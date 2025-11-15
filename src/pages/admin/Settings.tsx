import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <AppLayout>
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
    </AppLayout>
  );
};

export default Settings;
