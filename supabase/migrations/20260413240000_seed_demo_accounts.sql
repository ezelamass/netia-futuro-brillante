-- Seed data for 3 demo accounts
-- Player: 44e44edc-5484-42d9-9f31-22abe945ccae (demo-jugador@netia.app)
-- Coach:  5b20db0d-e111-4e6d-bb98-1d8177b49fe1 (demo-entrenador@netia.app)
-- Admin:  078f89c5-0fb1-4ea7-99c0-6e6ce340c41d (demo-admin@netia.app)

-- ═══════════════════════════════════════════════
-- PLAYER: Santiago Morales (14 years old, tennis)
-- ═══════════════════════════════════════════════

-- Profile (upsert in case trigger already created it)
INSERT INTO public.profiles (id, email, full_name, date_of_birth, sport, city, country, gender, onboarding_completed, onboarding)
VALUES (
  '44e44edc-5484-42d9-9f31-22abe945ccae',
  'demo-jugador@netia.app',
  'Santiago Morales',
  '2012-03-22',
  'tennis',
  'Buenos Aires',
  'Argentina',
  'male',
  true,
  '{"level":"competition","handedness":"right","hasCoach":true,"coachName":"Academia Wilson","trainingDays":["monday","wednesday","friday"],"sessionDuration":90,"mainGoal":"technique","areasToImprove":["Resistencia","Concentración"],"height":162,"weight":48,"preferredAvatar":"TINO","communicationMode":"text"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  date_of_birth = EXCLUDED.date_of_birth,
  sport = EXCLUDED.sport,
  city = EXCLUDED.city,
  country = EXCLUDED.country,
  gender = EXCLUDED.gender,
  onboarding_completed = EXCLUDED.onboarding_completed,
  onboarding = EXCLUDED.onboarding;

-- Role
INSERT INTO public.user_roles (user_id, role)
VALUES ('44e44edc-5484-42d9-9f31-22abe945ccae', 'player')
ON CONFLICT (user_id, role) DO NOTHING;

-- Player stats
INSERT INTO public.player_stats (user_id, xp, level, current_streak, longest_streak, total_logs, total_training_min)
VALUES ('44e44edc-5484-42d9-9f31-22abe945ccae', 1850, 'silver', 12, 18, 45, 2700)
ON CONFLICT (user_id) DO UPDATE SET
  xp = EXCLUDED.xp, level = EXCLUDED.level,
  current_streak = EXCLUDED.current_streak, longest_streak = EXCLUDED.longest_streak,
  total_logs = EXCLUDED.total_logs, total_training_min = EXCLUDED.total_training_min;

-- Daily logs (14 days of realistic data)
INSERT INTO public.daily_logs (user_id, log_date, sleep_hours, hydration_liters, energy_level, pain_level, pain_location, trained, training_duration_min) VALUES
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 13, 8.5, 2.3, 5, 0, null, true, 90),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 12, 8.0, 2.0, 4, 0, null, true, 60),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 11, 7.5, 2.1, 4, 1, null, true, 90),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 10, 8.0, 2.0, 5, 0, null, false, 0),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 9,  6.5, 1.5, 3, 2, 'hombro derecho', true, 75),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 8,  6.5, 1.8, 3, 2, 'hombro derecho', true, 60),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 7,  7.5, 2.0, 4, 1, null, true, 90),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 6,  8.0, 2.2, 5, 0, null, true, 90),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 5,  9.0, 2.5, 5, 0, null, false, 0),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 4,  8.0, 2.0, 4, 0, null, true, 90),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 3,  7.5, 2.3, 4, 1, null, true, 60),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 2,  7.0, 1.8, 3, 0, null, false, 0),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 1,  8.0, 2.2, 4, 0, null, true, 90)
ON CONFLICT (user_id, log_date) DO NOTHING;
-- NOTE: no log for today — TodayCard will show "Registrar" button

-- Diagnostic history (showing improvement)
INSERT INTO public.diagnostic_history (user_id, axis, score, detail, recorded_at) VALUES
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'fisico',  7.2, 'Buen nivel de resistencia', CURRENT_TIMESTAMP - interval '30 days'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'tecnico', 6.5, 'Mejorar saque y volea', CURRENT_TIMESTAMP - interval '30 days'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'mental',  8.0, 'Excelente concentracion', CURRENT_TIMESTAMP - interval '30 days'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'fisico',  7.8, 'Mejora en velocidad', CURRENT_TIMESTAMP - interval '5 days'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'tecnico', 7.0, 'Saque mas consistente', CURRENT_TIMESTAMP - interval '5 days'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'mental',  8.3, 'Mayor control emocional', CURRENT_TIMESTAMP - interval '5 days');

-- Badges earned
INSERT INTO public.player_badges (user_id, badge_id) VALUES
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'streak-7'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'xp-500'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'xp-1000'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'green-5')
ON CONFLICT (user_id, badge_id) DO NOTHING;

