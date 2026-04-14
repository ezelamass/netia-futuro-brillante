import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type ClearanceStatus = 'valid' | 'expiring_soon' | 'expired' | 'pending';

export interface MedicalClearance {
  id: string;
  userId: string;
  fileUrl?: string;
  issuedDate: Date;
  expiryDate: Date;
  status: ClearanceStatus;
  doctorName?: string;
  notes?: string;
  createdAt: Date;
}

function calculateClearanceStatus(expiryDate: Date): ClearanceStatus {
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring_soon';
  return 'valid';
}

export const useMedicalClearance = () => {
  const { user } = useAuth();
  const [clearances, setClearances] = useState<MedicalClearance[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClearances = useCallback(async (userId?: string) => {
    const targetId = userId || user?.id;
    if (!targetId) return;
    setIsLoading(true);

    const { data, error } = await supabase
      .from('medical_clearances')
      .select('*')
      .eq('user_id', targetId)
      .order('expiry_date', { ascending: false });

    if (!error && data) {
      setClearances(data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        fileUrl: row.file_url || undefined,
        issuedDate: new Date(row.issued_date),
        expiryDate: new Date(row.expiry_date),
        status: calculateClearanceStatus(new Date(row.expiry_date)),
        doctorName: row.doctor_name || undefined,
        notes: row.notes || undefined,
        createdAt: new Date(row.created_at),
      })));
    }
    setIsLoading(false);
  }, [user]);

  const uploadClearance = async (
    file: File,
    issuedDate: string,
    expiryDate: string,
    doctorName?: string,
    targetUserId?: string,
  ) => {
    const uploaderId = user?.id;
    const patientId = targetUserId || uploaderId;
    if (!uploaderId || !patientId) return false;

    // Upload file to storage
    const filePath = `${patientId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('medical-clearances')
      .upload(filePath, file);

    if (uploadError) {
      toast.error('Error al subir el archivo');
      return false;
    }

    const { data: urlData } = supabase.storage
      .from('medical-clearances')
      .getPublicUrl(filePath);

    const { error } = await supabase
      .from('medical_clearances')
      .insert({
        user_id: patientId,
        file_url: urlData.publicUrl,
        issued_date: issuedDate,
        expiry_date: expiryDate,
        doctor_name: doctorName || null,
        uploaded_by: uploaderId,
      });

    if (error) {
      toast.error('Error al guardar el certificado');
      return false;
    }

    toast.success('Certificado médico cargado');
    fetchClearances(patientId);
    return true;
  };

  const latestClearance = clearances[0] || null;
  const hasValidClearance = latestClearance?.status === 'valid';
  const isExpiringSoon = latestClearance?.status === 'expiring_soon';
  const isExpired = latestClearance?.status === 'expired';

  return {
    clearances, isLoading, latestClearance,
    hasValidClearance, isExpiringSoon, isExpired,
    fetchClearances, uploadClearance,
  };
};
