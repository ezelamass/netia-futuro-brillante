import { User } from '@/types/user';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  RefreshCw, 
  Building2, 
  Lock, 
  Unlock, 
  KeyRound, 
  Trash2 
} from 'lucide-react';
import { RoleBadge } from './RoleBadge';
import { StatusBadge } from './StatusBadge';
import { TableCell, TableRow } from '@/components/ui/table';

interface UserRowProps {
  user: User;
  isSelected: boolean;
  onToggleSelect: (userId: string) => void;
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onAssignClub: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserRow({
  user,
  isSelected,
  onToggleSelect,
  onView,
  onEdit,
  onChangeRole,
  onAssignClub,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: UserRowProps) {
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TableRow className={isSelected ? 'bg-muted/50' : undefined}>
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(user.id)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.fullName} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <RoleBadge role={user.role} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {user.clubName || '-'}
      </TableCell>
      <TableCell>
        <StatusBadge status={user.status} />
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(user)}>
              <Eye className="h-4 w-4 mr-2" />
              Ver detalle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeRole(user)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Cambiar rol
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssignClub(user)}>
              <Building2 className="h-4 w-4 mr-2" />
              Asignar a club
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onToggleStatus(user)}>
              {user.status === 'active' ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Desactivar
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Activar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onResetPassword(user)}>
              <KeyRound className="h-4 w-4 mr-2" />
              Resetear contraseña
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(user)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
