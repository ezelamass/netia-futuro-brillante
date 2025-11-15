import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface HeroCardProps {
  userName: string;
  welcomeMessage: string;
  badge?: {
    icon?: React.ReactNode;
    label: string;
    title: string;
  };
}

export const HeroCard = ({ userName, welcomeMessage, badge }: HeroCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl gradient-purple-blue p-8 min-h-[320px] shadow-2xl"
    >
      {/* Decorative sparkles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute top-8 left-8 flex items-center gap-2"
      >
        <Sparkles className="w-6 h-6 text-white/90" />
        <Sparkles className="w-4 h-4 text-white/70" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="absolute top-24 right-32"
      >
        <Sparkles className="w-8 h-8 text-white/30" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 right-16"
      >
        <Sparkles className="w-6 h-6 text-white/20" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-md">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-display font-bold text-white mb-2"
        >
          Hola, <span className="text-white drop-shadow-lg">{userName}</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white/95 text-lg mb-8 font-medium"
        >
          {welcomeMessage}
        </motion.p>
        
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-4 glass rounded-2xl px-6 py-4 border border-white/20 shadow-xl backdrop-blur-md"
          >
            <div className="w-14 h-14 rounded-xl bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg">
              {badge.icon || (
                <div className="text-2xl">🧪</div>
              )}
            </div>
            <div>
              <p className="text-white/90 text-sm font-medium">{badge.label}</p>
              <p className="text-white font-bold text-lg">{badge.title}</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 3D Character Placeholder */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute right-0 bottom-0 w-80 h-80"
      >
        <div className="relative w-full h-full">
          {/* Placeholder circle - will be replaced with 3D model */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2 animate-float">👨‍🚀</div>
                <p className="text-white/60 text-sm font-medium">Avatar 3D</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
