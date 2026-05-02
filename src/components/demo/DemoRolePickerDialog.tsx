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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl sm:text-2xl font-bold">Explorá NETIA</DialogTitle>
          <DialogDescription className="text-sm">
            Elegí un perfil para probar la plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 mt-2">
          {DEMO_ROLES.map((role, index) => {
            const Icon = role.icon;
            const isLoading = loadingRole === role.role;
            const isDisabled = loadingRole !== null && !isLoading;
            return (
              <motion.button
                key={role.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(role.role)}
                disabled={isLoading || isDisabled}
                className={`rounded-2xl border-2 border-transparent hover:border-primary p-3 sm:p-4 cursor-pointer transition-colors bg-gradient-to-br ${role.gradient} disabled:opacity-50 disabled:cursor-not-allowed flex sm:flex-col items-center sm:text-center text-left gap-3 sm:gap-2`}
              >
                {/* Icon */}
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/80 flex items-center justify-center shadow-sm shrink-0 ${role.iconColor}`}>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 sm:w-full min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold leading-tight">{role.label}</h3>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug mt-0.5 sm:mt-1 line-clamp-2 sm:line-clamp-none sm:min-h-[3rem]">
                    {role.description}
                  </p>
                </div>

                {/* Action chip (desktop only — full row is the tap target on mobile) */}
                <div className="hidden sm:block w-full">
                  <Button size="sm" className="mt-2 gap-1 w-full pointer-events-none" disabled={isLoading || isDisabled}>
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
                </div>

                {/* Mobile chevron / loader */}
                <div className="sm:hidden shrink-0 text-muted-foreground">
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-3 text-[11px] sm:text-xs text-muted-foreground">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Los datos son de ejemplo. No se crea ninguna cuenta.</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
