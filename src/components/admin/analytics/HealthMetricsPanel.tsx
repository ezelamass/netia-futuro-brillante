import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Droplets, Heart, TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HealthMetrics {
  avgSleep: number;
  sleepChange: number;
  avgHydration: number;
  hydrationChange: number;
  painFreePercentage: number;
  painFreeChange: number;
  totalAlerts: number;
  alertsChange: number;
}

interface HealthMetricsPanelProps {
  metrics: HealthMetrics;
}

export const HealthMetricsPanel = ({ metrics }: HealthMetricsPanelProps) => {
  const items = [
    {
      label: 'Sueño Promedio',
      value: `${metrics.avgSleep}h`,
      change: metrics.sleepChange,
      changeLabel: `${metrics.sleepChange > 0 ? '+' : ''}${metrics.sleepChange}h`,
      icon: Moon,
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
    {
      label: 'Hidratación',
      value: `${metrics.avgHydration}L`,
      change: metrics.hydrationChange,
      changeLabel: `${metrics.hydrationChange > 0 ? '+' : ''}${metrics.hydrationChange}L`,
      icon: Droplets,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
    },
    {
      label: 'Sin Dolor',
      value: `${metrics.painFreePercentage}%`,
      change: metrics.painFreeChange,
      changeLabel: `${metrics.painFreeChange > 0 ? '+' : ''}${metrics.painFreeChange}%`,
      icon: Heart,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
    },
  ];

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Indicadores de Salud (Agregado anónimo)</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Datos anonimizados y agregados. Se requiere un mínimo de 10 usuarios 
                  para mostrar métricas de un grupo (k-anonymity).
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isPositive = item.change > 0;
            const isNegative = item.change < 0;
            
            return (
              <div 
                key={index}
                className="flex flex-col items-center p-4 rounded-xl bg-muted/30 border"
              >
                <div className={cn("p-3 rounded-full mb-3", item.bgColor)}>
                  <Icon className={cn("h-6 w-6", item.iconColor)} />
                </div>
                <span className="text-2xl font-bold">{item.value}</span>
                <span className="text-sm text-muted-foreground mb-2">{item.label}</span>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  isPositive && "text-emerald-600",
                  isNegative && item.label !== 'Sin Dolor' && "text-red-600",
                  isNegative && item.label === 'Sin Dolor' && "text-red-600"
                )}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {item.changeLabel}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-amber-700">
              {metrics.totalAlerts} alertas esta semana
            </span>
            <span className="text-muted-foreground">
              {' '}({metrics.alertsChange > 0 ? '+' : ''}{metrics.alertsChange}% vs semana anterior)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
