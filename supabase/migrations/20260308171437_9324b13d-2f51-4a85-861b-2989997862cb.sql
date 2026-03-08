
-- =============================================
-- NETIA Web App — Full Database Schema
-- Phase 1.1: Enums, Tables, Functions, Triggers, RLS
-- =============================================

-- 1. ENUM TYPES
CREATE TYPE public.app_role AS ENUM ('player', 'parent', 'coach', 'club_admin', 'federation', 'government', 'admin');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE public.clearance_status AS ENUM ('valid', 'expiring_soon', 'expired', 'pending');
CREATE TYPE public.player_level AS ENUM ('bronze', 'silver', 'gold', 'elite');

-- 2. USER ROLES TABLE (separate per security guidelines)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'player',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. SECURITY DEFINER FUNCTION: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Helper: get primary role for a user
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY created_at ASC
  LIMIT 1
$$;

-- 4. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  city TEXT,
  country TEXT DEFAULT 'Argentina',
  sport TEXT DEFAULT 'tenis',
  club_name TEXT,
  onboarding JSONB DEFAULT '{}',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. CLUBS TABLE
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  city TEXT,
  country TEXT DEFAULT 'Argentina',
  sport TEXT DEFAULT 'tenis',
  invite_code TEXT UNIQUE,
  max_players INT DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

-- 6. ENROLLMENTS (player ↔ club)
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'player',
  status user_status NOT NULL DEFAULT 'pending',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, club_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 7. FAMILY LINKS (parent ↔ child)
CREATE TABLE public.family_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  relationship TEXT DEFAULT 'parent',
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_id, child_id)
);
ALTER TABLE public.family_links ENABLE ROW LEVEL SECURITY;

-- 8. MEDICAL CLEARANCES
CREATE TABLE public.medical_clearances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT,
  issued_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status clearance_status NOT NULL DEFAULT 'pending',
  doctor_name TEXT,
  notes TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.medical_clearances ENABLE ROW LEVEL SECURITY;

-- 9. DAILY LOGS
CREATE TABLE public.daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sleep_hours NUMERIC(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  hydration_liters NUMERIC(3,1) CHECK (hydration_liters >= 0 AND hydration_liters <= 10),
  energy_level INT CHECK (energy_level >= 1 AND energy_level <= 5),
  pain_level INT DEFAULT 0 CHECK (pain_level >= 0 AND pain_level <= 10),
  pain_location TEXT,
  trained BOOLEAN DEFAULT false,
  training_duration_min INT DEFAULT 0,
  mood TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- 10. PLAYER STATS (gamification)
CREATE TABLE public.player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  xp INT NOT NULL DEFAULT 0,
  level player_level NOT NULL DEFAULT 'bronze',
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  total_logs INT NOT NULL DEFAULT 0,
  total_training_min INT NOT NULL DEFAULT 0,
  badges JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- 11. CALENDAR EVENTS
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'training',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  location TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 12. AI CONVERSATIONS
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  avatar TEXT NOT NULL CHECK (avatar IN ('TINO', 'ZAHIA', 'ROMA')),
  title TEXT,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- 13. AI MESSAGES
CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-create profile + player_stats + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'player'));

  INSERT INTO public.player_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER clubs_updated_at
  BEFORE UPDATE ON public.clubs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER medical_clearances_updated_at
  BEFORE UPDATE ON public.medical_clearances
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER player_stats_updated_at
  BEFORE UPDATE ON public.player_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- RLS POLICIES
-- =============================================

