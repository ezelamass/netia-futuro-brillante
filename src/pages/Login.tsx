import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const sportsQuotes = [
  "El único modo de hacer un gran trabajo es amar lo que haces - Steve Jobs",
  "El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje de continuar - Winston Churchill",
  "No cuentes los días, haz que los días cuenten - Muhammad Ali",
  "La diferencia entre lo imposible y lo posible está en la determinación - Tommy Lasorda",
  "El talento gana juegos, pero el trabajo en equipo y la inteligencia ganan campeonatos - Michael Jordan",
  "Cuanto más duro trabajo, más suerte tengo - Gary Player",
  "El dolor es temporal, el orgullo es para siempre - Anónimo",
  "No te detengas cuando estés cansado, detente cuando hayas terminado - Anónimo",
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname;

  useEffect(() => {
    const randomQuote = sportsQuotes[Math.floor(Math.random() * sportsQuotes.length)];
    setCurrentQuote(randomQuote);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo = from || getDefaultRouteForRole(user.role);
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user]);

  const getDefaultRouteForRole = (role: string): string => {
    switch (role) {
      case 'admin': return '/admin/dashboard';
      case 'coach':
      case 'club_admin': return '/club/dashboard';
      case 'parent': return '/parent/dashboard';
      case 'player':
      default: return '/dashboard';
    }
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('¡Bienvenido a NETIA!');
    } catch (error: any) {
      const raw = error?.message || '';
      let title = 'Error al iniciar sesión';
      let description: string | undefined;

      if (raw.includes('Invalid login') || raw.toLowerCase().includes('invalid credentials')) {
        title = 'No pudimos iniciar sesión';
        description =
          'Revisá que el email y la contraseña estén correctos. Si nunca creaste una cuenta, registrate primero.';
      } else if (raw.toLowerCase().includes('email not confirmed')) {
        title = 'Email sin confirmar';
        description = 'Revisá tu casilla y hacé click en el link de confirmación que te enviamos.';
      } else if (raw.toLowerCase().includes('network') || raw.toLowerCase().includes('fetch')) {
        title = 'Error de conexión';
        description = 'No pudimos contactar al servidor. Revisá tu conexión a internet e intentá de nuevo.';
      } else if (raw) {
        description = raw;
      }

      toast.error(title, { description });
      console.error('[login] failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-netia-blue via-primary to-netia-orange p-4 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-netia-orange rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-netia-blue rounded-full blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white p-4 rounded-2xl shadow-2xl">
            <img src="/logo.png" alt="NETIA" className="w-20 h-20" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-white mb-2">NETIA</h1>
          <p className="text-white/90 text-lg font-medium">
            Tu mapa deportivo comienza acá 🌍
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass-card p-8 rounded-3xl shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-white/60" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                  className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all h-12 rounded-xl"
                />
              </div>
              {errors.email && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-300 text-sm">
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-white/60" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: '' }); }}
                  className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all h-12 rounded-xl"
                />
              </div>
              {errors.password && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-300 text-sm">
                  {errors.password}
                </motion.p>
              )}
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-netia-blue hover:bg-white/90 font-semibold h-12 rounded-xl text-base shadow-lg transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-netia-blue border-t-transparent rounded-full animate-spin" />
                    Iniciando...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </motion.div>


            <p className="text-center text-sm text-white/80">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-white font-semibold hover:underline transition-all">
                Regístrate
              </Link>
            </p>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-white/80 text-sm italic max-w-md mx-auto px-4">
            "{currentQuote}"
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
