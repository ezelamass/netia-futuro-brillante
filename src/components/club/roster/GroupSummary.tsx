import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GroupSummaryProps {
  total: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  greenPercent: number;
  yellowPercent: number;
  redPercent: number;
  avgSleep: string;
  avgRPE: string;
}

export function GroupSummary({
  total,
  greenCount,
  yellowCount,
  redCount,
  greenPercent,
  yellowPercent,
  redPercent,
  avgSleep,
  avgRPE,
}: GroupSummaryProps) {
  return (
    <Card className="bg-gradient-to-br from-card to-muted/30">
      <CardContent className="p-4 md:p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">RESUMEN DEL GRUPO</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {/* Green */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-2xl font-bold text-foreground">{greenCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Sin alertas</p>
          </div>

          {/* Yellow */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-2xl font-bold text-foreground">{yellowCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Atención</p>
          </div>

          {/* Red */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-2xl font-bold text-foreground">{redCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">Crítico</p>
          </div>

          {/* Averages - desktop only */}
          <div className="hidden md:block text-center border-l border-border pl-4">
            <p className="text-2xl font-bold text-foreground">{avgRPE}</p>
            <p className="text-xs text-muted-foreground">RPE Promedio</p>
          </div>

          <div className="hidden md:block text-center">
            <p className="text-2xl font-bold text-foreground">{avgSleep}h</p>
            <p className="text-xs text-muted-foreground">Sueño Promedio</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-2">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="bg-emerald-500 transition-all" 
              style={{ width: `${greenPercent}%` }} 
            />
            <div 
              className="bg-yellow-500 transition-all" 
              style={{ width: `${yellowPercent}%` }} 
            />
            <div 
              className="bg-red-500 transition-all" 
              style={{ width: `${redPercent}%` }} 
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{greenPercent}% OK</span>
            <span>{yellowPercent}% ⚠️</span>
            <span>{redPercent}% 🚨</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
