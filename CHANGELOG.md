# emotion-variants

## 2.1.1

### Patch Changes

- [#56](https://github.com/JeongHwan-dev/emotion-variants/pull/56) [`821c511`](https://github.com/JeongHwan-dev/emotion-variants/commit/821c5114b5329edd1025762e1d27cd76ba3620e4) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - docs(core): refresh the README for slots, extend, and responsive variants, and link the new docs site at emotion-variants.org

## 2.1.0

### Minor Changes

- [#53](https://github.com/JeongHwan-dev/emotion-variants/pull/53) [`2e7f5b4`](https://github.com/JeongHwan-dev/emotion-variants/commit/2e7f5b41e637130a84c5c83e7dbc4714b734e6bb) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - feat(core): add `extend` to build one `ev()` result on another
  
  - `ev({ extend: button, ... })` inherits the parent's `base`, `variants`, `compoundVariants`, and `defaultVariants`; the parent is not changed
  - the parent's styles come before the child's at every step: `base`, then each matching variant value, then compound variants
  - a child can add values to an inherited axis, add styles to an inherited value, and declare new axes; `defaultVariants` are merged per axis with the child's value winning
  - with `slots`, a child can add slots and style inherited ones; a config with `slots` can only extend one with `slots`
  - `extend` throws at definition time when the value is not an `ev()` result, or when a config with `slots` extends one without
  - add a third type parameter to `EvConfig<T, N, E>` for the type of the `extend` value (defaults to `undefined`)

- [#54](https://github.com/JeongHwan-dev/emotion-variants/pull/54) [`36c2199`](https://github.com/JeongHwan-dev/emotion-variants/commit/36c2199ae2d18b8331288fd39b6cbf649e84ebcb) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - feat(core): add `createEv` for responsive variant values
  
  - `createEv({ breakpoints })` returns `{ ev }`; breakpoints are media queries keyed by a name, declared smallest first
  - every variant prop of that `ev` also accepts `{ initial, [breakpoint]: value }`; `initial` falls back to the default variant, and each breakpoint's styles are wrapped in its media query, in declared order
  - an axis that received a responsive value matches no compound variant in that call
  - `className()` and slot functions accept the same values; `defaultVariants` does not
  - the exported `ev` is `createEv().ev` and behaves as before
  - add the `Ev<B>` type, and a trailing breakpoint-name parameter `B` (defaults to `never`) to `EvVariants<T, B>`, `EvFunction<T, B>`, and `EvSlotsFunction<N, T, B>`

- [#51](https://github.com/JeongHwan-dev/emotion-variants/pull/51) [`768ad08`](https://github.com/JeongHwan-dev/emotion-variants/commit/768ad08b66773b89461068353903bc67905d537b) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - feat(core): add `slots` and `compoundSlots` for multi-part components
  
  - `ev({ slots })` styles every part of a component from one config. Variant values and compound `style` are keyed by slot name, and the call returns one style function per slot: `const { root, title } = card({ size })`, then `css={root()}`
  - a slot function accepts the same variants as the call, resolved per axis as slot props, then call props, then `defaultVariants`; compound entries are matched per slot against the resolved values
  - `compoundSlots` applies one style to several slots, always or only when `variants` match
  - with `slots`, `className()` returns one class name per slot and there is no `classNames`; `base` cannot be combined with `slots`
  - export the `EvSlotsFunction` type, and add a second type parameter to `EvConfig<T, N>` for the slot names (defaults to `never`)
  - `ReturnType<ReturnType<typeof ev>>` no longer resolves to `SerializedStyles[]`, because `ev` now returns either form; use `SerializedStyles[]` from `@emotion/react` directly

- [#50](https://github.com/JeongHwan-dev/emotion-variants/pull/50) [`83838ab`](https://github.com/JeongHwan-dev/emotion-variants/commit/83838abe785eb3525ee3d26d678fe236eba6a73d) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - feat(core): add the `VariantProps` type and array conditions in `compoundVariants`
  
  - export `VariantProps<T>`, which extracts the variant props from an `ev()` result: `type ButtonVariants = VariantProps<typeof button>`
  - a `compoundVariants` condition can now be an array of values, which matches when the variant has any of them: `{ variants: { size: ['small', 'medium'] }, style }`
  - fix a variant value that only exists on `Object.prototype`, such as `'constructor'`, pushing a non-style value into the result; unknown values are now ignored

## 2.0.0

### Major Changes

- [#43](https://github.com/JeongHwan-dev/emotion-variants/pull/43) [`3456f97`](https://github.com/JeongHwan-dev/emotion-variants/commit/3456f97b6273c4d918e2ce8315e1f056c58767a9) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - fix(core): apply default variants when a prop is `undefined`, make `classNames` return real class names
  
  - `button({ size: undefined })` now falls back to `defaultVariants.size` instead of dropping it; this matches the README `Button` example which forwards possibly-undefined props
  - `classNames` previously returned `"[object Object]"` for every entry because `@emotion/react`'s `css()` yields `SerializedStyles`, not class names. It now injects each style through `@emotion/css` on first access and returns the generated class names
  - add `className(variants)`, which returns one class name covering base, variant and compound variant styles, for `className` props and non-React code
  - `@emotion/css` is a new required peer dependency
  - `ev()` now always returns `SerializedStyles[]` (previously `Interpolation<unknown>`, a bare object when only one style matched); the `css` prop accepts both

## 1.0.2

### Patch Changes

- [#41](https://github.com/JeongHwan-dev/emotion-variants/pull/41) [`176a7f2`](https://github.com/JeongHwan-dev/emotion-variants/commit/176a7f2c57e6d561a24d245261fad8fcf24a35d1) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - chore(core): switch to ESM package type and fix ESM type resolution
  
  - set "type": "module"; emit dist/index.{js,d.ts} for ESM and dist/index.{cjs,d.cts} for CJS
  - split exports "types" per import/require condition so node16 ESM no longer resolves CJS types
  - add "sideEffects": false, use git+https repository url, narrow "files" to dist
  - drop redundant react peer dependency (@emotion/react already declares it)
  - remove duplicate build from the release script (prepublishOnly already builds)
  - rename .lintstagedrc.js to .cjs, delete stale .npmignore, bump @types/node to 22

## 1.0.1

### Patch Changes

- [#33](https://github.com/JeongHwan-dev/emotion-variants/pull/33) [`ddc21a5`](https://github.com/JeongHwan-dev/emotion-variants/commit/ddc21a54361ff8a0a25691e4f59f11ae4f89bb95) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - chore(core): build with tsdown instead of tsup
  
  Output filenames and entry points are unchanged; the bundle is 27-31% smaller gzipped.

- [#27](https://github.com/JeongHwan-dev/emotion-variants/pull/27) [`ae2f98e`](https://github.com/JeongHwan-dev/emotion-variants/commit/ae2f98e706bab33eec4443769e06a12dea5fcc90) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - chore(core): remove unused `@emotion/serialize` runtime dependency

- [#25](https://github.com/JeongHwan-dev/emotion-variants/pull/25) [`2630063`](https://github.com/JeongHwan-dev/emotion-variants/commit/26300636cf33e9186b19c376e0dfa0a9dc7e8e9c) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - ci(release): migrate release pipeline from semantic-release to changesets

## 1.0.0

### Major Changes

- [`967258d`](https://github.com/JeongHwan-dev/emotion-variants/commit/967258df6562017bd60924a9f63a7bb617eba654) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **ev:** initial implementation of emotion-variants

### Patch Changes

- [#10](https://github.com/JeongHwan-dev/emotion-variants/pull/10) [`c919712`](https://github.com/JeongHwan-dev/emotion-variants/commit/c91971282e5e2f76e67e322fdccec7d4531e45f3) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **cursor:** add emotion-variants library rules and update frontend guidelines
- [#11](https://github.com/JeongHwan-dev/emotion-variants/pull/11) [`6482440`](https://github.com/JeongHwan-dev/emotion-variants/commit/6482440bae4f21d6666ba755df07b89edf8d5a6e) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **examples:** add design system example project
- [#2](https://github.com/JeongHwan-dev/emotion-variants/pull/2) [`1aaa93a`](https://github.com/JeongHwan-dev/emotion-variants/commit/1aaa93a825039519d61a25c353f07ac0ce865a5c) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **github:** add pull request template to repository
- [#9](https://github.com/JeongHwan-dev/emotion-variants/pull/9) [`1af7d81`](https://github.com/JeongHwan-dev/emotion-variants/commit/1af7d8108a97a8fd91e22d94d404919f24dccc7d) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **biome:** update biome version and clean up configuration
- [#5](https://github.com/JeongHwan-dev/emotion-variants/pull/5) [`d157a3d`](https://github.com/JeongHwan-dev/emotion-variants/commit/d157a3d3af806fd0880a5f878f77262282537c20) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **commitizen:** add commitizen configuration
- [#6](https://github.com/JeongHwan-dev/emotion-variants/pull/6) [`03f3da8`](https://github.com/JeongHwan-dev/emotion-variants/commit/03f3da8773ed2162afc9501d4a66ef933c0a8c16) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **commitizen:** improve commit message validation logic
- [#8](https://github.com/JeongHwan-dev/emotion-variants/pull/8) [`2323bbd`](https://github.com/JeongHwan-dev/emotion-variants/commit/2323bbd567cce5556e6712a4f36a99d6880d3465) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **commitizen:** update commitizen config
- [#14](https://github.com/JeongHwan-dev/emotion-variants/pull/14) [`f388a20`](https://github.com/JeongHwan-dev/emotion-variants/commit/f388a20c299996944a4df91aaa498f6af8449503) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **github:** update generate labels scripts and labels.json
- [#7](https://github.com/JeongHwan-dev/emotion-variants/pull/7) [`b0d9000`](https://github.com/JeongHwan-dev/emotion-variants/commit/b0d9000b109119555bb7ae1c65d49e12a5529293) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **husky:** add husky for pre-commit and update scripts
- [#1](https://github.com/JeongHwan-dev/emotion-variants/pull/1) [`2137060`](https://github.com/JeongHwan-dev/emotion-variants/commit/213706015976812b9d8bcbb5922d928516dc42fe) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **npmrc:** add .npmrc to ignore workspace root check
- [#12](https://github.com/JeongHwan-dev/emotion-variants/pull/12) [`d6510b0`](https://github.com/JeongHwan-dev/emotion-variants/commit/d6510b010410ec883cc793745f5dab9301b39873) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **release:** configure semantic release with GitHub Actions
- [#18](https://github.com/JeongHwan-dev/emotion-variants/pull/18) [`656c4a8`](https://github.com/JeongHwan-dev/emotion-variants/commit/656c4a87e08f90ad23b5bc297dedfbfcab5d5eac) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **release:** fix release workflow
- [#19](https://github.com/JeongHwan-dev/emotion-variants/pull/19) [`76eefea`](https://github.com/JeongHwan-dev/emotion-variants/commit/76eefea731dce61fac28838a8bbb22e86eca422b) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **release:** fix release workflow
- [#13](https://github.com/JeongHwan-dev/emotion-variants/pull/13) [`06e8467`](https://github.com/JeongHwan-dev/emotion-variants/commit/06e8467e2d1158e5ab2eb0f10313b71129be2345) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **release:** fix release workflow conditions and Node.js version
- [#16](https://github.com/JeongHwan-dev/emotion-variants/pull/16) [`e8497a9`](https://github.com/JeongHwan-dev/emotion-variants/commit/e8497a9f851c4cb835dbc9cc2d625bbdea7d1829) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **release:** update release configuration and add release script
- [#3](https://github.com/JeongHwan-dev/emotion-variants/pull/3) [`2488518`](https://github.com/JeongHwan-dev/emotion-variants/commit/248851831fff477f53a2810c48814b6380304b65) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **workflows:** add auto PR assignee workflow to assign repository owner
- [#4](https://github.com/JeongHwan-dev/emotion-variants/pull/4) [`3373071`](https://github.com/JeongHwan-dev/emotion-variants/commit/337307185d1f55b6224711cdcde0e0850bc70729) Thanks [@JeongHwan-dev](https://github.com/JeongHwan-dev)! - **workflows:** add automated label generation files
