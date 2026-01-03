import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface TodayCardSkeletonProps {
  className?: string;
}

export const TodayCardSkeleton = ({ className }: TodayCardSkeletonProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-border/50 p-5",
        "bg-background/80 backdrop-blur-md",
        className
      )}
      aria-busy="true"
      aria-label="Cargando información del día"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-4 h-4 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      {/* Wellness Indicators - 4 cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-border/50 bg-muted/30"
          >
            <Skeleton className="w-6 h-6 rounded-full mx-auto mb-2" />
            <Skeleton className="h-4 w-12 mx-auto mb-1" />
            <Skeleton className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 h-px bg-border/50" />
        <Skeleton className="h-4 w-32" />
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Action Card */}
      <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>

      {/* Streak badge */}
      <div className="mt-4 flex justify-center">
        <Skeleton className="h-8 w-40 rounded-full" />
      </div>
    </div>
  );
};
