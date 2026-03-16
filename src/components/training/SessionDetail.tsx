import { useState } from 'react';
import { DaySession, ExerciseBlock } from '@/hooks/useTrainingPlan';
import { SESSION_TYPE_LABELS, RPE_LABELS, SessionType } from '@/types/training';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flame, Timer, Target, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SessionDetailProps {
  session: DaySession;
}

const phaseLabels: Record<ExerciseBlock['phase'], { label: string; color: string }> = {
  warmup: { label: 'Calentamiento', color: 'bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]' },
  main: { label: 'Bloque Principal', color: 'bg-primary/10 text-primary' },
  cooldown: { label: 'Vuelta a la calma', color: 'bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]' },
};

export function SessionDetail({ session }: SessionDetailProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('main');
  const [rpeValue, setRpeValue] = useState<number>(session.rpeLogged ?? session.targetRPE);
  const isRest = session.type === 'rest';
  const isCompleted = session.status === 'completed';

  const exercisesByPhase = session.exercises.reduce<Record<string, ExerciseBlock[]>>((acc, ex) => {
    if (!acc[ex.phase]) acc[ex.phase] = [];
    acc[ex.phase].push(ex);
    return acc;
  }, {});

  const handleSaveRPE = () => {
    toast.success(`RPE ${rpeValue} registrado para "${session.title}"`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="w-5 h-5 text-secondary" />
              {session.title}
            </CardTitle>
            {!isRest && (
              <Badge variant="outline" className="text-xs">
                {SESSION_TYPE_LABELS[session.type as SessionType]}
              </Badge>
            )}
          </div>
          {!isRest && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" /> {session.duration} min
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> RPE objetivo: {session.targetRPE}
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {(['warmup', 'main', 'cooldown'] as const).map(phase => {
            const exercises = exercisesByPhase[phase];
            if (!exercises) return null;
            const isExpanded = expandedPhase === phase;
            const { label, color } = phaseLabels[phase];

            return (
              <div key={phase} className="rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-[10px] font-semibold', color)}>{label}</Badge>
                    <span className="text-xs text-muted-foreground">{exercises.length} ejercicios</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-2">
                        {exercises.map((ex, i) => (
                          <div key={i} className="flex items-start gap-3 py-1.5 border-b border-border/50 last:border-0">
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[9px] font-bold text-muted-foreground">{i + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground">{ex.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {ex.sets && <span className="text-[10px] text-muted-foreground">{ex.sets}</span>}
                                {ex.duration && <span className="text-[10px] text-muted-foreground">{ex.duration}</span>}
                                {ex.notes && <span className="text-[10px] text-primary/70 italic">{ex.notes}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* RPE Input */}
          {!isRest && (session.status === 'today' || session.status === 'completed') && (
            <div className="rounded-xl border border-border p-4 space-y-3 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Percepción de esfuerzo (RPE)</span>
                <span className="text-lg font-bold text-primary">{rpeValue}</span>
              </div>
              <Slider
                value={[rpeValue]}
                onValueChange={([v]) => setRpeValue(v)}
                min={1}
                max={10}
                step={1}
                disabled={isCompleted && !!session.rpeLogged}
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {RPE_LABELS[rpeValue] || ''}
                </span>
                {!isCompleted && (
                  <Button size="sm" variant="default" className="h-7 text-xs gap-1" onClick={handleSaveRPE}>
                    <Save className="w-3.5 h-3.5" />
                    Guardar
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
