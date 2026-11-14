import { defineConfig } from 'vitepress';

export const en = defineConfig({
  lang: 'en-US',
  description:
    'Type-safe variant API for Emotion. Create component styles with multiple variants without repetitive css() calls.',
  themeConfig: {
    nav: [
      {
        text: 'Guide',
        link: '/intro',
        activeMatch: '^/(intro|installation|getting-started|core-concepts|recipes)',
      },
      {
        text: 'Reference',
        link: '/reference/ev',
        activeMatch: '^/(reference/|migration)',
      },
      {
        text: 'v2.0.0',
        items: [
          {
            text: 'Changelog',
            link: 'https://github.com/JeongHwan-dev/emotion-variants/blob/main/CHANGELOG.md',
          },
          {
            text: 'npm',
            link: 'https://www.npmjs.com/package/emotion-variants',
          },
        ],
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            {
              text: 'Introduction',
              link: '/intro',
            },
            {
              text: 'Installation',
              link: '/installation',
            },
            {
              text: 'Getting Started',
              link: '/getting-started',
            },
            {
              text: 'Core Concepts',
              link: '/core-concepts',
            },
            {
              text: 'Compound Variants',
              link: '/recipes/compound-variants',
            },
            {
              text: 'Default Variants',
              link: '/recipes/default-variants',
            },
            {
              text: 'Overrides',
              link: '/recipes/overrides',
            },
            {
              text: 'Typed Props',
              link: '/recipes/typed-props',
            },
            {
              text: 'Slots',
              link: '/recipes/slots',
            },
            {
              text: 'Extend',
              link: '/recipes/extend',
            },
          ],
        },
        {
          text: 'Reference',
          items: [
            {
              text: 'ev',
              link: '/reference/ev',
            },
            {
              text: 'Types',
              link: '/reference/types',
            },
            {
              text: 'Migrating to v2',
              link: '/migration',
            },
          ],
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/JeongHwan-dev/emotion-variants/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
    },
    outline: {
      label: 'On this page',
    },
    lastUpdated: {
      text: 'Last updated',
    },
    darkModeSwitchLabel: 'Appearance',
    sidebarMenuLabel: 'Menu',
    returnToTopLabel: 'Return to top',
    langMenuLabel: 'Change language',
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Jeonghwan Park',
    },
  },
});
