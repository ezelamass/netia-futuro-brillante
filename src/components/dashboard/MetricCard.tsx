import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Clock, User, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  subject: string;
  topic: string;
  progress: number;
  daysLeft: number;
  color: 'teal' | 'purple' | 'orange' | 'blue' | 'pink';
  delay?: number;
  icon?: LucideIcon;
}

const colorConfig = {
  teal: {
    path: '#10B981',
    trail: '#D1FAE5',
    ring: 'from-emerald-400 to-teal-500',
  },
  purple: {
    path: '#8B5CF6',
    trail: '#EDE9FE',
    ring: 'from-purple-400 to-violet-500',
  },
  orange: {
    path: '#F59E0B',
    trail: '#FEF3C7',
    ring: 'from-orange-400 to-amber-500',
  },
  blue: {
    path: '#3B82F6',
    trail: '#DBEAFE',
    ring: 'from-blue-400 to-indigo-500',
  },
  pink: {
    path: '#EC4899',
    trail: '#FCE7F3',
    ring: 'from-pink-400 to-rose-500',
  },
};

export const MetricCard = ({
  subject,
  topic,
  progress,
  daysLeft,
  color,
  delay = 0,
  icon: Icon,
}: MetricCardProps) => {
  const colors = colorConfig[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-5">
        {/* Circular Progress with gradient ring effect */}
        <div className="relative flex-shrink-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${colors.ring} opacity-20 rounded-full blur-xl group-hover:opacity-30 transition-opacity`} />
          <div className="relative w-24 h-24">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textSize: '22px',
                pathColor: colors.path,
                textColor: '#1F2937',
                trailColor: colors.trail,
                pathTransitionDuration: 0.8,
                strokeLinecap: 'round',
              })}
              strokeWidth={8}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-display font-bold text-lg text-foreground leading-tight">
              {subject}
            </h4>
            {Icon && (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3 font-medium">
            {topic}
          </p>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.path }} />
              <span className="font-medium">
                {daysLeft} {daysLeft === 1 ? 'día restante' : 'días restantes'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.path }} />
              <span className="font-medium">Tarea Individual</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
