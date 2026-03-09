import { DiagnosticAxis } from '@/data/mockTrainingPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface DiagnosticRadarProps {
  diagnostic: DiagnosticAxis[];
}

export function DiagnosticRadar({ diagnostic }: DiagnosticRadarProps) {
  const data = diagnostic.map(d => ({
    subject: d.axis,
    score: d.score,
    fullMark: d.maxScore,
  }));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="h-full border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Diagnóstico Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                  tickCount={6}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {diagnostic.map(d => (
              <div key={d.axis} className="text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">{d.axis}</span>
                  <span className="font-bold text-primary">{d.score}</span>
                </div>
                <p className="text-muted-foreground leading-tight text-[10px] mt-0.5">{d.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
