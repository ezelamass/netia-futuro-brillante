import { User, UserActivity } from '@/types/user';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit, Lock, Unlock, KeyRound, CheckCircle, XCircle } from 'lucide-react';

interface UserDetailModalProps {
  user: User | null;
  activities: UserActivity[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export function UserDetailModal({
  user,
  activities,
  open,
  onOpenChange,
  onEdit,
  onToggleStatus,
  onResetPassword,
}: UserDetailModalProps) {
  if (!user) return null;

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user.fullName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{user.fullName}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <RoleBadge role={user.role} />
              <StatusBadge status={user.status} />
            </div>
          </div>

          <Separator />

          {/* Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase">
              Información
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">ID</p>
                <p className="font-mono">{user.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rol</p>
                <p>{user.role}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Club</p>
                <p>{user.clubName || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Registrado</p>
                <p>{format(user.createdAt, "dd/MM/yyyy", { locale: es })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Último login</p>
                <p>
                  {user.lastLoginAt
                    ? format(user.lastLoginAt, "dd/MM/yyyy HH:mm", { locale: es })
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Email verificado</p>
                <p className="flex items-center gap-1">
                  {user.emailVerified ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Verificado
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      No verificado
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics (for players) */}
          {user.metrics && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">
                  Métricas
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sesiones</p>
                    <p className="font-semibold text-lg">{user.metrics.totalSessions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Días activos</p>
                    <p className="font-semibold text-lg">{user.metrics.activeDays}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Racha actual</p>
                    <p className="font-semibold text-lg">{user.metrics.currentStreak} días</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">XP total</p>
                    <p className="font-semibold text-lg">{user.metrics.totalXP.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Recent Activity */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase">
              Actividad Reciente
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    {format(activity.timestamp, "dd/MM HH:mm", { locale: es })}
                  </span>
                  <span>-</span>
                  <span>{activity.action}</span>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">Sin actividad reciente</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onEdit(user)} className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" onClick={() => onToggleStatus(user)} className="gap-2">
              {user.status === 'active' ? (
                <>
                  <Lock className="h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  Activar
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => onResetPassword(user)} className="gap-2">
              <KeyRound className="h-4 w-4" />
              Resetear pwd
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
