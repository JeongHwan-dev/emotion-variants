# 기본 Variants

`defaultVariants`를 정해 두면, props를 생략해도 스타일이 적용된 컴포넌트를 얻을 수 있어요. 이 레시피에서는 언제 쓰면 좋은지, 흔히 빠지는 함정, 그리고 합리적인 기본값 패턴을 살펴봐요.

## 가장 흔한 경우를 기본값으로

코드베이스의 `<Button>` 호출 중 80%가 `size: 'medium'`, `color: 'primary'`를 쓴다면, 그게 기본값이 돼야 해요.

```ts
const button = ev({
  variants: {
    size: {
      small: {},
      medium: {},
      large: {},
    },
    color: {
      primary: {},
      secondary: {},
      danger: {},
    },
  },
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});

button();                  // medium primary
button({ size: 'large' }); // large primary
```

## 선택 props를 그대로 넘기기

기본값은 키 단위로 `props[key] ?? defaultVariants[key]`로 메워져요. 그래서 `undefined`와 `null`은 둘 다 기본값으로 떨어져요. 선택 prop을 따로 걸러내지 않고 variant 함수에 그대로 넘겨도 돼요.

```tsx
type Props = {
  size?: 'small' | 'medium' | 'large';
};

function Button({ size }: Props) {
  // prop을 생략하면 size는 undefined지만, 'medium'이 그대로 적용돼요.
  return <button css={button({ size })}>Click</button>;
}
```

```ts
button({ size: undefined }); // button()과 완전히 같아요 — medium primary
```

그래서 `defaultVariants`가 있는데 prop 기본값(`{ size = 'medium' }`)까지 또 줄 필요는 없어요. 기본값은 한 곳에서만 선언하세요. 컴포넌트 밖에서 `button()`을 직접 부르는 경우까지 덮어 주는 쪽은 `defaultVariants`예요.

::: warning
`false`와 `0`은 유효한 variant 값이라서, 기본값으로 떨어지지 않고 그 값 그대로 쓰여요.

```ts
const box = ev({
  variants: {
    outlined: {
      true: {
        border: '1px solid',
      },
      false: {
        border: 'none',
      },
    },
  },
  defaultVariants: {
    outlined: true,
  },
});

box({ outlined: false }); // border: none. 기본값 `true` 스타일이 아니에요
```
:::

## Boolean variant의 기본값

문자열 키 `'true'` / `'false'`가 아니라 실제 Boolean `true` / `false`를 써요.

```ts
const x = ev({
  variants: {
    outlined: {
      true: {
        border: '1px solid',
      },
      false: {
        border: 'none',
      },
    },
  },
  defaultVariants: {
    outlined: false,
  },
});

x(); // false 스타일이 적용돼요
```

## 복합 variant와도 잘 맞아요

기본값은 복합 매칭을 평가할 때 쓰일 variant 값으로도 들어가요.

```ts
const button = ev({
  variants: {
    size: {
      small: {},
      large: {},
    },
    color: {
      primary: {},
      danger: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        size: 'large',
        color: 'primary',
      },
      style: {
        fontWeight: 'bold',
      },
    },
  ],
  defaultVariants: {
    size: 'large',
    color: 'primary',
  },
});

button(); // 기본값이 복합 조건을 만족하므로 bold가 적용돼요
```

## 함께 보기

- [복합 Variants](./compound-variants)
- [핵심 개념 → defaultVariants](../core-concepts#defaultvariants)
