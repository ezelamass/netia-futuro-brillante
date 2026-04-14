-- Club announcements for coach→player communication
CREATE TABLE public.club_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  target_roles TEXT[] DEFAULT '{player,parent,coach}',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.club_announcements ENABLE ROW LEVEL SECURITY;

-- Club members can read announcements for their clubs
CREATE POLICY "Club members can read announcements"
  ON public.club_announcements FOR SELECT
  USING (
    club_id = ANY(get_user_club_ids(auth.uid()))
  );

-- Coaches and club_admins can create announcements
CREATE POLICY "Coaches can create announcements"
  ON public.club_announcements FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND club_id = ANY(get_user_club_ids(auth.uid()))
    AND (has_role(auth.uid(), 'coach') OR has_role(auth.uid(), 'club_admin') OR has_role(auth.uid(), 'admin'))
  );

-- Authors can update their own announcements
CREATE POLICY "Authors can update own announcements"
  ON public.club_announcements FOR UPDATE
  USING (auth.uid() = author_id);

-- Authors and club_admins can delete announcements
CREATE POLICY "Authors can delete own announcements"
  ON public.club_announcements FOR DELETE
  USING (
    auth.uid() = author_id
    OR has_role(auth.uid(), 'club_admin')
    OR has_role(auth.uid(), 'admin')
  );

-- Indexes
CREATE INDEX idx_announcements_club ON public.club_announcements(club_id);
CREATE INDEX idx_announcements_created ON public.club_announcements(created_at DESC);

-- Auto-update timestamp
CREATE TRIGGER club_announcements_updated_at
  BEFORE UPDATE ON public.club_announcements
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
