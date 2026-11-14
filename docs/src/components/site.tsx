import { defineI18nUI } from 'fumadocs-ui/i18n';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import {
  DocsBody,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
  PageLastUpdate,
} from 'fumadocs-ui/layouts/notebook/page';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { i18n, type Lang } from '@/lib/i18n';
import { alternateLanguages, GITHUB, home, SITE } from '@/lib/site';
import { source } from '@/lib/source';
import { version } from '../../../package.json';
import { GithubIcon, NpmIcon } from './icons';
import { copy } from './landing/copy';
import { Landing } from './landing/landing';
import { Preview } from './preview';
import { EvPlayground } from './sandpack';
import '@/app/global.css';

/**
 * Everything the route trees (`app/(en)`, `app/ko`, `app/ja`, `app/zh`) share. Static export has no
 * middleware to pick a locale, so each tree is a set of thin wrappers passing its `lang` here.
 */

const i18nUI = defineI18nUI(i18n, {
  en: {
    displayName: 'English',
  },
  ko: {
    displayName: '한국어',
    'Choose a language(language switcher)': '언어 변경',
    'Choose a language(language switcher)(aria-label)': '언어 변경',
    'Edit on GitHub(edit page)': copy.ko.editOnGitHub,
    'Last updated on(page footer)': '마지막 업데이트',
    'Next Page(pagination)': '다음 페이지',
    'Previous Page(pagination)': '이전 페이지',
    'No Headings(table of contents)': '제목이 없어요',
    'No results found(search dialog)': '검색 결과가 없어요',
    'On this page(table of contents)': '이 페이지에서',
    'Open Search(search trigger)(aria-label)': '검색',
    'Search(search dialog)': '검색',
    'Search(search trigger)': '검색',
    'Close Search(search dialog)(aria-label)': '닫기',
    'Toggle Menu(mobile menu)(aria-label)': '메뉴',
    'Toggle Theme(theme switcher)(aria-label)': '테마',
    'Copy Text(code block)(aria-label)': copy.ko.copy,
    'Copied Text(code block)(aria-label)': copy.ko.copied,
  },
  ja: {
    displayName: '日本語',
    'Choose a language(language switcher)': '言語を選択',
    'Choose a language(language switcher)(aria-label)': '言語を選択',
    'Edit on GitHub(edit page)': copy.ja.editOnGitHub,
    'Last updated on(page footer)': '最終更新',
    'Next Page(pagination)': '次のページ',
    'Previous Page(pagination)': '前のページ',
    'No Headings(table of contents)': '見出しがありません',
    'No results found(search dialog)': '結果が見つかりません',
    'On this page(table of contents)': 'このページの内容',
    'Open Search(search trigger)(aria-label)': '検索',
    'Search(search dialog)': '検索',
    'Search(search trigger)': '検索',
    'Close Search(search dialog)(aria-label)': '閉じる',
    'Toggle Menu(mobile menu)(aria-label)': 'メニュー',
    'Toggle Theme(theme switcher)(aria-label)': 'テーマ',
    'Copy Text(code block)(aria-label)': copy.ja.copy,
    'Copied Text(code block)(aria-label)': copy.ja.copied,
  },
  zh: {
    displayName: '简体中文',
    'Choose a language(language switcher)': '选择语言',
    'Choose a language(language switcher)(aria-label)': '选择语言',
    'Edit on GitHub(edit page)': copy.zh.editOnGitHub,
    'Last updated on(page footer)': '最后更新于',
    'Next Page(pagination)': '下一页',
    'Previous Page(pagination)': '上一页',
    'No Headings(table of contents)': '没有标题',
    'No results found(search dialog)': '未找到结果',
    'On this page(table of contents)': '本页目录',
    'Open Search(search trigger)(aria-label)': '搜索',
    'Search(search dialog)': '搜索',
    'Search(search trigger)': '搜索',
    'Close Search(search dialog)(aria-label)': '关闭',
    'Toggle Menu(mobile menu)(aria-label)': '菜单',
    'Toggle Theme(theme switcher)(aria-label)': '主题',
    'Copy Text(code block)(aria-label)': copy.zh.copy,
    'Copied Text(code block)(aria-label)': copy.zh.copied,
  },
});

const OG_LOCALE = {
  en: 'en_US',
  ko: 'ko_KR',
  ja: 'ja_JP',
  zh: 'zh_CN',
} satisfies Record<Lang, string>;

