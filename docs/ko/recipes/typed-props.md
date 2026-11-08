# Props 타입 추출

`emotion-variants`는 설정에서 variant 타입을 알아서 추론해요. 이 레시피에서는 `ev()` 결과에서 **React 컴포넌트 props**를 끌어내, 컴포넌트의 prop 타입과 스타일이 항상 같이 움직이도록 만드는 방법을 다뤄요.

## 재사용할 수 있는 `VariantProps` 헬퍼

`emotion-variants`는 `VariantProps` 헬퍼를 기본 제공하지 않아요. 하지만 프로젝트 안에 한 줄로 정의해 두면 돼요.

```ts
// types.ts (앱 또는 디자인 시스템 내부)
export type VariantProps<T extends (...args: any) => any> =
  NonNullable<Parameters<T>[0]>;
```

이제 어떤 `ev()` 결과에서도 variant 타입을 끌어낼 수 있어요.

```ts
import { ev } from 'emotion-variants';
import type { VariantProps } from './types';

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

type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariants;

export function Button({ size, color, ...rest }: ButtonProps) {
  return <button css={button({ size, color })} {...rest} />;
}
```

## 기본값과 함께 쓰기

`defaultVariants`(직접 `button()`을 호출할 때 쓰임)와 prop 경계에서 잡는 기본값(`<Button />`을 호출할 때 쓰임)을 함께 두는 걸 추천해요. 둘 다 왜 필요한지는 [기본 Variants](./default-variants) 페이지를 참고해 주세요.

```tsx
export function Button({
  size = 'medium',
  color = 'primary',
  ...rest
}: ButtonProps) {
  return <button css={button({ size, color })} {...rest} />;
}
```

## ref 전달

```tsx
import { forwardRef, type ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariants;

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
