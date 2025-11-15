import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog } from 'lucide-react';

const Users = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="w-6 h-6" />
            Gestión de Usuarios
          </CardTitle>
          <CardDescription>Administra cuentas y permisos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Gestión de usuarios próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Users;
