
-- ============================================
-- 1. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  is_read boolean NOT NULL DEFAULT false,
  avatar text,
  action_url text,
  priority text NOT NULL DEFAULT 'low',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, is_read);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
  ON public.notifications FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 2. BADGES TABLE (normalized)
-- ============================================
CREATE TABLE public.badges (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '⭐',
  category text NOT NULL DEFAULT 'streak',
  requirement integer NOT NULL DEFAULT 1,
  xp_reward integer NOT NULL DEFAULT 0
);

INSERT INTO public.badges (id, title, description, icon, category, requirement, xp_reward) VALUES
  ('streak-7', 'Una semana constante', '7 días seguidos registrando', '🔥', 'streak', 7, 25),
  ('streak-30', 'Mes de hierro', '30 días seguidos registrando', '🏆', 'streak', 30, 100),
  ('streak-100', 'Centurión', '100 días seguidos', '⚡', 'streak', 100, 500),
  ('xp-500', 'Primeros pasos', 'Alcanzar 500 XP', '⭐', 'xp', 500, 50),
  ('xp-1000', 'En camino', 'Alcanzar 1000 XP', '💫', 'xp', 1000, 100),
  ('xp-2500', 'Atleta dedicado', 'Alcanzar 2500 XP', '🌟', 'xp', 2500, 250),
  ('green-5', 'Semáforo verde', '5 días con indicadores en verde', '💚', 'wellness', 5, 30),
  ('sleep-7', 'Dormilón pro', '7 días con 8+ horas de sueño', '🌙', 'wellness', 7, 40),
  ('hydration-7', 'Héroe de la hidratación', '7 días con 2L+ de agua', '💧', 'wellness', 7, 40),
  ('training-10', 'Atleta en formación', '10 entrenamientos registrados', '🏋️', 'training', 10, 50),
  ('training-50', 'Imparable', '50 entrenamientos registrados', '🦾', 'training', 50, 200),
  ('training-100', 'Máquina', '100 entrenamientos registrados', '🤖', 'training', 100, 500);

-- No RLS needed for badges — public read-only catalog
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read badges"
  ON public.badges FOR SELECT TO authenticated
  USING (true);

-- ============================================
-- 3. PLAYER_BADGES TABLE (junction)
-- ============================================
CREATE TABLE public.player_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id text NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_player_badges_user ON public.player_badges(user_id);

ALTER TABLE public.player_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON public.player_badges FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own badges"
  ON public.player_badges FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Coaches can view club player badges"
  ON public.player_badges FOR SELECT TO authenticated
  USING (user_id = ANY(get_users_in_same_clubs(auth.uid())));

CREATE POLICY "Admins can manage all player badges"
  ON public.player_badges FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
