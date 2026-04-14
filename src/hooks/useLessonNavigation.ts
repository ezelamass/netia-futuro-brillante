import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LessonRef {
  id: string;
  title: string;
}

export function useLessonNavigation(moduleId: string | undefined, currentLessonId: string | undefined) {
  const [prevLesson, setPrevLesson] = useState<LessonRef | null>(null);
  const [nextLesson, setNextLesson] = useState<LessonRef | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    if (!moduleId || !currentLessonId) return;

    const fetchNavigation = async () => {
      // Fetch all sections with lessons for this module, ordered
      const { data: sections } = await supabase
        .from('course_sections')
        .select('id, sort_order, course_lessons (id, title, sort_order)')
        .eq('module_id', moduleId)
        .order('sort_order');

      if (!sections) return;

      // Flatten into linear array: sorted by section order, then lesson order
      const flatLessons: LessonRef[] = [];
      sections
        .sort((a, b) => a.sort_order - b.sort_order)
        .forEach((s: any) => {
          const lessons = (s.course_lessons || [])
            .sort((a: any, b: any) => a.sort_order - b.sort_order);
          lessons.forEach((l: any) => flatLessons.push({ id: l.id, title: l.title }));
        });

      setTotalLessons(flatLessons.length);

      const idx = flatLessons.findIndex(l => l.id === currentLessonId);
      setCurrentIndex(idx >= 0 ? idx : 0);
      setPrevLesson(idx > 0 ? flatLessons[idx - 1] : null);
      setNextLesson(idx < flatLessons.length - 1 ? flatLessons[idx + 1] : null);
    };

    fetchNavigation();
  }, [moduleId, currentLessonId]);

  return { prevLesson, nextLesson, currentIndex, totalLessons };
}
