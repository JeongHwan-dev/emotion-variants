import { buttonStyles } from './button.styles';
import type { ButtonProps } from './button.types';

export function Button({
  variant = 'fill',
  display = 'inline',
  size = 'xlarge',
  color = 'primary',
  children,
  ...props
}: ButtonProps) {
  return (
    <button css={buttonStyles({ color, variant, display, size })} {...props}>
      {children}
    </button>
  );
}
