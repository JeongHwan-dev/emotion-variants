---
layout: home

hero:
  name: emotion-variants
  text: Type-safe variant API for Emotion
  tagline: Compose component styles with multiple variants — no repetitive css() calls.
  image:
    src: /logo.svg
    alt: emotion-variants
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/JeongHwan-dev/emotion-variants

features:
  - icon: 🎯
    title: Type-safe
    details: Full TypeScript inference for variant keys, values, and compound combinations. No casts, no `any`.
  - icon: 🎨
    title: Compound variants
    details: Apply specific styles only when multiple variants match — like `large` + `primary`.
  - icon: 📦
    title: Default variants
    details: Set sensible defaults so consumers can omit props and still get a styled component.
  - icon: 🚀
    title: Zero runtime overhead
    details: Styles are pre-serialized at definition time. Only the matching class names are applied at render.
  - icon: 🪶
    title: Drop-in for Emotion
    details: Works with `@emotion/react`'s `css` prop. No bundler config, no providers.
  - icon: 🔍
    title: classNames access
    details: Read generated class names directly when integrating with non-React contexts or testing.
---

```tsx
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  variants: {
    size: {
      small: {
        fontSize: '12px',
      },
      large: {
        fontSize: '16px',
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
    size: 'small',
    color: 'primary',
  },
});

type ButtonProps = NonNullable<Parameters<typeof button>[0]> & {
  children: React.ReactNode;
};

function Button({ size, color, children }: ButtonProps) {
  return <button css={button({ size, color })}>{children}</button>;
}
```
