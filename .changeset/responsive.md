---
"emotion-variants": minor
---

feat(core): add `createEv` for responsive variant values

- `createEv({ breakpoints })` returns `{ ev }`; breakpoints are media queries keyed by a name, declared smallest first
- every variant prop of that `ev` also accepts `{ initial, [breakpoint]: value }`; `initial` falls back to the default variant, and each breakpoint's styles are wrapped in its media query, in declared order
- an axis that received a responsive value matches no compound variant in that call
- `className()` and slot functions accept the same values; `defaultVariants` does not
- the exported `ev` is `createEv().ev` and behaves as before
- add the `Ev<B>` type, and a trailing breakpoint-name parameter `B` (defaults to `never`) to `EvVariants<T, B>`, `EvFunction<T, B>`, and `EvSlotsFunction<N, T, B>`
