import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subWeeks, startOfWeek, endOfWeek, format } from 'date-fns';

export type ReportPeriod = '1week' | '2weeks' | '4weeks' | '8weeks';

interface PlayerReport {
  id: string;
  name: string;
  sport: string;
  category: string;
  attendanceRate: number;
  totalSessions: number;
  avgSleep: number;
  avgHydration: number;
  avgEnergy: number;
  avgPain: number;
  xp: number;
  streak: number;
}

interface WeeklyTrend {
  week: string;
  avgSleep: number;
  avgHydration: number;
  avgPain: number;
  avgEnergy: number;
  sessions: number;
  totalMinutes: number;
}

interface TrafficDistribution {
  green: number;
  yellow: number;
  red: number;
}

export function useClubReports() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<ReportPeriod>('4weeks');

  const [players, setPlayers] = useState<PlayerReport[]>([]);
  const [weeklyTrends, setWeeklyTrends] = useState<WeeklyTrend[]>([]);
  const [trafficDist, setTrafficDist] = useState<TrafficDistribution>({ green: 0, yellow: 0, red: 0 });

  // Training session raw data
  const [sessionData, setSessionData] = useState<{
    totalSessions: number;
    totalMinutes: number;
    avgRPE: number;
    attendanceRate: number;
    byCategory: { category: string; sessions: number; minutes: number }[];
  }>({ totalSessions: 0, totalMinutes: 0, avgRPE: 0, attendanceRate: 0, byCategory: [] });

  const periodWeeks = useMemo(() => {
    switch (period) {
      case '1week': return 1;
      case '2weeks': return 2;
      case '4weeks': return 4;
      case '8weeks': return 8;
    }
  }, [period]);

  const fetchReports = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Get coach's clubs
      const clubIds = await supabase.rpc('get_user_club_ids', { _user_id: user.id });
      if (!clubIds.data || clubIds.data.length === 0) {
        setIsLoading(false);
        return;
      }

      const cutoff = format(subWeeks(new Date(), periodWeeks), 'yyyy-MM-dd');

      // Get club players
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('user_id')
        .in('club_id', clubIds.data)
        .eq('role', 'player')
        .eq('status', 'active');

      const playerIds = [...new Set(enrollments?.map(e => e.user_id) || [])];
      if (playerIds.length === 0) {
        setIsLoading(false);
        return;
      }

      // Fetch all data in parallel
      const [profilesRes, logsRes, statsRes, sessionsRes, attendanceRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, sport, date_of_birth').in('id', playerIds),
        supabase.from('daily_logs').select('user_id, log_date, sleep_hours, hydration_liters, energy_level, pain_level, trained, training_duration_min').in('user_id', playerIds).gte('log_date', cutoff),
        supabase.from('player_stats').select('user_id, xp, current_streak').in('user_id', playerIds),
        supabase.from('training_sessions').select('id, category, duration_min, rpe_group, date').in('club_id', clubIds.data).gte('date', cutoff),
        supabase.from('session_attendance').select('session_id, player_id, status'),
      ]);

      const profiles = profilesRes.data || [];
      const logs = logsRes.data || [];
      const stats = statsRes.data || [];
      const sessions = sessionsRes.data || [];
      const attendance = attendanceRes.data || [];

      // Session IDs in period
      const sessionIds = new Set(sessions.map(s => s.id));
      const periodAttendance = attendance.filter(a => sessionIds.has(a.session_id));

      // Build session summary
      const totalMinutes = sessions.reduce((s, sess) => s + (sess.duration_min ?? 0), 0);
      const avgRPE = sessions.length > 0
        ? Math.round(sessions.reduce((s, sess) => s + (sess.rpe_group ?? 0), 0) / sessions.length * 10) / 10
        : 0;
      const presentCount = periodAttendance.filter(a => a.status === 'present').length;
      const totalAttendance = periodAttendance.length;

      // By category
      const catMap: Record<string, { sessions: number; minutes: number }> = {};
      for (const s of sessions) {
        const cat = s.category || 'General';
        if (!catMap[cat]) catMap[cat] = { sessions: 0, minutes: 0 };
        catMap[cat].sessions++;
        catMap[cat].minutes += s.duration_min ?? 0;
      }

      setSessionData({
        totalSessions: sessions.length,
        totalMinutes,
        avgRPE,
        attendanceRate: totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0,
        byCategory: Object.entries(catMap).map(([category, d]) => ({ category, ...d })),
      });

      // Build per-player reports
      const statsMap: Record<string, any> = {};
      for (const s of stats) statsMap[s.user_id] = s;

      const playerAttendance: Record<string, { present: number; total: number }> = {};
      for (const a of periodAttendance) {
        if (!playerAttendance[a.player_id]) playerAttendance[a.player_id] = { present: 0, total: 0 };
        playerAttendance[a.player_id].total++;
        if (a.status === 'present') playerAttendance[a.player_id].present++;
      }

      const playerLogMap: Record<string, any[]> = {};
      for (const l of logs) {
        if (!playerLogMap[l.user_id]) playerLogMap[l.user_id] = [];
        playerLogMap[l.user_id].push(l);
      }

      const builtPlayers: PlayerReport[] = profiles.map(p => {
        const pLogs = playerLogMap[p.id] || [];
        const pStat = statsMap[p.id];
        const pAtt = playerAttendance[p.id];
        const dob = p.date_of_birth ? new Date(p.date_of_birth) : null;
        const age = dob ? Math.floor((Date.now() - dob.getTime()) / (365.25 * 86400000)) : 0;

        const avgSleep = pLogs.length > 0
          ? Math.round(pLogs.reduce((s, l) => s + (l.sleep_hours ?? 0), 0) / pLogs.length * 10) / 10
          : 0;
        const avgHydration = pLogs.length > 0
          ? Math.round(pLogs.reduce((s, l) => s + (l.hydration_liters ?? 0), 0) / pLogs.length * 10) / 10
          : 0;
        const avgEnergy = pLogs.length > 0
          ? Math.round(pLogs.reduce((s, l) => s + (l.energy_level ?? 0), 0) / pLogs.length * 10) / 10
          : 0;
        const avgPain = pLogs.length > 0
          ? Math.round(pLogs.reduce((s, l) => s + (l.pain_level ?? 0), 0) / pLogs.length * 10) / 10
          : 0;

        return {
          id: p.id,
          name: p.full_name,
          sport: p.sport || 'Tenis',
          category: age <= 10 ? 'U10' : age <= 12 ? 'U12' : age <= 14 ? 'U14' : 'U16',
          attendanceRate: pAtt ? Math.round((pAtt.present / pAtt.total) * 100) : 0,
          totalSessions: pAtt?.present ?? 0,
          avgSleep,
          avgHydration,
          avgEnergy,
          avgPain,
          xp: pStat?.xp ?? 0,
          streak: pStat?.current_streak ?? 0,
        };
      });

      setPlayers(builtPlayers);

      // Traffic light distribution
      let green = 0, yellow = 0, red = 0;
      for (const p of builtPlayers) {
        if (p.avgSleep >= 7 && p.avgPain <= 3 && p.avgEnergy >= 3) green++;
        else if (p.avgSleep >= 6 || p.avgPain <= 5) yellow++;
        else red++;
      }
      setTrafficDist({ green, yellow, red });

      // Weekly trends
      const trends: WeeklyTrend[] = [];
      for (let w = periodWeeks - 1; w >= 0; w--) {
        const ws = startOfWeek(subWeeks(new Date(), w), { weekStartsOn: 1 });
        const we = endOfWeek(ws, { weekStartsOn: 1 });
        const wsStr = format(ws, 'yyyy-MM-dd');
        const weStr = format(we, 'yyyy-MM-dd');

        const weekLogs = logs.filter(l => l.log_date >= wsStr && l.log_date <= weStr);
        const weekSessions = sessions.filter(s => s.date >= wsStr && s.date <= weStr);

        trends.push({
          week: `S${periodWeeks - w}`,
          avgSleep: weekLogs.length > 0 ? Math.round(weekLogs.reduce((s, l) => s + (l.sleep_hours ?? 0), 0) / weekLogs.length * 10) / 10 : 0,
          avgHydration: weekLogs.length > 0 ? Math.round(weekLogs.reduce((s, l) => s + (l.hydration_liters ?? 0), 0) / weekLogs.length * 10) / 10 : 0,
          avgPain: weekLogs.length > 0 ? Math.round(weekLogs.reduce((s, l) => s + (l.pain_level ?? 0), 0) / weekLogs.length * 10) / 10 : 0,
          avgEnergy: weekLogs.length > 0 ? Math.round(weekLogs.reduce((s, l) => s + (l.energy_level ?? 0), 0) / weekLogs.length * 10) / 10 : 0,
          sessions: weekSessions.length,
          totalMinutes: weekSessions.reduce((s, sess) => s + (sess.duration_min ?? 0), 0),
        });
      }
      setWeeklyTrends(trends);
    } catch (error) {
      console.error('Error fetching club reports:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, periodWeeks]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  return {
    isLoading,
    period,
    setPeriod,
    players,
    weeklyTrends,
    trafficDist,
    sessionData,
  };
}
