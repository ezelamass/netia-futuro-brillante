import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface InvitePlayerModalProps {
  open: boolean;
  onClose: () => void;
}

export function InvitePlayerModal({ open, onClose }: InvitePlayerModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [category, setCategory] = useState('U14');

  const inviteCode = 'CLUB-NETIA-X7K9';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvitation = () => {
    if (!email) {
      toast.error('Ingresá un email válido');
      return;
    }
    toast.success(`Invitación enviada a ${email}`);
    setEmail('');
    setPlayerName('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar jugador</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invite code */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Compartí este código con la familia del jugador:
            </p>
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <code className="flex-1 text-center text-lg font-mono font-bold">
                {inviteCode}
              </code>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleCopyCode}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O enviá una invitación por email
              </span>
            </div>
          </div>

          {/* Email form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email del tutor</Label>
              <Input
                id="email"
                type="email"
                placeholder="tutor@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerName">Nombre del jugador (opcional)</Label>
              <Input
                id="playerName"
                placeholder="Juan Pérez"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="U10">U10 (8-10 años)</SelectItem>
                  <SelectItem value="U12">U12 (11-12 años)</SelectItem>
                  <SelectItem value="U14">U14 (13-14 años)</SelectItem>
                  <SelectItem value="U16">U16 (15-16 años)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSendInvitation}>
            <Mail className="h-4 w-4 mr-2" />
            Enviar invitación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
