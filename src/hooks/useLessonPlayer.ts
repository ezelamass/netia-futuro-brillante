import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { CourseLesson, LessonQuiz } from '@/types/classroom';

export function useLessonPlayer(lessonId: string | undefined) {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<CourseLesson | null>(null);
  const [quiz, setQuiz] = useState<LessonQuiz | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLesson = useCallback(async () => {
    if (!user?.id || !lessonId) return;
    setIsLoading(true);

    try {
      // Fetch lesson
      const { data: lessonData, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;

      // Check quiz
      const { data: quizData } = await supabase
        .from('lesson_quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .maybeSingle();

      // Check completion
      const { data: completion } = await supabase
        .from('lesson_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      setLesson({
        id: lessonData.id,
        sectionId: lessonData.section_id,
        title: lessonData.title,
        contentMd: lessonData.content_md,
        videoUrl: lessonData.video_url,
        durationMin: lessonData.duration_min || 0,
        sortOrder: lessonData.sort_order,
        hasQuiz: !!quizData,
      });

      if (quizData) {
        setQuiz({
          id: quizData.id,
          lessonId: quizData.lesson_id,
          questions: (quizData.questions as any[]) || [],
          passPercent: quizData.pass_percent || 70,
        });
      } else {
        setQuiz(null);
      }

      setIsCompleted(!!completion);
    } catch (err) {
      console.error('Error fetching lesson:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, lessonId]);

  useEffect(() => { fetchLesson(); }, [fetchLesson]);

  const markComplete = useCallback(async () => {
    if (!user?.id || !lessonId || isCompleted) return;

    try {
      // Insert completion
      const { error } = await supabase
        .from('lesson_completions')
        .upsert({ user_id: user.id, lesson_id: lessonId }, { onConflict: 'user_id,lesson_id' });

      if (error) throw error;

      // Award XP (+10 for lesson completion)
      const { data: stats } = await supabase
        .from('player_stats')
        .select('xp')
        .eq('user_id', user.id)
        .single();

      if (stats) {
        await supabase
          .from('player_stats')
          .update({ xp: (stats.xp || 0) + 10 })
          .eq('user_id', user.id);
      }

      setIsCompleted(true);
      toast.success('Lección completada! +10 XP');
    } catch (err) {
      console.error('Error marking lesson complete:', err);
      toast.error('Error al completar la lección');
    }
  }, [user?.id, lessonId, isCompleted]);

  return { lesson, quiz, isCompleted, markComplete, isLoading, refetch: fetchLesson };
}
