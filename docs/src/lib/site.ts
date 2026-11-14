import { i18n, type Lang } from './i18n';

export const SITE = 'https://emotion-variants.org';

export const GITHUB = 'https://github.com/JeongHwan-dev/emotion-variants';

export function home(lang: Lang) {
  return lang === 'en' ? '/' : `/${lang}/`;
}

/** hreflang map for one page, `x-default` pointing at English. */
export function alternateLanguages(urlOf: (lang: Lang) => string | undefined) {
  const entries = i18n.languages.flatMap((lang) => {
    const url = urlOf(lang);
    return url ? [[lang, url] as const] : [];
  });
  const en = urlOf('en');

  return Object.fromEntries(en ? [...entries, ['x-default', en]] : entries);
}
