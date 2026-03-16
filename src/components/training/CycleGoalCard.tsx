import { CycleObjective } from '@/hooks/useTrainingPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CycleGoalCardProps {
  objective: CycleObjective;
  cycleName: string;
  currentWeek: number;
  totalWeeks: number;
}

export function CycleGoalCard({ objective, cycleName, currentWeek, totalWeeks }: CycleGoalCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Objetivo del Ciclo
            </CardTitle>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Sem {currentWeek}/{totalWeeks}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{cycleName}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground leading-snug">{objective.main}</p>
            <div className="mt-3 flex items-center gap-3">
              <Progress value={objective.progress} className="h-2 flex-1" />
              <span className="text-xs font-bold text-primary">{objective.progress}%</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sub-objetivos</p>
            {objective.secondary.map((sub, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary/60 shrink-0" />
                <span className="text-xs text-foreground leading-snug">{sub}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
