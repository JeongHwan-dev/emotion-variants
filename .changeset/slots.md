---
"emotion-variants": minor
---

feat(core): add `slots` and `compoundSlots` for multi-part components

- `ev({ slots })` styles every part of a component from one config. Variant values and compound `style` are keyed by slot name, and the call returns one style function per slot: `const { root, title } = card({ size })`, then `css={root()}`
- a slot function accepts the same variants as the call, resolved per axis as slot props, then call props, then `defaultVariants`; compound entries are matched per slot against the resolved values
- `compoundSlots` applies one style to several slots, always or only when `variants` match
- with `slots`, `className()` returns one class name per slot and there is no `classNames`; `base` cannot be combined with `slots`
- export the `EvSlotsFunction` type, and add a second type parameter to `EvConfig<T, N>` for the slot names (defaults to `never`)
- `ReturnType<ReturnType<typeof ev>>` no longer resolves to `SerializedStyles[]`, because `ev` now returns either form; use `SerializedStyles[]` from `@emotion/react` directly
