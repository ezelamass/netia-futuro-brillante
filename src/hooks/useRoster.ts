import { useState, useEffect, useMemo, useCallback } from 'react';
import { startOfISOWeek } from 'date-fns';
import { Player, RosterFilters, RosterSort, calculateTrafficLight, TrafficLightStatus, CoachNote } from '@/types/player';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useRoster() {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<RosterFilters>({
    search: '',
    category: 'all',
    status: 'all',
    sport: 'all',
  });

  const [sort, setSort] = useState<RosterSort>({
    field: 'status',
    direction: 'desc',
  });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // Fetch players from Supabase
  const fetchPlayers = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Get clubs for current coach
      const clubIds = await supabase.rpc('get_user_club_ids', { _user_id: user.id });
      if (!clubIds.data || clubIds.data.length === 0) {
        setPlayers([]);
        setIsLoading(false);
        return;
      }

      // Get enrollments for those clubs (players only)
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('user_id, club_id')
        .in('club_id', clubIds.data)
        .eq('role', 'player')
        .eq('status', 'active');

      if (!enrollments || enrollments.length === 0) {
        setPlayers([]);
        setIsLoading(false);
        return;
      }

      const playerIds = [...new Set(enrollments.map(e => e.user_id))];

      // Fetch profiles, latest daily_logs, player_stats, coach_notes in parallel
      const [profilesRes, logsRes, statsRes, notesRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, full_name, date_of_birth, sport, avatar_url, gender')
          .in('id', playerIds),

        supabase
          .from('daily_logs')
          .select('user_id, sleep_hours, hydration_liters, energy_level, pain_level, pain_location, log_date, training_duration_min')
          .in('user_id', playerIds)
          .order('log_date', { ascending: false }),

        supabase
          .from('player_stats')
          .select('user_id, current_streak, xp')
          .in('user_id', playerIds),

        supabase
          .from('coach_notes')
          .select('id, player_id, content, created_at, coach_id')
          .in('player_id', playerIds)
          .in('club_id', clubIds.data)
          .order('created_at', { ascending: false }),
      ]);

      const profiles = profilesRes.data || [];
      const allLogs = logsRes.data || [];
      const allStats = statsRes.data || [];
      const allNotes = notesRes.data || [];

      // Build latest log per player
      const latestLogMap: Record<string, any> = {};
      for (const log of allLogs) {
        if (!latestLogMap[log.user_id]) {
          latestLogMap[log.user_id] = log;
        }
      }

      // Build weekly stats per player from daily_logs this week
      const weekStart = startOfISOWeek(new Date()).toISOString().split('T')[0];
      const weeklyLogMap: Record<string, { sessions: number; minutes: number; energySum: number }> = {};
      for (const log of allLogs) {
        if (log.log_date < weekStart) continue;
        if (!weeklyLogMap[log.user_id]) weeklyLogMap[log.user_id] = { sessions: 0, minutes: 0, energySum: 0 };
        const entry = weeklyLogMap[log.user_id];
        if (log.training_duration_min > 0) {
          entry.sessions++;
          entry.minutes += log.training_duration_min ?? 0;
        }
        entry.energySum += log.energy_level ?? 0;
      }

      // Stats map
      const statsMap: Record<string, any> = {};
      for (const s of allStats) {
        statsMap[s.user_id] = s;
      }

      // Notes map
      const notesMap: Record<string, CoachNote[]> = {};
      for (const n of allNotes) {
        if (!notesMap[n.player_id]) notesMap[n.player_id] = [];
        notesMap[n.player_id].push({
          id: n.id,
          date: new Date(n.created_at),
          content: n.content,
          coachId: n.coach_id,
          coachName: '', // Could be enriched later
        });
      }

      // Build Player objects
      const builtPlayers: Player[] = profiles.map(p => {
        const dob = p.date_of_birth ? new Date(p.date_of_birth) : null;
        const age = dob ? Math.floor((Date.now() - dob.getTime()) / (365.25 * 86400000)) : 0;
        const log = latestLogMap[p.id];
        const stat = statsMap[p.id];
        const category = age <= 10 ? 'U10' : age <= 12 ? 'U12' : age <= 14 ? 'U14' : 'U16';

        return {
          id: p.id,
          name: p.full_name,
          avatar: p.avatar_url || undefined,
          age,
          birthDate: dob || new Date(),
          category: category as any,
          sport: p.sport || 'Tenis',
          level: 'development' as any,
          handedness: 'right' as any,
          currentStatus: {
            sleep: log?.sleep_hours ?? 0,
            hydration: log?.hydration_liters ?? 0,
            energy: log?.energy_level ?? 0,
            pain: log?.pain_level ?? 0,
            painLocation: log?.pain_location || undefined,
            lastUpdated: log ? new Date(log.log_date) : new Date(),
          },
          weeklyStats: {
            sessions: weeklyLogMap[p.id]?.sessions ?? 0,
            targetSessions: 4,
            minutes: weeklyLogMap[p.id]?.minutes ?? 0,
            rpeAvg: weeklyLogMap[p.id]?.sessions
              ? Math.round((weeklyLogMap[p.id].energySum / weeklyLogMap[p.id].sessions) * 10) / 10
              : 0,
            warmupCompliance: 1,
            streak: stat?.current_streak ?? 0,
          },
          alerts: [],
          coachNotes: notesMap[p.id] || [],
          lastSessionDate: log ? new Date(log.log_date) : new Date(),
          tutorName: '',
          tutorEmail: '',
        };
      });

      setPlayers(builtPlayers);
    } catch (error) {
      console.error('Error fetching roster:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Calculate status for each player
  const playersWithStatus = useMemo(() => {
    return players.map(player => ({
      ...player,
      trafficLight: calculateTrafficLight(player),
    }));
  }, [players]);

  // Filter players
  const filteredPlayers = useMemo(() => {
    return playersWithStatus.filter(player => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!player.name.toLowerCase().includes(search)) return false;
      }
      if (filters.category !== 'all' && player.category !== filters.category) return false;
      if (filters.status !== 'all' && player.trafficLight !== filters.status) return false;
      if (filters.sport !== 'all' && player.sport !== filters.sport) return false;
      return true;
    });
  }, [playersWithStatus, filters]);

  // Sort players
  const sortedPlayers = useMemo(() => {
    const statusOrder: Record<TrafficLightStatus, number> = { red: 0, yellow: 1, green: 2 };
    return [...filteredPlayers].sort((a, b) => {
      let comparison = 0;
      switch (sort.field) {
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'status': comparison = statusOrder[a.trafficLight] - statusOrder[b.trafficLight]; break;
        case 'lastSession': comparison = new Date(b.lastSessionDate).getTime() - new Date(a.lastSessionDate).getTime(); break;
        case 'age': comparison = a.age - b.age; break;
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredPlayers, sort]);

  // Summary stats
  const summary = useMemo(() => {
    const greenCount = playersWithStatus.filter(p => p.trafficLight === 'green').length;
    const yellowCount = playersWithStatus.filter(p => p.trafficLight === 'yellow').length;
    const redCount = playersWithStatus.filter(p => p.trafficLight === 'red').length;
    const total = playersWithStatus.length;
    const avgSleep = total > 0 ? playersWithStatus.reduce((sum, p) => sum + p.currentStatus.sleep, 0) / total : 0;
    const avgRPE = total > 0 ? playersWithStatus.reduce((sum, p) => sum + p.weeklyStats.rpeAvg, 0) / total : 0;

    return {
      total,
      greenCount,
      yellowCount,
      redCount,
      greenPercent: total > 0 ? Math.round((greenCount / total) * 100) : 0,
      yellowPercent: total > 0 ? Math.round((yellowCount / total) * 100) : 0,
      redPercent: total > 0 ? Math.round((redCount / total) * 100) : 0,
      avgSleep: avgSleep.toFixed(1),
      avgRPE: avgRPE.toFixed(1),
    };
  }, [playersWithStatus]);

  // Add coach note
  const addCoachNote = useCallback(async (playerId: string, content: string) => {
    if (!user?.id) return;

    // Get first club of coach
    const clubIds = await supabase.rpc('get_user_club_ids', { _user_id: user.id });
    const clubId = clubIds.data?.[0];
    if (!clubId) return;

    const { data, error } = await supabase
      .from('coach_notes')
      .insert({
        player_id: playerId,
        coach_id: user.id,
        club_id: clubId,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding coach note:', error);
      return;
    }

    const newNote: CoachNote = {
      id: data.id,
      date: new Date(data.created_at),
      content: data.content,
      coachId: data.coach_id,
      coachName: '',
    };

    setPlayers(prev => prev.map(p =>
      p.id === playerId
        ? { ...p, coachNotes: [newNote, ...p.coachNotes] }
        : p
    ));

    if (selectedPlayer?.id === playerId) {
      setSelectedPlayer(prev => prev ? { ...prev, coachNotes: [newNote, ...prev.coachNotes] } : null);
    }
  }, [user?.id, selectedPlayer]);

  // Get unique sports
  const sports = useMemo(() => {
    const uniqueSports = [...new Set(players.map(p => p.sport))];
    return ['all', ...uniqueSports];
  }, [players]);

  return {
    players: sortedPlayers,
    allPlayers: playersWithStatus,
    filters,
    setFilters,
    sort,
    setSort,
    selectedPlayer,
    setSelectedPlayer,
    summary,
    addCoachNote,
    sports,
    isLoading,
  };
}
