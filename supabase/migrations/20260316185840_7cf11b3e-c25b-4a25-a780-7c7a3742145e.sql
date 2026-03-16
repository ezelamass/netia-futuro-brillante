
-- Parents can view children stats
CREATE POLICY "Parents can view children stats"
  ON public.player_stats FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- Parents can view children badges
CREATE POLICY "Parents can view children badges"
  ON public.player_badges FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- Parents can view children diagnostic history
CREATE POLICY "Parents can view children diagnostic history"
  ON public.diagnostic_history FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- Parents can view children diagnostic sessions
CREATE POLICY "Parents can view children diagnostic sessions"
  ON public.diagnostic_sessions FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- Parents can view children enrollments
CREATE POLICY "Parents can view children enrollments"
  ON public.enrollments FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));

-- Parents can view children events
CREATE POLICY "Parents can view children events"
  ON public.calendar_events FOR SELECT
  USING (user_id IN (
    SELECT child_id FROM family_links WHERE parent_id = auth.uid()
  ));
