import { SITE } from '@/lib/site';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

/** Every English page as Markdown in sidebar order, for LLMs that take the whole docs as context. */
export async function GET() {
  const pages = source
    .getPageTree('en')
    .children.flatMap((node) => (node.type === 'page' ? [source.getNodePage(node, 'en')] : []))
    .filter((page) => page !== undefined);

  const sections = await Promise.all(
    pages.map(
      async (page) =>
        `# ${page.data.title}\n\nURL: ${SITE}${page.url}/\n\n${await page.data.getText('processed')}`,
    ),
  );

  return new Response(`${sections.join('\n\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
