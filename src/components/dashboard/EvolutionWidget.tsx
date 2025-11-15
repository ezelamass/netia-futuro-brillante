import { motion } from 'framer-motion';
import { TrendingUp, Dumbbell, Target, Brain } from 'lucide-react';

interface EvolutionWidgetProps {
  physical: number;
  technique: number;
  mental: number;
  delay?: number;
}

export const EvolutionWidget = ({
  physical,
  technique,
  mental,
  delay = 0,
}: EvolutionWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h3 className="font-display font-bold text-2xl">
          Evolución General
        </h3>
      </div>

      {/* Evolution Metrics */}
      <div className="space-y-5">
        {/* Physical */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              <span className="text-sm font-semibold">Físico</span>
            </div>
            <span className="text-lg font-display font-bold text-emerald-300">
              +{physical}%
            </span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${physical * 10}%` }}
              transition={{ delay: delay + 0.2, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
            />
          </div>
        </div>

        {/* Technique */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-semibold">Técnica</span>
            </div>
            <span className="text-lg font-display font-bold text-blue-300">
              +{technique}%
            </span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${technique * 10}%` }}
              transition={{ delay: delay + 0.3, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            />
          </div>
        </div>

        {/* Mental */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-semibold">Mental</span>
            </div>
            <span className="text-lg font-display font-bold text-yellow-300">
              +{mental}%
            </span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mental * 10}%` }}
              transition={{ delay: delay + 0.4, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Total Progress */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <p className="text-center text-sm text-white/80 mb-1">Progreso total del mes</p>
        <p className="text-center text-3xl font-display font-bold">
          +{Math.round((physical + technique + mental) / 3)}%
        </p>
      </div>
    </motion.div>
  );
};
