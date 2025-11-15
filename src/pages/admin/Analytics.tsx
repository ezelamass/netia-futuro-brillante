import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Analíticas del Sistema
          </CardTitle>
          <CardDescription>Métricas y estadísticas globales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Analíticas próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Analytics;
