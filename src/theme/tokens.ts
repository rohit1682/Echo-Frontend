/**
 * Echo design tokens. Two full palettes (light/dark) plus shared spacing, radii,
 * and typography. The premium, minimal look leans on an indigo→violet accent,
 * soft surfaces, and clear semantic gain/loss colors.
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
  bg: '#F6F7F9',
  bgElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF0F5',
  border: '#E4E7EE',
  text: '#14151C',
  textMuted: '#6B7180',
  textFaint: '#9AA0AD',
  primary: '#6366F1',
  primaryStrong: '#4F46E5',
  primarySoft: '#EEF0FE',
  onPrimary: '#FFFFFF',
  accent: '#8B5CF6',
  success: '#12A150',
  successSoft: '#E4F7EC',
  danger: '#E5484D',
  dangerSoft: '#FDECEC',
  warning: '#D9820A',
  warningSoft: '#FCF1E1',
  info: '#2563EB',
  infoSoft: '#E7EEFE',
  gradient: ['#6366F1', '#8B5CF6'],
  chart: ['#6366F1', '#8B5CF6', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4', '#EF4444', '#14B8A6'],
  shadow: '#0B1220',
};

export const darkPalette: Palette = {
  bg: '#0A0B0F',
  bgElevated: '#15171F',
  surface: '#15171F',
  surfaceAlt: '#1E212B',
  border: '#282C38',
  text: '#F2F3F7',
  textMuted: '#9BA1AF',
  textFaint: '#6B7180',
  primary: '#818CF8',
  primaryStrong: '#6366F1',
  primarySoft: '#1E2033',
  onPrimary: '#0A0B0F',
  accent: '#A78BFA',
  success: '#3DD68C',
  successSoft: '#122A1E',
  danger: '#FF6369',
  dangerSoft: '#2A1517',
  warning: '#F5A524',
  warningSoft: '#2A2113',
  info: '#5B8DEF',
  infoSoft: '#141F33',
  gradient: ['#6366F1', '#8B5CF6'],
  chart: ['#818CF8', '#A78BFA', '#3DD68C', '#F5A524', '#F472B6', '#22D3EE', '#FF6369', '#2DD4BF'],
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
