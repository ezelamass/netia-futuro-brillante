import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';

export const PlatformPrefsStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Preferencias</h2>
        <p className="text-muted-foreground mt-1">Personalizá la plataforma</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label>Idioma predeterminado</Label>
          <Select value={data.language || 'es'} onValueChange={v => updateData({ language: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Zona horaria</Label>
          <Select value={data.adminTimezone ?? 'america_buenos_aires'} onValueChange={v => updateData({ adminTimezone: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="america_buenos_aires">Buenos Aires (GMT-3)</SelectItem>
              <SelectItem value="america_santiago">Santiago (GMT-4)</SelectItem>
              <SelectItem value="america_bogota">Bogotá (GMT-5)</SelectItem>
              <SelectItem value="america_mexico">Ciudad de México (GMT-6)</SelectItem>
              <SelectItem value="europe_madrid">Madrid (GMT+1)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div>
            <Label className="text-base font-medium">Notificaciones por email</Label>
            <p className="text-sm text-muted-foreground">Alertas de nuevos registros y actividad</p>
          </div>
          <Switch checked={data.adminEmailNotifications ?? true} onCheckedChange={v => updateData({ adminEmailNotifications: v })} />
        </div>
      </div>
    </OnboardingStep>
  );
};
