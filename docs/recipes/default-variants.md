# Default Variants

`defaultVariants` lets consumers omit props and still get a styled component. This recipe covers when to use them, common pitfalls, and patterns for sensible defaults.

## Set defaults that match the most common case

If 80% of `<Button>` calls in your codebase use `size: 'medium'` and `color: 'primary'`, those should be the defaults.

```ts
const button = ev({
  variants: {
    size: {
      small: {},
      medium: {},
      large: {},
    },
    color: {
      primary: {},
      secondary: {},
      danger: {},
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});

button();                  // medium primary
button({ size: 'large' }); // large primary
```

## Forward optional props straight through

Each key is resolved with `props[key] ?? defaultVariants[key]`, so `undefined` and `null` both fall back to the default. You can hand an optional prop to the variant function without guarding it.

```tsx
type Props = {
  size?: 'small' | 'medium' | 'large';
};

function Button({ size }: Props) {
  // `size` is undefined when the prop is omitted — 'medium' still applies.
  return <button css={button({ size })}>Click</button>;
}
```

```ts
button({ size: undefined }); // identical to button() — medium primary
```

This means you don't need a prop default (`{ size = 'medium' }`) on top of `defaultVariants`. Pick one place to declare the default, and `defaultVariants` is the one that also covers direct `button()` calls from outside the component.

::: warning
`false` and `0` are valid variant values, so they are used as-is rather than falling back.

```ts
const box = ev({
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

box({ outlined: false }); // border: none, not the default `true` style
```
:::

## Defaults for boolean variants

Use literal `true` / `false`, not the string keys:

```ts
const x = ev({
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
    outlined: false,
  },
});

x(); // applies the `false` style
```

## Defaults play well with compound variants

Defaults seed the variant values used to evaluate compound matches.

```ts
const button = ev({
  variants: {
    size: {
      small: {},
      large: {},
    },
    color: {
      primary: {},
      danger: {},
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
    size: 'large',
    color: 'primary',
  },
});

button(); // bold because defaults satisfy the compound condition
```

## See also

- [Compound Variants](./compound-variants)
- [Core Concepts → defaultVariants](../core-concepts#defaultvariants)
