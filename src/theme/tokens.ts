/**
 * Echo design tokens. Two full palettes (light/dark) plus shared spacing, radii,
 * and typography. The "Aurora" look leans on a teal→emerald accent, near-black /
 * crisp-white surfaces, high-contrast text, and clear semantic gain/loss colors.
 * Every component reads these via `useTheme().colors`, so the whole app re-themes
 * from this file alone.
 */

export interface Palette {
  bg: string;
  bgElevated: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  primary: string;
  primaryStrong: string;
  primarySoft: string;
  onPrimary: string;
  accent: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  info: string;
  infoSoft: string;
  /** Gradient stops for hero cards. */
  gradient: [string, string];
  /** Category/chart palette. */
  chart: string[];
  shadow: string;
}

export const lightPalette: Palette = {
  bg: '#F6F8FA',
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#EAEEF2',
  border: '#DDE3EA',
  text: '#0B1220',
  textMuted: '#566173',
  textFaint: '#8A94A6',
  primary: '#0F766E',
  primaryStrong: '#0B5D57',
  primarySoft: '#D8F3EE',
  onPrimary: '#FFFFFF',
  accent: '#0D9488',
  success: '#15803D',
  successSoft: '#DCFCE7',
  danger: '#D92D20',
  dangerSoft: '#FEE4E2',
  warning: '#B45309',
  warningSoft: '#FEF0C7',
  info: '#0E7490',
  infoSoft: '#CFF3FB',
  gradient: ['#0D9488', '#047857'],
  chart: ['#0F766E', '#0D9488', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#6366F1', '#EF4444'],
  shadow: '#0B1220',
};

export const darkPalette: Palette = {
  bg: '#08090D',
  bgElevated: '#12141A',
  surface: '#12141A',
  surfaceAlt: '#1C1F27',
  border: '#282C36',
  text: '#F1F4F8',
  textMuted: '#99A2B2',
  textFaint: '#5F6877',
  primary: '#2DD4BF',
  primaryStrong: '#14B8A6',
  primarySoft: '#0E2A28',
  onPrimary: '#04231D',
  accent: '#34D399',
  success: '#34D399',
  successSoft: '#0C2A1E',
  danger: '#FB7185',
  dangerSoft: '#2B1418',
  warning: '#FBBF24',
  warningSoft: '#2A2110',
  info: '#22D3EE',
  infoSoft: '#08272E',
  gradient: ['#0D9488', '#047857'],
  chart: ['#2DD4BF', '#34D399', '#22D3EE', '#5EEAD4', '#FBBF24', '#F472B6', '#818CF8', '#FB7185'],
  shadow: '#000000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -0.5 },
  title: { fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.3 },
  heading: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '500' as const },
  bodyStrong: { fontSize: 15, fontWeight: '700' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  mono: { fontSize: 15, fontWeight: '700' as const },
} as const;

export type TypographyVariant = keyof typeof typography;
