import { useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { CalendarEvent, getEventConfig } from '@/hooks/useCalendarEvents';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const MonthView = ({ currentDate, events, onDayClick }: MonthViewProps) => {
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    return events.filter(e => isSameDay(e.date, date));
  };

  return (
    <div className="bg-background/60 backdrop-blur-sm rounded-xl border p-3">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <motion.button
              key={day.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onDayClick(day)}
              className={cn(
                "aspect-square p-1 rounded-lg transition-all",
                "hover:bg-muted/50",
                !isCurrentMonth && "opacity-30",
                isCurrentDay && "ring-2 ring-primary ring-offset-1 ring-offset-background"
              )}
            >
              <div className="h-full flex flex-col">
                <span className={cn(
                  "text-sm font-medium",
                  isCurrentDay ? "text-primary" : "text-foreground"
                )}>
                  {format(day, 'd')}
                </span>
                
                {/* Event dots */}
                <div className="flex-1 flex items-end justify-center gap-0.5 pb-1">
                  {dayEvents.slice(0, 3).map((event) => {
                    const config = getEventConfig(event.type);
                    return (
                      <div
                        key={event.id}
                        className={cn("w-1.5 h-1.5 rounded-full", config.bgColor)}
                      />
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[8px] text-muted-foreground ml-0.5">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
