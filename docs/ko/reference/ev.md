# ev

설정 객체 하나로 타입 안전한 스타일 함수를 만들어요.

```typescript
const button = ev(config);
```

## 사용법

### `ev(config)` {#ev-config}

컴포넌트에 시각적인 축이 둘 이상 있고(size, color, 채움 방식, 상태 같은 것들), 그걸 한곳에 모아 선언하고 싶을 때 `ev`를 사용하세요. variant 값을 넣어 호출하는 함수를 돌려주고, 그 결과는 Emotion의 `css` prop에 그대로 넘기면 돼요.

```typescript
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
      large: {
        fontSize: 16,
      },
    },
    color: {
      primary: {
        background: 'blue',
        color: 'white',
      },
      secondary: {
        background: 'gray',
        color: 'white',
      },
    },
  },
  defaultVariants: {
    size: 'small',
    color: 'primary',
  },
});
```

설정 객체는 필수예요. 아직 선언할 게 없다면 `ev({})`를 넘기세요.

#### 파라미터

- `config.base` (`CSSObject`): 모든 호출에 적용되는 스타일이에요. 호출할 때마다가 아니라 `ev()`가 실행될 때 한 번만 직렬화돼요.
- `config.variants` (`Record<string, Record<string, CSSObject>>`): variant 축이에요. 각 축은 값과 그 값의 스타일을 짝지어요. 값이 객체 키라서 Boolean과 숫자 값은 `true`, `false`, `1`처럼 키로 쓰면 되고, 타입은 `boolean`과 숫자 literal로 되돌아와요.
- `config.compoundVariants` (`Array<{ variants, style }>`): 나열한 variant 값이 **모두** 일치할 때만 적용되는 스타일이에요. 조건에 값의 배열을 쓰면 그중 어느 값이든 일치해요. 키 이름이 `style` 단수인 점을 눈여겨보세요.
- `config.defaultVariants` (`Partial<Record<Axis, Value>>`): 호출하는 쪽에서 축을 생략했을 때 쓰이는 값이에요.

#### 반환 값

