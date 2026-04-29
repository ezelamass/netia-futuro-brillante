import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useDemo, DEMO_ROLES } from '@/contexts/DemoContext';
import type { UserRole } from '@/contexts/AuthContext';

interface DemoRolePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoRolePickerDialog({ open, onOpenChange }: DemoRolePickerDialogProps) {
  const { demoLogin } = useDemo();
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  const handleSelect = async (role: UserRole) => {
    if (loadingRole) return;
    setLoadingRole(role);
    try {
      const result = await demoLogin(role);
      if (result.ok) {
        onOpenChange(false);
      } else {
        toast.error('No pudimos abrir la demo', {
          description: result.error,
        });
      }
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Explorá NETIA</DialogTitle>
          <DialogDescription>
            Elegí un perfil para probar la plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-2">
          {DEMO_ROLES.map((role, index) => {
            const Icon = role.icon;
            const isLoading = loadingRole === role.role;
            const isDisabled = loadingRole !== null && !isLoading;
            return (
              <motion.button
                key={role.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ scale: isDisabled ? 1 : 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(role.role)}
                disabled={isLoading || isDisabled}
                className={`rounded-2xl border-2 border-transparent hover:border-primary p-5 cursor-pointer text-center transition-colors bg-gradient-to-br ${role.gradient} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center mx-auto mb-3 shadow-sm ${role.iconColor}`}>
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-base font-semibold mb-1">{role.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed min-h-[3rem]">
                  {role.description}
                </p>
                <Button size="sm" className="mt-3 gap-1 w-full" disabled={isLoading || isDisabled}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Abriendo...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" />
                      Probar
                    </>
                  )}
                </Button>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Los datos son de ejemplo. No se crea ninguna cuenta.</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
