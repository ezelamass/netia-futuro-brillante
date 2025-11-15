import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageTransition } from '@/layouts/PageTransition';
import { Waves, Target, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">NETIA</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button>Comenzar</Button>
            </Link>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Entrena más inteligente con IA
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              NETIA es tu entrenador personal con inteligencia artificial. 
              Mejora tu rendimiento deportivo con seguimiento personalizado y avatares IA.
            </p>
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Comienza Gratis
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrenamiento Personalizado</h3>
              <p className="text-muted-foreground">
                Planes adaptados a tus objetivos y nivel deportivo
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Avatares IA</h3>
              <p className="text-muted-foreground">
                TINO, ZAHIA y ROMA te guían en cada paso
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguimiento Completo</h3>
              <p className="text-muted-foreground">
                Analiza tu progreso con métricas detalladas
              </p>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default LandingPage;
