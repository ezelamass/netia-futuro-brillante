export interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  value?: string;
  sponsor?: string;
  details?: string;
}

export const mockPrizes: Prize[] = [
  {
    id: '1',
    name: 'Zapatillas Running Pro',
    description: 'Zapatillas de alto rendimiento para el campeón',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    value: '$150',
    sponsor: 'Nike',
    details: 'Zapatillas de running de última generación con tecnología de amortiguación avanzada. Incluye personalización con tu nombre.'
  },
  {
    id: '2',
    name: 'Smartwatch Fitness',
    description: 'Monitor de actividad y salud 24/7',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    value: '$80',
    sponsor: 'Garmin',
    details: 'Reloj inteligente con GPS, monitor cardíaco, y seguimiento de más de 30 deportes. Batería de 7 días.'
  },
  {
    id: '3',
    name: 'Kit de Suplementos',
    description: 'Pack completo de proteínas y vitaminas',
    imageUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=300&fit=crop',
    value: '$50',
    sponsor: 'GNC',
    details: 'Pack premium con proteína whey, creatina, BCAAs y multivitamínico deportivo para 2 meses.'
  }
];

// Calculate time remaining until end of week (Sunday 23:59:59)
export const getTimeRemaining = (): { days: number; hours: number; minutes: number; seconds: number } => {
  const now = new Date();
  const endOfWeek = new Date(now);
  const daysUntilSunday = 7 - now.getDay();
  endOfWeek.setDate(now.getDate() + (daysUntilSunday === 7 ? 0 : daysUntilSunday));
  endOfWeek.setHours(23, 59, 59, 999);
  
  const diff = endOfWeek.getTime() - now.getTime();
  
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  };
};
