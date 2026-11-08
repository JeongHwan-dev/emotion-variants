import { defineConfig } from 'vitepress';

export const ko = defineConfig({
  label: '한국어',
  lang: 'ko-KR',
  link: '/ko/',
  description:
    'Emotion을 위한 Type-safe variant API. 반복적인 css() 호출 없이 다양한 variant를 가진 컴포넌트 스타일을 만들어요.',
  themeConfig: {
    nav: [
      {
        text: '가이드',
        link: '/ko/intro',
        activeMatch: '^/ko/(intro|installation|getting-started|core-concepts|recipes)',
      },
      {
        text: '레퍼런스',
        link: '/ko/reference/ev',
        activeMatch: '^/ko/(reference/|migration)',
      },
      {
        text: 'v2.0.0',
        items: [
          {
            text: '변경 사항',
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
      '/ko/': [
        {
          text: '가이드',
          items: [
            {
              text: '소개',
              link: '/ko/intro',
            },
            {
              text: '설치',
              link: '/ko/installation',
            },
            {
              text: '시작하기',
              link: '/ko/getting-started',
            },
            {
              text: '핵심 개념',
              link: '/ko/core-concepts',
            },
            {
              text: '복합 Variants',
              link: '/ko/recipes/compound-variants',
            },
            {
              text: '기본 Variants',
              link: '/ko/recipes/default-variants',
            },
            {
              text: '덮어쓰기',
              link: '/ko/recipes/overrides',
            },
            {
              text: 'Props 타입 추출',
              link: '/ko/recipes/typed-props',
            },
          ],
        },
        {
          text: '레퍼런스',
          items: [
            {
              text: 'ev',
              link: '/ko/reference/ev',
            },
            {
              text: '타입',
              link: '/ko/reference/types',
            },
            {
              text: 'v2로 마이그레이션',
              link: '/ko/migration',
            },
          ],
        },
      ],
    },
    editLink: {
      pattern: 'https://github.com/JeongHwan-dev/emotion-variants/edit/main/docs/:path',
      text: 'GitHub에서 이 페이지 편집',
    },
    docFooter: {
      prev: '이전 페이지',
      next: '다음 페이지',
    },
    outline: {
      label: '이 페이지에서',
    },
    lastUpdated: {
      text: '마지막 업데이트',
    },
    darkModeSwitchLabel: '테마',
    sidebarMenuLabel: '메뉴',
    returnToTopLabel: '맨 위로',
    langMenuLabel: '언어 변경',
    footer: {
      message: 'MIT 라이선스에 따라 배포돼요.',
      copyright: 'Copyright © 2025-present Jeonghwan Park',
    },
  },
});
