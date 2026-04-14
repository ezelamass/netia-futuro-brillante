import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdminModule {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  targetRole: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
  lessonCount: number;
  sections: AdminSection[];
}

interface AdminSection {
  id: string;
  title: string;
  sortOrder: number;
  lessons: AdminLesson[];
}

interface AdminLesson {
  id: string;
  title: string;
  videoUrl: string | null;
  contentMd: string | null;
  durationMin: number;
  sortOrder: number;
  quiz: { id: string; questions: any[]; passPercent: number } | null;
}

export function useAdminCourses() {
  const [modules, setModules] = useState<AdminModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select(`
          *,
          course_sections (
            id, title, sort_order,
            course_lessons (
              id, title, video_url, content_md, duration_min, sort_order,
              lesson_quizzes ( id, questions, pass_percent )
            )
          )
        `)
        .order('sort_order');

      if (error) throw error;

      setModules((data || []).map((m: any) => {
        const sections = (m.course_sections || [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((s: any) => ({
            id: s.id,
            title: s.title,
            sortOrder: s.sort_order,
            lessons: (s.course_lessons || [])
              .sort((a: any, b: any) => a.sort_order - b.sort_order)
              .map((l: any) => ({
                id: l.id,
                title: l.title,
                videoUrl: l.video_url,
                contentMd: l.content_md,
                durationMin: l.duration_min || 0,
                sortOrder: l.sort_order,
                quiz: l.lesson_quizzes?.[0] ? {
                  id: l.lesson_quizzes[0].id,
                  questions: l.lesson_quizzes[0].questions || [],
                  passPercent: l.lesson_quizzes[0].pass_percent || 70,
                } : null,
              })),
          }));

        let lessonCount = 0;
        sections.forEach((s: AdminSection) => { lessonCount += s.lessons.length; });

        return {
          id: m.id,
          title: m.title,
          description: m.description,
          coverUrl: m.cover_url,
          targetRole: m.target_role,
          sortOrder: m.sort_order,
          isPublished: m.is_published,
          createdAt: m.created_at,
          lessonCount,
          sections,
        };
      }));
    } catch (err) {
      console.error('Error fetching admin courses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchModules(); }, [fetchModules]);

  const createModule = async (data: { title: string; description?: string; coverUrl?: string; targetRole: string }) => {
    const maxSort = modules.length > 0 ? Math.max(...modules.map(m => m.sortOrder)) + 1 : 0;
    const { error } = await supabase.from('course_modules').insert({
      title: data.title,
      description: data.description || null,
      cover_url: data.coverUrl || null,
      target_role: data.targetRole,
      sort_order: maxSort,
    });
    if (error) { toast.error('Error al crear módulo'); return; }
    toast.success('Módulo creado');
    fetchModules();
  };

  const updateModule = async (id: string, data: { title?: string; description?: string; coverUrl?: string; targetRole?: string; isPublished?: boolean }) => {
    const update: any = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description;
    if (data.coverUrl !== undefined) update.cover_url = data.coverUrl;
    if (data.targetRole !== undefined) update.target_role = data.targetRole;
    if (data.isPublished !== undefined) update.is_published = data.isPublished;

    const { error } = await supabase.from('course_modules').update(update).eq('id', id);
    if (error) { toast.error('Error al actualizar módulo'); return; }
    toast.success('Módulo actualizado');
    fetchModules();
  };

  const deleteModule = async (id: string) => {
    const { error } = await supabase.from('course_modules').delete().eq('id', id);
    if (error) { toast.error('Error al eliminar módulo'); return; }
    toast.success('Módulo eliminado');
    fetchModules();
  };

  const createSection = async (moduleId: string, title: string) => {
    const mod = modules.find(m => m.id === moduleId);
    const maxSort = mod && mod.sections.length > 0 ? Math.max(...mod.sections.map(s => s.sortOrder)) + 1 : 0;
    const { error } = await supabase.from('course_sections').insert({ module_id: moduleId, title, sort_order: maxSort });
    if (error) { toast.error('Error al crear sección'); return; }
    toast.success('Sección creada');
    fetchModules();
  };

  const deleteSection = async (sectionId: string) => {
    const { error } = await supabase.from('course_sections').delete().eq('id', sectionId);
    if (error) { toast.error('Error al eliminar sección'); return; }
    toast.success('Sección eliminada');
    fetchModules();
  };

  const createLesson = async (sectionId: string, data: { title: string; videoUrl?: string; contentMd?: string; durationMin?: number }) => {
    // Find max sort in section
    const section = modules.flatMap(m => m.sections).find(s => s.id === sectionId);
    const maxSort = section && section.lessons.length > 0 ? Math.max(...section.lessons.map(l => l.sortOrder)) + 1 : 0;

    const { error } = await supabase.from('course_lessons').insert({
      section_id: sectionId,
      title: data.title,
      video_url: data.videoUrl || null,
      content_md: data.contentMd || null,
      duration_min: data.durationMin || 0,
      sort_order: maxSort,
    });
    if (error) { toast.error('Error al crear lección'); return; }
    toast.success('Lección creada');
    fetchModules();
  };

  const updateLesson = async (lessonId: string, data: { title?: string; videoUrl?: string; contentMd?: string; durationMin?: number }) => {
    const update: any = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.videoUrl !== undefined) update.video_url = data.videoUrl;
    if (data.contentMd !== undefined) update.content_md = data.contentMd;
    if (data.durationMin !== undefined) update.duration_min = data.durationMin;

    const { error } = await supabase.from('course_lessons').update(update).eq('id', lessonId);
    if (error) { toast.error('Error al actualizar lección'); return; }
    toast.success('Lección actualizada');
    fetchModules();
  };

  const deleteLesson = async (lessonId: string) => {
    const { error } = await supabase.from('course_lessons').delete().eq('id', lessonId);
    if (error) { toast.error('Error al eliminar lección'); return; }
    toast.success('Lección eliminada');
    fetchModules();
  };

  const upsertQuiz = async (lessonId: string, questions: any[], passPercent: number) => {
    const { error } = await supabase.from('lesson_quizzes').upsert({
      lesson_id: lessonId,
      questions,
      pass_percent: passPercent,
    }, { onConflict: 'lesson_id' });
    if (error) { toast.error('Error al guardar quiz'); return; }
    toast.success('Quiz guardado');
    fetchModules();
  };

  const deleteQuiz = async (quizId: string) => {
    const { error } = await supabase.from('lesson_quizzes').delete().eq('id', quizId);
    if (error) { toast.error('Error al eliminar quiz'); return; }
    toast.success('Quiz eliminado');
    fetchModules();
  };

  return {
    modules, isLoading,
    createModule, updateModule, deleteModule,
    createSection, deleteSection,
    createLesson, updateLesson, deleteLesson,
    upsertQuiz, deleteQuiz,
    refetch: fetchModules,
  };
}
