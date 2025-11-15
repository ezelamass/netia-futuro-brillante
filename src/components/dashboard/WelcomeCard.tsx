import { Sparkles, Beaker } from 'lucide-react';
import { motion } from 'framer-motion';

export const WelcomeCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl gradient-purple-blue p-8 text-white shadow-2xl"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6" />
          <Sparkles className="w-4 h-4" />
        </div>
        
        <h2 className="text-4xl font-display font-bold mb-1">
          Hola, <span className="text-white">Umar</span>
        </h2>
        <p className="text-white/90 mb-6">Qué bueno tenerte de vuelta</p>
        
        <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
          <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-sm">Predicado</p>
            <p className="text-white font-semibold text-lg">Científico Boy</p>
          </div>
        </div>
      </div>
      
      {/* Decorative sparkles */}
      <Sparkles className="absolute top-20 right-32 w-8 h-8 text-white/30" />
      <Sparkles className="absolute bottom-10 right-12 w-6 h-6 text-white/20" />
      
      {/* Placeholder for 3D character - will be replaced with actual 3D model */}
      <div className="absolute right-8 bottom-0 w-64 h-64">
        <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/50 font-display text-sm">
          Avatar 3D
        </div>
      </div>
    </motion.div>
  );
};
