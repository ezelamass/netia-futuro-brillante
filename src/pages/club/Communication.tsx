import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const Communication = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Comunicación
          </CardTitle>
          <CardDescription>Mensajes y notificaciones del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Sistema de comunicación próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Communication;
