# 덮어쓰기

어떤 축에도 속하지 않는 스타일이 한 군데서만 필요할 때가 있어요. 폼 안에서만 전체 너비가 되는 버튼, 한 곳에서만 margin이 다른 카드 같은 경우예요. `ev()` 설정에는 `class`나 `css` 같은 탈출구가 없어요. 덮어쓰기는 호출하는 쪽에서 해요.

## 사용법

### `css` prop에 스타일을 덧붙이기

variant 함수는 `SerializedStyles[]`를 반환하고, Emotion의 `css` prop은 배열을 받아요. 추가 스타일을 variant 결과 **뒤에** 두면 그게 이겨요.

```tsx
<button css={[button({ size: 'large' }), { width: '100%' }]}>Submit</button>;
```

Emotion이 중첩 배열을 펼쳐 주기 때문에 spread는 선택이에요. 두 형태가 똑같이 동작해요.

```tsx
<button css={[...button({ size: 'large' }), { width: '100%' }]}>Submit</button>;
```

순서가 전부예요. Emotion은 배열 순서대로 이어 붙이고, 같은 property는 마지막 선언이 이겨요. 덮어쓸 스타일을 앞에 두면 집니다.

```tsx
// ✗ base와 variant 스타일이 `width`를 덮어써요
<button css={[{ width: '100%' }, button({ size: 'large' })]}>Submit</button>;

// ✓ 덮어쓸 스타일을 마지막에
<button css={[button({ size: 'large' }), { width: '100%' }]}>Submit</button>;
```

### 덮어쓰기를 prop으로 받기

`css` 모양의 prop을 받아서 같은 자리에 덧붙이면, 호출하는 쪽은 스타일이 어떻게 조립되는지 몰라도 덮어쓸 수 있어요.

```tsx
import type { Interpolation, Theme } from '@emotion/react';

type ButtonProps = NonNullable<Parameters<typeof button>[0]> & {
  children: React.ReactNode;
  css?: Interpolation<Theme>;
};

function Button({ size, color, css: override, children }: ButtonProps) {
  return <button css={[button({ size, color }), override]}>{children}</button>;
}
```

```tsx
<Button size="large" css={{ width: '100%' }}>
  Submit
</Button>
```

### `className`을 쓰는 곳에서 덮어쓰기

[`className()`](../reference/ev#classname)은 class 하나를 반환해요. 그래서 다른 class를 덧붙이는 방식은 **안정적으로 이기지 못해요.** 두 class의 specificity가 같아서, Emotion이 나중에 주입한 쪽이 이기거든요.

```tsx
// ✗ 순서가 보장되지 않아요
<button className={`${button.className({ size: 'large' })} ${myClass}`}>Submit</button>;
```

class를 합치지 말고 스타일을 합친 다음, `@emotion/css`로 class 하나를 만드세요.

```tsx
import { css as cssClassName } from '@emotion/css';

const full = cssClassName(button({ size: 'large' }), { width: '100%' });

<button className={full}>Submit</button>;
```

## 덮어쓰기 대신 variant를 만들어야 할 때

덮어쓰기는 그 스타일이 **호출 지점 한 곳**에만 속할 때 쓰는 거예요. 같은 덮어쓰기를 두 번 쓰고 있다면, 그건 축이에요.

```ts
// 두 곳에서 모두 전체 너비가 필요했다면 variant로 만드세요.
const button = ev({
  variants: {
    size: {
      small: {},
      large: {},
    },
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {},
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});
```

이렇게 하면 진짜 일회성인 경우에만 덮어쓰기를 남겨 두고, 반복되는 경우에는 이름과 타입과 class name이 생겨요.

## 함께 보기

- [핵심 개념 → 스타일 적용 순서](../core-concepts#style-precedence)
- [복합 Variants](./compound-variants) — 한 인스턴스가 아니라 조합에 적용되는 스타일
