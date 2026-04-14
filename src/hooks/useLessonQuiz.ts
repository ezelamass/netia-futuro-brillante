import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { LessonQuiz, QuizAttempt, QuizResult } from '@/types/classroom';

export function useLessonQuiz(lessonId: string | undefined) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<LessonQuiz | null>(null);
  const [bestAttempt, setBestAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuiz = useCallback(async () => {
    if (!user?.id || !lessonId) return;
    setIsLoading(true);

    try {
      const { data: quizData } = await supabase
        .from('lesson_quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (!quizData) {
        setQuiz(null);
        setBestAttempt(null);
        setIsLoading(false);
        return;
      }

      setQuiz({
        id: quizData.id,
        lessonId: quizData.lesson_id,
        questions: (quizData.questions as any[]) || [],
        passPercent: quizData.pass_percent || 70,
      });

      // Fetch best attempt
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('quiz_id', quizData.id)
        .eq('user_id', user.id)
        .order('score', { ascending: false })
        .limit(1);

      if (attempts && attempts.length > 0) {
        const a = attempts[0];
        setBestAttempt({
          id: a.id,
          quizId: a.quiz_id,
          answers: (a.answers as number[]) || [],
          score: a.score,
          passed: a.passed,
          xpAwarded: a.xp_awarded,
          createdAt: a.created_at,
        });
      } else {
        setBestAttempt(null);
      }
    } catch (err) {
      console.error('Error fetching quiz:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, lessonId]);

  useEffect(() => { fetchQuiz(); }, [fetchQuiz]);

  const submitAttempt = useCallback(async (answers: number[]): Promise<QuizResult> => {
    if (!user?.id || !quiz) return { score: 0, passed: false, xpAwarded: 0 };

    // Score client-side
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    const score = quiz.questions.length > 0
      ? Math.round((correct / quiz.questions.length) * 100)
      : 0;
    const passed = score >= quiz.passPercent;

    // Award XP only on first pass
    const isFirstPass = passed && (!bestAttempt || !bestAttempt.passed);
    const xpAwarded = isFirstPass ? (score === 100 ? 50 : 25) : 0;

    try {
      // Insert attempt
      await supabase.from('quiz_attempts').insert({
        quiz_id: quiz.id,
        user_id: user.id,
        answers,
        score,
        passed,
        xp_awarded: xpAwarded,
      });

      // If passed, mark lesson as complete
      if (passed) {
        await supabase
          .from('lesson_completions')
          .upsert(
            { user_id: user.id, lesson_id: quiz.lessonId },
            { onConflict: 'user_id,lesson_id' }
          );
      }

      // Award XP
      if (xpAwarded > 0) {
        const { data: stats } = await supabase
          .from('player_stats')
          .select('xp')
          .eq('user_id', user.id)
          .single();

        if (stats) {
          await supabase
            .from('player_stats')
            .update({ xp: (stats.xp || 0) + xpAwarded })
            .eq('user_id', user.id);
        }
      }

      const result: QuizResult = { score, passed, xpAwarded };

      if (passed) {
        toast.success(`Quiz aprobado! ${xpAwarded > 0 ? `+${xpAwarded} XP` : ''}`);
      }

      // Refresh best attempt
      fetchQuiz();
      return result;
    } catch (err) {
      console.error('Error submitting quiz:', err);
      toast.error('Error al enviar el quiz');
      return { score, passed, xpAwarded: 0 };
    }
  }, [user?.id, quiz, bestAttempt, fetchQuiz]);

  return { quiz, bestAttempt, submitAttempt, isLoading };
}
