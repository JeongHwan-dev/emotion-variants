# Getting Started

This page walks through building a `Button` component with `emotion-variants` from scratch.

It assumes you have already [installed](./installation) the package and enabled Emotion's `css` prop.

## 1. Define the style

Call `ev()` with a single configuration object describing your component's styles:

```tsx
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  },
  variants: {
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      medium: {
        padding: '10px 20px',
        fontSize: 14,
      },
      large: {
        padding: '12px 24px',
        fontSize: 16,
      },
    },
    color: {
      primary: {
        background: '#d36ac2',
        color: 'white',
      },
      secondary: {
        background: '#6c757d',
        color: 'white',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});
```

`ev()` returns a function. Call it with variant values and pass the result to Emotion's `css` prop.

## 2. Use it in a component

```tsx
type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  children: React.ReactNode;
};

export function Button({ size, color, children }: ButtonProps) {
  return <button css={button({ size, color })}>{children}</button>;
}
```

```tsx
<Button>Default</Button>
<Button size="large">Large primary</Button>
<Button size="small" color="secondary">Small secondary</Button>
```

Because `defaultVariants` is set, `<Button>Default</Button>` renders as `medium` + `primary`.

## 3. Derive props from the variant function

You don't have to hand-roll the prop types. Pull them out of the variant function with TypeScript's built-in `Parameters` utility:

```tsx
const button = ev({
  /* ... */
});

type ButtonVariants = NonNullable<Parameters<typeof button>[0]>;

type ButtonProps = ButtonVariants & {
  children: React.ReactNode;
};
```

::: tip
This keeps your component's prop types and styles in sync. Add a new variant value and `ButtonProps` updates automatically.
:::

See the [Typed Props](./recipes/typed-props) for a reusable `VariantProps` helper and patterns for combining with HTML element props.

## What's next

- [Core Concepts](./core-concepts) — `base`, `variants`, `compoundVariants`, `defaultVariants` in depth.
- [API Reference](./reference/ev) — exhaustive `ev()` documentation.
- [Compound Variants](./recipes/compound-variants) — styles that apply only to a combination.
