# Compound Variants

Compound variants apply styles only when the variant values you list all match. They're the answer to "I want this style only when `variant: 'outlined'` *and* `color: 'danger'`." Listing a single axis is allowed too — it then behaves like a variant style that is applied after all the others.

## When to reach for them

Use a compound variant when:

- A style depends on two or more axes simultaneously.
- Expressing the style as a single-axis variant would force you to invent a new axis or duplicate values.
- Conditional CSS inside the component (`size === 'lg' && color === 'primary' && ...`) is creeping in.

If a style depends on only one axis, put it directly in `variants` — compound variants are for the cross-product.

## Pattern: filled / outlined / text × color

A common design system pattern: the same set of colors styled three ways.

```ts
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    border: 'none',
  },

  variants: {
    variant: {
      filled: {},
      outlined: {
        background: 'transparent',
        border: '2px solid currentColor',
      },
      text: {
        background: 'transparent',
      },
    },
    color: {
      primary: {},
      danger: {},
    },
  },

  compoundVariants: [
    // Filled
    {
      variants: {
        variant: 'filled',
        color: 'primary',
      },
      style: {
        background: '#d36ac2',
        color: 'white',
      },
    },
    {
      variants: {
        variant: 'filled',
        color: 'danger',
      },
      style: {
        background: '#dc3545',
        color: 'white',
      },
    },

    // Outlined
    {
      variants: {
        variant: 'outlined',
        color: 'primary',
      },
      style: {
        color: '#d36ac2',
      },
    },
    {
      variants: {
        variant: 'outlined',
        color: 'danger',
      },
      style: {
        color: '#dc3545',
      },
    },

    // Text
    {
      variants: {
        variant: 'text',
        color: 'primary',
      },
      style: {
        color: '#d36ac2',
      },
    },
    {
      variants: {
        variant: 'text',
        color: 'danger',
      },
      style: {
        color: '#dc3545',
      },
    },
  ],

  defaultVariants: {
    variant: 'filled',
    color: 'primary',
  },
});
```

The `color` variant has empty objects in `variants` because the styling only makes sense **in combination** with `variant`. Compound variants carry the actual values.

## Pattern: size × density override

Sometimes a compound variant tweaks a base property only at a specific intersection.

```ts
const card = ev({
  base: {
    padding: 16,
    borderRadius: 12,
  },
  variants: {
    size: {
      sm: {
        padding: 12,
      },
      md: {
        padding: 16,
      },
      lg: {
        padding: 24,
      },
    },
    density: {
      comfortable: {},
      compact: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        size: 'lg',
        density: 'compact',
      },
      style: {
        padding: 16,
      },
    },
  ],
});
```

Only the `lg + compact` corner overrides the size's natural padding.

## Matching several values {#matching-several-values}

A condition can be an array. It matches when the variant has **any** of the listed values, so one entry covers what would otherwise be a copy per value.

```ts
const button = ev({
  variants: {
    variant: {
      filled: {},
      outlined: {},
      text: {},
    },
    color: {
      primary: {},
      danger: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        variant: ['outlined', 'text'],
        color: 'danger',
      },
      style: {
        color: 'crimson',
      },
    },
  ],
});

button({ variant: 'outlined', color: 'danger' }); // includes the compound style
button({ variant: 'text', color: 'danger' }); // includes it too
button({ variant: 'filled', color: 'danger' }); // does NOT include it
```

Axes are still combined with AND. Every listed axis has to match; an array only widens what counts as a match for its own axis. An empty array never matches.

## Order matters

Compound variants are appended **after** simple variants for each call, in the order they appear in the array. If two compound variants both match and set the same property, the later one wins.

```ts
compoundVariants: [
  {
    variants: {
      size: 'lg',
    },
    style: {
      fontWeight: 600,
    },
  },
  {
    variants: {
      size: 'lg',
      color: 'primary',
    },
    style: {
      fontWeight: 700, // overrides the entry above
    },
  },
],
```

::: tip
You can include compound variants that match only a **single** axis. They behave like normal variants but are useful when you want to keep all "conditional" rules in one place.
:::

## See also

- [Default Variants](./default-variants)
- [Core Concepts → compoundVariants](../core-concepts#compoundvariants)
