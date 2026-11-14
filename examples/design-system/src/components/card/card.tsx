import { cardStyles } from './card.styles';
import type { CardProps } from './card.types';

export function Card({ size, tone, heading, footer, children, ...props }: CardProps) {
  const styles = cardStyles({
    size,
    tone,
  });

  return (
    <section css={styles.root()} {...props}>
      <h3 css={styles.title()}>{heading}</h3>
      <div css={styles.body()}>{children}</div>
      {footer && <div css={styles.footer()}>{footer}</div>}
    </section>
  );
}
