import { useMemo } from 'react';
import { format, addDays, isSameDay, isToday, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { CalendarEvent, getEventConfig } from '@/hooks/useCalendarEvents';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface WeekViewProps {
  weekStart: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}

export const WeekView = ({ weekStart, events, onDayClick }: WeekViewProps) => {
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const getEventsForDay = (date: Date) => {
    return events
      .filter(e => isSameDay(e.date, date))
      .sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
      });
  };

  return (
    <ScrollArea className="w-full -mx-4 px-4">
      <div className="flex gap-2 pb-4 min-w-max md:min-w-0 md:grid md:grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentDay = isToday(day);
          
          return (
            <motion.button
              key={day.toISOString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onDayClick(day)}
              className={cn(
                "flex-shrink-0 w-[120px] md:w-auto",
                "p-3 rounded-xl border transition-all",
                "bg-background/60 backdrop-blur-sm hover:bg-background hover:shadow-md",
                isCurrentDay && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              {/* Day header */}
              <div className="text-center mb-3">
                <p className={cn(
                  "text-xs uppercase tracking-wide",
                  isCurrentDay ? "text-primary font-semibold" : "text-muted-foreground"
                )}>
                  {format(day, 'EEE', { locale: es })}
                </p>
                <p className={cn(
                  "text-2xl font-bold mt-1",
                  isCurrentDay ? "text-primary" : "text-foreground"
                )}>
                  {format(day, 'd')}
                </p>
              </div>
              
              {/* Events */}
              <div className="space-y-1.5 min-h-[60px]">
                {dayEvents.slice(0, 3).map((event) => {
                  const config = getEventConfig(event.type);
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-medium truncate",
                        config.bgColor,
                        "text-white"
                      )}
                    >
                      {event.startTime && (
                        <span className="opacity-80 mr-1">{event.startTime}</span>
                      )}
                      <span className="truncate">{config.emoji}</span>
                    </div>
                  );
                })}
                
                {dayEvents.length > 3 && (
                  <div className="text-[10px] text-muted-foreground text-center">
                    +{dayEvents.length - 3} más
                  </div>
                )}
                
                {dayEvents.length === 0 && (
                  <div className="text-[10px] text-muted-foreground text-center py-2">
                    Sin eventos
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
