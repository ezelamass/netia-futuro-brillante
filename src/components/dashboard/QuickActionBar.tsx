import { motion } from 'framer-motion';
import { Star, LucideIcon } from 'lucide-react';

interface QuickAction {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  rating: number;
  gradient: string;
}

interface QuickActionBarProps {
  actions: QuickAction[];
  delay?: number;
}

const gradientStyles: Record<string, string> = {
  purple: 'bg-gradient-to-br from-purple-500 to-violet-600',
  pink: 'bg-gradient-to-br from-pink-500 to-rose-600',
  teal: 'bg-gradient-to-br from-teal-500 to-emerald-600',
  blue: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  orange: 'bg-gradient-to-br from-orange-500 to-amber-600',
};

export const QuickActionBar = ({ actions, delay = 0 }: QuickActionBarProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + index * 0.1, duration: 0.4 }}
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
        >
          {/* Icon with gradient background */}
          <div className="relative mb-5">
            <div className={`w-16 h-16 rounded-2xl ${gradientStyles[action.gradient] || gradientStyles.purple} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
              <action.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
            {/* Glow effect on hover */}
            <div className={`absolute inset-0 rounded-2xl ${gradientStyles[action.gradient] || gradientStyles.purple} opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />
          </div>

          {/* Star Rating */}
          <div className="flex gap-1.5 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: delay + index * 0.1 + star * 0.05,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <Star
                  className={`w-5 h-5 transition-all ${
                    star <= action.rating
                      ? 'fill-warning text-warning'
                      : 'fill-muted text-muted'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Title and subtitle */}
          <div>
            <h3 className="font-display font-bold text-lg text-foreground mb-1 leading-tight">
              {action.title}
            </h3>
            {action.subtitle && (
              <p className="text-sm text-muted-foreground font-medium">
                {action.subtitle}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
