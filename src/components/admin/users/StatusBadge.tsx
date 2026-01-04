import { Badge } from '@/components/ui/badge';
import { UserStatus } from '@/types/user';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: UserStatus;
  className?: string;
}

const statusConfig: Record<UserStatus, { label: string; icon: string; className: string }> = {
  active: {
    label: 'Activo',
    icon: '🟢',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  inactive: {
    label: 'Inactivo',
    icon: '🔴',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  },
  pending: {
    label: 'Pendiente',
    icon: '🟡',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge 
      variant="secondary" 
      className={cn('font-medium', config.className, className)}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}
