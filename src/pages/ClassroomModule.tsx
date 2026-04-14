import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useModuleDetail } from '@/hooks/useModuleDetail';
import { ModuleProgressBar, SectionAccordion } from '@/components/classroom';

const ClassroomModule = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { module, sections, completedLessonIds, isLoading } = useModuleDetail(moduleId);

  const handleLessonClick = (lessonId: string) => {
    navigate(`/classroom/${moduleId}/lesson/${lessonId}`);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!module) {
    return (
      <AppLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Módulo no encontrado</p>
          <Link to="/classroom" className="text-primary text-sm mt-2 inline-block">
            Volver al Aula
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Back link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to="/classroom" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Volver al Aula
          </Link>
        </motion.div>

        {/* Module header with cover */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-xl overflow-hidden"
        >
          <div className="h-32">
            {module.coverUrl ? (
              <img src={module.coverUrl} alt={module.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h1 className="text-lg font-bold text-white">{module.title}</h1>
            {module.description && (
              <p className="text-sm text-white/80 line-clamp-2">{module.description}</p>
            )}
          </div>
        </motion.div>

        {/* Module progress */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <ModuleProgressBar completed={module.completedCount} total={module.lessonCount} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Section accordion */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {sections.length > 0 ? (
            <SectionAccordion
              sections={sections}
              completedIds={completedLessonIds}
              onLessonClick={handleLessonClick}
            />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Este módulo aún no tiene lecciones
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ClassroomModule;
