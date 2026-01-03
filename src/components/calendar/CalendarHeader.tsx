import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'week' | 'month';
  onViewChange: (view: 'week' | 'month') => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const CalendarHeader = ({
  currentDate,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) => {
  const title = view === 'week'
    ? `Semana del ${format(currentDate, "d 'de' MMMM", { locale: es })}`
    : format(currentDate, "MMMM yyyy", { locale: es });

  return (
    <div className="flex flex-col gap-3 mb-4">
      {/* Navigation row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrev}
            className="h-9 w-9"
            aria-label={view === 'week' ? 'Semana anterior' : 'Mes anterior'}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onNext}
            className="h-9 w-9"
            aria-label={view === 'week' ? 'Siguiente semana' : 'Siguiente mes'}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToday}
            className="text-xs"
          >
            <CalendarDays className="h-4 w-4 mr-1" />
            Hoy
          </Button>
        </div>
        
        {/* View toggle */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => onViewChange('week')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === 'week'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => onViewChange('month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === 'month'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mes
          </button>
        </div>
      </div>
      
      {/* Title */}
      <motion.h2
        key={title}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold capitalize"
      >
        {title}
      </motion.h2>
    </div>
  );
};
