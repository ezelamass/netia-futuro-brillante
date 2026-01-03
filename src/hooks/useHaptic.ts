// Haptic feedback utilities using the Web Vibration API
// Works on most mobile browsers (Android Chrome, Safari iOS 16.4+)

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'celebration';

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20],
  warning: [30, 30, 30],
  error: [50, 100, 50],
  celebration: [10, 30, 10, 30, 10, 50, 20, 100, 30],
};

export const haptic = (pattern: HapticPattern = 'light') => {
  // Check if vibration is supported
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(patterns[pattern]);
    } catch (e) {
      // Silently fail if vibration not allowed
      console.debug('Vibration not available');
    }
  }
};

// Hook for using haptic feedback
export const useHaptic = () => {
  const trigger = (pattern: HapticPattern = 'light') => {
    haptic(pattern);
  };

  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  return { trigger, isSupported };
};
