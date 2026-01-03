import { useEffect, useRef, useCallback } from 'react';
import { useDailyLog, DailyLog } from './useDailyLog';
import { useCalendarEvents, CalendarEvent } from './useCalendarEvents';
import { Notification, NotificationType, AvatarType } from '@/types/notification';
import { isSameDay, addDays, differenceInHours, differenceInDays } from 'date-fns';

const GENERATOR_KEY = 'netia_notification_generator_state';
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface GeneratorState {
  lastCheck: string;
  generatedIds: string[]; // Track which notifications we've already generated
}

interface NotificationRule {
  id: string;
  check: (context: RuleContext) => boolean;
  generate: (context: RuleContext) => Omit<Notification, 'id' | 'timestamp' | 'isRead'>;
}

interface RuleContext {
  todayLog: DailyLog | undefined;
  yesterdayLog: DailyLog | undefined;
  weekLogs: DailyLog[];
  streak: number;
  upcomingEvents: CalendarEvent[];
  todayEvents: CalendarEvent[];
}

// Notification generation rules
const RULES: NotificationRule[] = [
  // Low sleep alert (yesterday < 7 hours)
  {
    id: 'low_sleep',
    check: (ctx) => {
      if (!ctx.yesterdayLog) return false;
      return ctx.yesterdayLog.sleep < 7;
    },
    generate: (ctx) => ({
      type: 'health_alert',
      title: 'Sueño insuficiente',
      description: `Ayer dormiste ${ctx.yesterdayLog!.sleep.toFixed(1)} horas. El descanso es clave para tu rendimiento.`,
      avatar: 'ROMA',
      actionUrl: '/dashboard',
      priority: 'high',
    }),
  },

  // Low hydration alert (yesterday < 1.2L)
  {
    id: 'low_hydration',
    check: (ctx) => {
      if (!ctx.yesterdayLog) return false;
      return ctx.yesterdayLog.hydration < 1.2;
    },
    generate: (ctx) => ({
      type: 'health_alert',
      title: 'Alerta de hidratación',
      description: `Ayer tomaste solo ${ctx.yesterdayLog!.hydration.toFixed(1)}L de agua. Recordá hidratarte hoy.`,
      avatar: 'ZAHIA',
      actionUrl: '/dashboard',
      priority: 'high',
    }),
  },

  // High pain alert (yesterday pain >= 7)
  {
    id: 'high_pain',
    check: (ctx) => {
      if (!ctx.yesterdayLog) return false;
      return ctx.yesterdayLog.pain >= 7;
    },
    generate: (ctx) => ({
      type: 'health_alert',
      title: 'Dolor elevado detectado',
      description: `Ayer reportaste dolor nivel ${ctx.yesterdayLog!.pain}/10${ctx.yesterdayLog!.painLocation ? ` en ${ctx.yesterdayLog!.painLocation}` : ''}. ¿Cómo te sentís hoy?`,
      avatar: 'TINO',
      actionUrl: '/dashboard',
      priority: 'high',
    }),
  },

  // Streak milestones (3, 7, 14, 30, 60, 100 days)
  {
    id: 'streak_3',
    check: (ctx) => ctx.streak === 3,
    generate: () => ({
      type: 'streak',
      title: '¡Racha de 3 días!',
      description: '¡Buen comienzo! Ganaste 25 XP extra por tu constancia.',
      priority: 'low',
      metadata: { xpEarned: 25 },
    }),
  },
  {
    id: 'streak_7',
    check: (ctx) => ctx.streak === 7,
    generate: () => ({
      type: 'streak',
      title: '¡Racha de 7 días!',
      description: '¡Una semana completa! Ganaste 50 XP extra.',
      priority: 'medium',
      metadata: { xpEarned: 50 },
    }),
  },
  {
    id: 'streak_14',
    check: (ctx) => ctx.streak === 14,
    generate: () => ({
      type: 'streak',
      title: '¡Racha de 14 días!',
      description: '¡Dos semanas imparables! Ganaste 100 XP extra.',
      priority: 'medium',
      metadata: { xpEarned: 100 },
    }),
  },
  {
    id: 'streak_30',
    check: (ctx) => ctx.streak === 30,
    generate: () => ({
      type: 'streak',
      title: '¡Racha de 30 días!',
      description: '¡Un mes de dedicación! Ganaste 250 XP extra. 🏆',
      priority: 'high',
      metadata: { xpEarned: 250 },
    }),
  },

  // Training reminder (event in 1-2 hours)
  {
    id: 'training_soon',
    check: (ctx) => {
      const now = new Date();
      return ctx.todayEvents.some(event => {
        if (event.type !== 'training' || !event.startTime) return false;
        const [hours, mins] = event.startTime.split(':').map(Number);
        const eventTime = new Date();
        eventTime.setHours(hours, mins, 0, 0);
        const hoursUntil = differenceInHours(eventTime, now);
        return hoursUntil >= 1 && hoursUntil <= 2;
      });
    },
    generate: (ctx) => {
      const event = ctx.todayEvents.find(e => e.type === 'training' && e.startTime);
      return {
        type: 'reminder',
        title: 'Entrenamiento próximo',
        description: `${event?.title || 'Entrenamiento'} a las ${event?.startTime}. ¡Preparate!`,
        avatar: 'TINO',
        actionUrl: '/calendar',
        priority: 'medium',
      };
    },
  },

  // Tournament reminder (in 1, 3, or 7 days)
  {
    id: 'tournament_7days',
    check: (ctx) => {
      const now = new Date();
      return ctx.upcomingEvents.some(event => {
        if (event.type !== 'tournament') return false;
        const daysUntil = differenceInDays(event.date, now);
        return daysUntil === 7;
      });
    },
    generate: (ctx) => {
      const event = ctx.upcomingEvents.find(e => e.type === 'tournament');
      return {
        type: 'tournament',
        title: 'Torneo en 7 días',
        description: `${event?.title || 'Torneo'} se acerca. ¡Es hora de intensificar la preparación!`,
        actionUrl: '/calendar',
        priority: 'medium',
        metadata: { eventId: event?.id },
      };
    },
  },
  {
    id: 'tournament_3days',
    check: (ctx) => {
      const now = new Date();
      return ctx.upcomingEvents.some(event => {
        if (event.type !== 'tournament') return false;
        const daysUntil = differenceInDays(event.date, now);
        return daysUntil === 3;
      });
    },
    generate: (ctx) => {
      const event = ctx.upcomingEvents.find(e => e.type === 'tournament');
      return {
        type: 'tournament',
        title: 'Torneo en 3 días',
        description: `${event?.title || 'Torneo'} está muy cerca. Enfocate en descansar bien.`,
        avatar: 'ROMA',
        actionUrl: '/calendar',
        priority: 'high',
        metadata: { eventId: event?.id },
      };
    },
  },
  {
    id: 'tournament_tomorrow',
    check: (ctx) => {
      const now = new Date();
      return ctx.upcomingEvents.some(event => {
        if (event.type !== 'tournament') return false;
        const daysUntil = differenceInDays(event.date, now);
        return daysUntil === 1;
      });
    },
    generate: (ctx) => {
      const event = ctx.upcomingEvents.find(e => e.type === 'tournament');
      return {
        type: 'tournament',
        title: '¡Torneo mañana!',
        description: `${event?.title || 'El torneo'} es mañana. Descansá bien esta noche.`,
        avatar: 'ROMA',
        actionUrl: '/calendar',
        priority: 'high',
        metadata: { eventId: event?.id },
      };
    },
  },

  // Low energy trend (average < 3 over last 3 days)
  {
    id: 'low_energy_trend',
    check: (ctx) => {
      if (ctx.weekLogs.length < 3) return false;
      const last3 = ctx.weekLogs.slice(-3);
      const avgEnergy = last3.reduce((sum, log) => sum + log.energy, 0) / last3.length;
      return avgEnergy < 3;
    },
    generate: () => ({
      type: 'health_alert',
      title: 'Energía baja esta semana',
      description: 'Tu nivel de energía promedio está bajo. ¿Estás descansando lo suficiente?',
      avatar: 'ROMA',
      actionUrl: '/dashboard',
      priority: 'medium',
    }),
  },

  // Daily AI tip (random, ~30% chance)
  {
    id: 'daily_tip',
    check: () => Math.random() < 0.3,
    generate: () => {
      const tips: Array<{ avatar: AvatarType; title: string; description: string }> = [
        {
          avatar: 'TINO',
          title: 'Tip de TINO',
          description: '"El calentamiento no es opcional. 10 minutos bien hechos previenen lesiones."',
        },
        {
          avatar: 'ZAHIA',
          title: 'Consejo de ZAHIA',
          description: '"Antes del entreno, comé algo ligero: una banana o tostada con miel."',
        },
        {
          avatar: 'ROMA',
          title: 'Mensaje de ROMA',
          description: '"Respirá profundo antes de cada punto. La calma es tu superpoder."',
        },
        {
          avatar: 'TINO',
          title: 'Recordatorio de TINO',
          description: '"Los campeones se hacen en los entrenamientos, no solo en los partidos."',
        },
        {
          avatar: 'ZAHIA',
          title: 'Tip nutricional',
          description: '"Después de entrenar, combiná proteína con carbohidratos para recuperarte mejor."',
        },
        {
          avatar: 'ROMA',
          title: 'Consejo mental',
          description: '"Visualizá tu éxito antes de competir. Tu mente entrena igual que tu cuerpo."',
        },
      ];
      const tip = tips[Math.floor(Math.random() * tips.length)];
      return {
        type: 'ai_message' as NotificationType,
        title: tip.title,
        description: tip.description,
        avatar: tip.avatar,
        actionUrl: '/chat',
        priority: 'low' as const,
      };
    },
  },

  // No log today reminder (after 2pm)
  {
    id: 'no_log_reminder',
    check: (ctx) => {
      const now = new Date();
      return !ctx.todayLog && now.getHours() >= 14;
    },
    generate: () => ({
      type: 'reminder',
      title: '¿Cómo te sentís hoy?',
      description: 'Todavía no registraste tu día. ¡Son solo 30 segundos!',
      avatar: 'TINO',
      actionUrl: '/dashboard',
      priority: 'medium',
    }),
  },
];

