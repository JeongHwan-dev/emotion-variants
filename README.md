<p align="center">
  <a href="https://emotion-variants.org/">
    <img src="https://emotion-variants.org/logo.svg" alt="emotion-variants logo" width="96" height="96" />
  </a>
</p>

<h1 align="center">emotion-variants</h1>

<p align="center">
  Type-safe variant API for <a href="https://emotion.sh/">Emotion</a>.<br />
  Compose component styles with multiple variants — no repetitive <code>css()</code> calls.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/emotion-variants"><img src="https://img.shields.io/npm/v/emotion-variants.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/emotion-variants"><img src="https://img.shields.io/npm/dm/emotion-variants.svg" alt="npm downloads" /></a>
  <a href="https://bundlephobia.com/package/emotion-variants"><img src="https://img.shields.io/bundlephobia/minzip/emotion-variants" alt="bundle size" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
</p>

<p align="center">
  <a href="https://emotion-variants.org/"><strong>Documentation</strong></a> ·
  <a href="https://emotion-variants.org/ko/">한국어</a> ·
  <a href="https://emotion-variants.org/ja/">日本語</a> ·
  <a href="https://emotion-variants.org/zh/">简体中文</a>
</p>

## ✨ Features

- 🎯 **Type-safe variants** - Variant props are inferred from your config; extract them with [`VariantProps`](https://emotion-variants.org/docs/typescript/)
- 🚀 **No `css()` calls needed** - Write plain `CSSObject`s, get styles for the `css` prop
- 🎨 **[Compound variants](https://emotion-variants.org/docs/compound-variants/)** - Style combinations of variants, matching one value or any of several
- 📦 **[Default variants](https://emotion-variants.org/docs/default-variants/)** - Omitted or `undefined` props fall back to sensible defaults
- 🧩 **[Slots](https://emotion-variants.org/docs/slots/)** - Style every part of a multi-part component from one config
- 🧬 **[Extend](https://emotion-variants.org/docs/extending/)** - Build one variant function on top of another
- 📱 **[Responsive variants](https://emotion-variants.org/docs/responsive/)** - Give a variant prop one value per breakpoint with `createEv`
- 🔍 **[Class names](https://emotion-variants.org/docs/ev/)** - Get real class names for `className` props or non-React code

## 📦 Installation

```bash
# npm
npm install emotion-variants @emotion/react @emotion/css

# pnpm
pnpm add emotion-variants @emotion/react @emotion/css

# yarn
yarn add emotion-variants @emotion/react @emotion/css

# bun
bun add emotion-variants @emotion/react @emotion/css
```

Both Emotion packages are required peer dependencies. See [Installation](https://emotion-variants.org/docs/installation/) for setting up the `css` prop.

## 🚀 Quick Start

```tsx
import type { ComponentPropsWithoutRef } from 'react';
import { ev, type VariantProps } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
  },
  variants: {
    size: {
      small: {
        fontSize: 12,
        padding: '8px 16px',
      },
      large: {
        fontSize: 16,
        padding: '12px 24px',
      },
    },
    color: {
      primary: {
        background: '#d36ac2',
        color: 'white',
      },
      secondary: {
        background: '#475569',
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
        fontWeight: 700,
      },
    },
  ],
  defaultVariants: {
    size: 'small',
    color: 'primary',
  },
});

type ButtonProps = ComponentPropsWithoutRef<'button'> & VariantProps<typeof button>;

function Button({ size, color, ...rest }: ButtonProps) {
  return <button css={button({ size, color })} {...rest} />;
}
```

Omitted props fall back to `defaultVariants`, so `<Button>` renders as `small` + `primary`.

## 🧰 Beyond the basics

### Slots

One config styles every part of a component. The call returns one style function per slot.

```tsx
const card = ev({
  slots: {
    root: {
      borderRadius: 12,
      padding: 16,
    },
    title: {
      fontWeight: 600,
    },
  },
  variants: {
    size: {
      large: {
        root: {
          padding: 24,
        },
        title: {
          fontSize: 20,
        },
      },
    },
  },
});

const { root, title } = card({
  size: 'large',
});

<section css={root()}>
  <h3 css={title()}>Weekly report</h3>
</section>;
```

### Extend

Build on an existing variant function. The new one inherits its base, variants, compound variants, and defaults.

```ts
const iconButton = ev({
  extend: button,
  base: {
    width: 44,
    height: 44,
  },
});

iconButton({
  size: 'large',
});
```

### Responsive variants

Declare breakpoints once with `createEv`, and every variant prop accepts one value per breakpoint.

```tsx
import { createEv } from 'emotion-variants';

export const { ev } = createEv({
  breakpoints: {
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
  },
});

<button
  css={button({
    size: {
      initial: 'small',
      md: 'large',
    },
  })}
/>;
```

## 📖 Documentation

Full docs live at **[emotion-variants.org](https://emotion-variants.org/)**.

- **Getting Started** - [Introduction](https://emotion-variants.org/docs/introduction/) · [Installation](https://emotion-variants.org/docs/installation/) · [Quick Start](https://emotion-variants.org/docs/quick-start/)
- **Concepts** - [Variants](https://emotion-variants.org/docs/variants/) · [Default Variants](https://emotion-variants.org/docs/default-variants/) · [Compound Variants](https://emotion-variants.org/docs/compound-variants/) · [Slots](https://emotion-variants.org/docs/slots/) · [Overrides](https://emotion-variants.org/docs/overrides/) · [Extend](https://emotion-variants.org/docs/extending/) · [Responsive](https://emotion-variants.org/docs/responsive/)
- **Guides** - [TypeScript](https://emotion-variants.org/docs/typescript/) · [Migrating to v2](https://emotion-variants.org/docs/migration/)
- **Reference** - [`ev`](https://emotion-variants.org/docs/ev/) · [`createEv`](https://emotion-variants.org/docs/create-ev/) · [Types](https://emotion-variants.org/docs/types/) · [Changelog](https://emotion-variants.org/docs/changelog/)

Using an AI assistant? Point it at [`llms.txt`](https://emotion-variants.org/llms.txt) or [`llms-full.txt`](https://emotion-variants.org/llms-full.txt).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Working on the docs

```bash
pnpm docs:dev     # start the Next.js dev server
pnpm docs:build   # static export to docs/out, then a link check
```

The site is built with [Fumadocs](https://fumadocs.dev). Pages live in `docs/content/docs/<lang>/`: `en` (English), `ko` (Korean), `ja` (Japanese), and `zh` (Simplified Chinese). Keep all of them in sync.

### Releasing

This project uses [changesets](https://github.com/changesets/changesets).

1. After making a change, run `pnpm changeset`, pick a bump type, and write a short summary.
2. Commit the generated file in `.changeset/` along with your change.
3. Once merged into `main`, a `release: version packages` PR is opened automatically, carrying the version bump and the changelog entry.
4. Merging that PR publishes the new version to npm and creates the git tag and GitHub release.

## 📄 License

MIT © [Jeonghwan Park](https://github.com/JeongHwan-dev/emotion-variants/blob/main/LICENSE.md)

## 🔗 Links

- [Documentation](https://emotion-variants.org/)
- [Changelog](https://emotion-variants.org/docs/changelog/)
- [GitHub Repository](https://github.com/JeongHwan-dev/emotion-variants)
- [npm](https://www.npmjs.com/package/emotion-variants)
