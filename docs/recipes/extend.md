# Extend

Some components are another component plus a little more: an icon button is a button with a fixed width, a danger card is a card with one more tone. `extend` builds one `ev()` result on top of another, so the shared styles and variants are declared once.

## Build on another function

Pass an `ev()` result as `extend`. The new function inherits everything the parent declared.

```ts
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: 8,
  },
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
      large: {
        fontSize: 16,
      },
    },
    tone: {
      neutral: {
        background: 'gray',
      },
      danger: {
        background: 'crimson',
      },
    },
  },
  defaultVariants: {
    size: 'small',
    tone: 'neutral',
  },
});

const iconButton = ev({
  extend: button,
  base: {
    display: 'inline-flex',
  },
});

iconButton({
  size: 'large',
  tone: 'danger',
});
```

`iconButton` accepts `size` and `tone`, applies the parent's defaults, and adds its own `base` after the parent's. `button` itself is not changed.

## Add values and axes

A child can add values to an inherited axis, add styles to an inherited value, and declare new axes.

```ts
const iconButton = ev({
  extend: button,
  variants: {
    size: {
      large: {
        width: 48,
      },
      huge: {
        fontSize: 24,
      },
    },
    round: {
      true: {
        borderRadius: '50%',
      },
    },
  },
});

iconButton.variants(); // ['size', 'tone', 'round']
```

- `size: 'small'` is inherited as it is.
- `size: 'large'` gets the parent's font size, then the child's width.
- `size: 'huge'` and the `round` axis exist only on `iconButton`.

Inherited axes keep their position, and new axes come after them.

## Defaults and compound variants

`defaultVariants` are merged per axis, and the child's value wins. The child's `compoundVariants` and `defaultVariants` can refer to inherited axes and values.

```ts
const iconButton = ev({
  extend: button,
  variants: {
    round: {
      true: {
        borderRadius: '50%',
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        tone: 'danger',
        round: true,
      },
      style: {
        outline: '2px solid crimson',
      },
    },
  ],
  defaultVariants: {
    size: 'large',
  },
});
```

The parent's compound variants are inherited too, and they are matched against the values the child resolved.

## Order

At every step, the parent's styles come before the child's. Later entries win on CSS conflicts.

1. `base`, parent then child
2. Matching `variants` entries, axis by axis; for each value, parent then child
3. Matching `compoundVariants` entries, parent then child

::: warning
Every compound variant comes after every variant style. So a parent's compound variant still wins over a style the child declares for the same variant value. To override it, add a compound variant with the same condition to the child.
:::

The chain can be as long as you like. Extending `iconButton` again puts `button` first, `iconButton` second, and the new config last.

## With slots

A [slots](./slots) function extends another slots function. The child can add slots, and add styles to inherited slots.

```ts
const card = ev({
  slots: {
    root: {
      padding: 16,
    },
    title: {
      fontWeight: 600,
    },
  },
});

const mediaCard = ev({
  extend: card,
  slots: {
    root: {
      overflow: 'hidden',
    },
    footer: {
      display: 'flex',
    },
  },
});

const { root, title, footer } = mediaCard();
```

A child that declares no `slots` keeps the parent's slots, and its variant values are still keyed by slot name.

## Class names

`className()` includes the inherited styles. In `classNames`, each entry merges the parent's and the child's styles for that key, and a value the child did not touch keeps the parent's class name.

## Rules

- `extend` takes a single `ev()` result. Anything else throws when `ev()` runs. If the value did come from `ev()`, two copies of `emotion-variants` are probably installed.
- A config with `slots` can only extend one with `slots`. Extending a plain function throws, and is a type error.
- When the parent has `slots`, the child cannot use `base`. Put the styles in a slot. This is a type error.

## Props

[`VariantProps`](./typed-props) on an extended function gives you the merged variants.

```ts
import type { VariantProps } from 'emotion-variants';

type IconButtonVariants = VariantProps<typeof iconButton>;
// { size?: 'small' | 'large'; tone?: 'neutral' | 'danger'; round?: true }
```

## See also

- [Slots](./slots)
- [API Reference → extend](../reference/ev#extend)
