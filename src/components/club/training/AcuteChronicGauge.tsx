import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AcuteChronicGaugeProps {
  ratio: number;
  status: 'green' | 'yellow' | 'red';
  acuteLoad: number;
  chronicLoad: number;
}

export function AcuteChronicGauge({ ratio, status, acuteLoad, chronicLoad }: AcuteChronicGaugeProps) {
  // Calculate position for the indicator (0.5 to 2.0 range mapped to 0-100%)
  const minRatio = 0.5;
  const maxRatio = 2.0;
  const position = Math.max(0, Math.min(100, ((ratio - minRatio) / (maxRatio - minRatio)) * 100));

  const statusLabels = {
    green: 'Óptimo',
    yellow: 'Precaución',
    red: 'Alto riesgo',
  };

  const statusColors = {
    green: 'text-emerald-600 dark:text-emerald-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Ratio Agudo:Crónico</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Gauge */}
        <div className="relative pt-6">
          {/* Scale labels */}
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>0.5</span>
            <span>0.8</span>
            <span>1.3</span>
            <span>1.5</span>
            <span>2.0</span>
          </div>

          {/* Bar */}
          <div className="h-4 rounded-full overflow-hidden flex">
            <div className="bg-red-500/50 w-[20%]" /> {/* 0.5-0.8 */}
            <div className="bg-emerald-500 w-[33%]" /> {/* 0.8-1.3 */}
            <div className="bg-yellow-500 w-[13%]" /> {/* 1.3-1.5 */}
            <div className="bg-red-500 w-[34%]" /> {/* 1.5-2.0 */}
          </div>

          {/* Indicator */}
          <div 
            className="absolute top-0 transition-all duration-300"
            style={{ left: `calc(${position}% - 12px)` }}
          >
            <div className="flex flex-col items-center">
              <div className={cn(
                'text-lg font-bold mb-1',
                statusColors[status]
              )}>
                {ratio.toFixed(2)}
              </div>
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-foreground" />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          <span className={cn('text-sm font-medium', statusColors[status])}>
            {statusLabels[status]}
          </span>
        </div>

        {/* Load details */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Carga aguda (7d)</p>
            <p className="text-lg font-semibold">{acuteLoad}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Carga crónica (28d)</p>
            <p className="text-lg font-semibold">{chronicLoad}/sem</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
