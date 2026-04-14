import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LessonQuiz as LessonQuizType, QuizAttempt, QuizResult } from '@/types/classroom';

interface LessonQuizProps {
  quiz: LessonQuizType;
  bestAttempt: QuizAttempt | null;
  onSubmit: (answers: number[]) => Promise<QuizResult>;
}

export function LessonQuiz({ quiz, bestAttempt, onSubmit }: LessonQuizProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const hasPassed = bestAttempt?.passed;

  const handleStart = () => {
    setIsActive(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setResult(null);
  };

  const handleVerify = useCallback(async () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setShowFeedback(true);

    setTimeout(async () => {
      setShowFeedback(false);
      setSelectedOption(null);

      if (isLastQuestion) {
        const quizResult = await onSubmit(newAnswers);
        setResult(quizResult);
      } else {
        setCurrentQuestion(prev => prev + 1);
      }
    }, 1500);
  }, [selectedOption, answers, isLastQuestion, onSubmit]);

  // Initial state — not active
  if (!isActive) {
    return (
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <span className="text-base font-semibold">Quiz</span>
            {hasPassed && (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">
                Aprobado ({bestAttempt?.score}%)
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {hasPassed
              ? 'Ya aprobaste este quiz. Podés reintentar para mejorar tu puntaje.'
              : `Respondé las ${quiz.questions.length} preguntas para completar esta lección. Necesitás ${quiz.passPercent}% para aprobar.`}
          </p>
          <Button onClick={handleStart} variant={hasPassed ? 'outline' : 'default'} className="gap-2">
            {hasPassed ? <RotateCcw className="w-4 h-4" /> : null}
            {hasPassed ? 'Reintentar' : 'Empezar Quiz'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Result screen
  if (result) {
    return (
      <Card className="bg-muted/30 border-border">
        <CardContent className="p-6 text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto"
          >
            {/* Score circle */}
            <div className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center mx-auto border-4',
              result.passed ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'
            )}>
              <span className={cn(
                'text-3xl font-bold',
                result.passed ? 'text-emerald-600' : 'text-red-600'
              )}>
                {result.score}%
              </span>
            </div>
          </motion.div>

          <div>
            <p className={cn(
              'text-lg font-bold',
              result.passed ? 'text-emerald-600' : 'text-red-600'
            )}>
              {result.passed ? 'Aprobado!' : 'No aprobaste'}
            </p>
            {!result.passed && (
              <p className="text-xs text-muted-foreground">
                Necesitás {quiz.passPercent}% para aprobar
              </p>
            )}
          </div>

          {result.xpAwarded > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-200 text-sm px-3 py-1">
                <Trophy className="w-3.5 h-3.5 mr-1" />
                +{result.xpAwarded} XP
              </Badge>
            </motion.div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            {!result.passed && (
              <Button onClick={handleStart} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reintentar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active quiz — question view
  return (
    <Card className="bg-muted/30 border-border">
      <CardContent className="p-5 space-y-4">
        <p className="text-xs text-muted-foreground font-medium">
          Pregunta {currentQuestion + 1} de {quiz.questions.length}
        </p>

        <p className="text-base font-medium">{question.prompt}</p>

        <div className="space-y-2">
          {question.options.map((option, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === question.correctIndex;

            let optionStyle = 'border-border hover:bg-primary/5';
            if (showFeedback) {
              if (isCorrect) optionStyle = 'border-emerald-500 bg-emerald-50';
              else if (isSelected && !isCorrect) optionStyle = 'border-red-500 bg-red-50';
            } else if (isSelected) {
              optionStyle = 'border-primary bg-primary/10';
            }

            return (
              <button
                key={i}
                onClick={() => !showFeedback && setSelectedOption(i)}
                disabled={showFeedback}
                className={cn(
                  'w-full text-left rounded-xl border p-3 text-sm transition-all flex items-center gap-2',
                  optionStyle,
                  isSelected && !showFeedback && 'font-medium',
                )}
              >
                {showFeedback && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                {showFeedback && isSelected && !isCorrect && <X className="w-4 h-4 text-red-600 shrink-0" />}
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {!showFeedback && (
          <Button
            onClick={handleVerify}
            disabled={selectedOption === null}
            className="w-full"
          >
            Verificar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
