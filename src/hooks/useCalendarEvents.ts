import { useState, useEffect, useMemo } from 'react';
import { addDays, startOfWeek, addWeeks, format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isAfter } from 'date-fns';

export type EventType = 'training' | 'nutrition' | 'mental' | 'tournament' | 'school' | 'rest' | 'alert';
export type AvatarType = 'TINO' | 'ZAHIA' | 'ROMA';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: EventType;
  avatar?: AvatarType;
  description?: string;
  isRecurring?: boolean;
  isCompleted?: boolean;
}

export interface EventTypeConfig {
  type: EventType;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const EVENT_TYPES: EventTypeConfig[] = [
  { type: 'training', label: 'Entrenamiento', emoji: '🏋️', color: 'text-blue-600', bgColor: 'bg-blue-500' },
  { type: 'nutrition', label: 'Plan nutricional', emoji: '🍎', color: 'text-emerald-600', bgColor: 'bg-emerald-500' },
  { type: 'mental', label: 'Sesión mental', emoji: '🧠', color: 'text-violet-600', bgColor: 'bg-violet-500' },
  { type: 'tournament', label: 'Torneo', emoji: '🏆', color: 'text-orange-600', bgColor: 'bg-orange-500' },
  { type: 'school', label: 'Escolar', emoji: '📚', color: 'text-gray-600', bgColor: 'bg-gray-500' },
  { type: 'rest', label: 'Descanso', emoji: '🌴', color: 'text-green-600', bgColor: 'bg-green-400' },
  { type: 'alert', label: 'Alerta', emoji: '⚠️', color: 'text-yellow-600', bgColor: 'bg-yellow-500' },
];

export const getEventConfig = (type: EventType): EventTypeConfig => {
  return EVENT_TYPES.find(e => e.type === type) || EVENT_TYPES[0];
};

const STORAGE_KEY = 'netia-calendar-events';

// Generate mock data for the next 4 weeks
const generateMockEvents = (): CalendarEvent[] => {
  const today = new Date();
  const events: CalendarEvent[] = [];
  
  // Training events (3-4 per week)
  const trainingDays = [1, 3, 5]; // Lunes, Miércoles, Viernes
  for (let week = 0; week < 4; week++) {
    trainingDays.forEach((dayOffset, idx) => {
      const date = addDays(startOfWeek(addWeeks(today, week), { weekStartsOn: 1 }), dayOffset);
      events.push({
        id: `training-${week}-${idx}`,
        title: 'Entrenamiento físico con TINO',
        date,
        startTime: '16:00',
        endTime: '17:30',
        type: 'training',
        avatar: 'TINO',
        description: 'Sesión de preparación física integral',
        isRecurring: true,
        isCompleted: isBefore(date, today),
      });
    });
    
    // Add extra training on some weeks
    if (week % 2 === 0) {
      const extraDate = addDays(startOfWeek(addWeeks(today, week), { weekStartsOn: 1 }), 6);
      events.push({
        id: `training-extra-${week}`,
        title: 'Práctica de técnica',
        date: extraDate,
        startTime: '10:00',
        endTime: '11:30',
        type: 'training',
        avatar: 'TINO',
        description: 'Sesión enfocada en técnica específica',
        isCompleted: isBefore(extraDate, today),
      });
    }
  }
  
  // Tournament in 2 weeks
  const tournamentDate = addWeeks(today, 2);
  events.push({
    id: 'tournament-1',
    title: 'Torneo Regional Junior',
    date: tournamentDate,
    startTime: '09:00',
    endTime: '18:00',
    type: 'tournament',
    description: 'Competencia regional categoría sub-14. ¡A dar todo!',
  });
  
  // Mental sessions with ROMA (2)
  events.push({
    id: 'mental-1',
    title: 'Sesión de visualización con ROMA',
    date: addDays(today, 2),
    startTime: '18:00',
    endTime: '18:45',
    type: 'mental',
    avatar: 'ROMA',
    description: 'Técnicas de visualización para el próximo torneo',
  });
  
  events.push({
    id: 'mental-2',
    title: 'Control de nervios pre-competencia',
    date: addDays(today, 12),
    startTime: '17:00',
    endTime: '17:45',
    type: 'mental',
    avatar: 'ROMA',
    description: 'Preparación mental para el torneo',
  });
  
  // Nutrition plans with ZAHIA (3)
  events.push({
    id: 'nutrition-1',
    title: 'Plan alimenticio semanal',
    date: addDays(today, 1),
    startTime: '12:00',
    type: 'nutrition',
    avatar: 'ZAHIA',
    description: 'Revisión del plan de comidas de la semana',
  });
  
  events.push({
    id: 'nutrition-2',
    title: 'Hidratación pre-torneo',
    date: addDays(today, 11),
    startTime: '10:00',
    type: 'nutrition',
    avatar: 'ZAHIA',
    description: 'Estrategia de hidratación para el torneo',
  });
  
  events.push({
    id: 'nutrition-3',
    title: 'Comidas día de competencia',
    date: addDays(today, 13),
    startTime: '08:00',
    type: 'nutrition',
    avatar: 'ZAHIA',
    description: 'Qué comer el día del torneo',
  });
  
  // Rest period (3 days)
  const restStart = addDays(addWeeks(today, 2), 1);
  for (let i = 0; i < 3; i++) {
    events.push({
      id: `rest-${i}`,
      title: 'Descanso programado',
      date: addDays(restStart, i),
      type: 'rest',
      description: 'Recuperación post-torneo. ¡Descansa bien!',
    });
  }
  
  // School exam
  events.push({
    id: 'school-1',
    title: 'Examen de Matemáticas',
    date: addDays(today, 5),
    startTime: '09:00',
    endTime: '11:00',
    type: 'school',
    description: 'No olvides estudiar. Entrenamiento suave ese día.',
  });
  
  // Alerts
  events.push({
    id: 'alert-1',
    title: '💧 Recordatorio de hidratación',
    date: addDays(today, 0),
    startTime: '15:00',
    type: 'alert',
    avatar: 'ZAHIA',
    description: 'Recuerda tomar agua antes del entrenamiento',
  });
  
  events.push({
    id: 'alert-2',
    title: '😴 Alerta de sueño',
    date: addDays(today, 3),
    startTime: '21:00',
    type: 'alert',
    avatar: 'ROMA',
    description: 'Dormiste menos de 7 horas ayer. Intenta descansar más hoy.',
  });
  
  return events;
};

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.map((e: CalendarEvent) => ({
          ...e,
          date: new Date(e.date),
        }));
      } catch {
        return generateMockEvents();
      }
    }
    return generateMockEvents();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => isSameDay(event.date, date))
      .sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });
  };

  const getEventsForWeek = (weekStart: Date): CalendarEvent[] => {
    const weekEnd = addDays(weekStart, 6);
    return events.filter(event => {
      const eventDate = event.date;
      return (isSameDay(eventDate, weekStart) || isAfter(eventDate, weekStart)) &&
             (isSameDay(eventDate, weekEnd) || isBefore(eventDate, weekEnd));
    });
  };

  const getEventsForMonth = (monthDate: Date): CalendarEvent[] => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    return events.filter(event => {
      const eventDate = event.date;
      return (isSameDay(eventDate, monthStart) || isAfter(eventDate, monthStart)) &&
             (isSameDay(eventDate, monthEnd) || isBefore(eventDate, monthEnd));
    });
  };

  const getNextEvent = (): CalendarEvent | null => {
    const now = new Date();
    const upcoming = events
      .filter(e => isAfter(e.date, now) || isSameDay(e.date, now))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return upcoming[0] || null;
  };

  const getWeekStats = (weekStart: Date) => {
    const weekEvents = getEventsForWeek(weekStart);
    const trainings = weekEvents.filter(e => e.type === 'training');
    const completed = trainings.filter(e => e.isCompleted).length;
    return {
      total: trainings.length,
      completed,
      pending: trainings.length - completed,
    };
  };

  const getStreak = (): number => {
    const today = new Date();
    let streak = 0;
    let checkDate = today;
    
    while (true) {
      const dayEvents = getEventsForDate(checkDate);
      const hasCompletedTraining = dayEvents.some(e => e.type === 'training' && e.isCompleted);
      
      if (hasCompletedTraining) {
        streak++;
        checkDate = addDays(checkDate, -1);
      } else if (isSameDay(checkDate, today)) {
        // Today doesn't count against streak if no training scheduled
        const hasPendingTraining = dayEvents.some(e => e.type === 'training' && !e.isCompleted);
        if (!hasPendingTraining) {
          checkDate = addDays(checkDate, -1);
          continue;
        }
        break;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForWeek,
    getEventsForMonth,
    getNextEvent,
    getWeekStats,
    getStreak,
  };
};
