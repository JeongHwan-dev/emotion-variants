---
"emotion-variants": patch
---

chore(core): switch to ESM package type and fix ESM type resolution

- set "type": "module"; emit dist/index.{js,d.ts} for ESM and dist/index.{cjs,d.cts} for CJS
- split exports "types" per import/require condition so node16 ESM no longer resolves CJS types
- add "sideEffects": false, use git+https repository url, narrow "files" to dist
- drop redundant react peer dependency (@emotion/react already declares it)
- remove duplicate build from the release script (prepublishOnly already builds)
- rename .lintstagedrc.js to .cjs, delete stale .npmignore, bump @types/node to 22
