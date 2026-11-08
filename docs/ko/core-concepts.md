# 핵심 개념

`ev()`는 선택 키 네 개로 이루어진 설정 객체 하나를 받아요. `base`, `variants`, `compoundVariants`, `defaultVariants`. 이 페이지에서 하나씩 살펴봐요.

```ts
ev({
  base,             // 모든 variant에 공통으로 적용되는 스타일
  variants,         // 축 × 값 → 스타일
  compoundVariants, // 여러 축이 동시에 일치할 때 적용되는 스타일
  defaultVariants,  // prop을 생략했을 때 쓸 기본값
});
```

## `base`

`base` 스타일은 variant 함수를 호출할 때마다 늘 적용돼요. variant에 영향받지 않는 속성을 여기에 넣어 주세요.

```ts
const button = ev({
  base: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
});

button(); // base 스타일만 적용돼요
```

`base`는 `CSSObject` 하나를 받고, Emotion의 모든 문법(중첩 셀렉터, pseudo-class, 미디어 쿼리, `@keyframes` 등)을 지원해요.

```ts
const button = ev({
  base: {
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
});
```

## `variants`

`variants`는 축(axis)별 스타일 객체예요. 각 축은 값에서 `CSSObject`로 매핑돼요.

```ts
const button = ev({
  variants: {
    size: {
      small: {
        fontSize: 12,
      },
      medium: {
        fontSize: 14,
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
});

button({ size: 'large', color: 'primary' });
```

variant 값으로는 **string**, **number**, **Boolean** 세 종류를 쓸 수 있어요.

```ts
const panel = ev({
  variants: {
    color: {
      red: {
        color: 'red',
      },
      blue: {
        color: 'blue',
      },
    },
    level: {
      1: {
        zIndex: 1,
      },
      2: {
        zIndex: 2,
      },
    },
    outlined: {
      true: {
        border: '1px solid',
      },
      false: {
        border: 'none',
      },
    },
  },
});

panel({ color: 'red', level: 2, outlined: true });
```

::: info
Boolean variant는 설정에선 `'true'` / `'false'` 문자열 키로 적지만, 함수를 호출할 때는 실제 Boolean 값(`true` / `false`)을 그대로 넘겨요.
:::

## `compoundVariants`

복합 variant는 **여러 축**이 특정 값으로 동시에 맞아떨어질 때만 스타일을 적용해요. "X가 Y일 때만 이렇게 보여요" 같은 패턴에 잘 맞아요.

```ts
const button = ev({
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
      },
      danger: {
        background: 'red',
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
        fontWeight: 'bold',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      },
    },
  ],
});

button({ size: 'large', color: 'primary' }); // 복합 스타일이 포함돼요
button({ size: 'small', color: 'primary' }); // 복합 스타일은 빠져요
```

복합 variant는 배열 순서대로 평가되고, 일치하는 단순 variant **뒤에** 쌓여요. 그래서 안전하게 덮어쓸 수 있어요.

## `defaultVariants`

`defaultVariants`는 variant를 생략했을 때 쓸 기본값을 정해 줘요.

```ts
const button = ev({
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
      primary: {},
      secondary: {},
    },
  },
  defaultVariants: {
    size: 'small',
    color: 'primary',
  },
});

button();                  // size: 'small', color: 'primary'
button({ size: 'large' }); // size: 'large', color: 'primary'
```

기본값은 키 단위로 `??`로 메워지기 때문에, 명시적으로 `undefined`를 넘겨도 기본값이 적용돼요. React에서 prop을 그대로 넘겨주는 패턴이 이 덕분에 동작해요. 생략된 prop은 `undefined`로 도착하지만 기본값은 그대로 살아 있어요.

```ts
button({ size: undefined }); // button()과 완전히 같아요 — size: 'small', color: 'primary'
```

::: warning
`false`와 `0`은 값이 없는 게 아니라 실제 variant 값이에요. 그래서 기본값으로 **떨어지지 않아요**.

```ts
const badge = ev({
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

badge({ outlined: false }); // border: none — 기본값이 적용되지 않아요
```
:::

## 스타일 적용 순서 {#style-precedence}

한 번 호출할 때마다 스타일은 이 순서로 쌓여요 (CSS가 충돌하면 뒤에 오는 게 이겨요).

1. `base`
2. 일치하는 단순 `variants` 항목 (선언된 키 순서대로)
3. 일치하는 `compoundVariants` 항목 (배열 순서대로)

## 다음으로

- [API 레퍼런스](./reference/ev) — `ev()`의 전체 시그니처와 반환값.
- [복합 Variants](./recipes/compound-variants) — 조합에만 적용되는 스타일.