export function rootMetadata(lang: Lang): Metadata {
  return {
    metadataBase: new URL(SITE),
    title: {
      default: `emotion-variants — ${copy[lang].title}`,
      template: '%s | emotion-variants',
    },
    description: copy[lang].description,
    icons: {
      icon: '/logo.svg',
    },
    openGraph: {
      type: 'website',
      siteName: 'emotion-variants',
      locale: OG_LOCALE[lang],
      images: '/og.png',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

/** On the page, not the layout, so the 404 page gets no canonical. */
export function homeMetadata(lang: Lang): Metadata {
  return {
    alternates: {
      canonical: home(lang),
      languages: alternateLanguages(home),
    },
    openGraph: {
      ...rootMetadata(lang).openGraph,
      url: home(lang),
    },
  };
}

export const viewport = {
  themeColor: '#d36ac2',
};

export function RootLayout({ lang, children }: { lang: Lang; children: ReactNode }) {
  return (
    <html lang={lang} suppressHydrationWarning>
      {/* `keep-all` would leave Japanese and Chinese, written without spaces, no break points. */}
      <body className={`flex min-h-screen flex-col ${lang === 'ko' ? 'break-keep' : ''}`}>
        <RootProvider
          i18n={i18nUI.provider(lang)}
          search={{
            options: {
              // ponytail: the default dialog's deprecated `type` flag; write a dialog around
              // `useStaticSearch` if it is removed.
              type: 'static',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

function baseOptions(lang: Lang): BaseLayoutProps {
  const prefix = lang === 'en' ? '' : `/${lang}`;

  return {
    nav: {
      url: home(lang),
      title: (
        <>
          <img src="/logo.svg" alt="" width={24} height={24} />
          <span className="whitespace-nowrap">Emotion Variants</span>
          <span className="shrink-0 rounded-full border bg-fd-muted px-1.5 py-px font-mono text-[11px] font-medium text-fd-muted-foreground">
            v{version}
          </span>
        </>
      ),
    },
    links: [
      {
        text: copy[lang].docs,
        url: `${prefix}/docs/introduction`,
        active: 'none',
      },
      {
        text: copy[lang].changelog,
        url: `${prefix}/docs/changelog`,
      },
      {
        type: 'icon',
        text: 'GitHub',
        label: 'GitHub',
        icon: <GithubIcon />,
        url: GITHUB,
        external: true,
      },
      {
        type: 'icon',
        text: 'npm',
        label: 'npm',
        icon: <NpmIcon />,
        url: 'https://www.npmjs.com/package/emotion-variants',
        external: true,
      },
    ],
  };
}

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <HomeLayout {...baseOptions(lang)}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareSourceCode',
          name: 'emotion-variants',
          description: copy[lang].description,
          url: `${SITE}${home(lang)}`,
          codeRepository: GITHUB,
          programmingLanguage: 'TypeScript',
          runtimePlatform: 'React',
          license: 'https://opensource.org/licenses/MIT',
          version,
          inLanguage: lang,
        }}
      />
      <Landing lang={lang} />
    </HomeLayout>
  );
}

export function DocsShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const { nav, ...options } = baseOptions(lang);

  return (
    <DocsLayout
      {...options}
      nav={{
        ...nav,
        mode: 'top',
      }}
      tree={source.getPageTree(lang)}
    >
      {children}
    </DocsLayout>
  );
}

export function docsParams(lang: Lang) {
  return source
    .generateParams()
    .filter((params) => params.lang === lang)
    .map(({ slug }) => ({
      slug,
    }));
}

export function docsMetadata(lang: Lang, slug: string[]): Metadata {
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      languages: alternateLanguages((l) => source.getPage(slug, l)?.url),
    },
    // Replaces the layout's `openGraph` whole, so the shared fields are spread back in.
    openGraph: {
      ...rootMetadata(lang).openGraph,
      type: 'article',
      url: page.url,
      title: page.data.title,
      description: page.data.description,
      modifiedTime: page.data.lastModified?.toISOString(),
    },
  };
}

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll('<', '\\u003c'),
      }}
    />
  );
}

export function DocsPageView({ lang, slug }: { lang: Lang; slug: string[] }) {
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: page.data.title,
          description: page.data.description,
          url: `${SITE}${page.url}/`,
          inLanguage: lang,
          dateModified: page.data.lastModified?.toISOString(),
          isPartOf: {
            '@type': 'WebSite',
            name: 'emotion-variants',
            url: SITE,
          },
        }}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            EvPlayground,
            Preview,
            // Lets pages link to each other by file path (`./slots.mdx`). With `parser: 'dir'`,
            // `page.path` keeps the locale folder but the lookup index drops it.
            a: createRelativeLink(source, {
              ...page,
              path: page.path.replace(`${lang}/`, ''),
            }),
          }}
        />
      </DocsBody>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <EditOnGitHub href={`${GITHUB}/edit/main/docs/content/docs/${page.path}`} />
        {page.data.lastModified && <PageLastUpdate date={page.data.lastModified} />}
      </div>
    </DocsPage>
  );
}
