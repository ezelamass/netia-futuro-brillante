import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap } from 'lucide-react';

export const CoachProfileStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Perfil del entrenador</h2>
        <p className="text-muted-foreground mt-1">Contanos sobre tu experiencia</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Nombre completo *</Label>
          <Input value={data.fullName} onChange={e => updateData({ fullName: e.target.value })} placeholder="Tu nombre" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>País</Label>
            <Input value={data.country} onChange={e => updateData({ country: e.target.value })} placeholder="Argentina" />
          </div>
          <div>
            <Label>Ciudad</Label>
            <Input value={data.city} onChange={e => updateData({ city: e.target.value })} placeholder="Buenos Aires" />
          </div>
        </div>
        <div>
          <Label>Años de experiencia</Label>
          <Input
            type="number"
            min={0}
            value={data.coachExperienceYears ?? ''}
            onChange={e => updateData({ coachExperienceYears: parseInt(e.target.value) || 0 })}
            placeholder="5"
          />
        </div>
        <div>
          <Label>Certificaciones</Label>
          <Input
            value={data.coachCertifications ?? ''}
            onChange={e => updateData({ coachCertifications: e.target.value })}
            placeholder="AAT, ITF nivel 2, etc."
          />
        </div>
      </div>
    </OnboardingStep>
  );
};
