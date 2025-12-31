# emotion-variants Design System Example

This example demonstrates how to build a design system using `emotion-variants`.

**Note**: This example is not a complete design system, but rather a **partial implementation of the Button component only**. It is a minimal implementation to understand the core features of `emotion-variants`.


## Project Structure

```
src/
  components/         # Components
    button/           # Button component
    index.ts          # Component exports
  theme/              # Design theme
    tokens/           # Design tokens
    theme.ts          # Theme object
    theme.d.ts        # Theme type definitions
    index.ts          # Theme exports
  App.tsx             # Main application with examples
  main.tsx            # Entry point
```

## Getting Started

### Installation

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

Open your browser to `http://localhost:5173`

### Storybook

Start Storybook:

```bash
pnpm storybook
```

Open your browser to `http://localhost:6006`

Build static Storybook:

```bash
pnpm build-storybook
```
