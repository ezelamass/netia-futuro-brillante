import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { PageTransition } from '@/layouts/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog } from 'lucide-react';

const Users = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
        <Sidebar />
        
        <main className="ml-20 p-8">
          <Header />
          
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
        </main>
      </div>
    </PageTransition>
  );
};

export default Users;
