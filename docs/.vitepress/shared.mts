import container from 'markdown-it-container';
import { defineConfig } from 'vitepress';
import { renderSandbox } from 'vitepress-plugin-sandpack';

// Deployed to GitHub Pages at https://jeonghwan-dev.github.io/emotion-variants/
const base = '/emotion-variants/';

export const shared = defineConfig({
  title: 'emotion-variants',
  base,
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  vite: {
    publicDir: 'public',
  },
  head: [
    // `head` entries are emitted verbatim. Unlike themeConfig and markdown
    // links, VitePress does not prepend `base` here.
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#d36ac2' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:site_name', content: 'emotion-variants' }],
  ],
  themeConfig: {
    logo: { src: '/logo.svg', width: 24, height: 24 },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/JeongHwan-dev/emotion-variants' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/emotion-variants' },
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          ko: {
            translations: {
              button: {
                buttonText: '검색',
                buttonAriaLabel: '검색',
              },
              modal: {
                noResultsText: '검색 결과가 없어요',
                resetButtonTitle: '검색어 지우기',
                footer: {
                  selectText: '선택',
                  navigateText: '이동',
                  closeText: '닫기',
                },
              },
            },
          },
        },
      },
    },
  },
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: false,
    config(md) {
      // `::: sandpack` -> <Sandpack>, registered in theme/index.ts.
      md.use(container, 'sandpack', {
        render: (tokens, idx) => renderSandbox(tokens, idx, 'sandpack'),
      });
    },
  },
});
