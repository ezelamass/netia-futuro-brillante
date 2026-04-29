import { useDemo, DEMO_ROLES } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Gamepad2, ChevronDown, X, Check, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function DemoBanner() {
  const { isDemoMode, demoRole, switchDemoRole, exitDemo } = useDemo();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  const currentLabel = DEMO_ROLES.find(r => r.role === demoRole)?.label || 'Demo';

  const handleRegister = async () => {
    await exitDemo();
    navigate('/register');
  };

  const handleSwitch = async (role: typeof DEMO_ROLES[number]['role']) => {
    const result = await switchDemoRole(role);
    if (!result.ok) {
      toast.error('No pudimos cambiar de rol', { description: result.error });
    }
  };

  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-[60] h-10 bg-gradient-to-r from-[#FF6B35] via-primary to-[#1C274C]"
    >
      <div className="h-full flex items-center justify-between px-4 max-w-screen-2xl mx-auto">
        {/* Left */}
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-white" />
          <span className="text-white text-xs font-bold uppercase tracking-wider hidden sm:inline">
            Modo Demo
          </span>
        </div>

        {/* Center: Role switcher */}
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs hidden sm:inline">Viendo como:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-white hover:bg-white/20 hover:text-white gap-1 text-xs font-semibold">
                {currentLabel}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {DEMO_ROLES.map(role => (
                <DropdownMenuItem
                  key={role.role}
                  onClick={() => handleSwitch(role.role)}
                  className="gap-2"
                >
                  {role.role === demoRole && <Check className="w-3.5 h-3.5" />}
                  {role.role !== demoRole && <span className="w-3.5" />}
                  {role.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-white hover:bg-white/20 hover:text-white text-xs gap-1 hidden sm:flex"
            onClick={handleRegister}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Registrate gratis
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-white hover:bg-white/20 hover:text-white"
            onClick={exitDemo}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
