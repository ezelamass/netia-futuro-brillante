import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressCardProps {
  subject: string;
  topic: string;
  progress: number;
  daysLeft: number;
  color: string;
  delay?: number;
}

const colorMap: Record<string, { path: string; trail: string }> = {
  teal: { path: '#10B981', trail: '#D1FAE5' },
  purple: { path: '#8B5CF6', trail: '#EDE9FE' },
  orange: { path: '#F59E0B', trail: '#FEF3C7' },
  blue: { path: '#3B82F6', trail: '#DBEAFE' },
};

export const ProgressCard = ({ subject, topic, progress, daysLeft, color, delay = 0 }: ProgressCardProps) => {
  const colors = colorMap[color] || colorMap.teal;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 flex-shrink-0">
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: colors.path,
              textColor: '#1F2937',
              trailColor: colors.trail,
              pathTransitionDuration: 0.5,
            })}
          />
        </div>
        
        <div className="flex-1">
          <h4 className="font-display font-bold text-lg text-foreground mb-1">
            {subject}
          </h4>
          <p className="text-sm text-muted-foreground mb-2">{topic}</p>
          
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{daysLeft} días restantes</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>Tarea Individual</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
