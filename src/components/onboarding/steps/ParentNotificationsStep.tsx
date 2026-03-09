import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

export const ParentNotificationsStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Notificaciones</h2>
        <p className="text-muted-foreground mt-1">Configurá qué alertas querés recibir</p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div>
            <Label className="text-base font-medium">Reportes semanales</Label>
            <p className="text-sm text-muted-foreground">Resumen de actividad de tus hijos</p>
          </div>
          <Switch checked={data.weeklyReports} onCheckedChange={v => updateData({ weeklyReports: v })} />
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div>
            <Label className="text-base font-medium">Alertas de entrenamiento</Label>
            <p className="text-sm text-muted-foreground">Aviso si no entrena en 3+ días</p>
          </div>
          <Switch checked={data.parentTrainingAlerts ?? true} onCheckedChange={v => updateData({ parentTrainingAlerts: v })} />
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div>
            <Label className="text-base font-medium">Recordatorios médicos</Label>
            <p className="text-sm text-muted-foreground">Apto médico próximo a vencer</p>
          </div>
          <Switch checked={data.parentMedicalAlerts ?? true} onCheckedChange={v => updateData({ parentMedicalAlerts: v })} />
        </div>
      </div>
    </OnboardingStep>
  );
};
