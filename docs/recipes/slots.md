# Slots

A component is rarely a single element. A card has a root, a title, and a footer, and a variant such as `size` usually restyles several of them at once. `slots` lets one `ev()` call style every part, so the parts share the same variants and can't drift apart.

## Declare the parts

Use `slots` instead of `base`. Each key names a part of the component and holds its base styles.

```ts
import { ev } from 'emotion-variants';

const card = ev({
  slots: {
    root: {
      borderRadius: 12,
      padding: 16,
    },
    title: {
      fontWeight: 600,
    },
    footer: {
      display: 'flex',
      gap: 8,
    },
  },
});
```

Calling `card()` now returns one style function per slot. Call each one where its element is rendered:

```tsx
function Card({ heading, children }: CardProps) {
  const { root, title, footer } = card();

  return (
    <section css={root()}>
      <h3 css={title()}>{heading}</h3>
      <div css={footer()}>{children}</div>
    </section>
  );
}
```

::: warning
A slot is a function, not a style. Write `css={root()}`. Emotion calls a function passed to `css` with the theme, so `css={root}` reads the theme object as the slot's variants.
:::

## Variants per slot

With `slots`, a variant value maps slot names to styles. A value only lists the slots it changes.

```ts
const card = ev({
  slots: {
    root: {
      borderRadius: 12,
      padding: 16,
    },
    title: {
      fontWeight: 600,
    },
    footer: {
      display: 'flex',
      gap: 8,
    },
  },
  variants: {
    size: {
      small: {
        root: {
          padding: 12,
        },
        title: {
          fontSize: 14,
        },
      },
      large: {
        root: {
          padding: 24,
        },
        title: {
          fontSize: 20,
        },
      },
    },
    tone: {
      neutral: {},
      danger: {
        title: {
          color: 'crimson',
        },
      },
    },
  },
  defaultVariants: {
    size: 'small',
    tone: 'neutral',
  },
});

const { root, title, footer } = card({
  size: 'large',
  tone: 'danger',
});
```

One call resolves the variants for every slot. `root()` gets the large padding, `title()` gets the large font size and the danger color, and `footer()` gets only its base styles because no variant mentions it.

## Override a variant for one slot

Each slot function accepts the same variant props as the call. A slot prop wins over the call's props, which win over `defaultVariants`.

```tsx
const { root, title } = card({
  size: 'large',
});

root(); // large
title({
  size: 'small',
}); // small, for the title only
```

As everywhere else, `undefined` falls through to the next level, so forwarding an optional prop to a slot is safe.

## Compound variants

`compoundVariants` works the same way, except that `style` is keyed by slot.

```ts
compoundVariants: [
  {
    variants: {
      size: 'large',
      tone: 'danger',
    },
    style: {
      title: {
        textTransform: 'uppercase',
      },
    },
  },
],
```

Compounds are matched per slot, against the values that slot resolved to. Overriding a variant on one slot can therefore switch a compound on or off for that slot alone:

```ts
const { title } = card({
  tone: 'danger',
});

title(); // small + danger: no compound
title({
  size: 'large',
}); // large + danger: uppercase
```

## The same style on several slots

`compoundSlots` applies one style to a list of slots. It saves repeating the style under each slot name.

```ts
compoundSlots: [
  {
    slots: ['title', 'footer'],
    style: {
      paddingInline: 4,
    },
  },
  {
    slots: ['root', 'footer'],
    variants: {
      size: 'large',
    },
    style: {
      gap: 16,
    },
  },
],
```

`variants` is optional. Without it the entry always applies; with it the entry follows the same matching rules as `compoundVariants`, array conditions included.

## Order

For each slot, styles are appended in this order, and later entries win on CSS conflicts:

1. The slot's base styles from `slots`
2. Matching `variants` entries, in the order the axes were declared
3. Matching `compoundVariants` entries, in array order
4. Matching `compoundSlots` entries, in array order

## Class names

`className()` returns one class name per slot.

```tsx
const classNames = card.className({
  size: 'large',
});

<section className={classNames.root}>
  <h3 className={classNames.title}>Title</h3>
</section>;
```

There is no `classNames` lookup table when `slots` is declared.

## Rules

- `base` and `slots` cannot be combined. Put the styles in a slot, commonly one named `root`.
- A variant value, a compound `style`, and a `compoundSlots` entry may only name declared slots. Anything else is a type error, which catches typos.
- Selectors such as `'&:hover'` go inside a slot's style, not next to the slot names.
- `compoundSlots` requires `slots`.

## Props

[`VariantProps`](./typed-props) works on a slot function too, and gives you the variant props shared by all slots.

```ts
import type { VariantProps } from 'emotion-variants';

type CardVariants = VariantProps<typeof card>;
// { size?: 'small' | 'large'; tone?: 'neutral' | 'danger' }
```

## See also

- [Compound Variants](./compound-variants)
- [API Reference → slots](../reference/ev#slots)
