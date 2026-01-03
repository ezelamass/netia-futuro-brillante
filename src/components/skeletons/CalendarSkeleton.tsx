import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CalendarSkeletonProps {
  className?: string;
  view?: 'week' | 'month';
}

export const CalendarSkeleton = ({ 
  className,
  view = 'week' 
}: CalendarSkeletonProps) => {
  const days = view === 'week' ? 7 : 35;
  const cols = view === 'week' ? 'grid-cols-7' : 'grid-cols-7';
  
  return (
    <div
      className={cn("rounded-xl border border-border/50 p-4 bg-card", className)}
      aria-busy="true"
      aria-label="Cargando calendario"
    >
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-8 h-8 rounded-md" />
        <Skeleton className="h-6 w-40" />
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>

      {/* Day labels */}
      <div className={cn("grid gap-1 mb-2", cols)}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((_, i) => (
          <Skeleton key={i} className="h-4 w-6 mx-auto" />
        ))}
      </div>

      {/* Calendar grid */}
      <div className={cn("grid gap-1", cols)}>
        {[...Array(days)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square p-1 rounded-md border border-border/30 bg-muted/20",
              view === 'week' && "min-h-[80px]"
            )}
          >
            <Skeleton className="h-4 w-4 mb-1" />
            {view === 'week' && (
              <>
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
