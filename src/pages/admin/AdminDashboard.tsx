import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Panel de Administración
          </CardTitle>
          <CardDescription>Gestión completa del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Panel de administración próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default AdminDashboard;
