import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '../constants/theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(systemColorScheme === 'dark' ? DarkTheme : LightTheme);
  const [themeMode, setThemeMode] = useState('system');

  useEffect(() => {
    if (themeMode === 'system') {
      setTheme(systemColorScheme === 'dark' ? DarkTheme : LightTheme);
    }
  }, [systemColorScheme, themeMode]);

  const toggleTheme = (mode) => {
    if (mode) {
      setThemeMode(mode);
      if (mode === 'dark') {
        setTheme(DarkTheme);
      } else if (mode === 'light') {
        setTheme(LightTheme);
      } else {
        setTheme(systemColorScheme === 'dark' ? DarkTheme : LightTheme);
      }
    } else {
      // Toggle between light and dark
      const newMode = themeMode === 'light' ? 'dark' : 'light';
      setThemeMode(newMode);
      setTheme(newMode === 'dark' ? DarkTheme : LightTheme);
    }
  };

  const value = {
    theme,
    themeMode,
    toggleTheme,
    isDark: theme === DarkTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};