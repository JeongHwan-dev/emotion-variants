import type { VariantProps } from 'emotion-variants';
import type { ComponentPropsWithoutRef } from 'react';
import type { buttonStyles } from './button.styles';

type ButtonVariants = Required<VariantProps<typeof buttonStyles>>;

/**
 * Button style variant.
 */
export type ButtonVariant = ButtonVariants['variant'];

/**
 * Button display mode.
 */
export type ButtonDisplay = ButtonVariants['display'];

/**
 * Button size.
 */
export type ButtonSize = ButtonVariants['size'];

/**
 * Button color variant.
 */
export type ButtonColor = ButtonVariants['color'];

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
