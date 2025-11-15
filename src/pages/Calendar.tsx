import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

const Calendar = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6" />
            Calendario de Entrenamientos
          </CardTitle>
          <CardDescription>Planifica tus sesiones y competencias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Vista de calendario próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Calendar;
