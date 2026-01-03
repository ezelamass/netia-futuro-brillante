import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  className?: string;
  showImage?: boolean;
  lines?: number;
}

export const CardSkeleton = ({ 
  className,
  showImage = false,
  lines = 3,
}: CardSkeletonProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/50 overflow-hidden bg-card",
        className
      )}
      aria-busy="true"
      aria-label="Cargando tarjeta"
    >
      {showImage && (
        <Skeleton className="w-full h-40" />
      )}
      
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-3" />
        
        <div className="space-y-2">
          {[...Array(lines)].map((_, i) => (
            <Skeleton 
              key={i} 
              className={cn(
                "h-4",
                i === lines - 1 ? "w-1/2" : "w-full"
              )} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};
