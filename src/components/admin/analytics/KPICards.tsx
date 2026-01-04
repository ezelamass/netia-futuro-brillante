import { Users, Activity, Flame, Clock, Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPI {
  label: string;
  value: number | string;
  change: number;
  changeLabel: string;
  icon: string;
}

interface KPICardsProps {
  kpis: KPI[];
}

const iconMap: Record<string, React.ReactNode> = {
  users: <Users className="h-5 w-5" />,
  activity: <Activity className="h-5 w-5" />,
  flame: <Flame className="h-5 w-5" />,
  clock: <Clock className="h-5 w-5" />,
  heart: <Heart className="h-5 w-5" />,
};

export const KPICards = ({ kpis }: KPICardsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, index) => {
        const isPositive = kpi.change > 0;
        const isNeutral = kpi.change === 0;
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {iconMap[kpi.icon]}
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  isPositive && "bg-emerald-500/10 text-emerald-600",
                  !isPositive && !isNeutral && "bg-red-500/10 text-red-600",
                  isNeutral && "bg-muted text-muted-foreground"
                )}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : !isNeutral ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : null}
                  {isPositive && '+'}{kpi.change}%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {kpi.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
