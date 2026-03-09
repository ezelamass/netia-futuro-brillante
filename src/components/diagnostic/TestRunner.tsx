import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { LikertQuestion } from './questions/LikertQuestion';
import { ChoiceQuestion } from './questions/ChoiceQuestion';
import { NumericQuestion } from './questions/NumericQuestion';
import type { DiagnosticQuestion, DiagnosticResponse, DiagnosticTest } from '@/types/diagnostic';
import { AXIS_CONFIG } from '@/types/diagnostic';
import { motion, AnimatePresence } from 'framer-motion';

interface TestRunnerProps {
  test: DiagnosticTest;
  questions: DiagnosticQuestion[];
  open: boolean;
  onClose: () => void;
  onSubmit: (responses: DiagnosticResponse[]) => void;
  isSubmitting: boolean;
}

export function TestRunner({ test, questions, open, onClose, onSubmit, isSubmitting }: TestRunnerProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { value: string; score: number }>>({});

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;
  const config = AXIS_CONFIG[test.axis];
  const currentAnswer = q ? answers[q.id] : undefined;
  const allAnswered = questions.every(q => answers[q.id]);

  const setAnswer = (value: string, score: number) => {
    if (!q) return;
    setAnswers(prev => ({ ...prev, [q.id]: { value, score } }));
  };

  const handleSubmit = () => {
    const responses: DiagnosticResponse[] = questions.map(q => ({
      question_id: q.id,
      response_value: answers[q.id]?.value ?? '',
      score: answers[q.id]?.score ?? 0,
    }));
    onSubmit(responses);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <span>{config.icon}</span>
            {test.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Pregunta {current + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {q && (
          <AnimatePresence mode="wait">
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-semibold text-foreground text-center mb-2">{q.question_text}</p>

              {q.question_type === 'likert' && (
                <LikertQuestion
                  value={currentAnswer ? Number(currentAnswer.value) : null}
                  onChange={v => setAnswer(String(v), v)}
                />
              )}

              {q.question_type === 'choice' && q.options && (
                <ChoiceQuestion
                  options={q.options as string[]}
                  value={currentAnswer?.value ?? null}
                  onChange={(val, idx) => {
                    // Score: inverse index (first option = lowest risk = highest score)
                    const score = (q.options as string[]).length - idx;
                    setAnswer(val, score);
                  }}
                />
              )}

              {q.question_type === 'numeric' && (
                <NumericQuestion
                  value={currentAnswer?.value ?? ''}
                  onChange={v => setAnswer(v, Math.min(Number(v) || 0, 10))}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="flex justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrent(c => c - 1)}
            disabled={current === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
          </Button>

          {current < questions.length - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrent(c => c + 1)}
              disabled={!currentAnswer}
            >
              Siguiente <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
            >
              <Send className="w-4 h-4 mr-1" />
              {isSubmitting ? 'Guardando...' : 'Finalizar'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
