import { useState } from 'react';
import { User } from '@/types/user';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeactivateUserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeactivateUserModal({
  user,
  open,
  onOpenChange,
  onConfirm,
}: DeactivateUserModalProps) {
  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>⚠️ Desactivar usuario</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              ¿Desactivar la cuenta de{' '}
              <strong>{user.fullName}</strong> ({user.email})?
            </p>
            <p>
              El usuario no podrá acceder a la plataforma hasta que se reactive.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Desactivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface DeleteUserModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteUserModal({
  user,
  open,
  onOpenChange,
  onConfirm,
}: DeleteUserModalProps) {
  const [confirmText, setConfirmText] = useState('');

  if (!user) return null;

  const handleConfirm = () => {
    if (confirmText === 'ELIMINAR') {
      onConfirm();
      setConfirmText('');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setConfirmText('');
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🗑 Eliminar usuario</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p className="text-destructive font-medium">
              ⚠️ Esta acción es IRREVERSIBLE
            </p>
            <p>Se eliminará permanentemente:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Cuenta de {user.fullName}</li>
              <li>Todos sus datos y registros</li>
              <li>Historial de actividad</li>
            </ul>
            <div className="pt-2">
              <Label htmlFor="confirm-delete">
                Escribí "ELIMINAR" para confirmar:
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="mt-2"
                placeholder="ELIMINAR"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={confirmText !== 'ELIMINAR'}
            className="bg-destructive hover:bg-destructive/90"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ResetPasswordModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ResetPasswordModal({
  user,
  open,
  onOpenChange,
  onConfirm,
}: ResetPasswordModalProps) {
  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🔑 Resetear contraseña</AlertDialogTitle>
          <AlertDialogDescription>
            Se enviará un email a <strong>{user.email}</strong> con un enlace
            para restablecer la contraseña.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Enviar email
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { UserRole } from '@/types/user';

interface ChangeRoleModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (role: UserRole) => void;
}

export function ChangeRoleModal({
  user,
  open,
  onOpenChange,
  onConfirm,
}: ChangeRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'player');

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🔄 Cambiar rol</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Cambiar el rol de <strong>{user.fullName}</strong>
            </p>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="player">🎾 Jugador</option>
              <option value="family">👨‍👩‍👧 Familia</option>
              <option value="coach">🏫 Entrenador</option>
              <option value="club_admin">🏢 Admin Club</option>
              <option value="federation">🏛 Federación</option>
              <option value="government">🏛 Gobierno</option>
              <option value="admin">🔑 Administrador</option>
            </select>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(selectedRole)}>
            Cambiar rol
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface AssignClubModalProps {
  user: User | null;
  users?: User[];
  clubs: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (clubId: string, clubName: string) => void;
  isBulk?: boolean;
}

export function AssignClubModal({
  user,
  users,
  clubs,
  open,
  onOpenChange,
  onConfirm,
  isBulk = false,
}: AssignClubModalProps) {
  const [selectedClub, setSelectedClub] = useState('');

  const handleConfirm = () => {
    const club = clubs.find((c) => c.id === selectedClub);
    if (club) {
      onConfirm(club.id, club.name);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🏫 Asignar a club</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            {isBulk ? (
              <p>
                Asignar <strong>{users?.length} usuarios</strong> a un club
              </p>
            ) : (
              <p>
                Asignar a <strong>{user?.fullName}</strong> a un club
              </p>
            )}
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="">Seleccionar club...</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!selectedClub}>
            Asignar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
