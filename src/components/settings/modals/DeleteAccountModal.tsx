import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteAccountModal = ({ open, onOpenChange }: DeleteAccountModalProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canDelete = confirmText === 'ELIMINAR';

  const handleDelete = async () => {
    if (!canDelete) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast.success('Cuenta eliminada. Lamentamos verte partir.');
    onOpenChange(false);
    // In a real app, this would redirect to login/landing
  };

  const handleClose = () => {
    onOpenChange(false);
    setConfirmText('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-destructive">Eliminar cuenta</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Esta acción es <strong>IRREVERSIBLE</strong>. Se eliminarán permanentemente:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              Todos tus datos de entrenamiento
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              Tu historial con los avatares IA
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              Tus logros y rachas
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              Tu perfil y configuración
            </li>
          </ul>

          <div className="mt-6 space-y-2">
            <Label htmlFor="confirm-delete">
              Escribí <strong className="text-destructive">ELIMINAR</strong> para confirmar:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="border-destructive/50 focus-visible:ring-destructive"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Eliminar cuenta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
