import { ev } from 'emotion-variants';

import { theme } from '@/theme';

export const buttonStyles = ev({
  base: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[4],
    borderRadius: theme.radius.md,
    fontWeight: theme.fontWeight.semibold,
    lineHeight: theme.lineHeight.none,
    textAlign: 'center',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    userSelect: 'none',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',

    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },

    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${theme.color.semantic.ring.inner}, 0 0 0 4px ${theme.color.semantic.ring.outer}`,
    },
  },

  variants: {
    display: {
      inline: {
        display: 'inline-flex',
        width: 'auto',
      },
      block: {
        display: 'inline-flex',
        width: '100%',
      },
      full: {
        display: 'flex',
        width: '100%',
        borderRadius: theme.radius.none,
      },
    },

    size: {
      small: {
        minHeight: '32px',
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
        fontSize: theme.fontSize.sm,
      },
      medium: {
        minHeight: '38px',
        padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
        fontSize: theme.fontSize.md,
      },
      large: {
        minHeight: '48px',
        padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
        fontSize: theme.fontSize.lg,
      },
      xlarge: {
        minHeight: '56px',
        padding: `${theme.spacing[5]} ${theme.spacing[7]}`,
        fontSize: theme.fontSize.lg,
      },
    },

    variant: {
      fill: {},
      outline: {
        borderWidth: '1px',
        borderStyle: 'solid',
        background: theme.color.semantic.background.neutral,

        '&:hover:not(:disabled)': {
          background: theme.color.semantic.background.neutralHover,
        },

        '&:active:not(:disabled)': {
          background: theme.color.semantic.background.neutralPressed,
        },
      },
      text: {
        background: 'transparent',
        border: 'none',

        '&:hover:not(:disabled)': {
          background: theme.color.semantic.background.neutralHover,
        },

        '&:active:not(:disabled)': {
          background: theme.color.semantic.background.neutralPressed,
        },
      },
    },

    color: {
      primary: {},
      danger: {},
      warning: {},
      dark: {},
    },
  },

  compoundVariants: [
    {
      variants: {
        variant: 'fill',
        color: 'primary',
      },
      style: {
        background: theme.color.palette.primary.main,
        color: theme.color.primitive.white,

        '&:hover:not(:disabled)': {
          background: theme.color.palette.primary.dark,
        },

        '&:disabled': {
          background: theme.color.palette.primary.light,
        },
      },
    },
    {
      variants: {
        variant: 'fill',
        color: 'danger',
      },
      style: {
        background: theme.color.palette.danger.main,
        color: theme.color.primitive.white,

        '&:hover:not(:disabled)': {
          background: theme.color.palette.danger.dark,
        },

        '&:disabled': {
          background: theme.color.palette.danger.light,
        },
      },
    },
    {
      variants: {
        variant: 'fill',
        color: 'warning',
      },
      style: {
        background: theme.color.palette.warning.main,
        color: theme.color.primitive.white,

        '&:hover:not(:disabled)': {
          background: theme.color.palette.warning.dark,
        },

        '&:disabled': {
          background: theme.color.palette.warning.light,
        },
      },
    },
    {
      variants: {
        variant: 'fill',
        color: 'dark',
      },
      style: {
        background: theme.color.palette.dark.main,
        color: theme.color.primitive.white,

        '&:hover:not(:disabled)': {
          background: theme.color.palette.dark.dark,
        },

        '&:disabled': {
          background: theme.color.palette.dark.light,
        },
      },
    },
    {
      variants: {
        variant: 'outline',
        color: 'primary',
      },
      style: {
        color: theme.color.palette.primary.main,
        borderColor: theme.color.palette.primary.main,

        '&:hover:not(:disabled)': {
          borderColor: theme.color.palette.primary.dark,
        },

        '&:disabled': {
          color: theme.color.palette.primary.light,
          borderColor: theme.color.palette.primary.light,
        },
      },
    },
    {
      variants: {
        variant: 'outline',
        color: 'danger',
      },
      style: {
        color: theme.color.palette.danger.main,
        borderColor: theme.color.palette.danger.main,

        '&:hover:not(:disabled)': {
          borderColor: theme.color.palette.danger.dark,
        },

        '&:disabled': {
          color: theme.color.palette.danger.light,
          borderColor: theme.color.palette.danger.light,
        },
      },
    },
    {
      variants: {
        variant: 'outline',
        color: 'warning',
      },
      style: {
        color: theme.color.palette.warning.main,
        borderColor: theme.color.palette.warning.main,

        '&:hover:not(:disabled)': {
          borderColor: theme.color.palette.warning.dark,
        },

        '&:disabled': {
          color: theme.color.palette.warning.light,
          borderColor: theme.color.palette.warning.light,
        },
      },
    },
    {
      variants: {
        variant: 'outline',
        color: 'dark',
      },
      style: {
        color: theme.color.palette.dark.main,
        borderColor: theme.color.palette.dark.main,

        '&:hover:not(:disabled)': {
          borderColor: theme.color.palette.dark.dark,
        },

        '&:disabled': {
          color: theme.color.palette.dark.light,
          borderColor: theme.color.palette.dark.light,
        },
      },
    },
    {
      variants: {
        variant: 'text',
        color: 'primary',
      },
      style: {
        color: theme.color.palette.primary.main,

        '&:hover:not(:disabled)': {
          background: theme.color.semantic.background.neutralHover,
        },

        '&:disabled': {
          color: theme.color.palette.primary.light,
        },
      },
    },
    {
      variants: {
        variant: 'text',
        color: 'danger',
      },
      style: {
        color: theme.color.palette.danger.main,

        '&:hover:not(:disabled)': {
          background: theme.color.semantic.background.neutralHover,
        },

        '&:disabled': {
          color: theme.color.palette.danger.light,
        },
      },
    },
    {
      variants: {
        variant: 'text',
        color: 'warning',
      },
      style: {
        color: theme.color.palette.warning.main,

        '&:hover:not(:disabled)': {
          background: theme.color.semantic.background.neutralHover,
        },

        '&:disabled': {
          color: theme.color.palette.warning.light,
        },
      },
    },
    {
      variants: {
        variant: 'text',
        color: 'dark',
      },
      style: {
        color: theme.color.palette.dark.main,

        '&:hover:not(:disabled)': {
          background: theme.color.semantic.background.neutralHover,
        },

        '&:disabled': {
          color: theme.color.palette.dark.light,
        },
      },
    },
  ],

  defaultVariants: {
    display: 'inline',
    variant: 'fill',
    color: 'primary',
    size: 'xlarge',
  },
});
