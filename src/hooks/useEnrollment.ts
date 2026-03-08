import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Enrollment {
  id: string;
  clubId: string;
  clubName: string;
  role: string;
  status: string;
  joinedAt: Date;
}

export interface Club {
  id: string;
  name: string;
  logoUrl?: string;
  city?: string;
  sport?: string;
  inviteCode?: string;
  isActive: boolean;
}

export const useEnrollment = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEnrollments = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('enrollments')
      .select('*, clubs(name, logo_url, city, sport)')
      .eq('user_id', user.id);

    if (!error && data) {
      setEnrollments(data.map((row: any) => ({
        id: row.id,
        clubId: row.club_id,
        clubName: row.clubs?.name || 'Club',
        role: row.role,
        status: row.status,
        joinedAt: new Date(row.joined_at),
      })));
    }
    setIsLoading(false);
  }, [user]);

  const joinClubByCode = async (inviteCode: string) => {
    if (!user) { toast.error('Debes iniciar sesión'); return false; }

    // Find club by invite code
    const { data: club, error: clubError } = await supabase
      .from('clubs')
      .select('id, name')
      .eq('invite_code', inviteCode.trim().toUpperCase())
      .eq('is_active', true)
      .single();

    if (clubError || !club) {
      toast.error('Código de invitación inválido');
      return false;
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('club_id', club.id)
      .single();

    if (existing) {
      toast.info('Ya estás inscrito en este club');
      return false;
    }

    // Create enrollment
    const { error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        club_id: club.id,
        role: 'player',
        status: 'pending',
      });

    if (error) {
      toast.error('Error al unirse al club');
      return false;
    }

    toast.success(`¡Solicitud enviada a ${club.name}!`);
    fetchEnrollments();
    return true;
  };

  return { enrollments, isLoading, fetchEnrollments, joinClubByCode };
};
