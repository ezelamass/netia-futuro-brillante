import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface FamilyLink {
  id: string;
  childId: string;
  childName: string;
  childEmail: string;
  relationship: string;
  consentGiven: boolean;
  consentDate?: Date;
}

export const useFamilyLinks = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState<FamilyLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLinks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from('family_links')
      .select('*, profiles!family_links_child_id_fkey(full_name, email)')
      .eq('parent_id', user.id);

    if (!error && data) {
      setLinks(data.map((row: any) => ({
        id: row.id,
        childId: row.child_id,
        childName: row.profiles?.full_name || '',
        childEmail: row.profiles?.email || '',
        relationship: row.relationship || 'parent',
        consentGiven: row.consent_given,
        consentDate: row.consent_date ? new Date(row.consent_date) : undefined,
      })));
    }
    setIsLoading(false);
  }, [user]);

  const linkChild = async (childEmail: string) => {
    if (!user) return false;

    // Find the child's profile by email
    const { data: childProfile, error: findError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('email', childEmail.trim().toLowerCase())
      .single();

    if (findError || !childProfile) {
      toast.error('No se encontró una cuenta con ese email');
      return false;
    }

    // Check if already linked
    const { data: existing } = await supabase
      .from('family_links')
      .select('id')
      .eq('parent_id', user.id)
      .eq('child_id', childProfile.id)
      .single();

    if (existing) {
      toast.info('Ya tenés vinculado a este hijo/a');
      return false;
    }

    const { error } = await supabase
      .from('family_links')
      .insert({
        parent_id: user.id,
        child_id: childProfile.id,
        relationship: 'parent',
        consent_given: false,
      });

    if (error) {
      toast.error('Error al vincular');
      return false;
    }

    toast.success(`¡Vinculado a ${childProfile.full_name}!`);
    fetchLinks();
    return true;
  };

  const giveConsent = async (linkId: string) => {
    const { error } = await supabase
      .from('family_links')
      .update({ consent_given: true, consent_date: new Date().toISOString() })
      .eq('id', linkId);

    if (!error) {
      toast.success('Consentimiento otorgado');
      fetchLinks();
    }
  };

  return { links, isLoading, fetchLinks, linkChild, giveConsent };
};
