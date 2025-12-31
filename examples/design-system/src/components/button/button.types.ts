import type { ComponentPropsWithoutRef } from 'react';
import type { PaletteColor } from '@/theme';

/**
 * Button style variant.
 */
export type ButtonVariant = 'fill' | 'outline' | 'text';

/**
 * Button display mode.
 */
export type ButtonDisplay = 'inline' | 'block' | 'full';

/**
 * Button size.
 */
export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Button color variant.
 */
export type ButtonColor = PaletteColor;

/**
 * Button component props.
 */
export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Button style variant. @default 'fill' */
  variant?: ButtonVariant;
  /** Button display mode. @default 'inline' */
  display?: ButtonDisplay;
  /** Button size. @default 'xlarge' */
  size?: ButtonSize;
  /** Button color variant. @default 'primary' */
  color?: ButtonColor;
}
