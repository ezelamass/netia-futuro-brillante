import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

const Roster = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Plantilla del Club
          </CardTitle>
          <CardDescription>Gestiona a tus deportistas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Gestión de plantilla próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Roster;
