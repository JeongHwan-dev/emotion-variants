# emotion-variants

[![npm version](https://img.shields.io/npm/v/emotion-variants.svg)](https://www.npmjs.com/package/emotion-variants)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Type-safe variant API for Emotion. Create component styles with multiple variants without repetitive `css()` calls.

📖 **[Documentation](https://emotion-variants.org/)** · **[한국어](https://emotion-variants.org/ko/)** · **[日本語](https://emotion-variants.org/ja/)** · **[简体中文](https://emotion-variants.org/zh/)**

## ✨ Features

- 🎯 **Type-safe variants** - Full TypeScript support with automatic type inference
- 🚀 **No `css()` calls needed** - Use plain CSSObject directly
- 🎨 **Compound variants** - Define styles for complex variant combinations
- 📦 **Default variants** - Set sensible defaults easily
- 🔍 **Class names** - Get real class names for `className` props or non-React code
- ⚡ **Emotion integration** - Works seamlessly with @emotion/react

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

## 🚀 Quick Start

```tsx
import type { ComponentPropsWithoutRef } from 'react';
import { ev, type VariantProps } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  variants: {
    size: {
      small: { fontSize: '12px', padding: '8px 16px' },
      large: { fontSize: '16px', padding: '12px 24px' },
    },
    color: {
      primary: { background: 'blue', color: 'white' },
      secondary: { background: 'gray', color: 'white' },
    },
  },
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

## 📖 Documentation

- [Introduction](https://emotion-variants.org/docs/introduction) - what problem this solves
- [Installation](https://emotion-variants.org/docs/installation) - peer dependencies and the `css` prop
- [Quick Start](https://emotion-variants.org/docs/quick-start) - build a `Button` from scratch
- [Variants](https://emotion-variants.org/docs/variants) - `base`, `variants`, and the concepts built on them
- [API Reference](https://emotion-variants.org/docs/ev) - `ev()`, `className()`, `classNames`, `variants()`

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

MIT © [Jeonghwan Park](LICENSE)

## 🔗 Links

- [Documentation](https://emotion-variants.org/)
- [GitHub Repository](https://github.com/JeongHwan-dev/emotion-variants)
- [npm](https://www.npmjs.com/package/emotion-variants)
