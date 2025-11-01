export const colors = {
  // Primary
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#3395FF',

  // Secondary
  secondary: '#5856D6',

  // Status
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#5AC8FA',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',

  // Text
  textPrimary: '#000000',
  textSecondary: '#525252',
  textTertiary: '#A3A3A3',
  textDisabled: '#D4D4D4',

  // Background
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',

  // Border
  border: '#E5E5E5',
  borderDark: '#D4D4D4',
} as const;

export type ColorKeys = keyof typeof colors;
