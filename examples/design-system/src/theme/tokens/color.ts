const primitiveColor = {
  // Blue
  'blue-50': 'oklch(0.98 0.02 250)',
  'blue-100': 'oklch(0.94 0.05 250)',
  'blue-200': 'oklch(0.88 0.1 250)',
  'blue-300': 'oklch(0.78 0.15 250)',
  'blue-400': 'oklch(0.68 0.18 250)',
  'blue-500': 'oklch(0.58 0.2 250)',
  'blue-600': 'oklch(0.51 0.22 250)',
  'blue-700': 'oklch(0.45 0.23 250)',
  'blue-800': 'oklch(0.39 0.24 250)',
  'blue-900': 'oklch(0.35 0.24 250)',

  // Green
  'green-50': 'oklch(0.99 0.02 150)',
  'green-100': 'oklch(0.91 0.1 150)',
  'green-200': 'oklch(0.85 0.15 150)',
  'green-300': 'oklch(0.78 0.18 150)',
  'green-400': 'oklch(0.71 0.2 150)',
  'green-500': 'oklch(0.64 0.22 150)',
  'green-600': 'oklch(0.58 0.23 150)',
  'green-700': 'oklch(0.53 0.24 150)',
  'green-800': 'oklch(0.48 0.24 150)',
  'green-900': 'oklch(0.44 0.24 150)',

  // Orange
  'orange-50': 'oklch(0.99 0.03 70)',
  'orange-100': 'oklch(0.94 0.08 70)',
  'orange-200': 'oklch(0.89 0.12 70)',
  'orange-300': 'oklch(0.84 0.15 70)',
  'orange-400': 'oklch(0.79 0.17 70)',
  'orange-500': 'oklch(0.74 0.19 70)',
  'orange-600': 'oklch(0.69 0.2 70)',
  'orange-700': 'oklch(0.64 0.21 70)',
  'orange-800': 'oklch(0.59 0.21 70)',
  'orange-900': 'oklch(0.54 0.21 70)',

  // Purple
  'purple-50': 'oklch(0.98 0.02 300)',
  'purple-100': 'oklch(0.91 0.08 300)',
  'purple-200': 'oklch(0.83 0.13 300)',
  'purple-300': 'oklch(0.75 0.17 300)',
  'purple-400': 'oklch(0.67 0.2 300)',
  'purple-500': 'oklch(0.59 0.22 300)',
  'purple-600': 'oklch(0.52 0.23 300)',
  'purple-700': 'oklch(0.46 0.24 300)',
  'purple-800': 'oklch(0.41 0.24 300)',
  'purple-900': 'oklch(0.37 0.24 300)',

  // Red
  'red-50': 'oklch(0.99 0.02 25)',
  'red-100': 'oklch(0.94 0.05 25)',
  'red-200': 'oklch(0.88 0.1 25)',
  'red-300': 'oklch(0.78 0.15 25)',
  'red-400': 'oklch(0.68 0.18 25)',
  'red-500': 'oklch(0.58 0.2 25)',
  'red-600': 'oklch(0.51 0.22 25)',
  'red-700': 'oklch(0.45 0.23 25)',
  'red-800': 'oklch(0.39 0.24 25)',
  'red-900': 'oklch(0.35 0.24 25)',

  // Yellow
  'yellow-50': 'oklch(0.99 0.03 90)',
  'yellow-100': 'oklch(0.97 0.08 90)',
  'yellow-200': 'oklch(0.94 0.12 90)',
  'yellow-300': 'oklch(0.91 0.15 90)',
  'yellow-400': 'oklch(0.88 0.17 90)',
  'yellow-500': 'oklch(0.85 0.18 90)',
  'yellow-600': 'oklch(0.82 0.19 90)',
  'yellow-700': 'oklch(0.77 0.19 90)',
  'yellow-800': 'oklch(0.72 0.19 90)',
  'yellow-900': 'oklch(0.67 0.19 90)',

  // Grey
  'grey-50': 'oklch(0.99 0 0)',
  'grey-100': 'oklch(0.97 0 0)',
  'grey-200': 'oklch(0.92 0 0)',
  'grey-300': 'oklch(0.86 0 0)',
  'grey-400': 'oklch(0.68 0 0)',
  'grey-500': 'oklch(0.5 0 0)',
  'grey-600': 'oklch(0.36 0 0)',
  'grey-700': 'oklch(0.28 0 0)',
  'grey-800': 'oklch(0.18 0 0)',
  'grey-900': 'oklch(0.12 0 0)',

  // Achromatic
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
} as const;

const semanticColor = {
  foreground: {
    neutral: primitiveColor['grey-900'],
    neutralDisabled: primitiveColor['grey-300'],
  },
  background: {
    neutral: primitiveColor.white,
    neutralHover: primitiveColor['grey-100'],
    neutralPressed: primitiveColor['grey-200'],
  },
  border: {
    neutral: primitiveColor['grey-200'],
    neutralHover: primitiveColor['grey-300'],
    neutralPressed: primitiveColor['grey-300'],
  },
  ring: {
    inner: primitiveColor['blue-500'],
    outer: primitiveColor['blue-200'],
  },
} as const;

const paletteColor = {
  primary: {
    main: primitiveColor['blue-500'],
    light: primitiveColor['blue-200'],
    dark: primitiveColor['blue-700'],
  },
  danger: {
    main: primitiveColor['red-500'],
    light: primitiveColor['red-200'],
    dark: primitiveColor['red-700'],
  },
  warning: {
    main: primitiveColor['orange-500'],
    light: primitiveColor['orange-200'],
    dark: primitiveColor['orange-700'],
  },
  dark: {
    main: primitiveColor['grey-700'],
    light: primitiveColor['grey-300'],
    dark: primitiveColor['grey-900'],
  },
} as const;

export const color = {
  primitive: primitiveColor,
  semantic: semanticColor,
  palette: paletteColor,
} as const;

export type SemanticColor = keyof typeof semanticColor;

export type PrimitiveColor = keyof typeof primitiveColor;

export type PaletteColor = keyof typeof paletteColor;

export type Color = keyof typeof color;
