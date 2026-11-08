# 설치

## 요구 사항

- **React** 16.8 이상 (Hooks 도입 버전)
- **`@emotion/react`** 11.x
- **`@emotion/css`** 11.x

## 설치하기

::: code-group

```sh [pnpm]
pnpm add emotion-variants @emotion/react @emotion/css
```

```sh [npm]
npm install emotion-variants @emotion/react @emotion/css
```

```sh [yarn]
yarn add emotion-variants @emotion/react @emotion/css
```

:::

Emotion 패키지 두 개는 모두 peer dependency라서 `emotion-variants`와 함께 꼭 설치해야 해요. `@emotion/react`는 `css` prop에 넘길 스타일을 직렬화하고, `@emotion/css`는 [`className()`과 `classNames`](./reference/ev#classname)를 담당해요. `@emotion/css`는 조건 없이 import되기 때문에, `css` prop만 쓴다고 해도 설치는 필요해요.

## `css` prop 활성화

`emotion-variants`가 반환하는 값은 Emotion의 `css` prop에 그대로 넘기는 형태예요. 그래서 프로젝트에 `css` prop이 활성화돼 있어야 동작해요. 가장 간단한 방법은 JSX import-source pragma를 쓰는 거예요.

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsxImportSource": "@emotion/react"
  }
}
```

파일 단위로 지정할 수도 있어요.

```tsx
/** @jsxImportSource @emotion/react */
```

다른 설정 방법(Babel 플러그인, Next.js, Vite 등)은 [Emotion 공식 설치 가이드](https://emotion.sh/docs/css-prop)를 참고해 주세요.

## 동작 확인

작은 컴포넌트를 하나 만들어 렌더링해 보세요. `button({ ... })` 안에서 TypeScript가 `size`를 자동완성해 주면 잘 설정된 거예요.

```tsx
import { ev } from 'emotion-variants';

const button = ev({
  base: {
    padding: '8px 16px',
  },
  variants: {
    size: {
      sm: {
        fontSize: 12,
      },
      lg: {
        fontSize: 16,
      },
    },
  },
});

type ButtonProps = NonNullable<Parameters<typeof button>[0]> & {
  children: React.ReactNode;
};

export function Button({ size, children }: ButtonProps) {
  return <button css={button({ size })}>{children}</button>;
}
```

다음: [시작하기](./getting-started).
