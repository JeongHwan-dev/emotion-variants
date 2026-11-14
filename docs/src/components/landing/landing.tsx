import { readFile } from 'node:fs/promises';
import { highlight } from 'fumadocs-core/highlight';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Lang } from '@/lib/i18n';
import { BookIcon, GithubIcon } from '../icons';
import { Concepts, CopyButton, HeroDemo } from './client';
import { BeforeAfter } from './compare';
import { CONCEPTS, copy, INSTALL } from './copy';

const GITHUB = 'https://github.com/JeongHwan-dev/emotion-variants';

const primaryButton =
  'inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90';
const secondaryButton =
  'inline-flex items-center gap-2 rounded-xl border bg-fd-background px-5 py-2.5 text-sm font-medium hover:bg-fd-accent';

/** Renders `backticked` parts of a copy string as inline code. */
function inlineCode(text: string): ReactNode[] {
  return text.split('`').map((part, i) =>
    i % 2 ? (
      <code key={i} className="rounded bg-fd-muted px-1 py-0.5 font-mono text-[0.9em]">
        {part}
      </code>
    ) : (
      part
    ),
  );
}

/** The Before and After snippets are the Introduction page's own, so the two cannot drift apart. */
async function introSnippets(lang: Lang) {
  const mdx = await readFile(`content/docs/${lang}/introduction.mdx`, 'utf8');
  const [before, after] = [...mdx.matchAll(/```tsx\n([\s\S]*?)\n```/g)].map((match) => match[1]);
  if (!after) throw new Error(`${lang}/introduction.mdx needs its Before and After code blocks.`);

  // The last step explains the After code further instead of changing it.
  return [before, after, after];
}

export async function Landing({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const compare = await introSnippets(lang);
  const docs = (slug: string) => `${lang === 'en' ? '' : `/${lang}`}/docs/${slug}`;
  const install = await highlight(INSTALL, {
    lang: 'bash',
    structure: 'inline',
  });

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden border-b">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_75%_0%,var(--ev-glow),transparent)]"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="min-w-0">
            <p className="font-mono text-sm text-fd-primary">Emotion Variants</p>
            <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-tight text-balance md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-fd-muted-foreground">{t.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={docs('introduction')} className={primaryButton}>
                <BookIcon className="size-4" />
                {t.getStarted}
              </Link>
              <a href={GITHUB} className={secondaryButton}>
                <GithubIcon className="size-4" />
                {t.github}
              </a>
            </div>
            <div className="mt-8 flex max-w-full items-center gap-3 rounded-xl border bg-fd-card py-2 pr-2 pl-4 font-mono text-sm">
              <span aria-hidden className="select-none text-fd-muted-foreground">
                $
              </span>
              <code className="shiki flex-1 overflow-x-auto whitespace-nowrap">{install}</code>
              <CopyButton text={INSTALL} copy={t.copy} copied={t.copied} />
            </div>
          </div>
          <HeroDemo />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {t.features.map(([title, body]) => (
          <div key={title} className="rounded-2xl border bg-fd-card p-5">
            <h2 className="font-medium">{title}</h2>
            <p className="mt-2 text-sm text-fd-muted-foreground">{inlineCode(body)}</p>
          </div>
        ))}
      </section>

      {/* No `overflow-hidden` here: it would stop the code panel from sticking. */}
      <section className="border-t">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">{t.compareTitle}</h2>
          <p className="mt-2 mb-8 text-fd-muted-foreground">{inlineCode(t.compareLead)}</p>
          <BeforeAfter
            steps={compare.map((code, i) => ({
              title: t.compare[i][0],
              body: inlineCode(t.compare[i][1]),
              code,
            }))}
          />
        </div>
      </section>

      <section className="border-y bg-fd-muted/30">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-semibold tracking-tight">{t.conceptsTitle}</h2>
          <p className="mt-2 mb-8 text-fd-muted-foreground">{t.conceptsLead}</p>
          <Concepts
            readDocs={t.readDocs}
            items={CONCEPTS.map(({ slug, code }, i) => ({
              name: t.concepts[i][0],
              description: t.concepts[i][1],
              href: docs(slug),
              code,
            }))}
          />
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">{t.ctaTitle}</h2>
        <p className="mt-3 text-fd-muted-foreground">{inlineCode(t.ctaLead)}</p>
        <Link href={docs('installation')} className={`mt-8 ${primaryButton}`}>
          <BookIcon className="size-4" />
          {t.getStarted}
        </Link>
      </section>

      <footer className="border-t py-8 text-center text-sm text-fd-muted-foreground">
        <p>{t.license}</p>
        <p>Copyright © 2025-present Jeonghwan Park</p>
      </footer>
    </main>
  );
}
