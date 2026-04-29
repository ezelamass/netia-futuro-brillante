import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Users, Building2, Shield, type LucideIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/contexts/AuthContext';

/**
 * Single source of truth for demo roles. DemoBanner and DemoRolePickerDialog
 * both consume this list so adding a new role in one place updates the UI
 * everywhere.
 */
export interface DemoRoleConfig {
  role: UserRole;
  email: string;
  password: string;
  dashboard: string;
  label: string;
  icon: LucideIcon;
  description: string;
  gradient: string;
  iconColor: string;
}

export const DEMO_ROLES: DemoRoleConfig[] = [
  {
    role: 'player',
    email: 'demo-jugador@netia.app',
    password: 'netiademo',
    dashboard: '/dashboard',
    label: 'Jugador',
    icon: Trophy,
    description: 'Explora tu dashboard, logros, entrenamientos y chatea con tu avatar IA',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-500',
  },
  {
    role: 'coach',
    email: 'demo-entrenador@netia.app',
    password: 'netiademo',
    dashboard: '/club/dashboard',
    label: 'Entrenador',
    icon: Users,
    description: 'Gestiona tu club, roster de atletas, cargas de entrenamiento e informes',
    gradient: 'from-orange-500/10 to-amber-500/10',
    iconColor: 'text-orange-500',
  },
  {
    role: 'club_admin',
    email: 'demo-club-admin@netia.app',
    password: 'netiademo',
    dashboard: '/club/dashboard',
    label: 'Admin de Club',
    icon: Building2,
    description: 'Gestión integral del club, equipos y permisos administrativos',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-emerald-600',
  },
  {
    role: 'admin',
    email: 'demo-admin@netia.app',
    password: 'netiademo',
    dashboard: '/admin/dashboard',
    label: 'Administrador',
    icon: Shield,
    description: 'Controla toda la plataforma: usuarios, analíticas y configuración del sistema',
    gradient: 'from-purple-500/10 to-indigo-500/10',
    iconColor: 'text-purple-500',
  },
];

const getDemoConfig = (role: UserRole): DemoRoleConfig | undefined =>
  DEMO_ROLES.find((r) => r.role === role);

const DEMO_STORAGE_KEY = 'netia_demo';

interface DemoState {
  isDemoMode: boolean;
  demoRole: UserRole | null;
}

export interface DemoLoginResult {
  ok: boolean;
  error?: string;
}

interface DemoContextType {
  isDemoMode: boolean;
  demoRole: UserRole | null;
  demoLogin: (role: UserRole) => Promise<DemoLoginResult>;
  switchDemoRole: (role: UserRole) => Promise<DemoLoginResult>;
  exitDemo: () => Promise<void>;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
};

const friendlyAuthError = (err: unknown): string => {
  if (!err) return 'No pudimos abrir la demo. Intentá de nuevo en unos segundos.';
  const message = err instanceof Error ? err.message : String(err);
  if (/invalid login|invalid credentials/i.test(message)) {
    return 'La cuenta demo no está disponible. Avisanos para reactivarla.';
  }
  if (/network|fetch|failed to fetch/i.test(message)) {
    return 'Error de conexión. Revisá tu internet e intentá de nuevo.';
  }
  return message;
};

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<DemoState>(() => {
    try {
      const stored = sessionStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return { isDemoMode: false, demoRole: null };
  });

  // Persist to sessionStorage
  useEffect(() => {
    if (state.isDemoMode) {
      sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(DEMO_STORAGE_KEY);
    }
  }, [state]);

  const demoLogin = useCallback<DemoContextType['demoLogin']>(
    async (role) => {
      const account = getDemoConfig(role);
      if (!account) {
        return { ok: false, error: `Rol demo desconocido: ${role}` };
      }

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: account.email,
          password: account.password,
        });
        if (error) throw error;

        setState({ isDemoMode: true, demoRole: role });
        navigate(account.dashboard);
        return { ok: true };
      } catch (err) {
        console.error('[demo] login failed:', err);
        return { ok: false, error: friendlyAuthError(err) };
      }
    },
    [navigate]
  );

  const switchDemoRole = useCallback<DemoContextType['switchDemoRole']>(
    async (role) => {
      if (role === state.demoRole) return { ok: true };
      const account = getDemoConfig(role);
      if (!account) return { ok: false, error: `Rol demo desconocido: ${role}` };

      try {
        await supabase.auth.signOut();
        // Give Supabase's local state a tick to propagate the SIGNED_OUT
        // event before we sign in again. Prevents out-of-order events on
        // slow networks.
        await new Promise((resolve) => setTimeout(resolve, 100));

        const { error } = await supabase.auth.signInWithPassword({
          email: account.email,
          password: account.password,
        });
        if (error) throw error;

        setState({ isDemoMode: true, demoRole: role });
        navigate(account.dashboard);
        return { ok: true };
      } catch (err) {
        console.error('[demo] switch failed:', err);
        return { ok: false, error: friendlyAuthError(err) };
      }
    },
    [navigate, state.demoRole]
  );

  const exitDemo = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    setState({ isDemoMode: false, demoRole: null });
    navigate('/');
  }, [navigate]);

  return (
    <DemoContext.Provider value={{
      isDemoMode: state.isDemoMode,
      demoRole: state.demoRole,
      demoLogin,
      switchDemoRole,
      exitDemo,
    }}>
      {children}
    </DemoContext.Provider>
  );
};
