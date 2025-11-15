import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { PageTransition } from '@/layouts/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/30 to-blue-50/30">
        <Sidebar />
        
        <main className="ml-20 p-8">
          <Header />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-6 h-6" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>Ajustes generales de NETIA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                Configuración próximamente...
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </PageTransition>
  );
};

export default Settings;
