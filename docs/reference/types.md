# Types

Every type `emotion-variants` exports, and when you would reach for it.

```typescript
import type {
  CompoundVariant,
  Ev,
  EvClassNames,
  EvConfig,
  EvFunction,
  EvSlotsFunction,
  EvVariants,
  VariantConfig,
  VariantKeys,
  VariantProps,
  VariantValue,
  VariantValueFor,
} from 'emotion-variants';
```

Most of the time you don't need any of them. Variant types are inferred from the configuration object, so reading props off the function you already have is shorter than naming the generic:

```typescript
type ButtonVariants = VariantProps<typeof button>;
```

See [Typed Props](../recipes/typed-props) for that pattern in full.

## Usage

### `EvConfig<T, N, E>`

The shape of the object you pass to [`ev()`](./ev). Useful for extracting a configuration into its own variable or a factory.

```typescript
import type { EvConfig } from 'emotion-variants';

const config: EvConfig<{ size: { small: { fontSize: number } } }> = {
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
    },
  },
};
```

Every field is optional: `base`, `variants`, `compoundVariants`, `defaultVariants`, [`extend`](./ev#extend), and for [slots](./ev#slots), `slots` and `compoundSlots`.

`N` is the union of slot names. It defaults to `never`, which is the plain form without `slots`.

`E` is the type of the `ev()` result passed as `extend`. It defaults to `undefined`, which is a config that extends nothing.

### `EvFunction<T, B>`

The type of the value [`ev()`](./ev) returns — callable, plus `variants()`, `className()`, and `classNames`.

```typescript
interface EvFunction<T, B extends string = never> {
  (variants?: EvVariants<T, B>): SerializedStyles[];
  variants: () => Array<VariantKeys<T>>;
  className: (variants?: EvVariants<T, B>) => string;
  classNames: EvClassNames<T>;
}
```

`B` is the union of breakpoint names declared with [`createEv`](./create-ev). It defaults to `never`, which is a function that accepts plain values only. `EvSlotsFunction` and `EvVariants` take the same parameter.

### `EvSlotsFunction<N, T, B>`

The type [`ev()`](./ev#slots) returns when the configuration declares `slots`. `N` is the union of slot names.

```typescript
interface EvSlotsFunction<N extends string, T, B extends string = never> {
  (variants?: EvVariants<T, B>): { [K in N]: (slotVariants?: EvVariants<T, B>) => SerializedStyles[] };
  variants: () => Array<VariantKeys<T>>;
  className: (variants?: EvVariants<T, B>) => { [K in N]: string };
}
```

### `Ev<B>`

The type of the `ev` function itself. [`createEv`](./create-ev) returns an `Ev<B>` whose results accept responsive values for the breakpoints `B`, and the `ev` exported from the package is an `Ev<never>`.

```typescript
import { createEv } from 'emotion-variants';
import type { Ev } from 'emotion-variants';

const { ev }: { ev: Ev<'md' | 'lg'> } = createEv({
  breakpoints: {
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
  },
});
```

### `EvVariants<T, B>`

The argument type of the variant function: every axis, optional, narrowed to its declared values. This is what you want when writing a component's props by hand.

```typescript
import type { EvVariants } from 'emotion-variants';

type Variants = EvVariants<{
  size: { small: {}; large: {} };
}>;
// { size?: 'small' | 'large' }

// With breakpoint names, each value can also be given per breakpoint.
type ResponsiveVariants = EvVariants<
  {
    size: { small: {}; large: {} };
  },
  'md' | 'lg'
>;
// { size?: 'small' | 'large' | { initial?: 'small' | 'large'; md?: 'small' | 'large'; lg?: 'small' | 'large' } }
```

### `VariantProps<T>`

The variant props an `ev()` result accepts. Pass it the type of the function, not the configuration.

```typescript
import type { VariantProps } from 'emotion-variants';

type ButtonVariants = VariantProps<typeof button>;
// { size?: 'small' | 'large'; color?: 'primary' | 'secondary' }
```

It resolves to the same type as `EvVariants<T, B>` without you having to name `T` or `B`.

### `EvClassNames<T>`

The shape of [`classNames`](./ev#classnames) — `base` plus a class name per variant value. Keys are the string form of each value.

```typescript
type ClassNames = EvClassNames<{
  outlined: { true: {}; false: {} };
}>;
// { base: string; variants: { outlined: { true: string; false: string } } }
```

### `CompoundVariant<T>`

One entry of `compoundVariants`. Reach for it when you build compound rules in a separate array. Each condition is a single value or [an array of values](../recipes/compound-variants#matching-several-values).

```typescript
import type { CompoundVariant } from 'emotion-variants';

const variants = {
  size: {
    small: {},
    large: {},
  },
  color: {
    primary: {},
    danger: {},
  },
};

const compounds: Array<CompoundVariant<typeof variants>> = [
  {
    variants: {
      size: 'large',
      color: 'primary',
    },
    style: {
      fontWeight: 'bold',
    },
  },
];
```

### `VariantValue`

The value types a variant axis accepts.

```typescript
type VariantValue = string | number | boolean;
```

### `VariantConfig<T>`

The constraint applied to the `variants` field. You rarely write this yourself — it appears in the signature of `ev()` and in the other generic types.

### `VariantKeys<T>`

The union of axis names in a variant configuration.

```typescript
type Keys = VariantKeys<{ size: {}; color: {} }>; // 'size' | 'color'
```

### `VariantValueFor<T, K>`

The valid values for one axis, mapped back from its style-object keys. String keys stay strings, `'true'` and `'false'` become `boolean`, numeric keys become number literals.

```typescript
type Size = VariantValueFor<{ size: { small: {}; large: {} } }, 'size'>;
// 'small' | 'large'

type Outlined = VariantValueFor<{ outlined: { true: {}; false: {} } }, 'outlined'>;
// boolean
```

## Emotion types

`CSSObject` and `SerializedStyles` come from `@emotion/react` and are not re-exported. Import them from Emotion directly when you need them.

```typescript
import type { CSSObject, SerializedStyles } from '@emotion/react';
```
