import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // GitHub Pages serves static files only.
  output: 'export',
  reactStrictMode: true,
  // Every page becomes `<path>/index.html`, so `/ko` and `/ko/` both resolve on GitHub Pages.
  trailingSlash: true,
};

export default withMDX(config);
