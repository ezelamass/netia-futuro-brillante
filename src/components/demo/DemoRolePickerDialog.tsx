import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Shield, Info, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDemo } from '@/contexts/DemoContext';
import type { UserRole } from '@/contexts/AuthContext';

interface DemoRolePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLES = [
  {
    value: 'player' as UserRole,
    label: 'Jugador',
    icon: Trophy,
    description: 'Explora tu dashboard, logros, entrenamientos y chatea con tu avatar IA',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-500',
  },
  {
    value: 'coach' as UserRole,
    label: 'Entrenador',
    icon: Users,
    description: 'Gestiona tu club, roster de atletas, cargas de entrenamiento e informes',
    gradient: 'from-orange-500/10 to-amber-500/10',
    iconColor: 'text-orange-500',
  },
  {
    value: 'admin' as UserRole,
    label: 'Administrador',
    icon: Shield,
    description: 'Controla toda la plataforma: usuarios, analíticas y configuración del sistema',
    gradient: 'from-purple-500/10 to-indigo-500/10',
    iconColor: 'text-purple-500',
  },
];

export function DemoRolePickerDialog({ open, onOpenChange }: DemoRolePickerDialogProps) {
  const { demoLogin } = useDemo();

  const handleSelect = async (role: UserRole) => {
    onOpenChange(false);
    await demoLogin(role);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold">Explorá NETIA</DialogTitle>
          <DialogDescription>
            Elegí un perfil para probar la plataforma
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {ROLES.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.button
                key={role.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(role.value)}
                className={`rounded-2xl border-2 border-transparent hover:border-primary p-5 cursor-pointer text-center transition-colors bg-gradient-to-br ${role.gradient}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center mx-auto mb-3 shadow-sm ${role.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold mb-1">{role.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
                <Button size="sm" className="mt-3 gap-1 w-full">
                  <Play className="w-3 h-3" />
                  Probar
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
