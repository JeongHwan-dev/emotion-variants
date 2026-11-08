# 타입

`emotion-variants`가 export하는 타입 전체와, 각각 언제 꺼내 쓰면 되는지 정리했어요.

```typescript
import type {
  CompoundVariant,
  EvClassNames,
  EvConfig,
  EvFunction,
  EvVariants,
  VariantConfig,
  VariantKeys,
  VariantValue,
  VariantValueFor,
} from 'emotion-variants';
```

대부분의 경우 이 타입들을 쓸 일이 없어요. variant 타입은 설정 객체에서 추론되기 때문에, generic을 직접 적는 것보다 이미 가지고 있는 함수에서 props를 꺼내는 쪽이 훨씬 짧아요.

```typescript
type ButtonVariants = NonNullable<Parameters<typeof button>[0]>;
```

이 패턴은 [Props 타입 추출](../recipes/typed-props)에서 자세히 다뤄요.

## 사용법

### `EvConfig<T>`

[`ev()`](./ev)에 넘기는 객체의 모양이에요. 설정을 별도 변수나 factory로 분리할 때 쓸 만해요.

```typescript
import type { EvConfig } from 'emotion-variants';

const config: EvConfig<{ size: { small: { fontSize: number } } }> = {
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
    },
  },
};
```

네 필드 `base`, `variants`, `compoundVariants`, `defaultVariants`는 모두 선택이에요.

### `EvFunction<T>`

[`ev()`](./ev)가 반환하는 값의 타입이에요. 호출 가능하고, 여기에 `variants()` · `className()` · `classNames`가 붙어 있어요.

```typescript
interface EvFunction<T> {
  (variants?: EvVariants<T>): SerializedStyles[];
  variants: () => Array<VariantKeys<T>>;
  className: (variants?: EvVariants<T>) => string;
  classNames: EvClassNames<T>;
}
```

### `EvVariants<T>`

variant 함수의 인자 타입이에요. 모든 축이 선택이고, 선언한 값으로 좁혀져 있어요. 컴포넌트 props를 직접 작성할 때 쓰면 좋아요.

```typescript
import type { EvVariants } from 'emotion-variants';

type Variants = EvVariants<{
  size: { small: {}; large: {} };
}>;
// { size?: 'small' | 'large' }
```

### `EvClassNames<T>`

[`classNames`](./ev#classnames)의 모양이에요. `base` 하나와 variant 값마다 class name이 하나씩 있어요. 키는 각 값을 문자열로 바꾼 형태예요.

```typescript
type ClassNames = EvClassNames<{
  outlined: { true: {}; false: {} };
}>;
// { base: string; variants: { outlined: { true: string; false: string } } }
```

### `CompoundVariant<T>`

`compoundVariants` 배열의 한 항목이에요. compound 규칙을 별도 배열로 만들어 둘 때 꺼내 쓰세요.

```typescript
import type { CompoundVariant } from 'emotion-variants';

const compounds: Array<CompoundVariant<typeof variants>> = [
  {
    variants: {
      size: 'large',
      color: 'primary',
    },
    style: {
      fontWeight: 'bold',
    },
  },
];
```

### `VariantValue`

variant 축이 받을 수 있는 값의 타입이에요.

```typescript
type VariantValue = string | number | boolean;
```

### `VariantConfig<T>`

`variants` 필드에 걸리는 제약이에요. 직접 쓸 일은 거의 없고, `ev()`의 시그니처와 다른 generic 타입들 안에 등장해요.

### `VariantKeys<T>`

variant 설정에 있는 축 이름들의 union이에요.

```typescript
type Keys = VariantKeys<{ size: {}; color: {} }>; // 'size' | 'color'
```

### `VariantValueFor<T, K>`

한 축이 받을 수 있는 값이에요. 스타일 객체의 키에서 거꾸로 추론해요. 문자열 키는 문자열로 남고, `'true'`와 `'false'`는 `boolean`이 되고, 숫자 키는 숫자 literal이 돼요.

```typescript
type Size = VariantValueFor<{ size: { small: {}; large: {} } }, 'size'>;
// 'small' | 'large'

type Outlined = VariantValueFor<{ outlined: { true: {}; false: {} } }, 'outlined'>;
// boolean
```

## Emotion 타입

`CSSObject`와 `SerializedStyles`는 `@emotion/react`에서 오고, `emotion-variants`가 다시 export하지는 않아요. 필요하면 Emotion에서 직접 import하세요.

```typescript
import type { CSSObject, SerializedStyles } from '@emotion/react';
```
