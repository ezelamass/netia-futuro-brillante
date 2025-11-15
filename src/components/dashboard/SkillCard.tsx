import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SkillCardProps {
  icon: LucideIcon;
  title: string;
  rating: number;
  iconBg: string;
  delay?: number;
}

export const SkillCard = ({ icon: Icon, title, rating, iconBg, delay = 0 }: SkillCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-4`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-warning text-warning'
                : 'fill-muted text-muted'
            }`}
          />
        ))}
      </div>
      
      <h3 className="font-display font-semibold text-foreground text-lg">
        {title}
      </h3>
    </motion.div>
  );
};
