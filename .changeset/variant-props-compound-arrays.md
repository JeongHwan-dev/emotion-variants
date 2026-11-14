---
"emotion-variants": minor
---

feat(core): add the `VariantProps` type and array conditions in `compoundVariants`

- export `VariantProps<T>`, which extracts the variant props from an `ev()` result: `type ButtonVariants = VariantProps<typeof button>`
- a `compoundVariants` condition can now be an array of values, which matches when the variant has any of them: `{ variants: { size: ['small', 'medium'] }, style }`
- fix a variant value that only exists on `Object.prototype`, such as `'constructor'`, pushing a non-style value into the result; unknown values are now ignored
