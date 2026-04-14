import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculateLevel, LEVEL_CONFIG, type PlayerLevel } from '@/types/gamification';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  points: number;
  streak: number;
  level: PlayerLevel;
  levelEmoji: string;
}

export const useLeaderboard = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('player_stats')
        .select('user_id, xp, current_streak, level')
        .order('xp', { ascending: false })
        .limit(50);

      if (fetchError || !data) {
        console.error('Leaderboard fetch error:', fetchError);
        setError('No se pudo cargar el ranking');
        setIsLoading(false);
        return;
      }

      // Get profile names for all users
      const userIds = data.map(d => d.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      const nameMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      const mapped: LeaderboardEntry[] = data.map((d, i) => {
        const lvl = (d.level as PlayerLevel) || calculateLevel(d.xp);
        return {
          rank: i + 1,
          userId: d.user_id,
          name: nameMap.get(d.user_id) || 'Jugador',
          points: d.xp,
          streak: d.current_streak,
          level: lvl,
          levelEmoji: LEVEL_CONFIG[lvl].emoji,
        };
      });

      setEntries(mapped);

      if (user) {
        const mine = mapped.find(e => e.userId === user.id);
        setCurrentUserEntry(mine || null);
      }

      setIsLoading(false);
    };

    fetch();
  }, [user]);

  return { entries, isLoading, error, currentUserEntry };
};
