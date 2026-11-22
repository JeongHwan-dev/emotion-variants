---
"emotion-variants": major
---

Stop importing `@emotion/css`. The class-name helpers now come from `createClassName(css)`, which takes the Emotion `css` function that should inject the styles.

- `@emotion/css` is no longer a peer dependency. Install it only if you use the class-name helpers.
- `button.className(variants)` is now `className(button, variants)`.
- `button.classNames` is now `classNames(button)`.
- `classNames()` injects `base` first and then each variant in the order the axes were declared, so concatenated classes resolve like the function call.
- `EvFunction` and `EvSlotsFunction` no longer have `className` and `classNames` members. `ClassNameHelpers` is exported.

```ts
import { css } from '@emotion/css';
import { createClassName } from 'emotion-variants';

export const { className, classNames } = createClassName(css);
```

Pass the `css` of an instance made with `@emotion/css/create-instance` to use `nonce`, `container`, or a custom `key`.
