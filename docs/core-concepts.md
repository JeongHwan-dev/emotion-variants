# Core Concepts

`ev()` accepts a single configuration object with four optional keys: `base`, `variants`, `compoundVariants`, and `defaultVariants`. This page walks through each.

```ts
ev({
  base,             // styles applied to all variants
  variants,         // axis × value → styles
  compoundVariants, // styles applied when multiple axes match
  defaultVariants,  // fallback values when the consumer omits a prop
});
```

## `base`

`base` styles are applied to every call of the variant function. Use it for properties that don't depend on any variant.

```ts
const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
});

button(); // applies only base styles
```

`base` accepts a single `CSSObject` and supports Emotion's full syntax — nested selectors, pseudo-classes, media queries, keyframes via `@keyframes`, etc.

```ts
const button = ev({
  base: {
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
});
```

## `variants`

`variants` is a record of axes. Each axis maps from a value to a `CSSObject`.

```ts
const button = ev({
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
      medium: {
        fontSize: 14,
      },
      large: {
        fontSize: 16,
      },
    },
    color: {
      primary: {
        background: 'blue',
        color: 'white',
      },
      secondary: {
        background: 'gray',
        color: 'white',
      },
    },
  },
});

button({ size: 'large', color: 'primary' });
```

Variant values can be **strings**, **numbers**, or **booleans**:

```ts
const panel = ev({
  variants: {
    color: {
      red: {
        color: 'red',
      },
      blue: {
        color: 'blue',
      },
    },
    level: {
      1: {
        zIndex: 1,
      },
      2: {
        zIndex: 2,
      },
    },
    outlined: {
      true: {
        border: '1px solid',
      },
      false: {
        border: 'none',
      },
    },
  },
});

panel({ color: 'red', level: 2, outlined: true });
```

::: info
Boolean variant values use the literal string keys `'true'` and `'false'` in the configuration, but you pass actual booleans (`true` / `false`) when calling the function.
:::

## `compoundVariants`

A compound variant applies styles only when **multiple axes** match specific values. Useful for "X looks different when it's also Y" patterns.

```ts
const button = ev({
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
      large: {
        fontSize: 16,
      },
    },
    color: {
      primary: {
        background: 'blue',
      },
      danger: {
        background: 'red',
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
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      },
    },
  ],
});

button({ size: 'large', color: 'primary' }); // includes the compound style
button({ size: 'small', color: 'primary' }); // does NOT include it
```

Compound variants are evaluated in array order and stacked **after** the matching simple variants, so they can safely override.

## `defaultVariants`

`defaultVariants` sets fallback values used when the consumer omits a variant.

```ts
const button = ev({
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
      large: {
        fontSize: 16,
      },
    },
    color: {
      primary: {},
      secondary: {},
    },
  },
  defaultVariants: {
    size: 'small',
    color: 'primary',
  },
});

button();                  // size: 'small', color: 'primary'
button({ size: 'large' }); // size: 'large', color: 'primary'
```

Defaults are resolved per key with `??`, so an explicit `undefined` falls back to the default too. This is what makes React prop forwarding work — an omitted prop arrives as `undefined`, and you still get the default.

```ts
button({ size: undefined }); // identical to button() — size: 'small', color: 'primary'
```

::: warning
`false` and `0` are real variant values, not missing ones, so they do **not** fall back:

```ts
const badge = ev({
  variants: {
    outlined: {
      true: {
        border: '1px solid',
      },
      false: {
        border: 'none',
      },
    },
  },
  defaultVariants: {
    outlined: true,
  },
});

badge({ outlined: false }); // border: none — the default is not applied
```
:::

## Style precedence

For a given call, styles are appended in this order (later wins on CSS conflicts):

1. `base`
2. Each matching simple `variants` entry, in the order keys appear in `variants`
3. Each matching `compoundVariants` entry, in array order

## Next

- [API Reference](./reference/ev) — the complete `ev()` signature and return value.
- [Compound Variants](./recipes/compound-variants) — styles that apply only to a combination.
