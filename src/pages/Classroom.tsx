import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, BookOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseModules } from '@/hooks/useCourseModules';
import { ModuleCard, ModuleProgressBar } from '@/components/classroom';

const Classroom = () => {
  const { user } = useAuth();
  const { modules, totalLessons, completedLessons, isLoading } = useCourseModules();

  const isCoach = user?.role === 'coach' || user?.role === 'club_admin';

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Mi Aula</h1>
            <p className="text-xs text-muted-foreground">
              {isCoach ? 'Aprendizaje para entrenadores' : 'Aprendizaje para jugadores'}
            </p>
          </div>
        </motion.div>

        {/* Overall progress */}
        {totalLessons > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <ModuleProgressBar completed={completedLessons} total={totalLessons} />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Module grid */}
        {modules.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((m, i) => (
              <ModuleCard key={m.id} module={m} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="py-16 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-1">No hay cursos disponibles</h3>
                <p className="text-sm text-muted-foreground">
                  Pronto habrá contenido nuevo para vos
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default Classroom;
