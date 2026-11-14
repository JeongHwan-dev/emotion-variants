import { copy } from '@/components/landing/copy';
import { i18n } from '@/lib/i18n';
import { home, SITE } from '@/lib/site';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

/** https://llmstxt.org — an index of the English docs, grouped by the sidebar's sections. */
export function GET() {
  const lines = ['# emotion-variants', '', `> ${copy.en.description}`];

  // The tree is flat: `meta.json` separators followed by their pages.
  for (const node of source.getPageTree('en').children) {
    if (node.type === 'separator') lines.push('', `## ${node.name}`, '');
    if (node.type !== 'page') continue;

    const page = source.getNodePage(node, 'en');
    if (!page) continue;

    const description = page.data.description ? `: ${page.data.description}` : '';
    lines.push(`- [${page.data.title}](${SITE}${page.url}/)${description}`);
  }

  lines.push(
    '',
    '## Optional',
    '',
    `- [Full docs as one file](${SITE}/llms-full.txt): every English page above, in Markdown`,
    ...i18n.languages
      .filter((lang) => lang !== 'en')
      .map((lang) => `- [Docs in ${lang}](${SITE}${home(lang)}): ${copy[lang].title}`),
  );

  return new Response(`${lines.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
