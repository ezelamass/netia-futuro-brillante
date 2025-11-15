import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

const ClubDashboard = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Panel del Club
          </CardTitle>
          <CardDescription>Gestión y seguimiento del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Panel del club próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default ClubDashboard;
