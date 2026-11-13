# Typed Props

`emotion-variants` already infers variant types from your configuration. This recipe shows how to **derive React component props** from an `ev()` result so your component's prop types and styles stay in sync.

## The `VariantProps` type

`emotion-variants` exports `VariantProps`. Give it the type of any `ev()` result and it hands you the variants:

```ts
import { ev, type VariantProps } from 'emotion-variants';

const button = ev({
  variants: {
    size: {
      small: {},
      medium: {},
      large: {},
    },
    color: {
      primary: {},
      danger: {},
    },
  },
});

type ButtonVariants = VariantProps<typeof button>;
// { size?: 'small' | 'medium' | 'large'; color?: 'primary' | 'danger' }
```

Add a new value to `variants.size`, and `ButtonVariants['size']` updates automatically.

## Combining with HTML element props

For a polymorphic button-like component, intersect with `ComponentPropsWithoutRef`:

```tsx
import type { ComponentPropsWithoutRef } from 'react';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariants;

export function Button({ size, color, ...rest }: ButtonProps) {
  return <button css={button({ size, color })} {...rest} />;
}
```

## With sensible defaults

Declare the defaults once, in `defaultVariants`, and forward the props unchanged. An omitted prop arrives as `undefined` and still resolves to the default, so a second set of defaults at the prop boundary would only be a place for the two to drift apart:

```tsx
const button = ev({
  variants: {
    /* ... */
  },
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});

export function Button({ size, color, ...rest }: ButtonProps) {
  return <button css={button({ size, color })} {...rest} />;
}
```

See [Default Variants](./default-variants) for the resolution rules.

## Forwarding refs

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariants;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size, color, ...rest }, ref) => (
    <button ref={ref} css={button({ size, color })} {...rest} />
  ),
);
```

## Extracting only a subset

If you want to expose only some axes as props (e.g., hide `density` from the public API), `Pick` it:

```ts
type PublicButtonProps =
  ComponentPropsWithoutRef<'button'> &
  Pick<ButtonVariants, 'size' | 'color'>;
```

## Re-exporting from your design system

If you maintain a design system package that uses `emotion-variants` internally, export the prop types so consumers don't have to import internal style files:

```ts
// design-system/src/button/index.ts
export { Button } from './button';
export type { ButtonProps } from './button';
```

Consumers import `ButtonProps` from your package and never touch the underlying `ev()` config.

## See also

- [Types](../reference/types)
- [Default Variants](./default-variants)
