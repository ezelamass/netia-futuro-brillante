
-- =============================================
-- FASE 2: Coach Notes
-- =============================================
CREATE TABLE public.coach_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL,
  coach_id uuid NOT NULL,
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can manage own notes in their clubs"
  ON public.coach_notes FOR ALL
  USING (coach_id = auth.uid() AND club_id = ANY(get_user_club_ids(auth.uid())));

CREATE POLICY "Admins can manage all coach notes"
  ON public.coach_notes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_coach_notes_player ON public.coach_notes(player_id);
CREATE INDEX idx_coach_notes_club ON public.coach_notes(club_id);

-- =============================================
-- FASE 3: Training Sessions + Attendance
-- =============================================
CREATE TABLE public.training_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id uuid NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  coach_id uuid NOT NULL,
  group_name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'U12',
  sport text NOT NULL DEFAULT 'tenis',
  type text NOT NULL DEFAULT 'technical',
  date timestamptz NOT NULL,
  duration_min integer NOT NULL DEFAULT 60,
  rpe_group integer NOT NULL DEFAULT 5,
  warmup_done boolean NOT NULL DEFAULT false,
  cooldown_done boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can manage sessions in their clubs"
  ON public.training_sessions FOR ALL
  USING (club_id = ANY(get_user_club_ids(auth.uid())));

CREATE POLICY "Admins can manage all training sessions"
  ON public.training_sessions FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_training_sessions_club ON public.training_sessions(club_id);
CREATE INDEX idx_training_sessions_date ON public.training_sessions(date);

CREATE TABLE public.session_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  player_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'present',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.session_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can manage attendance in their clubs"
  ON public.session_attendance FOR ALL
  USING (session_id IN (
    SELECT id FROM public.training_sessions WHERE club_id = ANY(get_user_club_ids(auth.uid()))
  ));

CREATE POLICY "Players can view own attendance"
  ON public.session_attendance FOR SELECT
  USING (player_id = auth.uid());

CREATE POLICY "Admins can manage all attendance"
  ON public.session_attendance FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE INDEX idx_session_attendance_session ON public.session_attendance(session_id);
CREATE INDEX idx_session_attendance_player ON public.session_attendance(player_id);

-- =============================================
-- FASE 6: Training Plans + Plan Sessions
-- =============================================
CREATE TABLE public.training_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  coach_id uuid,
  cycle_name text NOT NULL DEFAULT '',
  sport text NOT NULL DEFAULT 'tenis',
  category text NOT NULL DEFAULT 'U12',
  current_stage text NOT NULL DEFAULT 'preparation',
  objective text,
  start_date date,
  end_date date,
  total_weeks integer NOT NULL DEFAULT 4,
  current_week integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans"
  ON public.training_plans FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Coaches can manage plans for their club players"
  ON public.training_plans FOR ALL
  USING (user_id = ANY(get_users_in_same_clubs(auth.uid())));

CREATE POLICY "Admins can manage all plans"
  ON public.training_plans FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Parents can view children plans"
  ON public.training_plans FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

CREATE INDEX idx_training_plans_user ON public.training_plans(user_id);

CREATE TABLE public.training_plan_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.training_plans(id) ON DELETE CASCADE,
  week_number integer NOT NULL DEFAULT 1,
  day_index integer NOT NULL DEFAULT 0,
  day_label text NOT NULL DEFAULT '',
  session_type text NOT NULL DEFAULT 'technical',
  title text NOT NULL DEFAULT '',
  exercises jsonb DEFAULT '[]'::jsonb,
  duration_min integer NOT NULL DEFAULT 60,
  intensity text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'pending',
  rpe integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.training_plan_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plan sessions"
  ON public.training_plan_sessions FOR SELECT
  USING (plan_id IN (
    SELECT id FROM public.training_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Coaches can manage plan sessions for their club players"
  ON public.training_plan_sessions FOR ALL
  USING (plan_id IN (
    SELECT id FROM public.training_plans WHERE user_id = ANY(get_users_in_same_clubs(auth.uid()))
  ));

CREATE POLICY "Admins can manage all plan sessions"
  ON public.training_plan_sessions FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Parents can view children plan sessions"
  ON public.training_plan_sessions FOR SELECT
  USING (plan_id IN (
    SELECT id FROM public.training_plans WHERE user_id IN (
      SELECT child_id FROM family_links WHERE parent_id = auth.uid()
    )
  ));

CREATE INDEX idx_training_plan_sessions_plan ON public.training_plan_sessions(plan_id);

-- =============================================
-- FASE 7: Prizes
-- =============================================
CREATE TABLE public.prizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text,
  value text,
  sponsor text,
  details text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.prizes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read active prizes"
  ON public.prizes FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage all prizes"
  ON public.prizes FOR ALL
  USING (has_role(auth.uid(), 'admin'));
