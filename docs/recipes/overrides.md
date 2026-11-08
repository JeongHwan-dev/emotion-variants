# Overrides

Sometimes one instance needs a style that doesn't belong on any axis — a button that stretches full width in a form, a card with a one-off margin. `ev()` has no `class` or `css` escape hatch in its config, so overrides happen at the call site.

## Usage

### Append styles to the `css` prop

The variant function returns `SerializedStyles[]`, and Emotion's `css` prop accepts arrays. Put your extra styles **after** the variant result and they win.

```tsx
<button css={[button({ size: 'large' }), { width: '100%' }]}>Submit</button>;
```

Emotion flattens nested arrays, so spreading is optional. Both forms behave identically:

```tsx
<button css={[...button({ size: 'large' }), { width: '100%' }]}>Submit</button>;
```

Order is the whole mechanism — Emotion concatenates in array order and the last declaration of a property wins. Put the override first and it loses:

```tsx
// ✗ `width` is overwritten by base/variant styles
<button css={[{ width: '100%' }, button({ size: 'large' })]}>Submit</button>;

// ✓ the override is last
<button css={[button({ size: 'large' }), { width: '100%' }]}>Submit</button>;
```

### Accept overrides as a prop

Give the component a `css`-shaped prop and append it in the same position. Callers then override without knowing how the styles are built.

```tsx
import type { Interpolation, Theme } from '@emotion/react';

type ButtonProps = NonNullable<Parameters<typeof button>[0]> & {
  children: React.ReactNode;
  css?: Interpolation<Theme>;
};

function Button({ size, color, css: override, children }: ButtonProps) {
  return <button css={[button({ size, color }), override]}>{children}</button>;
}
```

```tsx
<Button size="large" css={{ width: '100%' }}>
  Submit
</Button>
```

### Overriding on `className` surfaces

[`className()`](../reference/ev#classname) returns a single class, so appending another class does **not** reliably win — both classes have the same specificity and the winner is whichever Emotion inserted later.

```tsx
// ✗ ordering is not guaranteed
<button className={`${button.className({ size: 'large' })} ${myClass}`}>Submit</button>;
```

Compose the styles instead of the classes, then turn the result into one class with `@emotion/css`:

```tsx
import { css as cssClassName } from '@emotion/css';

const full = cssClassName(button({ size: 'large' }), { width: '100%' });

<button className={full}>Submit</button>;
```

## When to add a variant instead

Reach for an override when the style belongs to **one call site**. If you write the same override twice, it is an axis:

```ts
// Two call sites both needed full width — make it a variant.
const button = ev({
  variants: {
    size: {
      small: {},
      large: {},
    },
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {},
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});
```

That keeps the override path for genuine one-offs and gives the repeated case a name, a type, and a class name.

## See also

- [Core Concepts → Style precedence](../core-concepts#style-precedence)
- [Compound Variants](./compound-variants) — styles for a combination, not a single instance
