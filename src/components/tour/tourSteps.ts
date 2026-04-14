export interface TourStep {
  target: string;
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="hero-cta"]',
    title: 'Tu punto de partida',
    description: 'NETIA es un ecosistema digital multideporte para chicos de 8 a 16 años. Entrenamiento personalizado, avatares con IA y gamificación.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="stats"]',
    title: 'Impacto real',
    description: 'Más de 1400 alumnos, 25 años de experiencia en deporte juvenil y un equipo de avatares expertos que guían a cada atleta.',
    placement: 'top',
  },
  {
    target: '[data-tour="vision"]',
    title: 'Nuestra visión',
    description: 'Un modelo de entrenamiento digital que combina tecnología, juego y personalización. Avatares que enseñan, motivan y conectan con los chicos.',
    placement: 'top',
  },
  {
    target: '[data-tour="campus"]',
    title: 'Campus Digital',
    description: 'Cada jugador tiene su dashboard personalizado con seguimiento de bienestar, planes de entrenamiento, logros y métricas de evolución.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="avatars"]',
    title: 'Avatares con IA',
    description: 'Tino (entrenamiento), Zahia (nutrición) y Roma (psicología deportiva) son mentores virtuales 24/7 que hablan con cada atleta.',
    placement: 'top',
  },
  {
    target: '[data-tour="parental"]',
    title: 'Control Parental',
    description: 'Los padres pueden seguir la actividad de sus hijos, gestionar aptos médicos y comunicarse con el club. Todo con total transparencia.',
    placement: 'top',
  },
  {
    target: '[data-tour="cta-demo"]',
    title: 'Probá la plataforma ahora',
    description: 'Hacé click en "Probar Demo" para explorar como jugador, entrenador o administrador. Sin crear cuenta, con datos de ejemplo reales.',
    placement: 'top',
  },
];
