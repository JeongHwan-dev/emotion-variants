import type { MetadataRoute } from 'next';
import { i18n, type Lang } from '@/lib/i18n';
import { alternateLanguages, home, SITE } from '@/lib/site';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

// `trailingSlash: true` serves every page at `<path>/`, so the sitemap lists that form.
const absolute = (path: string) => `${SITE}${path.endsWith('/') ? path : `${path}/`}`;

function languages(urlOf: (lang: Lang) => string | undefined) {
  return Object.fromEntries(
    Object.entries(alternateLanguages(urlOf)).map(([lang, url]) => [lang, absolute(url)]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const homes = i18n.languages.map((lang) => ({
    url: absolute(home(lang)),
    alternates: {
      languages: languages(home),
    },
  }));

  const docs = i18n.languages.flatMap((lang) =>
    source.getPages(lang).map((page) => ({
      url: absolute(page.url),
      lastModified: page.data.lastModified,
      alternates: {
        languages: languages((l) => source.getPage(page.slugs, l)?.url),
      },
    })),
  );

  return [...homes, ...docs];
}
