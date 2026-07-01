import { useState, useEffect, useCallback } from 'react';

export type Theme = 'spring' | 'summer' | 'autumn' | 'winter';

const STORAGE_KEY = 'mindjourney-theme';
const THEMES: Theme[] = ['spring', 'summer', 'autumn', 'winter'];

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (THEMES.includes(stored as Theme)) return stored as Theme;
  return 'spring';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const index = THEMES.indexOf(prev);
      return THEMES[(index + 1) % THEMES.length];
    });
  }, []);

  return { theme, toggleTheme };
}
