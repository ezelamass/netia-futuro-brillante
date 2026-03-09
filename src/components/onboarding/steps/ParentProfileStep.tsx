import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

export const ParentProfileStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Datos del tutor</h2>
        <p className="text-muted-foreground mt-1">Completá tu perfil como padre/madre/tutor</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Nombre completo *</Label>
          <Input value={data.fullName} onChange={e => updateData({ fullName: e.target.value })} placeholder="Tu nombre" />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input value={data.tutorPhone} onChange={e => updateData({ tutorPhone: e.target.value })} placeholder="+54 11 1234-5678" />
        </div>
        <div>
          <Label>Relación con el deportista *</Label>
          <Select value={data.parentRelationship || ''} onValueChange={v => updateData({ parentRelationship: v })}>
            <SelectTrigger><SelectValue placeholder="Seleccioná" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="madre">Madre</SelectItem>
              <SelectItem value="padre">Padre</SelectItem>
              <SelectItem value="tutor">Tutor legal</SelectItem>
              <SelectItem value="otro">Otro familiar</SelectItem>
            </SelectContent>
          </Select>
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
      </div>
    </OnboardingStep>
  );
};
