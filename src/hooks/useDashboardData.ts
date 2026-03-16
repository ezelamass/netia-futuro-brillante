import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardData {
  profile: {
    fullName: string;
    sport: string;
    age: number;
  } | null;
  stats: {
    streak: number;
    xp: number;
    level: string;
    totalLogs: number;
    totalTrainingMin: number;
  } | null;
  health: {
    hydration: number;
    sleepHours: number;
    painLevel: number;
    energyLevel: number;
    recovery: 'optimal' | 'good' | 'needs-rest';
  } | null;
  weeklyCompliance: number;
  diagnosticScores: {
    physical: number;
    technique: number;
    mental: number;
  };
  isLoading: boolean;
}

export function useDashboardData(): DashboardData {
  const { user } = useAuth();
  const [profile, setProfile] = useState<DashboardData['profile']>(null);
  const [stats, setStats] = useState<DashboardData['stats']>(null);
  const [latestLog, setLatestLog] = useState<any>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<number>(0);
  const [diagnosticHistory, setDiagnosticHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchAll = async () => {
      setIsLoading(true);

      const [profileRes, statsRes, latestLogRes, weeklyLogsRes, diagnosticRes] = await Promise.all([
        // Profile
        supabase
          .from('profiles')
          .select('full_name, sport, date_of_birth')
          .eq('id', user.id)
          .single(),

        // Player stats
        supabase
          .from('player_stats')
          .select('current_streak, xp, level, total_logs, total_training_min')
          .eq('user_id', user.id)
          .single(),

        // Latest daily log
        supabase
          .from('daily_logs')
          .select('hydration_liters, sleep_hours, pain_level, energy_level, log_date')
          .eq('user_id', user.id)
          .order('log_date', { ascending: false })
          .limit(1)
          .maybeSingle(),

        // Weekly logs count (last 7 days)
        supabase
          .from('daily_logs')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('log_date', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]),

        // Latest diagnostic scores by axis
        supabase
          .from('diagnostic_history')
          .select('axis, score, recorded_at')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: false })
          .limit(20),
      ]);

      // Profile
      if (profileRes.data) {
        const dob = profileRes.data.date_of_birth;
        const age = dob
          ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 86400000))
          : 0;
        setProfile({
          fullName: profileRes.data.full_name,
          sport: profileRes.data.sport || 'Deporte',
          age,
        });
      }

      // Stats
      if (statsRes.data) {
        setStats({
          streak: statsRes.data.current_streak,
          xp: statsRes.data.xp,
          level: statsRes.data.level,
          totalLogs: statsRes.data.total_logs,
          totalTrainingMin: statsRes.data.total_training_min,
        });
      }

      // Latest log
      if (latestLogRes.data) {
        setLatestLog(latestLogRes.data);
      }

      // Weekly compliance
      setWeeklyLogs(weeklyLogsRes.count ?? 0);

      // Diagnostic history - get latest per axis
      if (diagnosticRes.data) {
        setDiagnosticHistory(diagnosticRes.data);
      }

      setIsLoading(false);
    };

    fetchAll();
  }, [user?.id]);

  // Compute health from latest log
  const health = useMemo<DashboardData['health']>(() => {
    if (!latestLog) return null;
    const painLevel = latestLog.pain_level ?? 0;
    const energyLevel = latestLog.energy_level ?? 5;
    let recovery: 'optimal' | 'good' | 'needs-rest' = 'optimal';
    if (painLevel >= 5 || energyLevel <= 2) recovery = 'needs-rest';
    else if (painLevel >= 3 || energyLevel <= 3) recovery = 'good';

    return {
      hydration: latestLog.hydration_liters ?? 0,
      sleepHours: latestLog.sleep_hours ?? 0,
      painLevel,
      energyLevel,
      recovery,
    };
  }, [latestLog]);

  // Compute weekly compliance (out of 7 days)
  const weeklyCompliance = useMemo(() => {
    return Math.round((weeklyLogs / 7) * 100);
  }, [weeklyLogs]);

  // Compute diagnostic scores - latest per axis
  const diagnosticScores = useMemo(() => {
    const axisMap: Record<string, number> = {};
    for (const entry of diagnosticHistory) {
      const axis = (entry.axis || '').toLowerCase();
      if (!axisMap[axis]) {
        axisMap[axis] = Number(entry.score) || 0;
      }
    }
    return {
      physical: axisMap['físico'] ?? axisMap['fisico'] ?? 0,
      technique: axisMap['técnico'] ?? axisMap['tecnico'] ?? 0,
      mental: axisMap['mental'] ?? 0,
    };
  }, [diagnosticHistory]);

  return {
    profile,
    stats,
    health,
    weeklyCompliance,
    diagnosticScores,
    isLoading,
  };
}
