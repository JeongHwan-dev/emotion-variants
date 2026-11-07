import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    sourcemap: false,
  },
  sourcemap: true,
  fixedExtension: false,
  minify: true,
});
