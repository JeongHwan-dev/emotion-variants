---
"emotion-variants": major
---

fix(core): apply default variants when a prop is `undefined`, make `classNames` return real class names

- `button({ size: undefined })` now falls back to `defaultVariants.size` instead of dropping it; this matches the README `Button` example which forwards possibly-undefined props
- `classNames` previously returned `"[object Object]"` for every entry because `@emotion/react`'s `css()` yields `SerializedStyles`, not class names. It now injects each style through `@emotion/css` on first access and returns the generated class names
- add `className(variants)`, which returns one class name covering base, variant and compound variant styles, for `className` props and non-React code
- `@emotion/css` is a new required peer dependency
- `ev()` now always returns `SerializedStyles[]` (previously `Interpolation<unknown>`, a bare object when only one style matched); the `css` prop accepts both
