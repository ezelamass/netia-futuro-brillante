import { useState, useMemo, useCallback } from 'react';
import { TrainingSession, WeeklyLoadSummary, calculateACRatio, calculateLoad, getRatioStatus, CategoryType } from '@/types/training';
import { mockTrainingSessions } from '@/data/mockTrainingSessions';
import { startOfWeek, endOfWeek, format, addWeeks, subWeeks, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

const SESSIONS_STORAGE_KEY = 'netia_training_sessions';

export function useTrainingSessions() {
  const [sessions, setSessions] = useState<TrainingSession[]>(() => {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return [...parsed, ...mockTrainingSessions];
      } catch {
        return mockTrainingSessions;
      }
    }
    return mockTrainingSessions;
  });

  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const [categoryFilter, setCategoryFilter] = useState<CategoryType | 'all'>('all');

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

    // Calculate previous week for comparison
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
    
    // Calculate acute and chronic loads
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
  const addSession = useCallback((session: Omit<TrainingSession, 'id' | 'createdAt'>) => {
    const newSession: TrainingSession = {
      ...session,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setSessions(prev => {
      const updated = [newSession, ...prev];
      // Save only user-added sessions
      const userSessions = updated.filter(s => !mockTrainingSessions.some(m => m.id === s.id));
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(userSessions));
      return updated;
    });
  }, []);

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
  };
}
