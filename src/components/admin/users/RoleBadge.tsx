import { Badge } from '@/components/ui/badge';
import { UserRole, ROLE_LABELS } from '@/types/user';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleColors: Record<UserRole, string> = {
  player: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  parent: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  coach: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  club_admin: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  federation: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  government: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
  admin: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const { label, icon } = ROLE_LABELS[role];

  return (
    <Badge 
      variant="secondary" 
      className={cn('font-medium', roleColors[role], className)}
    >
      <span className="mr-1">{icon}</span>
      {label}
    </Badge>
  );
}
