# Installation

## Requirements

- **React** 16.8 or newer (Hooks era)
- **`@emotion/react`** 11.x
- **`@emotion/css`** 11.x

## Install

::: code-group

```sh [pnpm]
pnpm add emotion-variants @emotion/react @emotion/css
```

```sh [npm]
npm install emotion-variants @emotion/react @emotion/css
```

```sh [yarn]
yarn add emotion-variants @emotion/react @emotion/css
```

:::

Both Emotion packages are peer dependencies and must be installed alongside `emotion-variants`. `@emotion/react` serializes your styles for the `css` prop; `@emotion/css` backs [`className()` and `classNames`](./reference/ev#classname). `@emotion/css` is imported unconditionally, so it is required even if you only ever use the `css` prop.

## Enable the `css` prop

`emotion-variants` returns values you pass to Emotion's `css` prop. Make sure your project is set up to use it. The simplest setup is the JSX import-source pragma:

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsxImportSource": "@emotion/react"
  }
}
```

Or per file:

```tsx
/** @jsxImportSource @emotion/react */
```

See [Emotion's installation guide](https://emotion.sh/docs/css-prop) for other setups (Babel plugin, Next.js, Vite, etc.).

## Verify

Create a tiny component and render it. If TypeScript autocompletes `size` and `color` inside `button({ ... })`, you're good to go.

```tsx
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '8px 16px',
  },
  variants: {
    size: {
      sm: {
        fontSize: 12,
      },
      lg: {
        fontSize: 16,
      },
    },
  },
});

type ButtonProps = NonNullable<Parameters<typeof button>[0]> & {
  children: React.ReactNode;
};

export function Button({ size, children }: ButtonProps) {
  return <button css={button({ size })}>{children}</button>;
}
```

Next: [Getting Started](./getting-started).
