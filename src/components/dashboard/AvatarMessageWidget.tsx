import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AvatarGuide } from '@/components/onboarding/AvatarGuide';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type AvatarType = 'tino' | 'zahia' | 'roma';

interface AvatarMessageWidgetProps {
  streak?: number;
  hasLogToday?: boolean;
  energyLevel?: number | null;
}

const motivationalMessages: Record<number, string> = {
  0: '¡Nuevo día, nueva oportunidad! Empezá con un buen calentamiento. 🔥',
  1: 'Los lunes son para arrancar con todo. ¡Dale que se puede! 💪',
  2: 'Martes de intensidad. Enfocate en lo que más te cuesta. ⚡',
  3: 'Mitad de semana. Mantené el ritmo, ¡vas muy bien! 🚀',
  4: 'Jueves de técnica. Cada repetición cuenta. 🎯',
  5: 'Viernes: cierre de semana fuerte. ¡No aflojes! 🏆',
  6: 'Fin de semana para descansar y recargar energía. 🌊',
};

export const AvatarMessageWidget = ({ streak = 0, hasLogToday = false, energyLevel = null }: AvatarMessageWidgetProps) => {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('tino');
  const [dismissed, setDismissed] = useState(false);

  // Load selected avatar from profile
  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('onboarding')
        .eq('id', user.id)
        .maybeSingle();

      if (data?.onboarding && typeof data.onboarding === 'object') {
        const ob = data.onboarding as Record<string, any>;
        if (ob.selectedAvatar) setSelectedAvatar(ob.selectedAvatar as AvatarType);
      }
    })();
  }, [user?.id]);

  // Check dismiss for today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const dismissKey = `netia_avatar_dismissed_${today}`;
    if (localStorage.getItem(dismissKey) === 'true') {
      setDismissed(true);
    }
  }, []);

  const message = useMemo(() => {
    if (!hasLogToday) {
      return '¡Todavía no registraste tu día! Hacelo ahora para mantener tu racha. 📝';
    }
    if (streak >= 7) {
      return `¡${streak} días seguidos! Sos imparable. Seguí así, campeón. 🔥`;
    }
    if (energyLevel !== null && energyLevel <= 3) {
      return 'Parece que tu energía está baja hoy. Escuchá a tu cuerpo y descansá bien. 🌙';
    }
    const dayOfWeek = new Date().getDay();
    return motivationalMessages[dayOfWeek] || motivationalMessages[0];
  }, [hasLogToday, streak, energyLevel]);

  const handleDismiss = () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`netia_avatar_dismissed_${today}`, 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="relative rounded-2xl border border-border/50 bg-card p-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
        <AvatarGuide avatar={selectedAvatar} message={message} />
      </motion.div>
    </AnimatePresence>
  );
};
