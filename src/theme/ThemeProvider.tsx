import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '../utils/storage';
import { darkPalette, lightPalette, Palette, radius, spacing, typography } from './tokens';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'echo.themeMode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark' | null>(
    () => (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'),
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') setModeState(saved);
    });
    const sub = Appearance.addChangeListener(({ colorScheme }) =>
      setSystemScheme(colorScheme === 'dark' ? 'dark' : 'light'),
    );
    return () => sub.remove();
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      isDark,
      colors: isDark ? darkPalette : lightPalette,
      spacing,
      radius,
      typography,
      setMode,
    }),
    [mode, isDark, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
