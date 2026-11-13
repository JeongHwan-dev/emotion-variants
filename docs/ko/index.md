---
layout: home

hero:
  name: emotion-variants
  text: Emotion을 위한 Type-safe variant API
  tagline: 반복적인 css() 호출 없이, 여러 variant를 가진 컴포넌트 스타일을 깔끔하게 정의해요.
  image:
    src: /logo.svg
    alt: emotion-variants
  actions:
    - theme: brand
      text: 시작하기
      link: /ko/getting-started
    - theme: alt
      text: GitHub에서 보기
      link: https://github.com/JeongHwan-dev/emotion-variants

features:
  - icon: 🎯
    title: 완전한 타입 추론
    details: variant 키와 값, 그리고 조합까지 TypeScript가 자동으로 추론해요. 캐스팅이나 `any`가 필요 없어요.
  - icon: 🎨
    title: 복합 variants
    details: 여러 variant가 동시에 일치할 때만 적용되는 스타일을 정의할 수 있어요. 예를 들면 `large`와 `primary` 조합처럼요.
  - icon: 📦
    title: 기본 variants
    details: 합리적인 기본값을 정해 두면, props 없이 호출해도 스타일이 자연스럽게 잡혀요.
  - icon: 🚀
    title: 미리 직렬화된 스타일
    details: base 스타일은 정의 시점에 한 번만 직렬화돼요. 호출할 때는 일치하는 스타일을 골라 `css` prop에 넘기기만 해요.
  - icon: 🪶
    title: Emotion과 그대로
    details: "`@emotion/react`의 `css` prop과 바로 연결돼요. 번들러 설정도, Provider도 필요 없어요."
  - icon: 🔍
    title: classNames 직접 접근
    details: 생성된 클래스 이름을 코드에서 바로 읽을 수 있어요. 테스트나 React 외부 환경에서 쓰기 좋아요.
---

```tsx
import { ev, type VariantProps } from 'emotion-variants';

const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  variants: {
    size: {
      small: {
        fontSize: '12px',
      },
      large: {
        fontSize: '16px',
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
    size: 'small',
    color: 'primary',
  },
});

type ButtonProps = VariantProps<typeof button> & {
  children: React.ReactNode;
};

function Button({ size, color, children }: ButtonProps) {
  return <button css={button({ size, color })}>{children}</button>;
}
```