(`EvFunction<T>`): 호출 가능한 객체예요. 호출하면 스타일을 돌려주고, [`className()`](#classname) · [`classNames`](#classnames) · [`variants()`](#variants)를 꺼내 쓸 수도 있어요.

### `button(variants)` {#call}

variant 함수를 호출하면 그 조합의 스타일을 받아요. 결과는 `css` prop이나 Emotion의 `css()`에 넘기세요.

```tsx
import type { VariantProps } from 'emotion-variants';

type ButtonProps = VariantProps<typeof button> & {
  children: React.ReactNode;
};

function Button({ size, color, children }: ButtonProps) {
  return <button css={button({ size, color })}>{children}</button>;
}
```

```tsx
<Button>defaultVariants가 적용돼요</Button>
<Button size="large" color="primary">Large primary</Button>
```

값은 키 단위로 `??`로 결정돼요. 그래서 생략하거나 `undefined`를 넘기면 `defaultVariants`로 떨어져요. 위 `Button`이 선택 prop을 따로 걸러내지 않고 그대로 넘길 수 있는 이유예요. `false`와 `0`은 실제 값이라서 그대로 쓰여요.

`null`도 런타임에서는 기본값으로 떨어지지만, `EvVariants` 타입에는 `null`이 없어요. `strictNullChecks`에서 `button({ size: null })`은 타입 에러예요. 호출 전에 `undefined`로 바꿔 주세요.

```typescript
button({ size: undefined }); // button()과 완전히 같아요
```

prop도 기본값도 없는 축은 아예 건너뛰어요.

#### 파라미터

- `variants` (`EvVariants<T>`, 선택): variant 값이에요. 모든 키가 선택이에요.

#### 반환 값

(`SerializedStyles[]`): 일치하는 스타일이 하나뿐일 때도 **항상 배열**이에요. 순서는 `base` → 일치하는 `variants` 항목(축을 선언한 순서) → 일치하는 `compoundVariants`(배열 순서)예요. CSS가 충돌하면 뒤에 오는 게 이기고, 넘기는 키의 순서는 결과에 영향을 주지 않아요.

### `button.className(variants)` {#classname}

`css` prop이 아니라 평범한 class 문자열이 필요할 때 `className()`을 사용하세요. React가 아닌 환경, `className`만 받는 외부 컴포넌트, 테스트 단정 같은 경우예요. `base`와 일치하는 variants, 그리고 **compound variants까지** 하나의 class로 합쳐 줘요.

```tsx
<button className={button.className({ size: 'large', color: 'primary' })}>Click me</button>;

// defaultVariants는 button()과 똑같이 적용돼요.
button.className();
```

#### 파라미터

- `variants` (`EvVariants<T>`, 선택): variant 값이에요. 모든 키가 선택이에요.

#### 반환 값

(`string`): 조합 전체를 담은 class name 하나를 반환해요.

### `button.classNames` {#classnames}

개별 class name을 모아 둔 조회용 테이블이에요. `base` 하나와 variant 값마다 하나씩 들어 있어요. class 목록을 직접 조립하는 코드와 함께 쓰거나, 무엇이 생성됐는지 들여다볼 때 편해요.

```typescript
const button = ev({
  base: {
    padding: 10,
  },
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
      large: {
        fontSize: 16,
      },
    },
    outlined: {
      true: {
        border: '1px solid',
      },
    },
    level: {
      1: {
        zIndex: 1,
      },
    },
  },
});

button.classNames.base; // 'css-abc123'
button.classNames.variants.size.small; // 'css-def456'
```

키는 값을 문자열로 바꾼 형태예요. 그래서 Boolean과 숫자 축은 `true`, `1`로 읽어요.

```typescript
button.classNames.variants.outlined.true;
button.classNames.variants.level[1];
```

`classNames`에 처음 접근할 때까지는 문서에 아무것도 주입되지 않고, 결과는 memoize돼요. `css` prop만 쓰는 코드는 이 비용을 전혀 치르지 않아요.

```typescript
button.classNames === button.classNames; // true
```

::: warning
`classNames`는 `base`와 단일 variant 값만 다뤄요. **compound variants는 여기에 들어 있지 않아요.** 조합에 대응하는 키가 없어요. compound 스타일이 필요하면 [`className()`](#classname)을 사용하세요.

이 class들을 이어 붙이는 건 함수를 호출하는 것과 달라요. 각각이 specificity가 같은 별개의 규칙이라서, `base`와 variant가 같은 property를 지정하면 나열한 순서가 아니라 Emotion이 먼저 주입한 쪽이 이겨요. variant가 `base`를 이겨야 한다면 [`className()`](#classname)을 쓰세요.

설정에 `base`가 없으면 `base`는 빈 문자열이에요.
:::

#### 반환 값

(`EvClassNames<T>`): `{ base, variants }` 형태예요. `variants[축][값]`이 class name이에요.

### `button.variants()` {#variants}

축 이름을 선언한 순서대로 반환해요. Storybook argTypes나 props 표를 만들 때 쓸 만해요.

```typescript
const button = ev({
  variants: {
    size: {
      small: {},
      large: {},
    },
    color: {
      primary: {},
      secondary: {},
    },
  },
});

button.variants(); // ['size', 'color']
```

`variants`가 없는 설정은 `[]`를 반환해요.

#### 반환 값

(`Array<VariantKeys<T>>`): 축 이름이에요. 호출할 때마다 같은 배열 instance를 돌려주니 읽기 전용으로 다뤄 주세요.

## 사용해보기

variant 값을 바꿔 보면서 버튼이 어떻게 달라지는지 확인해 보세요.

::: sandpack

```tsx App.tsx
/** @jsxImportSource @emotion/react */
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
  },
  variants: {
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      large: {
        padding: '12px 24px',
        fontSize: 16,
      },
    },
    color: {
      primary: {
        background: '#d36ac2',
        color: 'white',
      },
      secondary: {
        background: '#6c757d',
        color: 'white',
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        size: 'large',
        color: 'primary',
      },
      style: {
        boxShadow: '0 4px 12px rgba(211, 106, 194, 0.4)',
      },
    },
  ],
  defaultVariants: {
    size: 'small',
    color: 'primary',
  },
});

type ButtonProps = NonNullable<Parameters<typeof button>[0]> & {
  children: React.ReactNode;
};

function Button({ size, color, children }: ButtonProps) {
  return <button css={button({ size, color })}>{children}</button>;
}

export default function App() {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button>Default</Button>
      <Button size="large">Large primary</Button>
      <Button size="large" color="secondary">
        Large secondary
      </Button>
    </div>
  );
}
```

:::

## 타입

`EvConfig`, `EvFunction`, `EvVariants` 등 export되는 타입 정의는 [타입](./types)에서 확인하세요.

::: warning `@emotion/css`와 함께 쓸 때
`className()`과 `classNames`는 [`@emotion/css`](https://emotion.sh/docs/@emotion/css)를 거쳐요. `@emotion/css`는 `@emotion/react`와 별개인 자체 global cache를 갖고 있어요. 그래서 `CacheProvider`의 `key`나 `nonce` 같은 옵션을 무시하고, 서버 렌더링에서 이 스타일을 뽑아내려면 [`@emotion/server`](https://emotion.sh/docs/ssr#advanced-approach)가 필요해요.

같은 엘리먼트에 `css={button(...)}`와 `className={button.className(...)}`를 함께 쓰는 건 피하세요. 두 cache는 주입 순서를 공유하지 않아서, 덮어쓰기가 예상대로 동작하지 않을 수 있어요.

서버 렌더링에서는 뽑아내야 할 cache가 하나가 아니라 둘이라는 뜻이에요. `@emotion/react`의 cache만 모으면 `className()`과 `classNames`가 만든 규칙이 빠진 마크업이 나가서, hydration 전까지 스타일이 없는 화면이 보여요.
:::
