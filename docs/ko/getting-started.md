# 시작하기

이 페이지에서는 `emotion-variants`로 `Button` 컴포넌트를 처음부터 만들어 봐요.

패키지를 [설치](./installation)하고 Emotion의 `css` prop을 활성화해 둔 상태를 전제로 해요.

## 1. 스타일 정의

컴포넌트의 스타일을 기술하는 설정 객체 하나를 `ev()`에 넘겨요.

```tsx
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
  },
  variants: {
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      medium: {
        padding: '10px 20px',
        fontSize: 14,
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
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});
```

`ev()`는 함수를 돌려줘요. 이 함수에 variant 값을 넘기면, Emotion의 `css` prop에 그대로 넣을 수 있는 스타일이 나와요.

## 2. 컴포넌트에서 사용

```tsx
type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  children: React.ReactNode;
};

export function Button({ size, color, children }: ButtonProps) {
  return <button css={button({ size, color })}>{children}</button>;
}
```

```tsx
<Button>기본값</Button>
<Button size="large">큰 primary</Button>
<Button size="small" color="secondary">작은 secondary</Button>
```

`defaultVariants`가 잡혀 있어서, `<Button>기본값</Button>`은 `medium` + `primary`로 렌더링돼요.

## 3. variant 함수에서 props 타입 추출

prop 타입을 손으로 작성할 필요는 없어요. TypeScript의 `Parameters` 유틸리티를 쓰면 variant 함수에서 바로 끌어낼 수 있어요.

```tsx
const button = ev({
  /* ... */
});

type ButtonVariants = NonNullable<Parameters<typeof button>[0]>;

type ButtonProps = ButtonVariants & {
  children: React.ReactNode;
};
```

::: tip
이 패턴을 쓰면 컴포넌트의 prop 타입과 스타일이 항상 동기화돼요. `variants.size`에 새 값을 추가하면 `ButtonProps`도 자동으로 따라와요.
:::

재사용할 수 있는 `VariantProps` 헬퍼와, HTML 요소 props와 결합하는 패턴은 [Props 타입 추출](./recipes/typed-props)를 참고해 주세요.

## 다음으로

- [핵심 개념](./core-concepts) — `base`, `variants`, `compoundVariants`, `defaultVariants` 자세히 보기.
- [API 레퍼런스](./reference/ev) — `ev()`의 전체 문서.
- [복합 Variants](./recipes/compound-variants) — 조합에만 적용되는 스타일.
