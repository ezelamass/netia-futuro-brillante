import { useState, useEffect, useCallback } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '@/types/settings';
import { toast } from 'sonner';

const STORAGE_KEY = 'netia_settings';

interface UseSettingsReturn {
  settings: UserSettings;
  updateSettings: <K extends keyof UserSettings>(
    section: K,
    values: Partial<UserSettings[K]>
  ) => void;
  updateSetting: <K extends keyof UserSettings, S extends keyof UserSettings[K]>(
    section: K,
    key: S,
    value: UserSettings[K][S]
  ) => void;
  resetSettings: () => void;
  exportSettings: () => string;
  importSettings: (json: string) => boolean;
}

// Apply theme to document
const applyTheme = (theme: 'light' | 'dark' | 'system') => {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
};

// Listen for system theme changes
const setupThemeListener = (theme: 'light' | 'dark' | 'system') => {
  if (theme === 'system') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }
};

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all fields exist
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
          appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
          locale: { ...DEFAULT_SETTINGS.locale, ...parsed.locale },
          privacy: { ...DEFAULT_SETTINGS.privacy, ...parsed.privacy },
          aiAvatars: { ...DEFAULT_SETTINGS.aiAvatars, ...parsed.aiAvatars },
        };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(settings.appearance.theme);
    const cleanup = setupThemeListener(settings.appearance.theme);
    return cleanup;
  }, [settings.appearance.theme]);

  // Apply language
  useEffect(() => {
    document.documentElement.lang = settings.locale.language;
  }, [settings.locale.language]);

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Update an entire section
  const updateSettings = useCallback(<K extends keyof UserSettings>(
    section: K,
    values: Partial<UserSettings[K]>
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...values,
      },
    }));
  }, []);

  // Update a single setting
  const updateSetting = useCallback(<K extends keyof UserSettings, S extends keyof UserSettings[K]>(
    section: K,
    key: S,
    value: UserSettings[K][S]
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }, []);

  // Reset to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    toast.success('Configuración restablecida');
  }, []);

  // Export settings as JSON
  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  // Import settings from JSON
  const importSettings = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      setSettings({
        ...DEFAULT_SETTINGS,
        ...parsed,
        notifications: { ...DEFAULT_SETTINGS.notifications, ...parsed.notifications },
        appearance: { ...DEFAULT_SETTINGS.appearance, ...parsed.appearance },
        locale: { ...DEFAULT_SETTINGS.locale, ...parsed.locale },
        privacy: { ...DEFAULT_SETTINGS.privacy, ...parsed.privacy },
        aiAvatars: { ...DEFAULT_SETTINGS.aiAvatars, ...parsed.aiAvatars },
      });
      toast.success('Configuración importada correctamente');
      return true;
    } catch (error) {
      toast.error('Error al importar la configuración');
      return false;
    }
  }, []);

  return {
    settings,
    updateSettings,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings,
  };
};
