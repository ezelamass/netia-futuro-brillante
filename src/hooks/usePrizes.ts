import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Prize {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  value?: string;
  sponsor?: string;
  details?: string;
}

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
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
};

export function usePrizes() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrizes = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('prizes')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching prizes:', error);
      } else {
        setPrizes(
          (data || []).map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            imageUrl: p.image_url || '',
            value: p.value || undefined,
            sponsor: p.sponsor || undefined,
            details: p.details || undefined,
          }))
        );
      }
      setIsLoading(false);
    };

    fetchPrizes();
  }, []);

  return { prizes, isLoading };
}
