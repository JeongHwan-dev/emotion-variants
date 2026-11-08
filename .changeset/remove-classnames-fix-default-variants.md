---
"emotion-variants": major
---

fix(core): apply default variants when a prop is `undefined`, remove broken `classNames`

- `button({ size: undefined })` now falls back to `defaultVariants.size` instead of dropping it; this matches the README `Button` example which forwards possibly-undefined props
- remove `classNames`: it returned `"[object Object]"` for every entry because `@emotion/react`'s `css()` yields `SerializedStyles`, not class names. A class-name API backed by `@emotion/css` is planned as a separate `emotion-variants/css` entry
- `ev()` now always returns `SerializedStyles[]` (previously `Interpolation<unknown>`, a bare object when only one style matched); the `css` prop accepts both
