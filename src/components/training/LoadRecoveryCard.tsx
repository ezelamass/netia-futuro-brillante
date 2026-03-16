import { LoadRecoveryData } from '@/hooks/useTrainingPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, Battery, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LoadRecoveryCardProps {
  data: LoadRecoveryData;
}

const statusConfig = {
  green: { label: 'Óptimo', color: 'text-[hsl(var(--success))]', bg: 'bg-[hsl(var(--success))]/10' },
  yellow: { label: 'Precaución', color: 'text-[hsl(var(--warning))]', bg: 'bg-[hsl(var(--warning))]/10' },
  red: { label: 'Riesgo', color: 'text-[hsl(var(--danger))]', bg: 'bg-[hsl(var(--danger))]/10' },
};

export function LoadRecoveryCard({ data }: LoadRecoveryCardProps) {
  const config = statusConfig[data.status];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Carga vs Recuperación
            </CardTitle>
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', config.bg, config.color)}>
              {config.label}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* A:C Ratio */}
          <div className="text-center">
            <span className={cn('text-3xl font-black', config.color)}>{data.ratio}</span>
            <p className="text-xs text-muted-foreground mt-0.5">Ratio Agudo:Crónico</p>
          </div>

          {/* Load bars */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Carga aguda (7d)</span>
                <span className="font-semibold text-foreground">{data.acuteLoad} AU</span>
              </div>
              <Progress value={(data.acuteLoad / 4000) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">Carga crónica (28d)</span>
                <span className="font-semibold text-foreground">{data.chronicLoad} AU</span>
              </div>
              <Progress value={(data.chronicLoad / 4000) * 100} className="h-2" />
            </div>
          </div>

          {/* Fatigue / Energy */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Battery className="w-4 h-4 text-[hsl(var(--warning))]" />
              <div>
                <p className="text-[10px] text-muted-foreground">Fatiga</p>
                <p className="text-sm font-bold text-foreground">{data.fatigueLevel}/10</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Zap className="w-4 h-4 text-[hsl(var(--success))]" />
              <div>
                <p className="text-[10px] text-muted-foreground">Energía</p>
                <p className="text-sm font-bold text-foreground">{data.energyLevel}/10</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
