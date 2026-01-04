import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface UsersHeaderProps {
  totalUsers: number;
  onCreateUser: () => void;
}

export function UsersHeader({ totalUsers, onCreateUser }: UsersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          {totalUsers.toLocaleString()} usuarios registrados
        </p>
      </div>
      <Button onClick={onCreateUser} className="gap-2">
        <UserPlus className="h-4 w-4" />
        Crear usuario
      </Button>
    </div>
  );
}
