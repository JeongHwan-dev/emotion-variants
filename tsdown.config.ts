import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: { sourcemap: false },
  sourcemap: true,
  // Keep tsup's filenames so package.json entry points stay valid; tsdown
  // would otherwise emit index.cjs / index.d.cts.
  outExtensions: ({ format }) => ({
    js: format === 'es' ? '.mjs' : '.js',
    dts: format === 'es' ? '.d.mts' : '.d.ts',
  }),
  // Strip comments and whitespace without mangling names. tsdown keeps JSDoc
  // in the bundle otherwise, which costs more than minifying saves.
  minify: { compress: false, mangle: false },
});
