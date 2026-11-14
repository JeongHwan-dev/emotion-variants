# Slots

컴포넌트가 요소 하나로 끝나는 경우는 드물어요. 카드에는 root, title, footer가 있고, `size` 같은 variant는 보통 그중 여러 개를 한꺼번에 바꿔요. `slots`를 쓰면 `ev()` 호출 하나로 모든 부분을 스타일링할 수 있어요. 부분들이 같은 variant를 공유하니 서로 어긋날 일이 없어요.

## 부분 선언하기

`base` 대신 `slots`를 써요. 각 키는 컴포넌트의 한 부분을 가리키고, 그 부분의 기본 스타일을 담아요.

```ts
import { ev } from 'emotion-variants';

const card = ev({
  slots: {
    root: {
      borderRadius: 12,
      padding: 16,
    },
    title: {
      fontWeight: 600,
    },
    footer: {
      display: 'flex',
      gap: 8,
    },
  },
});
```

이제 `card()`를 호출하면 slot마다 스타일 함수를 하나씩 돌려줘요. 각 요소를 렌더링하는 자리에서 호출하세요.

```tsx
function Card({ heading, children }: CardProps) {
  const { root, title, footer } = card();

  return (
    <section css={root()}>
      <h3 css={title()}>{heading}</h3>
      <div css={footer()}>{children}</div>
    </section>
  );
}
```

::: warning
slot은 스타일이 아니라 함수예요. `css={root()}`로 쓰세요. Emotion은 `css`에 넘긴 함수를 theme과 함께 호출해요. 그래서 `css={root}`로 쓰면 theme 객체가 slot의 variants로 읽혀요.
:::

## slot별 variant

`slots`가 있으면 variant 값은 slot 이름과 스타일을 짝지어요. 값에는 바꾸려는 slot만 적으면 돼요.

```ts
const card = ev({
  slots: {
    root: {
      borderRadius: 12,
      padding: 16,
    },
    title: {
      fontWeight: 600,
    },
    footer: {
      display: 'flex',
      gap: 8,
    },
  },
  variants: {
    size: {
      small: {
        root: {
          padding: 12,
        },
        title: {
          fontSize: 14,
        },
      },
      large: {
        root: {
          padding: 24,
        },
        title: {
          fontSize: 20,
        },
      },
    },
    tone: {
      neutral: {},
      danger: {
        title: {
          color: 'crimson',
        },
      },
    },
  },
  defaultVariants: {
    size: 'small',
    tone: 'neutral',
  },
});

const { root, title, footer } = card({
  size: 'large',
  tone: 'danger',
});
```

호출 한 번으로 모든 slot의 variant가 정해져요. `root()`는 large의 padding을, `title()`은 large의 font size와 danger의 color를 받아요. `footer()`는 어떤 variant도 언급하지 않아서 기본 스타일만 받아요.

## 한 slot에서만 variant 바꾸기

각 slot 함수는 호출할 때와 같은 variant props를 받아요. slot props가 호출 props를 이기고, 호출 props가 `defaultVariants`를 이겨요.

```tsx
const { root, title } = card({
  size: 'large',
});

root(); // large
title({
  size: 'small',
}); // title만 small
```

다른 곳과 마찬가지로 `undefined`는 다음 단계로 떨어져요. 그래서 선택 prop을 slot에 그대로 넘겨도 안전해요.

## 복합 variant

`compoundVariants`는 똑같이 동작하고, `style`만 slot 이름으로 나눠 적어요.

```ts
compoundVariants: [
  {
    variants: {
      size: 'large',
      tone: 'danger',
    },
    style: {
      title: {
        textTransform: 'uppercase',
      },
    },
  },
],
```

복합 variant는 slot마다, 그 slot에서 정해진 값을 기준으로 일치 여부를 따져요. 그래서 한 slot에서 variant를 바꾸면 그 slot에서만 복합 variant가 켜지거나 꺼질 수 있어요.

```ts
const { title } = card({
  tone: 'danger',
});

title(); // small + danger: 복합 스타일 없음
title({
  size: 'large',
}); // large + danger: uppercase
```

## 여러 slot에 같은 스타일 적용하기

`compoundSlots`는 스타일 하나를 여러 slot에 적용해요. slot 이름마다 같은 스타일을 반복해서 적지 않아도 돼요.

```ts
compoundSlots: [
  {
    slots: ['title', 'footer'],
    style: {
      paddingInline: 4,
    },
  },
  {
    slots: ['root', 'footer'],
    variants: {
      size: 'large',
    },
    style: {
      gap: 16,
    },
  },
],
```

`variants`는 선택이에요. 없으면 항상 적용되고, 있으면 `compoundVariants`와 같은 규칙으로 일치 여부를 따져요. 배열 조건도 쓸 수 있어요.

## 순서

slot마다 스타일은 이 순서로 쌓이고, CSS가 충돌하면 뒤에 오는 게 이겨요.

1. `slots`에 적은 그 slot의 기본 스타일
2. 일치하는 `variants` 항목 (축을 선언한 순서대로)
3. 일치하는 `compoundVariants` 항목 (배열 순서대로)
4. 일치하는 `compoundSlots` 항목 (배열 순서대로)

## class name

`className()`은 slot마다 class name을 하나씩 반환해요.

```tsx
const classNames = card.className({
  size: 'large',
});

<section className={classNames.root}>
  <h3 className={classNames.title}>Title</h3>
</section>;
```

`slots`를 선언하면 `classNames` 조회용 테이블은 없어요.

## 규칙

- `base`와 `slots`는 함께 쓸 수 없어요. 스타일은 slot에 넣으세요. 보통 `root`라는 이름을 써요.
- variant 값, 복합 variant의 `style`, `compoundSlots` 항목에는 선언한 slot 이름만 쓸 수 있어요. 그 외에는 타입 에러가 나서 오타를 잡아 줘요.
- `'&:hover'` 같은 selector는 slot 이름 옆이 아니라 slot의 스타일 안에 적어요.
- `compoundSlots`는 `slots`가 있어야 쓸 수 있어요.

## Props

[`VariantProps`](./typed-props)는 slot 함수에도 쓸 수 있어요. 모든 slot이 공유하는 variant props를 돌려줘요.

```ts
import type { VariantProps } from 'emotion-variants';

type CardVariants = VariantProps<typeof card>;
// { size?: 'small' | 'large'; tone?: 'neutral' | 'danger' }
```

## 함께 보기

- [복합 Variants](./compound-variants)
- [API 레퍼런스 → slots](../reference/ev#slots)
