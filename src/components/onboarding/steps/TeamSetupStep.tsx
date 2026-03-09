import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UsersRound } from 'lucide-react';

export const TeamSetupStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UsersRound className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Tu equipo</h2>
        <p className="text-muted-foreground mt-1">Configurá la información de tu grupo</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Cantidad de jugadores estimada</Label>
          <Input
            type="number"
            min={1}
            value={data.coachTeamSize ?? ''}
            onChange={e => updateData({ coachTeamSize: parseInt(e.target.value) || 0 })}
            placeholder="20"
          />
        </div>
        <div>
          <Label>Rango de edad</Label>
          <Select value={data.coachAgeRange ?? ''} onValueChange={v => updateData({ coachAgeRange: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccioná" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sub10">Sub 10</SelectItem>
              <SelectItem value="sub12">Sub 12</SelectItem>
              <SelectItem value="sub14">Sub 14</SelectItem>
              <SelectItem value="sub16">Sub 16</SelectItem>
              <SelectItem value="sub18">Sub 18</SelectItem>
              <SelectItem value="adultos">Adultos</SelectItem>
              <SelectItem value="mixto">Mixto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Días de entrenamiento por semana</Label>
          <Input
            type="number"
            min={1}
            max={7}
            value={data.trainingDaysPerWeek}
            onChange={e => updateData({ trainingDaysPerWeek: parseInt(e.target.value) || 3 })}
          />
        </div>
        <div>
          <Label>Objetivo de la temporada</Label>
          <Input
            value={data.coachSeasonGoal ?? ''}
            onChange={e => updateData({ coachSeasonGoal: e.target.value })}
            placeholder="Mejorar ranking nacional, formar base..."
          />
        </div>
      </div>
    </OnboardingStep>
  );
};
