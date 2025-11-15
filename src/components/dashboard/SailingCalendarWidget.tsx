import { motion } from 'framer-motion';
import { Clock, Wind, Gauge, Target } from 'lucide-react';

interface SailingCalendarWidgetProps {
  hoursNavigated: number;
  averageSpeed: number;
  windDirection: string;
  windSpeed: number;
  successfulManeuvers: number;
  delay?: number;
}

export const SailingCalendarWidget = ({
  hoursNavigated,
  averageSpeed,
  windDirection,
  windSpeed,
  successfulManeuvers,
  delay = 0,
}: SailingCalendarWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="text-3xl">⛵</div>
        <div>
          <h3 className="font-display font-bold text-2xl">
            Calendario Deportivo
          </h3>
          <p className="text-white/80 text-sm font-medium">Optimist</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Hours Navigated */}
        <div className="glass rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            <p className="text-xs text-white/80 font-medium">Horas navegadas</p>
          </div>
          <p className="text-2xl font-display font-bold">{hoursNavigated} h</p>
        </div>

        {/* Average Speed */}
        <div className="glass rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4" />
            <p className="text-xs text-white/80 font-medium">Velocidad media</p>
          </div>
          <p className="text-2xl font-display font-bold">{averageSpeed} nudos</p>
        </div>

        {/* Wind */}
        <div className="glass rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-4 h-4" />
            <p className="text-xs text-white/80 font-medium">Dirección del viento</p>
          </div>
          <p className="text-xl font-display font-bold">{windDirection} {windSpeed} kn</p>
        </div>

        {/* Successful Maneuvers */}
        <div className="glass rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" />
            <p className="text-xs text-white/80 font-medium">Maniobras exitosas</p>
          </div>
          <p className="text-2xl font-display font-bold">{successfulManeuvers}</p>
        </div>
      </div>
    </motion.div>
  );
};
