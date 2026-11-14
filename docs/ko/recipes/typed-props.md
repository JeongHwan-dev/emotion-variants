# Props 타입 추출

`emotion-variants`는 설정에서 variant 타입을 알아서 추론해요. 이 레시피에서는 `ev()` 결과에서 **React 컴포넌트 props**를 끌어내, 컴포넌트의 prop 타입과 스타일이 항상 같이 움직이도록 만드는 방법을 다뤄요.

## `VariantProps` 타입

`emotion-variants`는 `VariantProps`를 export해요. `ev()` 결과의 타입을 넘기면 variant 타입을 끌어낼 수 있어요.

```ts
import { ev, type VariantProps } from 'emotion-variants';

const button = ev({
  variants: {
    size: {
      small: {},
      medium: {},
      large: {},
    },
    color: {
      primary: {},
      danger: {},
    },
  },
});

type ButtonVariants = VariantProps<typeof button>;
// { size?: 'small' | 'medium' | 'large'; color?: 'primary' | 'danger' }
```

`variants.size`에 새 값을 추가하면 `ButtonVariants['size']`도 자동으로 따라와요.

## HTML 요소 props와 결합

button처럼 HTML 요소를 감싸는 컴포넌트라면 `ComponentPropsWithoutRef`와 교집합 타입으로 묶어 줘요.

```tsx
import type { ComponentPropsWithoutRef } from 'react';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariants;

export function Button({ size, color, ...rest }: ButtonProps) {
  return <button css={button({ size, color })} {...rest} />;
}
```

## 기본값과 함께 쓰기

기본값은 `defaultVariants` 한 곳에만 선언하고, props는 그대로 넘기세요. 생략된 prop은 `undefined`로 도착해도 기본값으로 해석되기 때문에, prop 경계에 기본값을 한 번 더 두면 두 값이 어긋날 자리만 생겨요.

```tsx
const button = ev({
  variants: {
    /* ... */
  },
  defaultVariants: {
    size: 'medium',
    color: 'primary',
  },
});

export function Button({ size, color, ...rest }: ButtonProps) {
  return <button css={button({ size, color })} {...rest} />;
}
```

해석 규칙은 [기본 Variants](./default-variants)에서 확인하세요.


## ref 전달

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariants;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size, color, ...rest }, ref) => (
    <button ref={ref} css={button({ size, color })} {...rest} />
  ),
);
```

## 일부 축만 노출하기

특정 축(예: `density`)을 공개 API에서 숨기고 싶다면 `Pick`을 써 주세요.

```ts
type PublicButtonProps =
  ComponentPropsWithoutRef<'button'> &
  Pick<ButtonVariants, 'size' | 'color'>;
```

## 디자인 시스템에서 re-export

`emotion-variants`를 내부에서 쓰는 디자인 시스템 패키지를 만든다면, prop 타입을 함께 export해서 사용자가 내부 스타일 파일을 직접 import하지 않아도 되게 해 주세요.

```ts
// design-system/src/button/index.ts
export { Button } from './button';
export type { ButtonProps } from './button';
```

사용자는 패키지에서 `ButtonProps`만 import하면 되고, 내부 `ev()` 설정은 만질 일이 없어요.

## 함께 보기

- [타입](../reference/types)
- [기본 Variants](./default-variants)
