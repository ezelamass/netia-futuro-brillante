import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekNavigatorProps {
  weekNumber: string;
  month: string;
  range: string;
  onPrevious: () => void;
  onNext: () => void;
  onCurrent: () => void;
}

export function WeekNavigator({ 
  weekNumber, 
  month, 
  range,
  onPrevious, 
  onNext, 
  onCurrent 
}: WeekNavigatorProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onCurrent}>
          Esta semana
        </Button>
        <Button variant="outline" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground">
        Semana {weekNumber} · {month} · <span className="font-medium">{range}</span>
      </div>
    </div>
  );
}
