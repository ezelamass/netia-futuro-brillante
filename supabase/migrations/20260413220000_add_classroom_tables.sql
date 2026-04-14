-- Classroom feature: Modules → Sections → Lessons + Quizzes + Progress

-- Course modules (top-level containers)
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  target_role TEXT NOT NULL DEFAULT 'player'
    CHECK (target_role IN ('player', 'coach')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Course sections (groups within a module)
CREATE TABLE public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Course lessons (individual lessons)
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.course_sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_md TEXT,
  video_url TEXT,
  duration_min INTEGER DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lesson quizzes (1:1 with lesson)
CREATE TABLE public.lesson_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL UNIQUE REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  questions JSONB NOT NULL DEFAULT '[]',
  pass_percent INTEGER DEFAULT 70,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lesson completions (user progress)
CREATE TABLE public.lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Quiz attempts (user submissions)
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.lesson_quizzes(id) ON DELETE CASCADE,
  answers JSONB DEFAULT '[]',
  score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  xp_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- RLS: course_modules
CREATE POLICY "Anyone can read published modules"
  ON public.course_modules FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all modules"
  ON public.course_modules FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS: course_sections (readable if parent module is published)
CREATE POLICY "Anyone can read sections of published modules"
  ON public.course_sections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_modules
      WHERE id = course_sections.module_id AND is_published = true
    )
  );

CREATE POLICY "Admins can manage all sections"
  ON public.course_sections FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS: course_lessons (readable if parent module is published)
CREATE POLICY "Anyone can read lessons of published modules"
  ON public.course_lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_sections cs
      JOIN public.course_modules cm ON cm.id = cs.module_id
      WHERE cs.id = course_lessons.section_id AND cm.is_published = true
    )
  );

CREATE POLICY "Admins can manage all lessons"
  ON public.course_lessons FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS: lesson_quizzes (readable if parent module is published)
CREATE POLICY "Anyone can read quizzes of published modules"
  ON public.lesson_quizzes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_lessons cl
      JOIN public.course_sections cs ON cs.id = cl.section_id
      JOIN public.course_modules cm ON cm.id = cs.module_id
      WHERE cl.id = lesson_quizzes.lesson_id AND cm.is_published = true
    )
  );

CREATE POLICY "Admins can manage all quizzes"
  ON public.lesson_quizzes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- RLS: lesson_completions (own data only)
CREATE POLICY "Users can manage own completions"
  ON public.lesson_completions FOR ALL
  USING (user_id = auth.uid());

-- RLS: quiz_attempts (own data only)
CREATE POLICY "Users can manage own quiz attempts"
  ON public.quiz_attempts FOR ALL
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_course_modules_target_role ON public.course_modules(target_role) WHERE is_published = true;
CREATE INDEX idx_course_sections_module ON public.course_sections(module_id);
CREATE INDEX idx_course_lessons_section ON public.course_lessons(section_id);
CREATE INDEX idx_lesson_completions_user ON public.lesson_completions(user_id);
CREATE INDEX idx_lesson_completions_lesson ON public.lesson_completions(lesson_id);
CREATE INDEX idx_quiz_attempts_user_quiz ON public.quiz_attempts(user_id, quiz_id);

-- Auto-update timestamp on course_modules
CREATE TRIGGER course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Seed classroom badges into existing badges table
INSERT INTO public.badges (id, title, description, icon, category, requirement, xp_reward) VALUES
  ('classroom-first', 'Primer Paso', 'Completar tu primera leccion', '📖', 'training', 1, 25),
  ('classroom-5', 'Estudiante Aplicado', 'Completar 5 lecciones', '🎓', 'training', 5, 50),
  ('classroom-module', 'Modulo Completo', 'Completar un modulo entero', '🏅', 'training', 1, 100),
  ('quiz-perfect', 'Nota Perfecta', 'Obtener 100% en un quiz', '💯', 'training', 1, 75)
ON CONFLICT (id) DO NOTHING;
