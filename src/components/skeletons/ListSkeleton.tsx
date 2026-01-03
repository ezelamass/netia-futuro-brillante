import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ListSkeletonProps {
  className?: string;
  rows?: number;
  showAvatar?: boolean;
  showRank?: boolean;
}

export const ListSkeleton = ({ 
  className,
  rows = 5,
  showAvatar = true,
  showRank = false,
}: ListSkeletonProps) => {
  return (
    <div
      className={cn("space-y-3", className)}
      aria-busy="true"
      aria-label="Cargando lista"
    >
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/30"
        >
          {showRank && (
            <Skeleton className="w-6 h-6 rounded-full shrink-0" />
          )}
          
          {showAvatar && (
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          )}

          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>

          <div className="text-right">
            <Skeleton className="h-5 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
};
