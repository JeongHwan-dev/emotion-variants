import { defineI18n } from 'fumadocs-core/i18n';

export type Lang = 'en' | 'ko' | 'ja' | 'zh';

export const i18n = defineI18n({
  languages: ['en', 'ko', 'ja', 'zh'],
  defaultLanguage: 'en',
  hideLocale: 'default-locale',
  parser: 'dir',
});
