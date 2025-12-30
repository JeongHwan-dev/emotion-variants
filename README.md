# emotion-variants

[![npm version](https://img.shields.io/npm/v/emotion-variants.svg)](https://www.npmjs.com/package/emotion-variants)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Type-safe variant API for Emotion. Create component styles with multiple variants without repetitive `css()` calls.

## ✨ Features

- 🎯 **Type-safe variants** - Full TypeScript support with automatic type inference
- 🚀 **No `css()` calls needed** - Use plain CSSObject directly
- 🎨 **Compound variants** - Define styles for complex variant combinations
- 📦 **Default variants** - Set sensible defaults easily
- 🔍 **classNames access** - Access individual variant class names
- ⚡ **Emotion integration** - Works seamlessly with @emotion/react

## 📦 Installation

```bash
# pnpm
pnpm add emotion-variants @emotion/react

# npm
npm install emotion-variants @emotion/react

# yarn
yarn add emotion-variants @emotion/react
```

## 🚀 Quick Start

```typescript
import { ev } from 'emotion-variants';

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

// Usage
function MyButton() {
  return (
    <button css={button({ size: 'large', color: 'primary' })}>Click me</button>
  );
}
```

## 📖 API Reference

### `ev(config)`

Creates a type-safe variant function.

#### Parameters

##### `config.base`

Base styles applied to all variants.

```typescript
const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '4px',
  },
});
```

##### `config.variants`

Define different variants and their styles.

```typescript
const button = ev({
  variants: {
    size: {
      small: { fontSize: '12px' },
      medium: { fontSize: '14px' },
      large: { fontSize: '16px' },
    },
    color: {
      primary: { background: 'blue' },
      secondary: { background: 'gray' },
    },
  },
});
```

Supports `string`, `number`, and `boolean` variant values:

```typescript
const component = ev({
  variants: {
    // String variants
    color: {
      red: { color: 'red' },
      blue: { color: 'blue' },
    },
    // Number variants
    level: {
      1: { zIndex: 1 },
      2: { zIndex: 2 },
    },
    // Boolean variants
    outlined: {
      true: { border: '1px solid' },
      false: { border: 'none' },
    },
  },
});
```

##### `config.compoundVariants`

Define styles for specific variant combinations.

```typescript
const button = ev({
  variants: {
    size: {
      small: { fontSize: '12px' },
      large: { fontSize: '16px' },
    },
    color: {
      primary: { background: 'blue' },
      danger: { background: 'red' },
    },
  },
  compoundVariants: [
    {
      variants: { size: 'large', color: 'primary' },
      style: {
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      },
    },
  ],
});
```

##### `config.defaultVariants`

Set default variant values.

```typescript
const button = ev({
  variants: {
    size: {
      small: { fontSize: '12px' },
      large: { fontSize: '16px' }
    }
  },
  defaultVariants: {
    size: 'small'
  }
});

// Uses 'small' size by default
<button css={button()}>Click me</button>

// Override default
<button css={button({ size: 'large' })}>Click me</button>
```

#### Return Value

The `ev()` function returns an object with:

##### Main function

```typescript
const button = ev({
  /* config */
});

// Call with variants
button({ size: 'large', color: 'primary' });

// Or use defaults
button();
```

##### `.variants()` method

Returns array of variant keys.

```typescript
const button = ev({
  variants: {
    size: { small: {}, large: {} },
    color: { primary: {}, secondary: {} },
  },
});

button.variants(); // ['size', 'color']
```

##### `.classNames` property

Access individual class names for each variant.

```typescript
const button = ev({
  base: { padding: '10px' },
  variants: {
    size: {
      small: { fontSize: '12px' },
      large: { fontSize: '16px' },
    },
  },
});

button.classNames.base; // Base class name
button.classNames.variants.size.small; // Small size class name
button.classNames.variants.size.large; // Large size class name
```

## 🎨 Examples

### Button Component

```typescript
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s ease',

    '&:hover': {
      transform: 'translateY(-2px)',
    },

    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },

  variants: {
    size: {
      small: { padding: '8px 16px', fontSize: '12px' },
      medium: { padding: '10px 20px', fontSize: '14px' },
      large: { padding: '12px 24px', fontSize: '16px' },
    },

    color: {
      primary: { background: '#007bff', color: 'white' },
      secondary: { background: '#6c757d', color: 'white' },
      danger: { background: '#dc3545', color: 'white' },
    },

    variant: {
      solid: {},
      outlined: {
        background: 'transparent',
        border: '2px solid currentColor',
      },
      ghost: {
        background: 'transparent',
      },
    },
  },

  compoundVariants: [
    {
      variants: { size: 'large', color: 'primary' },
      style: {
        fontWeight: '700',
        boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
      },
    },
  ],

  defaultVariants: {
    size: 'medium',
    color: 'primary',
    variant: 'solid',
  },
});

// Usage
export function Button({ size, color, variant, children, ...props }) {
  return (
    <button css={button({ size, color, variant })} {...props}>
      {children}
    </button>
  );
}
```

### Card Component

```typescript
const card = ev({
  base: {
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease',
  },

  variants: {
    elevation: {
      0: { boxShadow: 'none' },
      1: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' },
      2: { boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)' },
      3: { boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)' },
    },

    padding: {
      none: { padding: '0' },
      small: { padding: '16px' },
      medium: { padding: '24px' },
      large: { padding: '32px' },
    },
  },

  defaultVariants: {
    elevation: 1,
    padding: 'medium',
  },
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Jeonghwan Park](LICENSE)

## 🔗 Links

- [GitHub Repository](https://github.com/JeongHwan-dev/emotion-variants)
- [npm Package](https://www.npmjs.com/package/emotion-variants)
