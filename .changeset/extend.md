---
"emotion-variants": minor
---

feat(core): add `extend` to build one `ev()` result on another

- `ev({ extend: button, ... })` inherits the parent's `base`, `variants`, `compoundVariants`, and `defaultVariants`; the parent is not changed
- the parent's styles come before the child's at every step: `base`, then each matching variant value, then compound variants
- a child can add values to an inherited axis, add styles to an inherited value, and declare new axes; `defaultVariants` are merged per axis with the child's value winning
- with `slots`, a child can add slots and style inherited ones; a config with `slots` can only extend one with `slots`
- `extend` throws at definition time when the value is not an `ev()` result, or when a config with `slots` extends one without
- add a third type parameter to `EvConfig<T, N, E>` for the type of the `extend` value (defaults to `undefined`)
