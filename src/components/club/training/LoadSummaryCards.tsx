import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadSummaryCardsProps {
  totalSessions: number;
  totalMinutes: number;
  avgRPE: number;
  attendanceRate: number;
  sessionsDiff: number;
  minutesDiff: number;
  rpeDiff: number;
  attendanceDiff: number;
}

export function LoadSummaryCards({
  totalSessions,
  totalMinutes,
  avgRPE,
  attendanceRate,
  sessionsDiff,
  minutesDiff,
  rpeDiff,
  attendanceDiff,
}: LoadSummaryCardsProps) {
  const getDiffIcon = (diff: number, inverse = false) => {
    const isPositive = inverse ? diff < 0 : diff > 0;
    if (diff === 0) return <Minus className="h-3 w-3" />;
    return isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getDiffColor = (diff: number, inverse = false) => {
    const isPositive = inverse ? diff < 0 : diff > 0;
    if (diff === 0) return 'text-muted-foreground';
    return isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400';
  };

  const formatDiff = (diff: number, prefix = '') => {
    if (diff === 0) return '=';
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff}${prefix}`;
  };

  const cards = [
    {
      label: 'Sesiones',
      icon: '📊',
      value: totalSessions,
      diff: sessionsDiff,
      diffLabel: formatDiff(sessionsDiff),
    },
    {
      label: 'Minutos',
      icon: '⏱️',
      value: totalMinutes,
      diff: minutesDiff,
      diffLabel: formatDiff(minutesDiff),
    },
    {
      label: 'RPE Prom.',
      icon: '💪',
      value: avgRPE.toFixed(1),
      diff: rpeDiff,
      diffLabel: formatDiff(rpeDiff),
      inverse: true, // Lower is often better for recovery
    },
    {
      label: 'Asistencia',
      icon: '✅',
      value: `${attendanceRate}%`,
      diff: attendanceDiff,
      diffLabel: formatDiff(attendanceDiff, '%'),
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">RESUMEN SEMANA</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span>{card.icon}</span>
                <span className="text-2xl font-bold text-foreground">{card.value}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
              <div className={cn(
                'flex items-center justify-center gap-1 text-xs',
                getDiffColor(card.diff, card.inverse)
              )}>
                {getDiffIcon(card.diff, card.inverse)}
                <span>{card.diffLabel} vs S-1</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
