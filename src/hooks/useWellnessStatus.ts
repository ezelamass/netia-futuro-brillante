import { useMemo } from 'react';
import { DailyLog } from './useDailyLog';

export type WellnessStatus = 'green' | 'yellow' | 'red';
export type IndicatorStatus = 'ok' | 'warning' | 'critical' | 'unknown';

export interface IndicatorConfig {
  key: 'sleep' | 'hydration' | 'energy' | 'pain';
  label: string;
  emoji: string;
  unit: string;
  getValue: (log: DailyLog) => string;
  getStatus: (log: DailyLog) => IndicatorStatus;
}

export const INDICATORS: IndicatorConfig[] = [
  {
    key: 'sleep',
    label: 'Sueño',
    emoji: '😴',
    unit: 'h',
    getValue: (log) => `${log.sleep.toFixed(1)}h`,
    getStatus: (log) => {
      if (log.sleep >= 7) return 'ok';
      if (log.sleep >= 6) return 'warning';
      return 'critical';
    },
  },
  {
    key: 'hydration',
    label: 'Hidratación',
    emoji: '💧',
    unit: 'L',
    getValue: (log) => `${log.hydration.toFixed(1)}L`,
    getStatus: (log) => {
      if (log.hydration >= 1.5) return 'ok';
      if (log.hydration >= 1.2) return 'warning';
      return 'critical';
    },
  },
  {
    key: 'energy',
    label: 'Energía',
    emoji: '⚡',
    unit: '/5',
    getValue: (log) => `${log.energy}/5`,
    getStatus: (log) => {
      if (log.energy >= 4) return 'ok';
      if (log.energy >= 3) return 'warning';
      return 'critical';
    },
  },
  {
    key: 'pain',
    label: 'Dolor',
    emoji: '🦵',
    unit: '/10',
    getValue: (log) => `${log.pain}/10`,
    getStatus: (log) => {
      if (log.pain <= 2) return 'ok';
      if (log.pain <= 6) return 'warning';
      return 'critical';
    },
  },
];

export const STATUS_MESSAGES: Record<WellnessStatus, string[]> = {
  green: ['Todo en orden', 'Excelente día', 'Seguí así', '¡A tope!'],
  yellow: ['Atención con tu descanso', 'Recordá hidratarte', 'Escuchá tu cuerpo'],
  red: ['Hablemos de cómo te sentís', 'Descansá hoy', 'Cuidate un poco más'],
};

export const STATUS_COLORS: Record<WellnessStatus, { bg: string; border: string; glow: string; text: string }> = {
  green: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/50',
    glow: 'shadow-emerald-500/20',
    text: 'text-emerald-600',
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/50',
    glow: 'shadow-yellow-500/20',
    text: 'text-yellow-600',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/50',
    glow: 'shadow-red-500/20',
    text: 'text-red-600',
  },
};

export const INDICATOR_STATUS_COLORS: Record<IndicatorStatus, { bg: string; icon: string }> = {
  ok: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600' },
  warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'text-yellow-600' },
  critical: { bg: 'bg-red-100 dark:bg-red-900/30', icon: 'text-red-600' },
  unknown: { bg: 'bg-muted', icon: 'text-muted-foreground' },
};

export function calculateStatus(log: DailyLog | undefined): WellnessStatus {
  if (!log) return 'yellow'; // No data = attention needed
  
  const issues: ('warning' | 'critical')[] = [];
  
  // Sleep check
  if (log.sleep < 6) issues.push('critical');
  else if (log.sleep < 7) issues.push('warning');
  
  // Hydration check
  if (log.hydration < 1.0) issues.push('critical');
  else if (log.hydration < 1.2) issues.push('warning');
  
  // Energy check
  if (log.energy <= 2) issues.push('warning');
  
  // Pain check
  if (log.pain >= 7) issues.push('critical');
  else if (log.pain >= 4) issues.push('warning');
  
  if (issues.includes('critical')) return 'red';
  if (issues.length >= 2) return 'yellow';
  if (issues.includes('warning')) return 'yellow';
  return 'green';
}

export const useWellnessStatus = (todayLog: DailyLog | undefined) => {
  const status = useMemo(() => calculateStatus(todayLog), [todayLog]);
  
  const statusMessage = useMemo(() => {
    const messages = STATUS_MESSAGES[status];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [status]);
  
  const statusColors = STATUS_COLORS[status];
  
  const getIndicatorStatus = (indicator: IndicatorConfig): IndicatorStatus => {
    if (!todayLog) return 'unknown';
    return indicator.getStatus(todayLog);
  };
  
  const getIndicatorValue = (indicator: IndicatorConfig): string => {
    if (!todayLog) return '?';
    return indicator.getValue(todayLog);
  };
  
  return {
    status,
    statusMessage,
    statusColors,
    getIndicatorStatus,
    getIndicatorValue,
  };
};
