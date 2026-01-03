import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface WidgetSkeletonProps {
  className?: string;
  showHeader?: boolean;
  rows?: number;
}

export const WidgetSkeleton = ({ 
  className, 
  showHeader = true,
  rows = 3 
}: WidgetSkeletonProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 p-4 bg-card",
        className
      )}
      aria-busy="true"
      aria-label="Cargando widget"
    >
      {showHeader && (
        <div className="mb-4">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
      )}

      <div className="space-y-3">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
