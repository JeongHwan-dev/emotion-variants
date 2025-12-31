import { color, fontFamily, fontSize, fontWeight, lineHeight, radius, spacing } from './tokens';

export const theme = {
  color,
  radius,
  spacing,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
} as const;

export type Theme = typeof theme;
