import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';

export const AdminProfileStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Perfil de administrador</h2>
        <p className="text-muted-foreground mt-1">Configurá tu cuenta de administrador</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Nombre completo *</Label>
          <Input value={data.fullName} onChange={e => updateData({ fullName: e.target.value })} placeholder="Tu nombre" />
        </div>
        <div>
          <Label>Organización</Label>
          <Input
            value={data.adminOrganization ?? ''}
            onChange={e => updateData({ adminOrganization: e.target.value })}
            placeholder="Nombre de la organización"
          />
        </div>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground">
            🔑 Como administrador, tendrás acceso completo a la gestión de usuarios, clubes y configuración de la plataforma.
          </p>
        </div>
      </div>
    </OnboardingStep>
  );
};
