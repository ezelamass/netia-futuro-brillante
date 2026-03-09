import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare } from 'lucide-react';

export const CoachCommunicationStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Comunicación</h2>
        <p className="text-muted-foreground mt-1">Configurá tus preferencias de alertas</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label>Frecuencia de reportes</Label>
          <Select value={data.coachReportFrequency ?? 'weekly'} onValueChange={v => updateData({ coachReportFrequency: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div>
            <Label className="text-base font-medium">Alertas de bienestar</Label>
            <p className="text-sm text-muted-foreground">Notificar si un jugador reporta dolor o baja energía</p>
          </div>
          <Switch checked={data.coachWellnessAlerts ?? true} onCheckedChange={v => updateData({ coachWellnessAlerts: v })} />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div>
            <Label className="text-base font-medium">Interacción con avatares</Label>
            <p className="text-sm text-muted-foreground">Recibir sugerencias de NETIA basadas en datos del equipo</p>
          </div>
          <Switch checked={data.championChallenges} onCheckedChange={v => updateData({ championChallenges: v })} />
        </div>
      </div>
    </OnboardingStep>
  );
};
