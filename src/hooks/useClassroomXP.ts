import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Checks and awards classroom-specific badges.
 * Call after lesson completions and quiz passes.
 */
export function useClassroomXP() {
  const { user } = useAuth();

  const checkClassroomBadges = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Count total lesson completions
      const { count: lessonCount } = await supabase
        .from('lesson_completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Check for perfect quiz score
      const { data: perfectQuiz } = await supabase
        .from('quiz_attempts')
        .select('id')
        .eq('user_id', user.id)
        .eq('score', 100)
        .eq('passed', true)
        .limit(1);

      // Check for completed modules (all lessons in a module done)
      const { data: allModules } = await supabase
        .from('course_modules')
        .select('id, course_sections ( id, course_lessons ( id ) )')
        .eq('is_published', true);

      const { data: completions } = await supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', user.id);

      const completedIds = new Set(completions?.map(c => c.lesson_id) || []);
      let completedModules = 0;

      (allModules || []).forEach((m: any) => {
        const moduleLessonIds: string[] = [];
        (m.course_sections || []).forEach((s: any) => {
          (s.course_lessons || []).forEach((l: any) => moduleLessonIds.push(l.id));
        });
        if (moduleLessonIds.length > 0 && moduleLessonIds.every(id => completedIds.has(id))) {
          completedModules++;
        }
      });

      // Award badges
      const badgesToCheck = [
        { id: 'classroom-first', condition: (lessonCount ?? 0) >= 1 },
        { id: 'classroom-5', condition: (lessonCount ?? 0) >= 5 },
        { id: 'classroom-module', condition: completedModules >= 1 },
        { id: 'quiz-perfect', condition: (perfectQuiz?.length ?? 0) > 0 },
      ];

      for (const badge of badgesToCheck) {
        if (badge.condition) {
          await supabase
            .from('player_badges')
            .upsert(
              { user_id: user.id, badge_id: badge.id },
              { onConflict: 'user_id,badge_id' }
            );
        }
      }

      // Award module completion XP (+100 per newly completed module)
      // This is called after markComplete, so the XP for the lesson itself is already awarded
      if (completedModules > 0) {
        // Check if we already awarded module XP (by checking if badge was just earned)
        const { data: existingBadge } = await supabase
          .from('player_badges')
          .select('earned_at')
          .eq('user_id', user.id)
          .eq('badge_id', 'classroom-module')
          .single();

        // If badge was earned in the last 5 seconds, this is a new completion
        if (existingBadge) {
          const earnedAt = new Date(existingBadge.earned_at);
          const fiveSecsAgo = new Date(Date.now() - 5000);
          if (earnedAt > fiveSecsAgo) {
            const { data: stats } = await supabase
              .from('player_stats')
              .select('xp')
              .eq('user_id', user.id)
              .single();

            if (stats) {
              await supabase
                .from('player_stats')
                .update({ xp: (stats.xp || 0) + 100 })
                .eq('user_id', user.id);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error checking classroom badges:', err);
    }
  }, [user?.id]);

  return { checkClassroomBadges };
}
