-- Create demo parent user (Familia) and link to demo player
DO $$
DECLARE
  parent_uid uuid;
  child_uid uuid;
BEGIN
  -- Skip if already exists
  SELECT id INTO parent_uid FROM auth.users WHERE email = 'demo-padre@netia.app';

  IF parent_uid IS NULL THEN
    parent_uid := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      parent_uid,
      'authenticated',
      'authenticated',
      'demo-padre@netia.app',
      crypt('netiademo', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Familia Demo","role":"parent"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    );

    -- handle_new_user trigger creates profiles + user_roles + player_stats automatically
  END IF;

  -- Mark onboarding complete on parent profile
  UPDATE public.profiles
     SET onboarding_completed = true,
         full_name = COALESCE(NULLIF(full_name, ''), 'Familia Demo')
   WHERE id = parent_uid;

  -- Link parent to demo player child
  SELECT id INTO child_uid FROM auth.users WHERE email = 'demo-jugador@netia.app';

  IF child_uid IS NOT NULL AND parent_uid IS NOT NULL THEN
    INSERT INTO public.family_links (parent_id, child_id, relationship, consent_given, consent_date)
    VALUES (parent_uid, child_uid, 'parent', true, now())
    ON CONFLICT DO NOTHING;
  END IF;
END $$;