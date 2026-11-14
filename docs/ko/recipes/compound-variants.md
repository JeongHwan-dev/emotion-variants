# 복합 Variants

복합 variant는 나열한 variant 값이 모두 맞아떨어질 때만 스타일을 적용해요. "`variant: 'outlined'` *이면서* `color: 'danger'`일 때만" 같은 요구사항에 대한 답이에요. 축을 하나만 적어도 괜찮아요. 그럴 때는 다른 모든 variant 뒤에 적용되는 스타일처럼 동작해요.

## 언제 쓰면 좋나요?

이런 상황에서 복합 variant를 쓰면 좋아요.

- 어떤 스타일이 두 개 이상의 축에 동시에 의존할 때.
- 단일 축 variant로 표현하려면 축을 새로 만들거나 값을 중복으로 정의해야 할 때.
- 컴포넌트 안에 `size === 'lg' && color === 'primary' && ...` 같은 조건문이 늘어나기 시작할 때.

스타일이 단 한 축에만 의존한다면 그냥 `variants`에 바로 넣어 주세요. 복합 variant는 축의 교차(cross-product)를 위한 도구예요.

## 패턴: filled / outlined / text × color

디자인 시스템에서 흔히 보이는 패턴이에요. 같은 색상 세트를 세 가지 스타일로 표현해요.

```ts
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '8px 16px',
    borderRadius: 8,
    cursor: 'pointer',
    border: 'none',
  },

  variants: {
    variant: {
      filled: {},
      outlined: {
        background: 'transparent',
        border: '2px solid currentColor',
      },
      text: {
        background: 'transparent',
      },
    },
    color: {
      primary: {},
      danger: {},
    },
  },

  compoundVariants: [
    // Filled
    {
      variants: {
        variant: 'filled',
        color: 'primary',
      },
      style: {
        background: '#d36ac2',
        color: 'white',
      },
    },
    {
      variants: {
        variant: 'filled',
        color: 'danger',
      },
      style: {
        background: '#dc3545',
        color: 'white',
      },
    },

    // Outlined
    {
      variants: {
        variant: 'outlined',
        color: 'primary',
      },
      style: {
        color: '#d36ac2',
      },
    },
    {
      variants: {
        variant: 'outlined',
        color: 'danger',
      },
      style: {
        color: '#dc3545',
      },
    },

    // Text
    {
      variants: {
        variant: 'text',
        color: 'primary',
      },
      style: {
        color: '#d36ac2',
      },
    },
    {
      variants: {
        variant: 'text',
        color: 'danger',
      },
      style: {
        color: '#dc3545',
      },
    },
  ],

  defaultVariants: {
    variant: 'filled',
    color: 'primary',
  },
});
```

`color` variant가 `variants`에서 빈 객체인 이유는, 스타일이 `variant`와의 **조합에서만** 의미를 갖기 때문이에요. 실제 값은 복합 variant 쪽에 들어 있어요.

## 패턴: size × density 오버라이드

복합 variant가 특정 교차점에서만 기본 속성을 살짝 조정하는 경우도 있어요.

```ts
const card = ev({
  base: {
    padding: 16,
    borderRadius: 12,
  },
  variants: {
    size: {
      sm: {
        padding: 12,
      },
      md: {
        padding: 16,
      },
      lg: {
        padding: 24,
      },
    },
    density: {
      comfortable: {},
      compact: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        size: 'lg',
        density: 'compact',
      },
      style: {
        padding: 16,
      },
    },
  ],
});
```

`lg + compact` 조합에서만 size가 정한 기본 padding을 덮어써요.

## 여러 값에 일치시키기 {#matching-several-values}

조건에는 배열을 쓸 수 있어요. variant가 나열한 값 중 **어느 하나**이면 일치하기 때문에, 값마다 복사해 두어야 했던 항목을 하나로 줄일 수 있어요.

```ts
const button = ev({
  variants: {
    variant: {
      filled: {},
      outlined: {},
      text: {},
    },
    color: {
      primary: {},
      danger: {},
    },
  },
  compoundVariants: [
    {
      variants: {
        variant: ['outlined', 'text'],
        color: 'danger',
      },
      style: {
        color: 'crimson',
      },
    },
  ],
});

button({ variant: 'outlined', color: 'danger' }); // 복합 스타일이 포함돼요
button({ variant: 'text', color: 'danger' }); // 여기에도 포함돼요
button({ variant: 'filled', color: 'danger' }); // 복합 스타일은 빠져요
```

축끼리는 여전히 AND로 묶여요. 나열한 축이 모두 일치해야 하고, 배열은 자기 축에서 일치로 치는 값의 범위만 넓혀요. 빈 배열은 어떤 값과도 일치하지 않아요.

## 순서가 중요해요

각 호출에서 복합 variant는 단순 variant **뒤에**, 배열에 적힌 순서대로 추가돼요. 두 복합 variant가 같은 속성을 설정하고 둘 다 일치하면, 뒤에 오는 게 이겨요.

```ts
compoundVariants: [
  {
    variants: {
      size: 'lg',
    },
    style: {
      fontWeight: 600,
    },
  },
  {
    variants: {
      size: 'lg',
      color: 'primary',
    },
    style: {
      fontWeight: 700, // 위 항목을 덮어써요
    },
  },
],
```

::: tip
**단일 축**만 일치시키는 복합 variant를 둘 수도 있어요. 일반 variant와 동작은 같지만, 모든 "조건부" 규칙을 한 곳에 모으고 싶을 때 유용해요.
:::

## 함께 보기

- [기본 Variants](./default-variants)
- [핵심 개념 → compoundVariants](../core-concepts#compoundvariants)
