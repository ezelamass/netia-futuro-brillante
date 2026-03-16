import { ComplianceData } from '@/hooks/useTrainingPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Flame, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComplianceCardProps {
  compliance: ComplianceData;
}

export function ComplianceCard({ compliance }: ComplianceCardProps) {
  const rate = Math.round((compliance.completedSessions / compliance.totalSessions) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Cumplimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 shrink-0">
              <CircularProgressbar
                value={rate}
                text={`${rate}%`}
                styles={buildStyles({
                  textSize: '24px',
                  textColor: 'hsl(var(--foreground))',
                  pathColor: 'hsl(var(--primary))',
                  trailColor: 'hsl(var(--muted))',
                })}
              />
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-secondary" />
                <span className="text-sm font-bold text-foreground">{compliance.currentStreak} días</span>
                <span className="text-xs text-muted-foreground">racha actual</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Mejor racha: <span className="font-semibold text-foreground">{compliance.longestStreak} días</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {compliance.completedSessions}/{compliance.totalSessions} sesiones completadas
              </div>
            </div>
          </div>

          {/* Mini trend */}
          <div className="mt-4 flex items-end gap-1.5 h-8">
            {compliance.weeklyTrend.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className="w-full rounded-sm bg-primary/20 relative overflow-hidden"
                  style={{ height: `${(val / 100) * 32}px` }}
                >
                  <div
                    className="absolute bottom-0 w-full bg-primary rounded-sm"
                    style={{ height: `${(val / 100) * 100}%` }}
                  />
                </div>
                <span className="text-[8px] text-muted-foreground">S{i + 1}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
