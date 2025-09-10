import React, {createContext, useCallback, useEffect, useMemo, useState} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';
import {getSystemTheme, getThemeColors, ThemeName} from '../theme';

type ThemeContextValue = {
  theme: ThemeName;
  colors: ReturnType<typeof getThemeColors>;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const [theme, setTheme] = useState<ThemeName>(getSystemTheme());

  useEffect(() => {
    const listener = ({colorScheme}: {colorScheme: ColorSchemeName}) => {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    };
    const sub = Appearance.addChangeListener(listener);
    return () => sub.remove();
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const colors = useMemo(() => getThemeColors(theme), [theme]);

  const value = useMemo(() => ({theme, colors, toggle}), [theme, colors, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

