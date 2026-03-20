export interface RecommendationInput {
  role: string;
  level: string;
  mainGoal: string;
  mainSport: string;
  areasToImprove: string[];
  selectedAvatar: string;
  fullName: string;
  trainingDaysPerWeek: number;
}

export interface Recommendation {
  levelLabel: string;
  levelEmoji: string;
  objectiveSuggestion: string;
  trainingTip: string;
  avatarMessage: string;
}

const levelMap: Record<string, { label: string; emoji: string }> = {
  principiante: { label: 'Nivel Principiante', emoji: '🌱' },
  intermedio: { label: 'Nivel Intermedio', emoji: '⚡' },
  avanzado: { label: 'Nivel Avanzado', emoji: '🔥' },
  competitivo: { label: 'Nivel Competitivo', emoji: '🏆' },
};

const goalObjectiveMap: Record<string, Record<string, string>> = {
  principiante: {
    mejorar_tecnica: 'Desarrollar fundamentos técnicos sólidos con práctica constante',
    mejorar_fisico: 'Construir una base física con ejercicios de coordinación y resistencia',
    ganar_torneos: 'Primero consolidar técnica básica, luego empezar a competir',
    divertirme: 'Disfrutar del deporte mientras aprendés los fundamentos',
    default: 'Trabajar consistencia y técnica básica paso a paso',
  },
  intermedio: {
    mejorar_tecnica: 'Perfeccionar golpes y tácticas de juego avanzadas',
    mejorar_fisico: 'Aumentar potencia y velocidad con entrenamiento específico',
    ganar_torneos: 'Combinar preparación táctica con fortaleza mental competitiva',
    divertirme: 'Explorar nuevas tácticas y desafiarte en partidos amistosos',
    default: 'Fortalecer tus puntos fuertes y trabajar las áreas débiles',
  },
  avanzado: {
    mejorar_tecnica: 'Pulir detalles técnicos y automatizar patrones tácticos',
    mejorar_fisico: 'Optimizar rendimiento físico con periodización avanzada',
    ganar_torneos: 'Preparación integral: táctica, física y mental para competir',
    divertirme: 'Mantener el nivel alto mientras disfrutás del proceso',
    default: 'Mantener tu nivel y buscar la excelencia en cada entrenamiento',
  },
  competitivo: {
    mejorar_tecnica: 'Micro-ajustes técnicos bajo presión competitiva',
    mejorar_fisico: 'Maximizar rendimiento físico y prevención de lesiones',
    ganar_torneos: 'Enfocarte en resistencia mental y simulación de torneos',
    divertirme: 'Equilibrar competición intensa con disfrute del deporte',
    default: 'Enfocarte en resistencia mental y simulación de partidos',
  },
};

const sportTips: Record<string, Record<string, string>> = {
  tenis: {
    tecnica: '30 min de práctica de golpes en cancha',
    fisico: '20 min de footwork y agilidad',
    mental: '15 min de visualización pre-partido',
    nutricion: 'Hidratarte bien antes de cada sesión',
    default: '30 min de peloteo enfocado en consistencia',
  },
  futbol: {
    tecnica: '30 min de control de balón y pases cortos',
    fisico: '25 min de sprints y cambios de dirección',
    mental: '15 min de concentración táctica',
    nutricion: 'Comer carbohidratos 2h antes del entrenamiento',
    default: '30 min de práctica con balón',
  },
  natacion: {
    tecnica: '30 min de drills de brazada y patada',
    fisico: '25 min de series de velocidad',
    mental: '10 min de respiración y relajación',
    nutricion: 'Snack ligero 1h antes de nadar',
    default: '30 min de técnica en pileta',
  },
  default: {
    tecnica: '30 min de práctica técnica específica',
    fisico: '25 min de preparación física general',
    mental: '15 min de enfoque y concentración',
    nutricion: 'Mantener buena hidratación durante el día',
    default: '30 min de entrenamiento enfocado',
  },
};

const avatarIntros: Record<string, { name: string; specialty: string; intro: string }> = {
  tino: {
    name: 'Tino',
    specialty: 'entrenamiento',
    intro: 'Soy Tino, tu entrenador personal. Voy a ayudarte a mejorar tu rendimiento día a día.',
  },
  zahia: {
    name: 'Zahia',
    specialty: 'nutrición',
    intro: 'Soy Zahia, tu guía de nutrición. Juntas vamos a cuidar tu alimentación para rendir al máximo.',
  },
  roma: {
    name: 'Roma',
    specialty: 'mente',
    intro: 'Soy Roma, tu entrenadora mental. Te acompaño a fortalecer tu mente y tu confianza.',
  },
};

export function getRecommendation(input: RecommendationInput): Recommendation {
  const level = input.level?.toLowerCase() || 'principiante';
  const goal = input.mainGoal?.toLowerCase() || 'default';
  const sport = input.mainSport?.toLowerCase() || 'default';
  const firstName = input.fullName?.split(' ')[0] || 'Deportista';

  const { label: levelLabel, emoji: levelEmoji } = levelMap[level] || levelMap.principiante;

  const objectives = goalObjectiveMap[level] || goalObjectiveMap.principiante;
  const objectiveSuggestion = objectives[goal] || objectives.default;

  // Pick tip based on first area to improve or default
  const sportTipMap = sportTips[sport] || sportTips.default;
  const firstArea = (input.areasToImprove?.[0] || 'default').toLowerCase();
  const trainingTip = sportTipMap[firstArea] || sportTipMap.default;

  const avatar = avatarIntros[input.selectedAvatar] || avatarIntros.tino;
  const avatarMessage = `¡Perfecto, ${firstName}! Ya analizamos tu perfil. Estás en ${levelLabel.toLowerCase()} y tu objetivo es ${objectiveSuggestion.toLowerCase()}. Hoy podrías empezar con ${trainingTip.toLowerCase()}. ¡Vamos a por ello! 💪`;

  return {
    levelLabel,
    levelEmoji,
    objectiveSuggestion,
    trainingTip,
    avatarMessage,
  };
}

export function getAvatarIntros(selectedAvatar: string) {
  const all = ['tino', 'zahia', 'roma'];
  const others = all.filter(a => a !== selectedAvatar);
  return others.map(a => avatarIntros[a] || avatarIntros.tino);
}

export function getRoleMessage(role: string, fullName: string): { title: string; message: string } {
  const firstName = fullName?.split(' ')[0] || '';
  switch (role) {
    case 'parent':
      return {
        title: '¡Perfil creado!',
        message: `${firstName}, ya podés ver el progreso de tus hijos desde tu panel. Te vamos a mantener informado/a con alertas y reportes.`,
      };
    case 'coach':
    case 'club_admin':
      return {
        title: '¡Equipo configurado!',
        message: `${firstName}, tu espacio de entrenador está listo. Empezá a registrar sesiones y seguir el progreso de tus jugadores.`,
      };
    case 'admin':
      return {
        title: '¡Plataforma lista!',
        message: `${firstName}, ya tenés acceso al panel de administración. Podés gestionar usuarios, clubes y ver analíticas.`,
      };
    default:
      return { title: '¡Listo!', message: 'Tu perfil está configurado.' };
  }
}
