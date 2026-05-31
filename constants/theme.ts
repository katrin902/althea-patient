export const colors = {
  primary: '#3AABF0',
  primaryDark: '#1A8ED4',
  primaryLight: '#E8F6FE',
  background: '#FAF5ED',
  surface: '#FFFFFF',
  surfaceMuted: '#F5F0E8',
  text: '#1A1A2E',
  textSecondary: '#6E6E82',
  textMuted: '#9898A8',
  border: '#EDE8DF',
  borderLight: '#F2EDE5',
  riskGreen: '#22C55E',
  riskYellow: '#F59E0B',
  riskRed: '#EF4444',
  crisisBackground: '#FEF2F2',
  crisisBorder: '#FECACA',
  crisisText: '#991B1B',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, color: colors.text, lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: '700' as const, color: colors.text, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, color: colors.text, lineHeight: 28 },
  h4: { fontSize: 17, fontWeight: '600' as const, color: colors.text, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.text, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, color: colors.text, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '400' as const, color: colors.textSecondary, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, color: colors.textMuted, lineHeight: 18 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadow = {
  sm: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
};
