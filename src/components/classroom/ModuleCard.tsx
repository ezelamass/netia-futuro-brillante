import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { CourseModule } from '@/types/classroom';

interface ModuleCardProps {
  module: CourseModule;
  index: number;
}

export function ModuleCard({ module, index }: ModuleCardProps) {
  const percent = module.lessonCount > 0
    ? Math.round((module.completedCount / module.lessonCount) * 100)
    : 0;
  const isComplete = percent === 100 && module.lessonCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={`/classroom/${module.id}`}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
          {/* Cover */}
          <div className="relative h-40 overflow-hidden">
            {module.coverUrl ? (
              <img
                src={module.coverUrl}
                alt={module.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary/30">
                  {module.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {isComplete && (
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center ring-2 ring-background">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Body */}
          <CardContent className="p-4">
            <h3 className="text-base font-semibold line-clamp-2 mb-1">{module.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">
              {module.lessonCount} lecciones
            </p>
            <div className="flex items-center gap-2">
              <Progress value={percent} className="h-1.5 flex-1" />
              <span className="text-xs font-medium text-muted-foreground">{percent}%</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
