
-- Diagnostic tests (templates)
CREATE TABLE public.diagnostic_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  axis text NOT NULL CHECK (axis IN ('físico', 'técnico', 'táctico', 'mental')),
  title text NOT NULL,
  description text,
  sport text DEFAULT 'tenis',
  question_count integer NOT NULL DEFAULT 0,
  estimated_minutes integer NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnostic_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can read tests" ON public.diagnostic_tests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage tests" ON public.diagnostic_tests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Diagnostic questions
CREATE TABLE public.diagnostic_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES public.diagnostic_tests(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'likert' CHECK (question_type IN ('likert', 'choice', 'numeric', 'text')),
  options jsonb,
  weight numeric NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnostic_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can read questions" ON public.diagnostic_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage questions" ON public.diagnostic_questions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Diagnostic sessions (completed test instances)
CREATE TABLE public.diagnostic_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  test_id uuid NOT NULL REFERENCES public.diagnostic_tests(id) ON DELETE CASCADE,
  axis text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  total_score numeric DEFAULT 0,
  max_score numeric DEFAULT 0,
  normalized_score numeric DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON public.diagnostic_sessions FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Coaches can view club player sessions" ON public.diagnostic_sessions FOR SELECT TO authenticated USING (user_id = ANY(get_users_in_same_clubs(auth.uid())));
CREATE POLICY "Admins can manage all sessions" ON public.diagnostic_sessions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Diagnostic responses (individual answers)
CREATE TABLE public.diagnostic_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.diagnostic_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.diagnostic_questions(id) ON DELETE CASCADE,
  response_value text,
  score numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnostic_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own responses" ON public.diagnostic_responses FOR ALL TO authenticated
  USING (session_id IN (SELECT id FROM public.diagnostic_sessions WHERE user_id = auth.uid()))
  WITH CHECK (session_id IN (SELECT id FROM public.diagnostic_sessions WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage all responses" ON public.diagnostic_responses FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Diagnostic history (aggregated scores per axis)
CREATE TABLE public.diagnostic_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  axis text NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  detail text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  session_id uuid REFERENCES public.diagnostic_sessions(id) ON DELETE SET NULL
);

ALTER TABLE public.diagnostic_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own history" ON public.diagnostic_history FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own history" ON public.diagnostic_history FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Coaches can view club player history" ON public.diagnostic_history FOR SELECT TO authenticated USING (user_id = ANY(get_users_in_same_clubs(auth.uid())));
CREATE POLICY "Admins can manage all history" ON public.diagnostic_history FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Seed: Diagnostic Tests
INSERT INTO public.diagnostic_tests (id, axis, title, description, question_count, estimated_minutes) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'físico', 'Evaluación Física General', 'Evalúa tu condición física percibida: resistencia, fuerza, velocidad y movilidad.', 5, 5),
  ('a1000000-0000-0000-0000-000000000002', 'técnico', 'Evaluación Técnica General', 'Autoevaluación de tus habilidades técnicas: golpes, consistencia y eficiencia.', 5, 5),
  ('a1000000-0000-0000-0000-000000000003', 'táctico', 'Evaluación Táctica General', 'Evalúa tu lectura de juego, toma de decisiones y variación táctica.', 5, 5),
  ('a1000000-0000-0000-0000-000000000004', 'mental', 'Evaluación Mental General', 'Mide tu concentración, manejo de presión y constancia mental.', 5, 5);

-- Seed: Questions for Físico
INSERT INTO public.diagnostic_questions (test_id, order_index, question_text, question_type, options, weight) VALUES
  ('a1000000-0000-0000-0000-000000000001', 1, '¿Cómo calificarías tu resistencia aeróbica actual?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000001', 2, '¿Cómo percibís tu nivel de fuerza general?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000001', 3, '¿Cómo es tu velocidad de reacción en cancha?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000001', 4, '¿Sentís fatiga muscular durante entrenamientos largos?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000001', 5, '¿Tenés alguna limitación de movilidad?', 'choice', '["Ninguna", "Leve", "Moderada", "Significativa"]', 1);

-- Seed: Questions for Técnico
INSERT INTO public.diagnostic_questions (test_id, order_index, question_text, question_type, options, weight) VALUES
  ('a1000000-0000-0000-0000-000000000002', 1, '¿Cómo calificarías tu golpe de derecha?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000002', 2, '¿Cómo calificarías tu golpe de revés?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000002', 3, '¿Qué tan consistente sos en tus golpes?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000002', 4, '¿Cómo es tu servicio?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000002', 5, '¿Qué golpe necesitás mejorar más?', 'choice', '["Derecha", "Revés", "Servicio", "Volea", "Smash"]', 1);

-- Seed: Questions for Táctico
INSERT INTO public.diagnostic_questions (test_id, order_index, question_text, question_type, options, weight) VALUES
  ('a1000000-0000-0000-0000-000000000003', 1, '¿Cómo calificarías tu lectura de juego?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000003', 2, '¿Tomás buenas decisiones bajo presión?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000003', 3, '¿Variás tu juego según el rival?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000003', 4, '¿Sabés identificar las debilidades del oponente?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000003', 5, '¿Cuál es tu estilo de juego principal?', 'choice', '["Agresivo", "Defensivo", "All-court", "Serve & Volley"]', 1);

-- Seed: Questions for Mental
INSERT INTO public.diagnostic_questions (test_id, order_index, question_text, question_type, options, weight) VALUES
  ('a1000000-0000-0000-0000-000000000004', 1, '¿Cómo manejás la presión en puntos importantes?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000004', 2, '¿Podés mantener la concentración durante todo el partido?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000004', 3, '¿Cómo reaccionás después de cometer un error?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000004', 4, '¿Te sentís confiado antes de competir?', 'likert', null, 1),
  ('a1000000-0000-0000-0000-000000000004', 5, '¿Qué te genera más ansiedad?', 'choice', '["Competencias", "Entrenamientos exigentes", "Evaluaciones", "Nada en particular"]', 1);
