import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { demoMockClient, resetMockDataset } from './demo-mock-client';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const realClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Demo mode flag — flipped by DemoContext.demoLogin / exitDemo via setDemoMode().
// We keep it as a module-level boolean (not React state) so the supabase proxy
// can consult it synchronously inside .from()/.rpc()/.functions calls.
let demoModeActive = false;

export const setDemoMode = (active: boolean) => {
  if (active === demoModeActive) return;
  demoModeActive = active;
  if (!active) resetMockDataset();
};

export const isDemoModeActive = () => demoModeActive;

// On boot, sync flag with sessionStorage so a page reload during a demo session
// keeps the mock active without waiting for DemoContext to mount.
try {
  const stored = sessionStorage.getItem('netia_demo');
  if (stored && JSON.parse(stored)?.isDemoMode) demoModeActive = true;
} catch { /* ignore */ }

// Proxy that routes table queries / rpc / functions / channels through the mock
// when demo mode is on. `auth` and other surface always go to the real client
// so login, sessions and onAuthStateChange continue to behave normally.
const ROUTED_PROPS = new Set(['from', 'rpc', 'functions', 'channel', 'removeChannel']);

export const supabase = new Proxy(realClient, {
  get(target, prop, receiver) {
    if (demoModeActive && typeof prop === 'string' && ROUTED_PROPS.has(prop)) {
      return (demoMockClient as any)[prop];
    }
    return Reflect.get(target, prop, receiver);
  },
}) as SupabaseClient<Database>;