interface UseNotificationGeneratorProps {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
}

export const useNotificationGenerator = ({ addNotification }: UseNotificationGeneratorProps) => {
  const { logs, todayLog, getLogsForDays, getStreak } = useDailyLog();
  const { events, getEventsForDate } = useCalendarEvents();
  const lastCheckRef = useRef<Date | null>(null);

  // Load generator state from localStorage
  const getState = useCallback((): GeneratorState => {
    try {
      const stored = localStorage.getItem(GENERATOR_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore errors
    }
    return { lastCheck: '', generatedIds: [] };
  }, []);

  // Save generator state
  const saveState = useCallback((state: GeneratorState) => {
    localStorage.setItem(GENERATOR_KEY, JSON.stringify(state));
  }, []);

  // Check and generate notifications
  const checkAndGenerate = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayKey = today.toISOString().split('T')[0];

    const state = getState();
    
    // Reset generated IDs if it's a new day
    if (state.lastCheck.split('T')[0] !== todayKey) {
      state.generatedIds = [];
    }

    // Build context for rules
    const yesterday = addDays(today, -1);
    const yesterdayLog = logs.find(log => isSameDay(new Date(log.date), yesterday));
    const weekLogs = getLogsForDays(7);
    const streak = getStreak();
    
    // Get upcoming events (next 14 days)
    const upcomingEvents: CalendarEvent[] = [];
    for (let i = 0; i <= 14; i++) {
      const date = addDays(today, i);
      upcomingEvents.push(...getEventsForDate(date));
    }
    
    const todayEvents = getEventsForDate(today);

    const context: RuleContext = {
      todayLog,
      yesterdayLog,
      weekLogs,
      streak,
      upcomingEvents,
      todayEvents,
    };

    // Check each rule
    const newGeneratedIds: string[] = [...state.generatedIds];

    RULES.forEach(rule => {
      // Skip if already generated today
      if (state.generatedIds.includes(rule.id)) return;

      try {
        if (rule.check(context)) {
          const notification = rule.generate(context);
          addNotification(notification);
          newGeneratedIds.push(rule.id);
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error);
      }
    });

    // Save updated state
    saveState({
      lastCheck: now.toISOString(),
      generatedIds: newGeneratedIds,
    });

    lastCheckRef.current = now;
  }, [logs, todayLog, getLogsForDays, getStreak, events, getEventsForDate, addNotification, getState, saveState]);

  // Run check on mount and periodically
  useEffect(() => {
    // Initial check
    const timerId = setTimeout(() => {
      checkAndGenerate();
    }, 2000); // Small delay to let other hooks initialize

    // Periodic check
    const intervalId = setInterval(() => {
      checkAndGenerate();
    }, CHECK_INTERVAL);

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [checkAndGenerate]);

  // Manual trigger for testing
  const forceCheck = useCallback(() => {
    // Clear generated IDs to allow regeneration
    saveState({ lastCheck: '', generatedIds: [] });
    checkAndGenerate();
  }, [checkAndGenerate, saveState]);

  return { forceCheck };
};
