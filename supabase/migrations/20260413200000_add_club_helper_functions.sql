-- Migration: Add missing helper functions referenced by RLS policies
-- These functions are used in policies on: coach_notes, training_sessions,
-- session_attendance, diagnostic_sessions, diagnostic_history, player_badges,
-- training_plans, training_plan_sessions

-- Returns array of club UUIDs the user is actively enrolled in
CREATE OR REPLACE FUNCTION public.get_user_club_ids(_user_id UUID)
RETURNS UUID[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(array_agg(club_id), '{}')
  FROM public.enrollments
  WHERE user_id = _user_id
    AND status = 'active';
$$;

-- Returns array of user UUIDs who share at least one club with the given user
CREATE OR REPLACE FUNCTION public.get_users_in_same_clubs(_user_id UUID)
RETURNS UUID[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(array_agg(DISTINCT e2.user_id), '{}')
  FROM public.enrollments e1
  JOIN public.enrollments e2 ON e1.club_id = e2.club_id
  WHERE e1.user_id = _user_id
    AND e1.status = 'active'
    AND e2.status = 'active';
$$;
