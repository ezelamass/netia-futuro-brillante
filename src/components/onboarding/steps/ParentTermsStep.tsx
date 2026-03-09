import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';

export const ParentTermsStep = () => {
  const { data, updateData } = useOnboarding();

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Términos y condiciones</h2>
        <p className="text-muted-foreground mt-1">Para continuar, aceptá los términos</p>
      </div>

      <div className="space-y-5">
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
          <Checkbox
            id="data-auth"
            checked={data.dataAuthorization}
            onCheckedChange={v => updateData({ dataAuthorization: v === true })}
            className="mt-1"
          />
          <Label htmlFor="data-auth" className="text-sm leading-relaxed cursor-pointer">
            Autorizo el tratamiento de datos personales de mi hijo/a según la política de privacidad de NETIA.
          </Label>
        </div>
        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30">
          <Checkbox
            id="terms"
            checked={data.termsAccepted}
            onCheckedChange={v => updateData({ termsAccepted: v === true })}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
            Acepto los términos y condiciones de uso de la plataforma NETIA.
          </Label>
        </div>
      </div>
    </OnboardingStep>
  );
};
