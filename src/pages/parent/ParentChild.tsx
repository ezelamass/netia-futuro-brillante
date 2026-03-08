import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const ParentChild = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-heading">Mi Hijo/a</h1>
          <p className="text-muted-foreground">Actividad, bienestar y progreso</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sin hijos vinculados</h3>
            <p className="text-muted-foreground max-w-md">
              Una vez que vincules a tu hijo/a, acá vas a poder ver su actividad deportiva, estado de bienestar,
              racha de entrenamientos y más.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ParentChild;
