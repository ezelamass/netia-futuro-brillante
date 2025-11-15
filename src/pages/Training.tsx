import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

const Training = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6" />
            Plan de Entrenamiento
          </CardTitle>
          <CardDescription>Tus ejercicios y rutinas personalizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Plan de entrenamiento próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Training;
