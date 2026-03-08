import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEnrollment } from '@/hooks/useEnrollment';
import { Ticket, Loader2 } from 'lucide-react';

export const JoinClubModal = () => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { joinClubByCode } = useEnrollment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    const success = await joinClubByCode(code);
    setLoading(false);
    if (success) {
      setCode('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Ticket className="h-4 w-4" />
          Unirme a un club
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unirme a un club</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Código de invitación</Label>
            <Input
              id="invite-code"
              placeholder="Ej: CLUB2025"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={20}
              className="text-center text-lg tracking-widest font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Pedile el código a tu entrenador o club
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Enviar solicitud
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
