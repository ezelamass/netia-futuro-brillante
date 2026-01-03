import { useState, useEffect, useMemo } from 'react';
import { addDays, startOfDay, isSameDay, subDays, isAfter } from 'date-fns';

export interface DailyLog {
  id: string;
  date: Date;
  sleep: number; // hours (4-12)
  hydration: number; // liters (0-3)
  energy: 1 | 2 | 3 | 4 | 5;
  pain: number; // 0-10
  painLocation?: string;
  completedAt: Date;
}

export interface TodayAction {
  id: string;
  type: 'training' | 'nutrition' | 'mental' | 'rest';
  avatar: 'TINO' | 'ZAHIA' | 'ROMA';
  title: string;
  description: string;
  duration?: string;
  isCompleted: boolean;
}

const STORAGE_KEY = 'netia-daily-logs';

// Generate realistic mock data for the last 14 days
const generateMockLogs = (): DailyLog[] => {
  const logs: DailyLog[] = [];
  const today = startOfDay(new Date());
  
  for (let i = 1; i <= 14; i++) {
    const date = subDays(today, i);
    const baseEnergy = Math.random() > 0.3 ? 4 : 3;
    const hasPain = Math.random() > 0.8;
    
    logs.push({
      id: `log-${i}`,
      date,
      sleep: 6 + Math.random() * 3, // 6-9 hours
      hydration: 1 + Math.random() * 1.5, // 1-2.5 liters
      energy: (baseEnergy + Math.floor(Math.random() * 2) - 1) as 1 | 2 | 3 | 4 | 5,
      pain: hasPain ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 2),
      painLocation: hasPain ? ['rodilla', 'hombro', 'espalda'][Math.floor(Math.random() * 3)] : undefined,
      completedAt: date,
    });
  }
  
  return logs;
};

// Get today's action based on calendar events or suggestions
const getTodayAction = (): TodayAction => {
  const actions: TodayAction[] = [
    {
      id: 'action-training',
      type: 'training',
      avatar: 'TINO',
      title: 'Entrenamiento con TINO',
      description: 'Calentá 10\' + 3 bloques de 6\'',
      duration: '45 min',
      isCompleted: false,
    },
    {
      id: 'action-nutrition',
      type: 'nutrition',
      avatar: 'ZAHIA',
      title: 'Plan de hidratación',
      description: 'Llevá 2L de agua al entreno',
      isCompleted: false,
    },
    {
      id: 'action-mental',
      type: 'mental',
      avatar: 'ROMA',
      title: 'Visualización pre-torneo',
      description: '10 minutos de respiración y enfoque',
      duration: '10 min',
      isCompleted: false,
    },
  ];
  
  // Return a random action for demo
  return actions[Math.floor(Math.random() * actions.length)];
};

export const useDailyLog = () => {
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((log: DailyLog) => ({
          ...log,
          date: new Date(log.date),
          completedAt: new Date(log.completedAt),
        }));
      } catch {
        return generateMockLogs();
      }
    }
    return generateMockLogs();
  });

  const [todayAction, setTodayAction] = useState<TodayAction>(() => {
    const stored = localStorage.getItem('netia-today-action');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return getTodayAction();
      }
    }
    return getTodayAction();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('netia-today-action', JSON.stringify(todayAction));
  }, [todayAction]);

  const today = startOfDay(new Date());
  
  const todayLog = useMemo(() => {
    return logs.find(log => isSameDay(log.date, today));
  }, [logs, today]);

  const hasLoggedToday = !!todayLog;

  const addLog = (logData: Omit<DailyLog, 'id' | 'date' | 'completedAt'>) => {
    const newLog: DailyLog = {
      ...logData,
      id: `log-${Date.now()}`,
      date: today,
      completedAt: new Date(),
    };
    
    setLogs(prev => {
      // Remove existing log for today if any
      const filtered = prev.filter(log => !isSameDay(log.date, today));
      return [newLog, ...filtered];
    });
    
    return newLog;
  };

  const updateTodayLog = (updates: Partial<Omit<DailyLog, 'id' | 'date' | 'completedAt'>>) => {
    setLogs(prev =>
      prev.map(log =>
        isSameDay(log.date, today) ? { ...log, ...updates } : log
      )
    );
  };

  const completeTodayAction = () => {
    setTodayAction(prev => ({ ...prev, isCompleted: true }));
  };

  const getLogsForDays = (days: number): DailyLog[] => {
    const cutoff = subDays(today, days);
    return logs
      .filter(log => isAfter(log.date, cutoff) || isSameDay(log.date, cutoff))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getStreak = (): number => {
    let streak = 0;
    let checkDate = hasLoggedToday ? today : subDays(today, 1);
    
    while (true) {
      const hasLog = logs.some(log => isSameDay(log.date, checkDate));
      if (hasLog) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getXP = (): number => {
    // 10 XP per daily log, bonus for streaks
    const baseXP = logs.length * 10;
    const streakBonus = getStreak() * 5;
    return baseXP + streakBonus + 1200; // Base XP
  };

  return {
    logs,
    todayLog,
    hasLoggedToday,
    todayAction,
    addLog,
    updateTodayLog,
    completeTodayAction,
    getLogsForDays,
    getStreak,
    getXP,
  };
};
