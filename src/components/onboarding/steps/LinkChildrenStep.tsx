import { useState } from 'react';
import { OnboardingStep } from '../OnboardingStep';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserPlus, X, Mail } from 'lucide-react';

export const LinkChildrenStep = () => {
  const { data, updateData } = useOnboarding();
  const [childEmail, setChildEmail] = useState('');

  const children = data.childrenEmails || [];

  const addChild = () => {
    if (childEmail.trim() && !children.includes(childEmail.trim())) {
      updateData({ childrenEmails: [...children, childEmail.trim()] });
      setChildEmail('');
    }
  };

  const removeChild = (email: string) => {
    updateData({ childrenEmails: children.filter(c => c !== email) });
  };

  return (
    <OnboardingStep>
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Vincular hijos</h2>
        <p className="text-muted-foreground mt-1">Ingresá el email de tus hijos registrados en NETIA</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Email del deportista</Label>
          <div className="flex gap-2">
            <Input
              value={childEmail}
              onChange={e => setChildEmail(e.target.value)}
              placeholder="hijo@email.com"
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addChild())}
            />
            <Button type="button" onClick={addChild} size="icon" variant="outline">
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {children.length > 0 && (
          <div className="space-y-2">
            <Label>Hijos vinculados</Label>
            {children.map(email => (
              <div key={email} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{email}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeChild(email)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {children.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Podés vincular hijos después desde tu perfil si preferís.
          </p>
        )}
      </div>
    </OnboardingStep>
  );
};
