import { cn } from '@/lib/utils';
import { TrafficLightStatus } from '@/types/player';

interface TrafficLightProps {
  status: TrafficLightStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const statusColors = {
  green: 'bg-emerald-500 shadow-emerald-500/50',
  yellow: 'bg-yellow-500 shadow-yellow-500/50',
  red: 'bg-red-500 shadow-red-500/50',
};

const statusLabels = {
  green: 'Sin alertas',
  yellow: 'Atención',
  red: 'Alerta',
};

export function TrafficLight({ status, size = 'md', showLabel = false, className }: TrafficLightProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full shadow-lg animate-pulse',
          sizeClasses[size],
          statusColors[status]
        )}
      />
      {showLabel && (
        <span className={cn(
          'text-sm font-medium',
          status === 'green' && 'text-emerald-600 dark:text-emerald-400',
          status === 'yellow' && 'text-yellow-600 dark:text-yellow-400',
          status === 'red' && 'text-red-600 dark:text-red-400'
        )}>
          {statusLabels[status]}
        </span>
      )}
    </div>
  );
}
