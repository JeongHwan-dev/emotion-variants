# Introduction

`emotion-variants` is a thin layer on top of [`@emotion/react`](https://emotion.sh/) that lets you define every visual permutation of a component — base styles, variants, compound combinations, and defaults — in a **single configuration object**, with full TypeScript inference.

## The problem

A real-world button has multiple visual axes: size, color, fill style, state. With vanilla Emotion, those axes pull your styles into multiple places — a lookup table here, a conditional spread there, a hand-written prop type somewhere else.

```tsx
// Without emotion-variants
import { css } from '@emotion/react';

// 1. Lookup tables, separate from the component
const sizeStyles = {
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
};

const colorStyles = {
  primary: {
    background: 'blue',
    color: 'white',
  },
  danger: {
    background: 'red',
    color: 'white',
  },
};

// 2. Prop types maintained by hand
type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'danger';
};

// 3. Component owns: defaults, composition, and compound logic
function Button({ size = 'medium', color = 'primary' }: ButtonProps) {
  return (
    <button
      css={css({
        borderRadius: 8,
        cursor: 'pointer',
        ...sizeStyles[size],
        ...colorStyles[color],
        // Compound rule leaks into the component
        ...(size === 'large' && color === 'primary' && {
          fontWeight: 'bold',
        }),
      })}
    >
      Click
    </button>
  );
}
```

Adding one new `size` value means touching the lookup table, the prop type union, and — if it participates in a compound rule — the component itself.

## The solution

`emotion-variants` collapses all of that into a single configuration object.

```tsx
// With emotion-variants
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    borderRadius: 8,
    cursor: 'pointer',
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
        background: 'blue',
        color: 'white',
      },
      danger: {
        background: 'red',
        color: 'white',
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        size: 'large',
        color: 'primary',
      },
      style: {
        fontWeight: 'bold',
      },
    },
  ],
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});

type ButtonProps = NonNullable<Parameters<typeof button>[0]>;

function Button({ size, color }: ButtonProps) {
  return <button css={button({ size, color })}>Click</button>;
}
```

Adding a new `size` value? One line, one place: `variants.size`. The prop type updates automatically.

## Side-by-side

| | Without `emotion-variants` | With `emotion-variants` |
|---|---|---|
| Style definition | Lookup tables, scattered files | Single config object |
| Variant prop types | Hand-written union | Inferred from config |
| Compound rules | Inline conditional in component | `compoundVariants` array |
| Default values | Function-argument defaults | `defaultVariants` |
| Add a new variant value | Touch lookup + type + component | Touch `variants` |
| Generated class names | Not exposed | `button.classNames` |
| New consumer reading the code | Reads 3 files to understand styling | Reads 1 object |

## When not to use it

- If your component has zero or one variant, plain `css()` is simpler.
- If you need runtime theming with arbitrary CSS variables resolved per render, `emotion-variants` works but you may want to lean more on Emotion's `theme` directly.

## Next steps

- [Install](./installation) the package and peer dependencies.
- Walk through [Getting Started](./getting-started) to build your first component.
- Read [Core Concepts](./core-concepts) to understand `base` / `variants` / `compoundVariants` / `defaultVariants`.
