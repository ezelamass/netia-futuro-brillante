-- Allow authenticated users to self-enroll (join club by invite code)
CREATE POLICY "Users can self-enroll"
ON public.enrollments
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
