import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';

export const docs = defineDocs({
  dir: 'content/docs',
});

type Node = {
  type: string;
  depth?: number;
  children?: Node[];
};

/**
 * Page titles come from frontmatter, so the `# emotion-variants` of the included CHANGELOG.md
 * goes. An include is a nested root, hence the recursion.
 */
function remarkDropH1() {
  return function drop(node: Node) {
    if (!node.children) return;
    node.children = node.children.filter((child) => child.type !== 'heading' || child.depth !== 1);
    node.children.forEach(drop);
  };
}

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: (plugins) => [remarkDropH1, ...plugins],
  },
});
