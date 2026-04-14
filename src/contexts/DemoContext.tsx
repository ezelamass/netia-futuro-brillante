import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/contexts/AuthContext';

const DEMO_ACCOUNTS: Record<string, { email: string; password: string; dashboard: string }> = {
  player: { email: 'demo-jugador@netia.app', password: 'netiademo', dashboard: '/dashboard' },
  coach: { email: 'demo-entrenador@netia.app', password: 'netiademo', dashboard: '/club/dashboard' },
  club_admin: { email: 'demo-entrenador@netia.app', password: 'netiademo', dashboard: '/club/dashboard' },
  admin: { email: 'demo-admin@netia.app', password: 'netiademo', dashboard: '/admin/dashboard' },
};

const DEMO_STORAGE_KEY = 'netia_demo';

interface DemoState {
  isDemoMode: boolean;
  demoRole: UserRole | null;
}

interface DemoContextType {
  isDemoMode: boolean;
  demoRole: UserRole | null;
  demoLogin: (role: UserRole) => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
  exitDemo: () => Promise<void>;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const useDemo = () => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
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

  const demoLogin = useCallback(async (role: UserRole) => {
    const account = DEMO_ACCOUNTS[role];
    if (!account) return;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });
      if (error) throw error;

      setState({ isDemoMode: true, demoRole: role });
      navigate(account.dashboard);
    } catch (err) {
      console.error('Demo login failed:', err);
    }
  }, [navigate]);

  const switchDemoRole = useCallback(async (role: UserRole) => {
    if (role === state.demoRole) return;
    const account = DEMO_ACCOUNTS[role];
    if (!account) return;

    try {
      await supabase.auth.signOut();
      const { error } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      });
      if (error) throw error;

      setState({ isDemoMode: true, demoRole: role });
      navigate(account.dashboard);
    } catch (err) {
      console.error('Demo switch failed:', err);
    }
  }, [navigate, state.demoRole]);

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
