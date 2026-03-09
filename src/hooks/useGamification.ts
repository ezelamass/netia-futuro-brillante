import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PlayerStats, Badge, BADGES, calculateLevel, getNextLevelXP, LEVEL_THRESHOLDS, PlayerLevel } from '@/types/gamification';
import { useDailyLog } from './useDailyLog';
import { calculateStatus } from './useWellnessStatus';

export const useGamification = () => {
  const { user } = useAuth();
  const { logs, getStreak, getXP } = useDailyLog();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) { setStats(null); setIsLoading(false); return; }

    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setStats({
        xp: data.xp,
        level: data.level as PlayerLevel,
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        totalLogs: data.total_logs,
        totalTrainingMin: data.total_training_min,
        badges: (data.badges as any[] || []),
      });
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Calculate badge progress from local data
  const badgeProgress = useMemo(() => {
    const streak = getStreak();
    const xp = getXP();
    const greenDays = logs.filter(log => calculateStatus(log) === 'green').length;
    const goodSleepDays = logs.filter(log => log.sleep >= 8).length;
    const goodHydrationDays = logs.filter(log => log.hydration >= 2).length;
    const trainingDays = logs.filter(log => log.trained).length;

    return BADGES.map(badge => {
      let current = 0;
      switch (badge.id) {
        case 'streak-7': case 'streak-30': case 'streak-100': current = streak; break;
        case 'xp-500': case 'xp-1000': case 'xp-2500': current = xp; break;
        case 'green-5': current = greenDays; break;
        case 'sleep-7': current = goodSleepDays; break;
        case 'hydration-7': current = goodHydrationDays; break;
        case 'training-10': case 'training-50': case 'training-100': current = trainingDays; break;
      }

      return {
        ...badge,
        current,
        progress: Math.min((current / badge.requirement) * 100, 100),
        isUnlocked: current >= badge.requirement,
      };
    });
  }, [logs, getStreak, getXP]);

  const currentLevel = useMemo(() => calculateLevel(getXP()), [getXP]);
  const nextLevelXP = useMemo(() => getNextLevelXP(currentLevel), [currentLevel]);
  const currentXP = getXP();
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel];
  const levelProgress = nextLevelXP > currentLevelXP
    ? ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    : 100;

  const syncStats = useCallback(async () => {
    if (!user) return;
    const streak = getStreak();
    const xp = getXP();

    await supabase
      .from('player_stats')
      .update({
        xp,
        level: calculateLevel(xp),
        current_streak: streak,
        longest_streak: Math.max(streak, stats?.longestStreak || 0),
        total_logs: logs.length,
        total_training_min: logs.reduce((sum, l) => sum + (l.trainingDurationMin || 0), 0),
      })
      .eq('user_id', user.id);
  }, [user, logs, getStreak, getXP, stats]);

  return {
    stats, isLoading, badgeProgress, currentLevel, currentXP,
    nextLevelXP, levelProgress, syncStats,
    unlockedCount: badgeProgress.filter(b => b.isUnlocked).length,
    totalBadges: BADGES.length,
  };
};
