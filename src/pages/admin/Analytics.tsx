import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { PageTransition } from '@/layouts/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
        <Sidebar />
        
        <main className="ml-20 p-8">
          <Header />
          
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
        </main>
      </div>
    </PageTransition>
  );
};

export default Analytics;