-- USER ROLES: users can read own roles, admins can manage all
CREATE POLICY "Users can read own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- PROFILES: users see own, coaches see club players, parents see children, admins see all
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Coaches can view club player profiles"
  ON public.profiles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'coach') AND
    id IN (
      SELECT e.user_id FROM public.enrollments e
      WHERE e.club_id IN (
        SELECT e2.club_id FROM public.enrollments e2
        WHERE e2.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Parents can view children profiles"
  ON public.profiles FOR SELECT
  USING (
    public.has_role(auth.uid(), 'parent') AND
    id IN (SELECT child_id FROM public.family_links WHERE parent_id = auth.uid())
  );

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- CLUBS: visible to members, admins manage
CREATE POLICY "Club members can view their club"
  ON public.clubs FOR SELECT
  USING (
    id IN (SELECT club_id FROM public.enrollments WHERE user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Club admins and admins can manage clubs"
  ON public.clubs FOR ALL
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'club_admin')
  );

-- ENROLLMENTS
CREATE POLICY "Users can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Coaches can view club enrollments"
  ON public.enrollments FOR SELECT
  USING (
    club_id IN (SELECT club_id FROM public.enrollments WHERE user_id = auth.uid())
  );

CREATE POLICY "Club admins can manage enrollments"
  ON public.enrollments FOR ALL
  USING (
    public.has_role(auth.uid(), 'club_admin') OR
    public.has_role(auth.uid(), 'admin')
  );

-- FAMILY LINKS
CREATE POLICY "Parents can view own family links"
  ON public.family_links FOR SELECT
  USING (parent_id = auth.uid() OR child_id = auth.uid());

CREATE POLICY "Parents can manage own family links"
  ON public.family_links FOR INSERT
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Admins can manage all family links"
  ON public.family_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- MEDICAL CLEARANCES
CREATE POLICY "Users can view own clearances"
  ON public.medical_clearances FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own clearances"
  ON public.medical_clearances FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Parents can view children clearances"
  ON public.medical_clearances FOR SELECT
  USING (
    user_id IN (SELECT child_id FROM public.family_links WHERE parent_id = auth.uid())
  );

CREATE POLICY "Coaches can view club player clearances"
  ON public.medical_clearances FOR SELECT
  USING (
    user_id IN (
      SELECT e.user_id FROM public.enrollments e
      WHERE e.club_id IN (
        SELECT e2.club_id FROM public.enrollments e2 WHERE e2.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all clearances"
  ON public.medical_clearances FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- DAILY LOGS
CREATE POLICY "Users can manage own daily logs"
  ON public.daily_logs FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Parents can view children logs"
  ON public.daily_logs FOR SELECT
  USING (
    user_id IN (SELECT child_id FROM public.family_links WHERE parent_id = auth.uid())
  );

CREATE POLICY "Coaches can view club player logs"
  ON public.daily_logs FOR SELECT
  USING (
    user_id IN (
      SELECT e.user_id FROM public.enrollments e
      WHERE e.club_id IN (
        SELECT e2.club_id FROM public.enrollments e2 WHERE e2.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all daily logs"
  ON public.daily_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- PLAYER STATS
CREATE POLICY "Users can view own stats"
  ON public.player_stats FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own stats"
  ON public.player_stats FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Coaches can view club player stats"
  ON public.player_stats FOR SELECT
  USING (
    user_id IN (
      SELECT e.user_id FROM public.enrollments e
      WHERE e.club_id IN (
        SELECT e2.club_id FROM public.enrollments e2 WHERE e2.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can manage all stats"
  ON public.player_stats FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- CALENDAR EVENTS
CREATE POLICY "Users can manage own events"
  ON public.calendar_events FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Club members can view club events"
  ON public.calendar_events FOR SELECT
  USING (
    club_id IN (SELECT club_id FROM public.enrollments WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all events"
  ON public.calendar_events FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- AI CONVERSATIONS
CREATE POLICY "Users can manage own conversations"
  ON public.ai_conversations FOR ALL
  USING (user_id = auth.uid());

-- AI MESSAGES
CREATE POLICY "Users can manage own messages"
  ON public.ai_messages FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations WHERE user_id = auth.uid()
    )
  );

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_club_id ON public.enrollments(club_id);
CREATE INDEX idx_family_links_parent_id ON public.family_links(parent_id);
CREATE INDEX idx_family_links_child_id ON public.family_links(child_id);
CREATE INDEX idx_daily_logs_user_date ON public.daily_logs(user_id, log_date);
CREATE INDEX idx_medical_clearances_user_id ON public.medical_clearances(user_id);
CREATE INDEX idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX idx_calendar_events_start ON public.calendar_events(start_time);
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_messages_conversation ON public.ai_messages(conversation_id);

-- STORAGE BUCKET for medical clearances
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-clearances', 'medical-clearances', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can upload own clearances
CREATE POLICY "Users can upload own clearances"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'medical-clearances' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own clearances"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'medical-clearances' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins can view all clearances"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'medical-clearances' AND public.has_role(auth.uid(), 'admin'));
