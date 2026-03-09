import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';

export const AdminConfirmationStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Confirmación</h2>
        <p className="text-muted-foreground mt-1">Revisá tu configuración y aceptá los términos</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-muted/30 space-y-2">
          <p className="text-sm"><strong>Nombre:</strong> {data.fullName || '—'}</p>
          <p className="text-sm"><strong>Organización:</strong> {data.adminOrganization || '—'}</p>
          <p className="text-sm"><strong>Idioma:</strong> {data.language === 'en' ? 'English' : data.language === 'pt' ? 'Português' : 'Español'}</p>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
          <Checkbox
            id="admin-terms"
            checked={data.termsAccepted}
            onCheckedChange={v => updateData({ termsAccepted: v === true })}
            className="mt-1"
          />
          <Label htmlFor="admin-terms" className="text-sm leading-relaxed cursor-pointer">
            Acepto los términos y condiciones de uso de la plataforma NETIA como administrador.
          </Label>
        </div>
      </div>
    </OnboardingStep>
  );
};
