import type { VariantProps } from 'emotion-variants';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { cardStyles } from './card.styles';

/**
 * Card component props.
 */
export interface CardProps
  extends ComponentPropsWithoutRef<'section'>,
    VariantProps<typeof cardStyles> {
  /** Card title. */
  heading: ReactNode;
  /** Content rendered below the body, such as actions. */
  footer?: ReactNode;
}
