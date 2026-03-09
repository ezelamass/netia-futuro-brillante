import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

export const ClubSportStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Club y deporte</h2>
        <p className="text-muted-foreground mt-1">Información de tu club y especialidad</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Nombre del club *</Label>
          <Input value={data.coachClubName ?? ''} onChange={e => updateData({ coachClubName: e.target.value })} placeholder="Club de Tenis XYZ" />
        </div>
        <div>
          <Label>Código de invitación (opcional)</Label>
          <Input value={data.coachClubCode ?? ''} onChange={e => updateData({ coachClubCode: e.target.value })} placeholder="ABC123" />
        </div>
        <div>
          <Label>Deporte *</Label>
          <Select value={data.mainSport || ''} onValueChange={v => updateData({ mainSport: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccioná" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tenis">Tenis</SelectItem>
              <SelectItem value="padel">Pádel</SelectItem>
              <SelectItem value="futbol">Fútbol</SelectItem>
              <SelectItem value="natacion">Natación</SelectItem>
              <SelectItem value="atletismo">Atletismo</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Especialidad</Label>
          <Select value={data.coachSpecialty ?? ''} onValueChange={v => updateData({ coachSpecialty: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccioná" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tecnica">Técnica</SelectItem>
              <SelectItem value="fisica">Preparación física</SelectItem>
              <SelectItem value="mental">Entrenamiento mental</SelectItem>
              <SelectItem value="tactica">Táctica</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </OnboardingStep>
  );
};
