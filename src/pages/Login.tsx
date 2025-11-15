import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTransition } from '@/layouts/PageTransition';
import { Waves, User, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password, selectedRole);
      toast.success('¡Bienvenido a NETIA!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Error al iniciar sesión');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Waves className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">NETIA</CardTitle>
            <CardDescription>Inicia sesión en tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tipo de cuenta (Demo)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={selectedRole === 'student' ? 'default' : 'outline'}
                    onClick={() => setSelectedRole('student')}
                    className="w-full"
                  >
                    Alumno
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === 'coach' ? 'default' : 'outline'}
                    onClick={() => setSelectedRole('coach')}
                    className="w-full"
                  >
                    Club
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === 'admin' ? 'default' : 'outline'}
                    onClick={() => setSelectedRole('admin')}
                    className="w-full"
                  >
                    Admin
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;
