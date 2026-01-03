import { motion } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IndicatorConfig, IndicatorStatus, INDICATOR_STATUS_COLORS } from '@/hooks/useWellnessStatus';
import { DailyLog } from '@/hooks/useDailyLog';
import { Sparkline } from './Sparkline';

interface WellnessIndicatorProps {
  indicator: IndicatorConfig;
  value: string;
  status: IndicatorStatus;
  historicalData?: number[];
  onClick?: () => void;
  delay?: number;
}

export const WellnessIndicator = ({
  indicator,
  value,
  status,
  historicalData,
  onClick,
  delay = 0,
}: WellnessIndicatorProps) => {
  const colors = INDICATOR_STATUS_COLORS[status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center p-3 rounded-xl border transition-all",
        "bg-background/60 backdrop-blur-sm hover:shadow-md",
        colors.bg
      )}
    >
      {/* Emoji */}
      <span className="text-2xl mb-1">{indicator.emoji}</span>
      
      {/* Label */}
      <span className="text-xs text-muted-foreground mb-1">{indicator.label}</span>
      
      {/* Value */}
      <span className={cn(
        "text-sm font-semibold",
        status === 'unknown' ? 'text-muted-foreground' : ''
      )}>
        {value}
      </span>
      
      {/* Status indicator */}
      <div className="mt-1">
        {status === 'unknown' ? (
          <HelpCircle className="w-4 h-4 text-muted-foreground" />
        ) : status === 'ok' ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : status === 'warning' ? (
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-red-500" />
        )}
      </div>
      
      {/* Sparkline if data available */}
      {historicalData && historicalData.length > 0 && (
        <div className="mt-2 w-full">
          <Sparkline 
            data={historicalData} 
            color={status === 'ok' ? '#22C55E' : status === 'warning' ? '#EAB308' : '#EF4444'}
          />
        </div>
      )}
    </motion.button>
  );
};
