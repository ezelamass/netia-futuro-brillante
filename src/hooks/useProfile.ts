import { useState, useEffect, useCallback } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { UserProfile, profileSchema, DEFAULT_PROFILE } from '@/types/profile';

const STORAGE_KEY = 'netia_user_profile';

interface UseProfileReturn {
  profile: UserProfile;
  form: UseFormReturn<UserProfile>;
  isEditing: boolean;
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  setIsEditing: (editing: boolean) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  saveProfile: () => Promise<void>;
  updateField: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => void;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<UserProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: DEFAULT_PROFILE,
    mode: 'onChange',
  });

  const { isDirty } = form.formState;

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        setProfile(parsed);
        form.reset(parsed);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && isEditing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isEditing]);

  const startEditing = useCallback(() => {
    form.reset(profile);
    setIsEditing(true);
  }, [form, profile]);

  const cancelEditing = useCallback(() => {
    form.reset(profile);
    setIsEditing(false);
  }, [form, profile]);

  const saveProfile = useCallback(async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error('Hay errores en el formulario');
      return;
    }

    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const values = form.getValues();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      setProfile(values);
      setIsEditing(false);
      toast.success('Perfil guardado correctamente');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  }, [form]);

  const updateField = useCallback(<K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form.setValue(field, value as any, { shouldDirty: true, shouldValidate: true });
  }, [form]);

  return {
    profile,
    form,
    isEditing,
    isDirty,
    isLoading,
    isSaving,
    setIsEditing,
    startEditing,
    cancelEditing,
    saveProfile,
    updateField,
  };
};
