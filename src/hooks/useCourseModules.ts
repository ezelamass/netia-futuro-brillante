import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CourseModule } from '@/types/classroom';

export function useCourseModules() {
  const { user } = useAuth();
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);

  const fetchModules = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // Determine target role based on user role
      const targetRole = (user.role === 'coach' || user.role === 'club_admin') ? 'coach' : 'player';

      // Fetch published modules with nested sections/lessons counts
      const { data: modulesData, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_sections (
            id,
            course_lessons ( id )
          )
        `)
        .eq('is_published', true)
        .eq('target_role', targetRole)
        .order('sort_order');

      if (error) throw error;

      // Fetch user's completions
      const { data: completions } = await supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', user.id);

      const completedIds = new Set(completions?.map(c => c.lesson_id) || []);

      let totalCount = 0;
      let completedCount = 0;

      const mapped: CourseModule[] = (modulesData || []).map((m: any) => {
        const sections = m.course_sections || [];
        const lessonIds: string[] = [];
        sections.forEach((s: any) => {
          (s.course_lessons || []).forEach((l: any) => lessonIds.push(l.id));
        });

        const moduleCompleted = lessonIds.filter(id => completedIds.has(id)).length;
        totalCount += lessonIds.length;
        completedCount += moduleCompleted;

        return {
          id: m.id,
          title: m.title,
          description: m.description,
          coverUrl: m.cover_url,
          targetRole: m.target_role,
          sortOrder: m.sort_order,
          isPublished: m.is_published,
          createdAt: m.created_at,
          sectionCount: sections.length,
          lessonCount: lessonIds.length,
          completedCount: moduleCompleted,
        };
      });

      setModules(mapped);
      setTotalLessons(totalCount);
      setCompletedLessons(completedCount);
    } catch (err) {
      console.error('Error fetching course modules:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.role]);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  return { modules, totalLessons, completedLessons, isLoading, refetch: fetchModules };
}
