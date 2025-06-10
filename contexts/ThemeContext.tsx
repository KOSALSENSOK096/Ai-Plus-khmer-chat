// Code Complete Review: 20240815120000
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ThemeSetting, AppliedTheme } from '../types'; // Import new types
import { APP_THEME_KEY } from '../constants';

interface ThemeContextType {
  appliedTheme: AppliedTheme; // Actual theme on the page: 'light' or 'dark'
  themeSetting: ThemeSetting; // User's preference: 'light', 'dark', or 'system'
  setThemePreference: (preference: ThemeSetting) => void;
  toggleTheme: () => void; // Kept for ThemeToggleButton convenience
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeSetting, setThemeSettingState] = useState<ThemeSetting>(() => {
    const storedTheme = localStorage.getItem(APP_THEME_KEY) as ThemeSetting | null;
    return storedTheme || 'system'; // Default to 'system' if nothing stored
  });

  const [appliedTheme, setAppliedTheme] = useState<AppliedTheme>('light'); // Default to light initially

  const applyThemeToDocument = useCallback((themeToApply: AppliedTheme) => {
    const root = window.document.documentElement;
    if (themeToApply === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setAppliedTheme(themeToApply);
  }, []);

  useEffect(() => {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      if (themeSetting === 'system') {
        applyThemeToDocument(systemPrefersDark.matches ? 'dark' : 'light');
      } else {
        applyThemeToDocument(themeSetting);
      }
    };

    updateTheme(); // Initial theme application

    // Listen for changes in system preference if themeSetting is 'system'
    const mediaQueryListener = (e: MediaQueryListEvent) => {
      if (themeSetting === 'system') {
        applyThemeToDocument(e.matches ? 'dark' : 'light');
      }
    };

    systemPrefersDark.addEventListener('change', mediaQueryListener);

    return () => {
      systemPrefersDark.removeEventListener('change', mediaQueryListener);
    };
  }, [themeSetting, applyThemeToDocument]);

  const setThemePreference = (preference: ThemeSetting) => {
    localStorage.setItem(APP_THEME_KEY, preference);
    setThemeSettingState(preference);
  };

  const toggleTheme = () => {
    // This toggle logic is simplified: if current setting is dark, go light. Otherwise, go dark.
    // If system, it will toggle between light and dark explicitly, overriding system for that choice.
    const newSetting = appliedTheme === 'dark' ? 'light' : 'dark';
    setThemePreference(newSetting);
  };
  
  return (
    <ThemeContext.Provider value={{ appliedTheme, themeSetting, setThemePreference, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};