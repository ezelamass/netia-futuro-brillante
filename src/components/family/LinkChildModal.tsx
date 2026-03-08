import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFamilyLinks } from '@/hooks/useFamilyLinks';
import { UserPlus, Loader2 } from 'lucide-react';

export const LinkChildModal = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { linkChild } = useFamilyLinks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    const success = await linkChild(email);
    setLoading(false);
    if (success) {
      setEmail('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Vincular hijo/a
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular a tu hijo/a</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child-email">Email del hijo/a</Label>
            <Input
              id="child-email"
              type="email"
              placeholder="hijo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Tu hijo/a debe tener una cuenta registrada en NETIA
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Vincular
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
