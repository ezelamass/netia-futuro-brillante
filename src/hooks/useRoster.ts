import { useState, useMemo, useCallback } from 'react';
import { Player, RosterFilters, RosterSort, calculateTrafficLight, TrafficLightStatus, CoachNote } from '@/types/player';
import { mockPlayers } from '@/data/mockPlayers';

const ROSTER_STORAGE_KEY = 'netia_roster_notes';

export function useRoster() {
  const [players, setPlayers] = useState<Player[]>(() => {
    // Load coach notes from localStorage
    const storedNotes = localStorage.getItem(ROSTER_STORAGE_KEY);
    if (storedNotes) {
      try {
        const notesMap: Record<string, CoachNote[]> = JSON.parse(storedNotes);
        return mockPlayers.map(p => ({
          ...p,
          coachNotes: notesMap[p.id] || p.coachNotes,
        }));
      } catch {
        return mockPlayers;
      }
    }
    return mockPlayers;
  });

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
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!player.name.toLowerCase().includes(search)) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && player.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && player.trafficLight !== filters.status) {
        return false;
      }

      // Sport filter
      if (filters.sport !== 'all' && player.sport !== filters.sport) {
        return false;
      }

      return true;
    });
  }, [playersWithStatus, filters]);

  // Sort players
  const sortedPlayers = useMemo(() => {
    const statusOrder: Record<TrafficLightStatus, number> = {
      red: 0,
      yellow: 1,
      green: 2,
    };

    return [...filteredPlayers].sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = statusOrder[a.trafficLight] - statusOrder[b.trafficLight];
          break;
        case 'lastSession':
          comparison = new Date(b.lastSessionDate).getTime() - new Date(a.lastSessionDate).getTime();
          break;
        case 'age':
          comparison = a.age - b.age;
          break;
        default:
          comparison = 0;
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

    const avgSleep = playersWithStatus.reduce((sum, p) => sum + p.currentStatus.sleep, 0) / total;
    const avgRPE = playersWithStatus.reduce((sum, p) => sum + p.weeklyStats.rpeAvg, 0) / total;

    return {
      total,
      greenCount,
      yellowCount,
      redCount,
      greenPercent: Math.round((greenCount / total) * 100),
      yellowPercent: Math.round((yellowCount / total) * 100),
      redPercent: Math.round((redCount / total) * 100),
      avgSleep: avgSleep.toFixed(1),
      avgRPE: avgRPE.toFixed(1),
    };
  }, [playersWithStatus]);

  // Add coach note
  const addCoachNote = useCallback((playerId: string, content: string) => {
    const newNote: CoachNote = {
      id: Date.now().toString(),
      date: new Date(),
      content,
      coachId: 'coach1',
      coachName: 'Carlos Rodríguez',
    };

    setPlayers(prev => {
      const updated = prev.map(p => {
        if (p.id === playerId) {
          return {
            ...p,
            coachNotes: [newNote, ...p.coachNotes],
          };
        }
        return p;
      });

      // Save notes to localStorage
      const notesMap: Record<string, CoachNote[]> = {};
      updated.forEach(p => {
        notesMap[p.id] = p.coachNotes;
      });
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(notesMap));

      return updated;
    });

    // Update selected player if viewing
    if (selectedPlayer?.id === playerId) {
      setSelectedPlayer(prev => prev ? {
        ...prev,
        coachNotes: [newNote, ...prev.coachNotes],
      } : null);
    }
  }, [selectedPlayer]);

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
  };
}
