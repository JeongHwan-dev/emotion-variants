# createEv

Creates an `ev` function whose variant props accept one value per breakpoint.

```typescript
const { ev } = createEv(options);
```

## Usage

### `createEv(options)` {#create-ev-options}

Use `createEv` when a variant should change with the width of the screen. Declare the breakpoints once, export the `ev` it returns, and use that `ev` across your app.

```typescript
import { createEv } from 'emotion-variants';

export const { ev } = createEv({
  breakpoints: {
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
  },
});
```

#### Parameters

- `options.breakpoints` (`Record<string, string>`, optional): Media queries keyed by breakpoint name, from the smallest width to the largest. `initial` cannot be a name, and a name must not look like a number.

#### Returns

(`{ ev: Ev<B> }`): An object holding an `ev` function. It takes the same configuration as [`ev`](./ev), and the functions it returns accept [responsive values](#responsive-values). Without `breakpoints` it behaves like the `ev` exported from the package, which is `createEv().ev`.

### Responsive values {#responsive-values}

Every variant prop of a function made by this `ev` takes a value, or an object with one value per breakpoint.

```typescript
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
  },
  defaultVariants: {
    size: 'small',
  },
});

button({
  size: {
    initial: 'small',
    md: 'large',
  },
});
```

- `initial`: The value outside any media query. When omitted, the axis's default variant is used.
- A breakpoint name: The value inside that breakpoint's media query. An omitted breakpoint adds nothing.

The styles are added where the axis sits in the usual order: the `initial` styles first, then one style per breakpoint in the order the breakpoints were declared. A breakpoint style is serialized the first time its value is used and reused afterwards.

An axis that received a responsive value matches no compound variant in that call, even when the object only has `initial`.

`className()` and, with [slots](./ev#slots), each slot function accept the same values. `defaultVariants` does not.

See [Responsive](../recipes/responsive) for the ordering rules and the limits.

## Types

See [Types](./types) for `Ev`, `EvFunction`, and `EvVariants`, which carry the breakpoint names as their last type parameter.
