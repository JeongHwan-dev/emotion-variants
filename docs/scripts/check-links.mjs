/**
 * Verifies every internal link in the built site resolves to a real file, and
 * every `#fragment` to a real element id.
 *
 * VitePress fails the build on dead *paths* but not on dead *anchors*, and its
 * slugifier normalizes headings with NFKD — which decomposes Hangul into jamo,
 * so a Korean anchor written in NFC silently never matches. That class of bug
 * is invisible until someone clicks the link.
 */
import { glob, readFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';

const DIST = resolve(import.meta.dirname, '../.vitepress/dist');
const BASE = '/emotion-variants/';

const pages = [];

for await (const entry of glob('**/*.html', { cwd: DIST })) {
  pages.push(entry);
}

/** Element ids present on each page, keyed by page path relative to dist. */
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

    // Resolve the target page relative to the current one.
    let targetPage = page;
    if (rawPath) {
      const abs = rawPath.startsWith('/')
        ? rawPath.slice(BASE.length)
        : relative(DIST, resolve(DIST, dirname(page), rawPath));

      if (!abs || abs.startsWith('..')) continue;

      // Mirror GitHub Pages: an extensionless path is served as `<path>.html`,
      // and a directory as its `index.html`.
      const candidates = abs.endsWith('.html')
        ? [abs]
        : [`${abs}.html`, join(abs, 'index.html').replace(/^\.\//, '')];
      const found = candidates.find((c) => ids.has(c));

      if (!found) {
        // Non-HTML assets (css, svg, …) are emitted by Vite; only flag pages.
        if (!/\.[a-z0-9]+$/i.test(abs)) {
          errors.push(`${page}: dead link ${href}`);
        }
        continue;
      }
      targetPage = found;
    }

    if (anchor && !ids.get(targetPage)?.has(anchor)) {
      errors.push(`${page}: dead anchor ${href} (no id="${anchor}" in ${targetPage})`);
    }
  }
}

if (errors.length > 0) {
  console.error(`${errors.length} broken link(s):\n${[...new Set(errors)].join('\n')}`);
  process.exit(1);
}

console.log(`Checked ${pages.length} pages. All internal links and anchors resolve.`);
