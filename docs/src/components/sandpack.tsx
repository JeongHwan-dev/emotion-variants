'use client';

import { Sandpack } from '@codesandbox/sandpack-react';
import { useTheme } from 'fumadocs-ui/provider/base';
import { version } from '../../../package.json';

const APP = `/** @jsxImportSource @emotion/react */
import type { ComponentPropsWithoutRef } from 'react';
import { ev, type VariantProps } from 'emotion-variants';

const button = ev({
  base: {
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
  },
  variants: {
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      large: {
        padding: '12px 24px',
        fontSize: 16,
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
        boxShadow: '0 4px 12px rgba(211, 106, 194, 0.4)',
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

export default function App() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button>Default</Button>
      <Button size="large">Large primary</Button>
      <Button size="large" color="secondary">
        Large secondary
      </Button>
    </div>
  );
}
`;

export function EvPlayground() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="not-prose">
      <Sandpack
        template="react-ts"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        files={{
          '/App.tsx': APP,
        }}
        options={{
          showLineNumbers: true,
          showTabs: false,
          editorHeight: 420,
        }}
        customSetup={{
          dependencies: {
            'emotion-variants': version,
            '@emotion/react': '^11',
            '@emotion/css': '^11',
          },
        }}
      />
    </div>
  );
}
