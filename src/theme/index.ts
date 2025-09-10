import {darkColors, lightColors} from './colors';
import {Appearance} from 'react-native';

export type ThemeName = 'light' | 'dark';

export const getSystemTheme = (): ThemeName => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
};

export const getThemeColors = (theme: ThemeName) =>
  theme === 'dark' ? darkColors : lightColors;

