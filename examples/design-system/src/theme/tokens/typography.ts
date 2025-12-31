export const fontFamily = {
  roboto:
    'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
} as const;

export const fontSize = {
  xs: '11px',
  sm: '12px',
  md: '14px',
  lg: '16px',
  xl: '18px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '28px',
  '5xl': '32px',
  '6xl': '40px',
  '7xl': '48px',
  '8xl': '64px',
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  none: 1,
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export type FontFamily = keyof typeof fontFamily;

export type FontSize = keyof typeof fontSize;

export type FontWeight = keyof typeof fontWeight;

export type LineHeight = keyof typeof lineHeight;
