# emotion-variants

[![npm version](https://img.shields.io/npm/v/emotion-variants.svg)](https://www.npmjs.com/package/emotion-variants)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Type-safe variant API for Emotion. Create component styles with multiple variants without repetitive `css()` calls.

📖 **[Documentation](https://emotion-variants.org/)** · **[한국어](https://emotion-variants.org/ko/)**

## ✨ Features

- 🎯 **Type-safe variants** - Full TypeScript support with automatic type inference
- 🚀 **No `css()` calls needed** - Use plain CSSObject directly
- 🎨 **Compound variants** - Define styles for complex variant combinations
- 📦 **Default variants** - Set sensible defaults easily
- 🔍 **Class names** - Get real class names for `className` props or non-React code
- ⚡ **Emotion integration** - Works seamlessly with @emotion/react

## 📦 Installation

```bash
# pnpm
pnpm add emotion-variants @emotion/react @emotion/css

# npm
npm install emotion-variants @emotion/react @emotion/css

# yarn
yarn add emotion-variants @emotion/react @emotion/css
```

## 🚀 Quick Start

```tsx
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

type ButtonProps = VariantProps<typeof button> & {
  children: React.ReactNode;
};

function Button({ size, color, children }: ButtonProps) {
  return <button css={button({ size, color })}>{children}</button>;
}
```

Omitted props fall back to `defaultVariants`, so `<Button>` renders as `small` + `primary`.

## 📖 Documentation

- [Introduction](https://emotion-variants.org/intro) - what problem this solves
- [Installation](https://emotion-variants.org/installation) - peer dependencies and the `css` prop
- [Getting Started](https://emotion-variants.org/getting-started) - build a `Button` from scratch
- [Core Concepts](https://emotion-variants.org/core-concepts) - `base`, `variants`, `compoundVariants`, `defaultVariants`
- [API Reference](https://emotion-variants.org/reference/ev) - `ev()`, `className()`, `classNames`, `variants()`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Working on the docs

```bash
pnpm docs:dev     # start the VitePress dev server
pnpm docs:build   # production build
```

Pages live in `docs/` (English) and `docs/ko/` (Korean). Keep both in sync.

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
