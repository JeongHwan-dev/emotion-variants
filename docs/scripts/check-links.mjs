/**
 * Checks every internal link and `#fragment` in the built site, and every redirect target in
 * `404.html`. Next.js fails the build on neither.
 */
import { glob, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

const DIST = resolve(import.meta.dirname, '../out');

const pages = [];

for await (const entry of glob('**/*.html', { cwd: DIST })) {
  pages.push(entry);
}

const ids = new Map();

for (const page of pages) {
  const html = await readFile(join(DIST, page), 'utf8');
  ids.set(page, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const errors = [];

for (const page of pages) {
  const html = await readFile(join(DIST, page), 'utf8');
  const hrefs = [...html.matchAll(/\shref="([^"]+)"/g)].map((m) => m[1]);

  for (const href of hrefs) {
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;

    const [rawPath, anchor] = href.split('#');

    let targetPage = page;
    if (rawPath) {
      const abs = rawPath.startsWith('/')
        ? rawPath.slice(1)
        : relative(DIST, resolve(DIST, dirname(page), rawPath));

      if (!abs || abs.startsWith('..')) continue;

      // Mirror GitHub Pages: an extensionless path is served as `<path>.html`,
      // and a directory as its `index.html`.
      const candidates = abs.endsWith('.html')
        ? [abs]
        : [`${abs}.html`, join(abs, 'index.html').replace(/^\.\//, '')];
      const found = candidates.find((c) => ids.has(c));

      if (!found) {
        // Other extensions are assets; `.mdx` is a page link Fumadocs failed to resolve.
        if (!/\.[a-z0-9]+$/i.test(abs) || abs.endsWith('.mdx')) {
          errors.push(`${page}: dead link ${href}`);
        }
        continue;
      }
      targetPage = found;
    }

    if (anchor) {
      const pageIds = ids.get(targetPage);
      let decoded = anchor;
      try {
        decoded = decodeURIComponent(anchor);
      } catch {
        // malformed escape: fall back to the raw fragment
      }
      if (!pageIds?.has(anchor) && !pageIds?.has(decoded)) {
        errors.push(`${page}: dead anchor ${href} (no id="${anchor}" in ${targetPage})`);
      }
    }
  }
}

// `404.html` redirects pre-Fumadocs URLs to `/docs/<slug>/`; each slug must still be a page.
const redirects = await readFile(resolve(import.meta.dirname, '../404.html'), 'utf8');

for (const [, slug] of redirects.matchAll(/^\s*'\/[\w/-]+': '([\w-]+)',$/gm)) {
  if (!ids.has(`docs/${slug}/index.html`)) {
    errors.push(`404.html: redirect to missing page /docs/${slug}/`);
  }
}

if (errors.length > 0) {
  console.error(`${errors.length} broken link(s):\n${[...new Set(errors)].join('\n')}`);
  process.exit(1);
}

console.log(`Checked ${pages.length} pages. All internal links and anchors resolve.`);
