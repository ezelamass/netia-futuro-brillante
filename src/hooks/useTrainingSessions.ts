import { useState, useEffect, useMemo, useCallback } from 'react';
import { TrainingSession, calculateACRatio, calculateLoad, getRatioStatus, CategoryType } from '@/types/training';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfWeek, endOfWeek, format, addWeeks, subWeeks, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

export function useTrainingSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'all'>('all');

  // Fetch sessions from Supabase
  const fetchSessions = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const clubIds = await supabase.rpc('get_user_club_ids', { _user_id: user.id });
      if (!clubIds.data || clubIds.data.length === 0) {
        setSessions([]);
        setIsLoading(false);
        return;
      }

      // Fetch last 5 weeks of sessions
      const fiveWeeksAgo = subWeeks(new Date(), 5).toISOString();

      const [sessionsRes, attendanceRes] = await Promise.all([
        supabase
          .from('training_sessions')
          .select('*')
          .in('club_id', clubIds.data)
          .gte('date', fiveWeeksAgo)
          .order('date', { ascending: false }),

        supabase
          .from('session_attendance')
          .select('session_id, player_id, status'),
      ]);

      const rawSessions = sessionsRes.data || [];
      const rawAttendance = attendanceRes.data || [];

      // Build attendance map
      const attendanceMap: Record<string, { present: string[]; absent: string[]; total: number }> = {};
      for (const a of rawAttendance) {
        if (!attendanceMap[a.session_id]) {
          attendanceMap[a.session_id] = { present: [], absent: [], total: 0 };
        }
        attendanceMap[a.session_id].total++;
        if (a.status === 'present') {
          attendanceMap[a.session_id].present.push(a.player_id);
        } else {
          attendanceMap[a.session_id].absent.push(a.player_id);
        }
      }

      const mapped: TrainingSession[] = rawSessions.map(s => ({
        id: s.id,
        date: new Date(s.date),
        groupId: s.club_id,
        groupName: s.group_name,
        category: s.category as CategoryType,
        sport: s.sport,
        type: s.type as any,
        duration: s.duration_min,
        rpeGroup: s.rpe_group,
        attendance: attendanceMap[s.id] || { present: [], absent: [], total: 0 },
        warmupDone: s.warmup_done,
        cooldownDone: s.cooldown_done,
        notes: s.notes || undefined,
        coachId: s.coach_id,
        createdAt: new Date(s.created_at),
      }));

      setSessions(mapped);
    } catch (error) {
      console.error('Error fetching training sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Navigate weeks
  const goToPreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  }, []);

  const goToNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  }, []);

  // Get week label
  const weekLabel = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const weekNumber = format(currentWeekStart, 'w');
    const month = format(currentWeekStart, 'MMMM yyyy', { locale: es });
    return {
      weekNumber,
      month: month.charAt(0).toUpperCase() + month.slice(1),
      range: `${format(currentWeekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM', { locale: es })}`,
    };
  }, [currentWeekStart]);

  // Filter sessions by current week
  const weekSessions = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return sessions.filter(s =>
      isWithinInterval(new Date(s.date), { start: currentWeekStart, end: weekEnd })
    );
  }, [sessions, currentWeekStart]);

  // Filter by category
  const filteredSessions = useMemo(() => {
    if (categoryFilter === 'all') return weekSessions;
    return weekSessions.filter(s => s.category === categoryFilter);
  }, [weekSessions, categoryFilter]);

  // Calculate week summary
  const weekSummary = useMemo(() => {
    const totalSessions = filteredSessions.length;
    const totalMinutes = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    const avgRPE = totalSessions > 0
      ? filteredSessions.reduce((sum, s) => sum + s.rpeGroup, 0) / totalSessions
      : 0;

    const totalAttendance = filteredSessions.reduce((sum, s) => sum + s.attendance.present.length, 0);
    const totalPossible = filteredSessions.reduce((sum, s) => sum + s.attendance.total, 0);
    const attendanceRate = totalPossible > 0 ? (totalAttendance / totalPossible) * 100 : 0;

    const prevWeekStart = subWeeks(currentWeekStart, 1);
    const prevWeekEnd = endOfWeek(prevWeekStart, { weekStartsOn: 1 });
    const prevWeekSessions = sessions.filter(s =>
      isWithinInterval(new Date(s.date), { start: prevWeekStart, end: prevWeekEnd }) &&
      (categoryFilter === 'all' || s.category === categoryFilter)
    );

    const prevTotalSessions = prevWeekSessions.length;
    const prevTotalMinutes = prevWeekSessions.reduce((sum, s) => sum + s.duration, 0);
    const prevAvgRPE = prevTotalSessions > 0
      ? prevWeekSessions.reduce((sum, s) => sum + s.rpeGroup, 0) / prevTotalSessions
      : 0;
    const prevTotalAttendance = prevWeekSessions.reduce((sum, s) => sum + s.attendance.present.length, 0);
    const prevTotalPossible = prevWeekSessions.reduce((sum, s) => sum + s.attendance.total, 0);
    const prevAttendanceRate = prevTotalPossible > 0 ? (prevTotalAttendance / prevTotalPossible) * 100 : 0;

    return {
      totalSessions,
      totalMinutes,
      avgRPE: Number(avgRPE.toFixed(1)),
      attendanceRate: Math.round(attendanceRate),
      sessionsDiff: totalSessions - prevTotalSessions,
      minutesDiff: totalMinutes - prevTotalMinutes,
      rpeDiff: Number((avgRPE - prevAvgRPE).toFixed(1)),
      attendanceDiff: Math.round(attendanceRate - prevAttendanceRate),
    };
  }, [filteredSessions, sessions, currentWeekStart, categoryFilter]);

  // Calculate load by category for chart
  const loadByCategory = useMemo(() => {
    const categories: CategoryType[] = ['U10', 'U12', 'U14', 'U16'];
    return categories.map(cat => {
      const catSessions = weekSessions.filter(s => s.category === cat);
      const totalMinutes = catSessions.reduce((sum, s) => sum + s.duration, 0);
      const avgRPE = catSessions.length > 0
        ? catSessions.reduce((sum, s) => sum + s.rpeGroup, 0) / catSessions.length
        : 0;
      const totalLoad = catSessions.reduce((sum, s) => sum + calculateLoad(s.duration, s.rpeGroup), 0);

      return {
        category: cat,
        minutes: totalMinutes,
        rpe: Number(avgRPE.toFixed(1)),
        load: totalLoad,
        sessions: catSessions.length,
      };
    });
  }, [weekSessions]);

  // Calculate A:C ratio
  const acRatio = useMemo(() => {
    const relevantSessions = categoryFilter === 'all'
      ? sessions
      : sessions.filter(s => s.category === categoryFilter);

    const ratio = calculateACRatio(relevantSessions);
    const status = getRatioStatus(ratio);

    const now = new Date();
    const daysBetween = (d1: Date, d2: Date) =>
      Math.floor((d2.getTime() - new Date(d1).getTime()) / (1000 * 60 * 60 * 24));

    const acuteSessions = relevantSessions.filter(s => daysBetween(s.date, now) <= 7);
    const chronicSessions = relevantSessions.filter(s => daysBetween(s.date, now) <= 28);

    const acuteLoad = acuteSessions.reduce((sum, s) => sum + calculateLoad(s.duration, s.rpeGroup), 0);
    const chronicLoad = chronicSessions.reduce((sum, s) => sum + calculateLoad(s.duration, s.rpeGroup), 0) / 4;

    return {
      ratio,
      status,
      acuteLoad: Math.round(acuteLoad),
      chronicLoad: Math.round(chronicLoad),
    };
  }, [sessions, categoryFilter]);

  // Add new session
  const addSession = useCallback(async (session: Omit<TrainingSession, 'id' | 'createdAt'>) => {
    if (!user?.id) return;

    const clubIds = await supabase.rpc('get_user_club_ids', { _user_id: user.id });
    const clubId = clubIds.data?.[0];
    if (!clubId) return;

    const { data, error } = await supabase
      .from('training_sessions')
      .insert({
        club_id: clubId,
        coach_id: user.id,
        group_name: session.groupName,
        category: session.category,
        sport: session.sport,
        type: session.type,
        date: session.date instanceof Date ? session.date.toISOString() : session.date,
        duration_min: session.duration,
        rpe_group: session.rpeGroup,
        warmup_done: session.warmupDone,
        cooldown_done: session.cooldownDone,
        notes: session.notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding session:', error);
      return;
    }

    // Insert attendance records
    if (data && (session.attendance.present.length > 0 || session.attendance.absent.length > 0)) {
      const attendanceRecords = [
        ...session.attendance.present.map(pid => ({
          session_id: data.id,
          player_id: pid,
          status: 'present',
        })),
        ...session.attendance.absent.map(pid => ({
          session_id: data.id,
          player_id: pid,
          status: 'absent',
        })),
      ];

      await supabase.from('session_attendance').insert(attendanceRecords);
    }

    // Refresh sessions
    fetchSessions();
  }, [user?.id, fetchSessions]);

  // Get categories for filter
  const categories = useMemo(() => {
    return ['all', 'U10', 'U12', 'U14', 'U16'] as const;
  }, []);

  return {
    sessions: filteredSessions,
    allSessions: sessions,
    weekSessions,
    currentWeekStart,
    weekLabel,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
    categoryFilter,
    setCategoryFilter,
    weekSummary,
    loadByCategory,
    acRatio,
    addSession,
    categories,
    isLoading,
  };
}
