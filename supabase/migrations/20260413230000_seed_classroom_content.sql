-- Seed sample classroom content for demo

-- Module 1: Physical preparation for players
INSERT INTO public.course_modules (id, title, description, target_role, sort_order, is_published)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Preparación Física para Tenistas',
  'Fundamentos de la preparación física aplicada al tenis. Calentamiento, fuerza base, movilidad y recuperación.',
  'player', 0, true
);

INSERT INTO public.course_sections (id, module_id, title, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Semana 1: Fundamentos', 0),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Semana 2: Fuerza Base', 1);

INSERT INTO public.course_lessons (id, section_id, title, content_md, duration_min, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Introducción al entrenamiento', 'La preparación física es la base del rendimiento deportivo. En esta lección vas a aprender por qué es importante entrenar el cuerpo de forma integral, no solo la técnica del deporte.\n\nPuntos clave:\n- El cuerpo necesita una base física sólida para rendir\n- La preparación física previene lesiones\n- Se adapta a la edad y el nivel del deportista', 5, 0),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Calentamiento dinámico', 'El calentamiento es la parte más importante antes de cualquier actividad física. Un buen calentamiento prepara los músculos, las articulaciones y el sistema nervioso.\n\nRutina de calentamiento:\n1. Trote suave 3 minutos\n2. Movilidad articular (tobillos, rodillas, caderas, hombros)\n3. Activación muscular (sentadillas, estocadas, saltos)\n4. Ejercicios específicos del deporte', 8, 1),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Movilidad articular', 'La movilidad articular te permite moverte mejor y con menos riesgo de lesión. Es diferente a la flexibilidad: la movilidad es movimiento activo controlado.\n\nEjercicios fundamentales:\n- Rotaciones de tobillo (10 por lado)\n- Círculos de cadera (10 por lado)\n- Rotaciones de hombro (10 por lado)\n- Giros de muñeca (especial para tenistas)', 6, 2),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Principios de fuerza', 'La fuerza es la capacidad de generar tensión muscular. En el deporte juvenil, trabajamos fuerza con el propio peso corporal antes de usar cargas externas.\n\nPrincipios:\n- Progresión gradual (de menos a más)\n- Técnica antes que carga\n- Descanso entre series\n- Consistencia en el entrenamiento', 7, 0),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 'Ejercicios con peso corporal', 'Estos ejercicios forman la base de tu preparación física. Podés hacerlos en casa sin ningún equipamiento.\n\nCircuito base (3 series):\n1. Sentadillas: 10 repeticiones\n2. Flexiones (adaptadas): 8 repeticiones\n3. Plancha: 20 segundos\n4. Estocadas: 8 por pierna\n5. Superman: 10 repeticiones\n\nDescanso: 60 segundos entre series.', 12, 1);

-- Quiz for lesson 3 (Movilidad articular)
INSERT INTO public.lesson_quizzes (lesson_id, questions, pass_percent) VALUES
  ('c1000000-0000-0000-0000-000000000003', '[
    {"prompt": "Cual es la diferencia entre movilidad y flexibilidad?", "options": ["Son lo mismo", "La movilidad es movimiento activo controlado", "La flexibilidad es más importante", "No hay diferencia en el deporte"], "correctIndex": 1},
    {"prompt": "Cuantas rotaciones de tobillo se recomiendan por lado?", "options": ["5", "10", "15", "20"], "correctIndex": 1},
    {"prompt": "Por que es importante la movilidad articular?", "options": ["Para verse bien", "Para mover mejor y con menos riesgo de lesión", "Para ser más rápido", "No es importante"], "correctIndex": 1}
  ]', 70);

-- Module 2: Mental training for players
INSERT INTO public.course_modules (id, title, description, target_role, sort_order, is_published)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Entrenamiento Mental para Competir',
  'Técnicas de concentración, visualización y manejo de presión para competencias deportivas.',
  'player', 1, true
);

INSERT INTO public.course_sections (id, module_id, title, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Fundamentos Mentales', 0);

INSERT INTO public.course_lessons (id, section_id, title, content_md, duration_min, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000003', 'Respiración para la calma', 'La respiración es tu herramienta más poderosa para controlar los nervios. La técnica 4-2-6 es simple y efectiva.\n\nTécnica 4-2-6:\n1. Inhalar por la nariz contando hasta 4\n2. Mantener contando hasta 2\n3. Exhalar por la boca contando hasta 6\n\nPracticá 5 ciclos antes de cada partido o entrenamiento.', 5, 0),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000003', 'Visualización pre-partido', 'La visualización es imaginar en tu mente lo que querés que pase en el partido. Los mejores deportistas del mundo la practican.\n\nEjercicio de visualización (30 segundos):\n- Cerrá los ojos\n- Imaginá tu primer punto/jugada\n- Sentí la raqueta/pelota en tu mano\n- Visualizá el movimiento perfecto\n- Sentí la confianza en tu cuerpo', 8, 1);

-- Module 3: Coaching methodology for coaches
INSERT INTO public.course_modules (id, title, description, target_role, sort_order, is_published)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Metodología de Entrenamiento Juvenil',
  'Principios de la enseñanza deportiva para entrenadores que trabajan con jóvenes atletas.',
  'coach', 0, true
);

INSERT INTO public.course_sections (id, module_id, title, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003', 'Principios Pedagógicos', 0);

INSERT INTO public.course_lessons (id, section_id, title, content_md, duration_min, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000004', 'El modelo DMSP', 'El Developmental Model of Sport Participation (Jean Côté) es el marco de referencia para el desarrollo deportivo juvenil.\n\nEtapas:\n1. Sampling (6-12 años): Variedad de deportes, diversión\n2. Specializing (13-15 años): Reducir deportes, más práctica deliberada\n3. Investment (16+ años): Dedicación a un deporte\n\nComo entrenador, tu rol cambia en cada etapa.', 10, 0),
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000004', 'Comunicación con jóvenes', 'La forma en que te comunicás con tus deportistas impacta directamente en su motivación y desarrollo.\n\nPrincipios:\n- Feedback positivo antes que correctivo (ratio 3:1)\n- Preguntas abiertas en lugar de instrucciones cerradas\n- Escuchar activamente sus preocupaciones\n- Adaptar el lenguaje a la edad\n- Celebrar el esfuerzo, no solo el resultado', 8, 1);
