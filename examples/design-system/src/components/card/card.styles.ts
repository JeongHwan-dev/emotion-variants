import { ev } from 'emotion-variants';

import { theme } from '@/theme';

export const cardStyles = ev({
  slots: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${theme.color.semantic.border.neutral}`,
      borderRadius: theme.radius.lg,
      background: theme.color.semantic.background.neutral,
    },
    title: {
      fontWeight: theme.fontWeight.bold,
      color: theme.color.semantic.foreground.neutral,
    },
    body: {
      lineHeight: theme.lineHeight.normal,
      color: theme.color.semantic.foreground.neutral,
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: theme.spacing[4],
    },
  },

  variants: {
    size: {
      small: {
        root: {
          gap: theme.spacing[4],
          padding: theme.spacing[8],
        },
        title: {
          fontSize: theme.fontSize.lg,
        },
        body: {
          fontSize: theme.fontSize.sm,
        },
      },
      large: {
        root: {
          gap: theme.spacing[8],
          padding: theme.spacing[12],
        },
        title: {
          fontSize: theme.fontSize['2xl'],
        },
        body: {
          fontSize: theme.fontSize.md,
        },
      },
    },

    tone: {
      neutral: {},
      danger: {
        root: {
          borderColor: theme.color.palette.danger.main,
        },
        title: {
          color: theme.color.palette.danger.dark,
        },
      },
    },
  },

  compoundSlots: [
    {
      slots: ['title', 'body'],
      style: {
        margin: 0,
      },
    },
  ],

  defaultVariants: {
    size: 'small',
    tone: 'neutral',
  },
});
