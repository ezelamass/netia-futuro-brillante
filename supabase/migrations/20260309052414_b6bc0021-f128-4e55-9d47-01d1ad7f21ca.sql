
CREATE OR REPLACE FUNCTION public.find_profile_by_email(_email text)
RETURNS TABLE(id uuid, full_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.full_name
  FROM public.profiles p
  WHERE LOWER(p.email) = LOWER(_email)
  LIMIT 1;
$$;
