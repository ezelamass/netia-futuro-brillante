import { DaySession } from '@/data/mockTrainingPlan';
import { SESSION_TYPE_COLORS, SESSION_TYPE_LABELS, SessionType } from '@/types/training';
import { cn } from '@/lib/utils';
import { Check, Moon, Zap, Crosshair, Dumbbell, Swords, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const typeIcons: Record<SessionType | 'rest', React.ElementType> = {
  technical: Crosshair,
  physical: Dumbbell,
  tactical: Zap,
  match: Swords,
  recovery: Heart,
  rest: Moon,
};

interface WeeklyMicrocycleProps {
  sessions: DaySession[];
  onSelectDay: (dayIndex: number) => void;
  selectedDay: number | null;
}

export function WeeklyMicrocycle({ sessions, onSelectDay, selectedDay }: WeeklyMicrocycleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-foreground">Microciclo semanal</h3>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {sessions.map((session) => {
          const Icon = typeIcons[session.type];
          const isSelected = selectedDay === session.dayIndex;
          const isToday = session.status === 'today';
          const isCompleted = session.status === 'completed';
          const isRest = session.type === 'rest';

          return (
            <button
              key={session.dayIndex}
              onClick={() => onSelectDay(session.dayIndex)}
              className={cn(
                'relative flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl transition-all',
                'border hover:shadow-md cursor-pointer',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/40',
                isToday && !isSelected && 'border-primary/50 bg-primary/5'
              )}
            >
              <span className={cn(
                'text-[10px] sm:text-xs font-bold uppercase',
                isToday ? 'text-primary' : 'text-muted-foreground'
              )}>
                {session.dayLabel}
              </span>

              <div className={cn(
                'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center',
                isRest
                  ? 'bg-muted'
                  : isCompleted
                    ? 'bg-[hsl(var(--success))]/15'
                    : isToday
                      ? 'bg-primary/15'
                      : 'bg-muted'
              )}>
                {isCompleted && !isRest ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[hsl(var(--success))]" />
                ) : (
                  <Icon className={cn(
                    'w-4 h-4 sm:w-5 sm:h-5',
                    isRest ? 'text-muted-foreground' : isToday ? 'text-primary' : 'text-muted-foreground'
                  )} />
                )}
              </div>

              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium text-center leading-tight line-clamp-1">
                {isRest ? 'Descanso' : SESSION_TYPE_LABELS[session.type as SessionType]}
              </span>

              {session.duration > 0 && !isRest && (
                <span className="text-[9px] text-muted-foreground">{session.duration}′</span>
              )}

              {/* Today indicator dot */}
              {isToday && (
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
