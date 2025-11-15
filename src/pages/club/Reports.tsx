import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

const Reports = () => {
  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Informes y Reportes
          </CardTitle>
          <CardDescription>Análisis del rendimiento del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            Sistema de informes próximamente...
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Reports;
