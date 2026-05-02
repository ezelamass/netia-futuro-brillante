import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CourseModule, CourseSection, CourseLesson } from '@/types/classroom';

export function useModuleDetail(moduleId: string | undefined) {
  const { user } = useAuth();
  const [module, setModule] = useState<CourseModule | null>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!user?.id || !moduleId) return;
    setIsLoading(true);

    try {
      // Fetch module with full section/lesson tree
      const { data: moduleData, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_sections (
            id, title, sort_order,
            course_lessons (
              id, title, content_md, video_url, duration_min, sort_order
            )
          )
        `)
        .eq('id', moduleId)
        .single();

      if (error) throw error;

      // Fetch quizzes for all lessons in this module
      const allLessonIds: string[] = [];
      (moduleData.course_sections || []).forEach((s: any) => {
        (s.course_lessons || []).forEach((l: any) => allLessonIds.push(l.id));
      });

      let quizLessonIds = new Set<string>();
      if (allLessonIds.length > 0) {
        const { data: quizzes } = await supabase
          .from('lesson_quizzes')
          .select('lesson_id')
          .in('lesson_id', allLessonIds);
        quizLessonIds = new Set(quizzes?.map(q => q.lesson_id) || []);
      }

      // Fetch user completions for these lessons
      const { data: completions } = await supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', user.id)
        .in('lesson_id', allLessonIds.length > 0 ? allLessonIds : ['__none__']);

      const completedIds = new Set(completions?.map(c => c.lesson_id) || []);
      setCompletedLessonIds(completedIds);

      // Map sections with sorted lessons
      const mappedSections: CourseSection[] = (moduleData.course_sections || [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((s: any) => ({
          id: s.id,
          moduleId: moduleId,
          title: s.title,
          sortOrder: s.sort_order,
          lessons: (s.course_lessons || [])
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((l: any) => ({
              id: l.id,
              sectionId: s.id,
              title: l.title,
              contentMd: l.content_md,
              videoUrl: l.video_url,
              durationMin: l.duration_min || 0,
              sortOrder: l.sort_order,
              hasQuiz: quizLessonIds.has(l.id),
            })),
        }));

      setSections(mappedSections);

      const totalLessons = allLessonIds.length;
      const completedCount = allLessonIds.filter(id => completedIds.has(id)).length;

      setModule({
        id: moduleData.id,
        title: moduleData.title,
        description: moduleData.description,
        coverUrl: moduleData.cover_url,
        targetRole: moduleData.target_role as 'coach' | 'player',
        sortOrder: moduleData.sort_order,
        isPublished: moduleData.is_published,
        createdAt: moduleData.created_at,
        sectionCount: mappedSections.length,
        lessonCount: totalLessons,
        completedCount,
      });
    } catch (err) {
      console.error('Error fetching module detail:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, moduleId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  return { module, sections, completedLessonIds, isLoading, refetch: fetchDetail };
}