-- Calendar events this week
INSERT INTO public.calendar_events (user_id, title, event_type, start_time, end_time, description) VALUES
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'Entrenamiento Tenis', 'training', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 1)::timestamp + time '16:00', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 1)::timestamp + time '17:30', 'Saque y revés con coach'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'Entrenamiento Tenis', 'training', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 3)::timestamp + time '16:00', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 3)::timestamp + time '17:30', 'Preparación física + juego'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'Entrenamiento Tenis', 'training', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 5)::timestamp + time '16:00', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 5)::timestamp + time '17:30', 'Táctica y match play'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'Partido amistoso', 'tournament', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 6)::timestamp + time '10:00', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 6)::timestamp + time '12:00', 'Vs Club San Isidro'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'Descanso activo', 'rest', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 7)::timestamp + time '09:00', (CURRENT_DATE - extract(dow from CURRENT_DATE)::int + 7)::timestamp + time '10:00', 'Movilidad y stretching');

-- AI conversation with Roma
INSERT INTO public.ai_conversations (id, user_id, avatar, title, last_message_at) VALUES
  ('d1000001-de00-4000-a000-000000000001', '44e44edc-5484-42d9-9f31-22abe945ccae', 'ROMA', 'Técnica de saque', CURRENT_TIMESTAMP - interval '2 hours');

INSERT INTO public.ai_messages (conversation_id, role, content, created_at) VALUES
  ('d1000001-de00-4000-a000-000000000001', 'user', 'Roma, estoy nervioso por el torneo del sábado. Me cuesta concentrarme cuando pierdo un game.', CURRENT_TIMESTAMP - interval '2 hours'),
  ('d1000001-de00-4000-a000-000000000001', 'assistant', 'Es re normal sentir eso antes de un torneo. Lo importante es que ya lo reconocés, y eso es un gran paso. Vamos a trabajar juntos una micro-estrategia para ese momento', CURRENT_TIMESTAMP - interval '2 hours' + interval '10 seconds'),
  ('d1000001-de00-4000-a000-000000000001', 'assistant', 'Probá el reset 3R: Respirá (4-2-6), Reenfocá (mirá las cuerdas de tu raqueta), y Rearrancar (pensá solo en el próximo punto). Practicalo hoy antes de dormir, 3 veces seguidas', CURRENT_TIMESTAMP - interval '2 hours' + interval '20 seconds'),
  ('d1000001-de00-4000-a000-000000000001', 'user', 'Dale, me gusta eso. Y qué hago si voy perdiendo 1-4?', CURRENT_TIMESTAMP - interval '1 hour'),
  ('d1000001-de00-4000-a000-000000000001', 'assistant', 'Cuando vas abajo, el truco es achicarlo: no pensés en remontar 4 games, pensá solo en ganar el punto que estás jugando. Cada punto empieza 0-0. Además, usá el ritual entre puntos: ajustá las cuerdas, rebotá la pelota 3 veces, respirá y arrancá', CURRENT_TIMESTAMP - interval '1 hour' + interval '15 seconds');

-- Notifications
INSERT INTO public.notifications (user_id, type, title, description, avatar, priority, is_read) VALUES
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'badge_earned', 'Nuevo logro!', 'Desbloqueaste "Racha de 7 días"', 'TINO', 'high', false),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'ai_message', 'Roma te envió un mensaje', 'Tengo una estrategia mental para tu próximo partido', 'ROMA', 'normal', false),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'wellness_tip', 'Recordatorio de ZAHIA', 'No olvides hidratarte antes del entreno de hoy', 'ZAHIA', 'normal', true),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'session_reminder', 'Entrenamiento en 2 horas', 'Saque y revés con coach - 16:00', 'TINO', 'normal', true),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'xp_milestone', 'Nivel Silver alcanzado!', 'Llegaste a 500 XP. Seguí así campeón!', 'TINO', 'high', true),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'wellness_tip', 'Consejo de descanso', 'Dormí al menos 8 horas antes del partido del sábado', 'ROMA', 'low', true);

-- ═══════════════════════════════════════════════
-- COACH: María Fernández
-- ═══════════════════════════════════════════════

