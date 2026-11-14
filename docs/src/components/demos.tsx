/** @jsxImportSource @emotion/react */
'use client';

import { createEv, ev } from 'emotion-variants';

// Generated with the MDX snippets they render; keep the two in sync.

const variantsButton = ev({
  base: {
    border: '1px solid transparent',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  variants: {
    variant: {
      filled: {
        background: 'var(--button-color)',
        color: 'white',
      },
      outlined: {
        background: 'transparent',
        borderColor: 'var(--button-color)',
        color: 'var(--button-color)',
      },
      text: {
        background: 'transparent',
        color: 'var(--button-color)',
      },
    },
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      medium: {
        padding: '10px 20px',
        fontSize: 14,
      },
      large: {
        padding: '12px 24px',
        fontSize: 16,
      },
    },
    color: {
      primary: {
        '--button-color': '#d36ac2',
      },
      secondary: {
        '--button-color': '#475569',
      },
    },
  },
});

const defaultsButton = ev({
  base: {
    border: '1px solid transparent',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  variants: {
    variant: {
      filled: {
        background: 'var(--button-color)',
        color: 'white',
      },
      outlined: {
        background: 'transparent',
        borderColor: 'var(--button-color)',
        color: 'var(--button-color)',
      },
      text: {
        background: 'transparent',
        color: 'var(--button-color)',
      },
    },
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      medium: {
        padding: '10px 20px',
        fontSize: 14,
      },
      large: {
        padding: '12px 24px',
        fontSize: 16,
      },
    },
    color: {
      primary: {
        '--button-color': '#d36ac2',
      },
      secondary: {
        '--button-color': '#475569',
      },
    },
  },
  defaultVariants: {
    variant: 'filled',
    size: 'medium',
    color: 'primary',
  },
});

const compoundButton = ev({
  base: {
    border: '1px solid transparent',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  variants: {
    variant: {
      filled: {
        background: 'var(--button-color)',
        color: 'white',
      },
      outlined: {
        background: 'transparent',
        borderColor: 'var(--button-color)',
        color: 'var(--button-color)',
      },
      text: {
        background: 'transparent',
        color: 'var(--button-color)',
      },
    },
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      medium: {
        padding: '10px 20px',
        fontSize: 14,
      },
      large: {
        padding: '12px 24px',
        fontSize: 16,
      },
    },
    color: {
      primary: {
        '--button-color': '#d36ac2',
      },
      secondary: {
        '--button-color': '#475569',
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        variant: 'filled',
        size: 'large',
        color: 'primary',
      },
      style: {
        boxShadow: '0 4px 12px rgba(211, 106, 194, 0.4)',
      },
    },
  ],
  defaultVariants: {
    variant: 'filled',
    size: 'medium',
    color: 'primary',
  },
});

const card = ev({
  slots: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: 320,
      border: '1px solid #e4e4e7',
      borderRadius: 12,
      background: 'white',
      color: '#09090b',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    title: {
      fontWeight: 600,
    },
    footer: {
      display: 'flex',
      gap: 8,
      fontSize: 14,
      color: '#71717a',
    },
  },
  variants: {
    size: {
      small: {
        root: {
          padding: 16,
        },
        title: {
          fontSize: 16,
        },
      },
      large: {
        root: {
          padding: 24,
        },
        title: {
          fontSize: 18,
        },
      },
    },
    tone: {
      neutral: {},
      accent: {
        title: {
          color: '#d36ac2',
        },
      },
    },
  },
  defaultVariants: {
    size: 'small',
    tone: 'neutral',
  },
});

const iconButton = ev({
  extend: defaultsButton,
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
});

const responsive = createEv({
  breakpoints: {
    md: '@media (min-width: 768px)',
  },
});

const responsiveButton = responsive.ev({
  base: {
    border: '1px solid transparent',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  variants: {
    variant: {
      filled: {
        background: 'var(--button-color)',
        color: 'white',
      },
      outlined: {
        background: 'transparent',
        borderColor: 'var(--button-color)',
        color: 'var(--button-color)',
      },
      text: {
        background: 'transparent',
        color: 'var(--button-color)',
      },
    },
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      medium: {
        padding: '10px 20px',
        fontSize: 14,
      },
      large: {
        padding: '12px 24px',
        fontSize: 16,
      },
    },
    color: {
      primary: {
        '--button-color': '#d36ac2',
      },
      secondary: {
        '--button-color': '#475569',
      },
    },
  },
  defaultVariants: {
    variant: 'filled',
    size: 'medium',
    color: 'primary',
  },
});

export const DEMOS = {
  variants: () => (
    <>
      <button
        type="button"
        css={variantsButton({
          variant: 'filled',
          size: 'medium',
          color: 'primary',
        })}
      >
        Filled
      </button>
      <button
        type="button"
        css={variantsButton({
          variant: 'outlined',
          size: 'medium',
          color: 'primary',
        })}
      >
        Outlined
      </button>
      <button
        type="button"
        css={variantsButton({
          variant: 'text',
          size: 'medium',
          color: 'primary',
        })}
      >
        Text
      </button>
    </>
  ),
  'default-variants': () => (
    <>
      <button type="button" css={defaultsButton()}>
        Default
      </button>
      <button
        type="button"
        css={defaultsButton({
          variant: 'outlined',
        })}
      >
        Outlined
      </button>
      <button
        type="button"
        css={defaultsButton({
          size: 'small',
        })}
      >
        Small
      </button>
    </>
  ),
  'compound-variants': () => (
    <>
      <button
        type="button"
        css={compoundButton({
          size: 'large',
          color: 'primary',
        })}
      >
        Large primary
      </button>
      <button
        type="button"
        css={compoundButton({
          size: 'large',
          color: 'secondary',
        })}
      >
        Large secondary
      </button>
    </>
  ),
  slots: () => {
    const { root, title, footer } = card({
      size: 'large',
      tone: 'accent',
    });

    return (
      <div css={root()}>
        <h3 css={title()}>Weekly report</h3>
        <div css={footer()}>Updated 2 hours ago</div>
      </div>
    );
  },
  overrides: () => (
    <>
      <button
        type="button"
        css={[
          defaultsButton({
            size: 'large',
          }),
          {
            width: '100%',
          },
        ]}
      >
        Submit
      </button>
    </>
  ),
  extending: () => (
    <>
      <button type="button" css={defaultsButton()}>
        Button
      </button>
      <button type="button" aria-label="Close" css={iconButton()}>
        ✕
      </button>
    </>
  ),
  responsive: () => (
    <>
      <button
        type="button"
        css={responsiveButton({
          size: {
            initial: 'small',
            md: 'large',
          },
        })}
      >
        Small below 768px, large above
      </button>
    </>
  ),
};