INSERT INTO public.profiles (id, email, full_name, sport, city, country, gender, onboarding_completed)
VALUES (
  '5b20db0d-e111-4e6d-bb98-1d8177b49fe1',
  'demo-entrenador@netia.app',
  'María Fernández',
  'tennis',
  'Buenos Aires',
  'Argentina',
  'female',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name, sport = EXCLUDED.sport,
  city = EXCLUDED.city, onboarding_completed = true;

INSERT INTO public.user_roles (user_id, role)
VALUES ('5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'coach')
ON CONFLICT (user_id, role) DO NOTHING;

-- Demo club
INSERT INTO public.clubs (id, name, sport, city, country, invite_code, max_players, is_active, created_by) VALUES
  ('e1000001-de00-4000-a000-c10b00000001', 'Club Atlético Demo', 'tennis', 'Buenos Aires', 'Argentina', 'DEMO2026', 50, true, '5b20db0d-e111-4e6d-bb98-1d8177b49fe1')
ON CONFLICT (id) DO NOTHING;

-- Enroll coach + player in the club
INSERT INTO public.enrollments (user_id, club_id, role, status) VALUES
  ('5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'e1000001-de00-4000-a000-c10b00000001', 'coach', 'active'),
  ('44e44edc-5484-42d9-9f31-22abe945ccae', 'e1000001-de00-4000-a000-c10b00000001', 'player', 'active')
ON CONFLICT (user_id, club_id) DO NOTHING;

-- Training sessions (last 2 weeks)
INSERT INTO public.training_sessions (id, club_id, coach_id, group_name, category, sport, type, date, duration_min, rpe_group, warmup_done, cooldown_done, notes) VALUES
  ('f1000001-de00-4000-a000-5e5500000001', 'e1000001-de00-4000-a000-c10b00000001', '5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'U14', 'U14', 'tennis', 'technical', CURRENT_DATE - 12, 90, 6, true, true, 'Trabajo de saque y revés'),
  ('f1000001-de00-4000-a000-5e5500000002', 'e1000001-de00-4000-a000-c10b00000001', '5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'U14', 'U14', 'tennis', 'physical', CURRENT_DATE - 10, 60, 7, true, true, 'Preparación física'),
  ('f1000001-de00-4000-a000-5e5500000003', 'e1000001-de00-4000-a000-c10b00000001', '5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'U14', 'U14', 'tennis', 'tactical', CURRENT_DATE - 8, 75, 5, true, false, 'Táctica de dobles'),
  ('f1000001-de00-4000-a000-5e5500000004', 'e1000001-de00-4000-a000-c10b00000001', '5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'U14', 'U14', 'tennis', 'technical', CURRENT_DATE - 5, 90, 6, true, true, 'Volea y approach'),
  ('f1000001-de00-4000-a000-5e5500000005', 'e1000001-de00-4000-a000-c10b00000001', '5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'U14', 'U14', 'tennis', 'match', CURRENT_DATE - 3, 120, 8, true, true, 'Partidos de práctica'),
  ('f1000001-de00-4000-a000-5e5500000006', 'e1000001-de00-4000-a000-c10b00000001', '5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'U14', 'U14', 'tennis', 'physical', CURRENT_DATE - 1, 60, 7, true, true, 'Fuerza y movilidad');

-- Session attendance
INSERT INTO public.session_attendance (session_id, player_id, status) VALUES
  ('f1000001-de00-4000-a000-5e5500000001', '44e44edc-5484-42d9-9f31-22abe945ccae', 'present'),
  ('f1000001-de00-4000-a000-5e5500000002', '44e44edc-5484-42d9-9f31-22abe945ccae', 'present'),
  ('f1000001-de00-4000-a000-5e5500000003', '44e44edc-5484-42d9-9f31-22abe945ccae', 'absent'),
  ('f1000001-de00-4000-a000-5e5500000004', '44e44edc-5484-42d9-9f31-22abe945ccae', 'present'),
  ('f1000001-de00-4000-a000-5e5500000005', '44e44edc-5484-42d9-9f31-22abe945ccae', 'present'),
  ('f1000001-de00-4000-a000-5e5500000006', '44e44edc-5484-42d9-9f31-22abe945ccae', 'present');

-- Coach notes
INSERT INTO public.coach_notes (player_id, coach_id, club_id, content) VALUES
  ('44e44edc-5484-42d9-9f31-22abe945ccae', '5b20db0d-e111-4e6d-bb98-1d8177b49fe1', 'e1000001-de00-4000-a000-c10b00000001', 'Excelente progreso en saque. Mejoró la consistencia del segundo servicio esta semana.');

-- Medical clearances
INSERT INTO public.medical_clearances (user_id, issued_date, expiry_date, doctor_name, uploaded_by) VALUES
  ('44e44edc-5484-42d9-9f31-22abe945ccae', CURRENT_DATE - 60, CURRENT_DATE + 300, 'Dr. Martín Rodríguez', '5b20db0d-e111-4e6d-bb98-1d8177b49fe1');

-- ═══════════════════════════════════════════════
-- ADMIN: Admin NETIA
-- ═══════════════════════════════════════════════

INSERT INTO public.profiles (id, email, full_name, city, country, onboarding_completed)
VALUES (
  '078f89c5-0fb1-4ea7-99c0-6e6ce340c41d',
  'demo-admin@netia.app',
  'Admin NETIA',
  'Buenos Aires',
  'Argentina',
  true
)
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name, onboarding_completed = true;

INSERT INTO public.user_roles (user_id, role)
VALUES ('078f89c5-0fb1-4ea7-99c0-6e6ce340c41d', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Admin notifications
INSERT INTO public.notifications (user_id, type, title, description, priority, is_read) VALUES
  ('078f89c5-0fb1-4ea7-99c0-6e6ce340c41d', 'system', 'Nuevo club registrado', 'Club Atlético Demo se unió a la plataforma', 'normal', false),
  ('078f89c5-0fb1-4ea7-99c0-6e6ce340c41d', 'system', '5 usuarios nuevos esta semana', 'Crecimiento del 15% respecto a la semana anterior', 'normal', false),
  ('078f89c5-0fb1-4ea7-99c0-6e6ce340c41d', 'system', 'Reporte semanal disponible', 'Resumen de actividad y métricas del sistema', 'low', true);
