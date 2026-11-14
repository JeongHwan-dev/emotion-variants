import type { Lang } from '@/lib/i18n';
import {
  BlendIcon,
  CircleDotIcon,
  DevicesIcon,
  LayersIcon,
  LayoutIcon,
  PencilIcon,
  ShieldCheckIcon,
  SlidersIcon,
} from '../icons';

export const INSTALL = 'npm install emotion-variants @emotion/react @emotion/css';

const IMPORT_EV = `import { ev } from 'emotion-variants';

`;

const SIZE_AXIS = `    size: {
      small: {
        fontSize: 12,
      },
      large: {
        fontSize: 16,
      },
    },`;

/** Docs slug, icon and snippet per concept. Names and descriptions are in `copy` below, in this order. */
export const CONCEPTS = [
  {
    slug: 'variants',
    icon: SlidersIcon,
    code: `${IMPORT_EV}const button = ev({
  base: {
    borderRadius: 8,
  },
  variants: {
${SIZE_AXIS}
  },
});

button({
  size: 'large',
});`,
  },
  {
    slug: 'default-variants',
    icon: CircleDotIcon,
    code: `${IMPORT_EV}const button = ev({
  base: {
    borderRadius: 8,
  },
  variants: {
${SIZE_AXIS}
  },
  defaultVariants: {
    size: 'small',
  },
});

button(); // size: 'small'`,
  },
  {
    slug: 'compound-variants',
    icon: BlendIcon,
    code: `${IMPORT_EV}const button = ev({
  variants: {
${SIZE_AXIS}
    color: {
      primary: {
        background: '#d36ac2',
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
      },
    },
  ],
});`,
  },
  {
    slug: 'slots',
    icon: LayoutIcon,
    code: `${IMPORT_EV}const card = ev({
  slots: {
    root: {
      padding: 16,
    },
    title: {
      fontWeight: 600,
    },
  },
  variants: {
    size: {
      large: {
        root: {
          padding: 24,
        },
        title: {
          fontSize: 20,
        },
      },
    },
  },
});

const { root, title } = card({
  size: 'large',
});`,
  },
  {
    slug: 'overrides',
    icon: PencilIcon,
    code: `${IMPORT_EV}const button = ev({
  variants: {
${SIZE_AXIS}
  },
});

<button
  css={[
    button({
      size: 'large',
    }),
    {
      width: '100%',
    },
  ]}
>
  Submit
</button>;`,
  },
  {
    slug: 'extending',
    icon: LayersIcon,
    code: `${IMPORT_EV}const button = ev({
  variants: {
${SIZE_AXIS}
  },
});

const iconButton = ev({
  extend: button,
  base: {
    display: 'inline-flex',
  },
});

iconButton({
  size: 'large',
});`,
  },
  {
    slug: 'responsive',
    icon: DevicesIcon,
    code: `import { createEv } from 'emotion-variants';

const { ev } = createEv({
  breakpoints: {
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
  },
});

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
  },
});

button({
  size: {
    initial: 'small',
    md: 'medium',
    lg: 'large',
  },
});`,
  },
  {
    slug: 'typescript',
    icon: ShieldCheckIcon,
    code: `import { ev, type VariantProps } from 'emotion-variants';

const button = ev({
  variants: {
${SIZE_AXIS}
  },
});

type ButtonProps = VariantProps<typeof button>;
// { size?: 'small' | 'large' }`,
  },
];

export const copy = {
  en: {
    description:
      'Type-safe variant API for Emotion. Create component styles with multiple variants without repetitive css() calls.',
    docs: 'Docs',
    changelog: 'Changelog',
    title: 'Type-safe variant API for Emotion',
    tagline: 'Compose component styles with multiple variants — no repetitive css() calls.',
    getStarted: 'Get Started',
    github: 'View on GitHub',
    copy: 'Copy',
    copied: 'Copied',
    features: [
      [
        'Type-safe',
        'Full TypeScript inference for variant keys, values, and compound combinations. No casts, no `any`.',
      ],
      [
        'Compound variants',
        'Apply specific styles only when multiple variants match — like `large` + `primary`.',
      ],
      [
        'Default variants',
        'Set sensible defaults so consumers can omit props and still get a styled component.',
      ],
      [
        'Pre-serialized styles',
        "Base styles are serialized once at definition time. Each call just selects the matching styles for Emotion's `css` prop.",
      ],
      [
        'Drop-in for Emotion',
        "Works with `@emotion/react`'s `css` prop. No bundler config, no providers.",
      ],
      [
        'classNames access',
        'Read generated class names directly when integrating with non-React contexts or testing.',
      ],
    ],
    compareTitle: 'See it in code',
    compareLead: 'Scroll to watch a plain Emotion button turn into one `ev()` config.',
    compare: [
      [
        'Styles scattered across three places',
        'With plain Emotion, lookup tables, hand-written prop types, and conditional spreads inside the component all describe the same button. Adding one `size` means touching each of them.',
      ],
      [
        'One config holds everything',
        'Shared styles become `base`, lookup tables become `variants`, the conditional spread becomes `compoundVariants`, and argument defaults become `defaultVariants`. A new `size` is one entry in one place.',
      ],
      [
        'Inferred types, a one-line component',
        '`VariantProps` builds the prop types from the config. Adding a variant needs no type edits. The component only passes its props to the style function.',
      ],
    ],
    conceptsTitle: 'One config, every permutation',
    conceptsLead: 'Pick a concept to see how the config changes.',
    concepts: [
      ['Variants', 'All style options in one place.'],
      ['Defaults', 'The value used when a prop is omitted.'],
      ['Compound', 'Extra styles for specific combinations.'],
      ['Slots', 'Style several parts at once.'],
      ['Overrides', 'One-off styles at the call site.'],
      ['Extend', 'Build on an existing config.'],
      ['Responsive', 'A different value per screen size.'],
      ['Types', 'Prop types, generated for you.'],
    ],
    readDocs: 'Read the docs',
    ctaTitle: 'Start with one component',
    ctaLead: "Install the package and move one component's styles into `ev()`.",
    license: 'Released under the MIT License.',
    editOnGitHub: 'Edit this page on GitHub',
  },
  ko: {
    description:
      'Emotion을 위한 Type-safe variant API. 반복적인 css() 호출 없이 다양한 variant를 가진 컴포넌트 스타일을 만들어요.',
    docs: '문서',
    changelog: '변경 사항',
    title: 'Emotion을 위한 Type-safe variant API',
    tagline: '반복적인 css() 호출 없이, 여러 variant를 가진 컴포넌트 스타일을 깔끔하게 정의해요.',
    getStarted: '시작하기',
    github: 'GitHub에서 보기',
    copy: '복사',
    copied: '복사했어요',
    features: [
      [
        '완전한 타입 추론',
        'variant 키와 값, 그리고 조합까지 TypeScript가 자동으로 추론해요. 캐스팅이나 `any`가 필요 없어요.',
      ],
      [
        '복합 variants',
        '여러 variant가 동시에 일치할 때만 적용되는 스타일을 정의할 수 있어요. 예를 들면 `large`와 `primary` 조합처럼요.',
      ],
      [
        '기본 variants',
        '합리적인 기본값을 정해 두면, props 없이 호출해도 스타일이 자연스럽게 잡혀요.',
      ],
      [
        '미리 직렬화된 스타일',
        'base 스타일은 정의 시점에 한 번만 직렬화돼요. 호출할 때는 일치하는 스타일을 골라 `css` prop에 넘기기만 해요.',
      ],
      [
        'Emotion과 그대로',
        '`@emotion/react`의 `css` prop과 바로 연결돼요. 번들러 설정도, Provider도 필요 없어요.',
      ],
      [
        'classNames 직접 접근',
        '생성된 클래스 이름을 코드에서 바로 읽을 수 있어요. 테스트나 React 외부 환경에서 쓰기 좋아요.',
      ],
    ],
    compareTitle: '코드로 확인해 보세요',
    compareLead:
      '스크롤하면서 Emotion만으로 만든 버튼이 `ev()` 스타일 정의 하나로 바뀌는 과정을 살펴보세요.',
    compare: [
      [
        '스타일이 세 군데로 흩어져요',
        'Emotion만 쓰면 variant별 스타일 객체, 손으로 쓴 props 타입, 컴포넌트 안의 조건부 spread가 모두 같은 버튼을 설명해요. `size` 하나를 추가하려면 세 곳을 전부 고쳐야 해요.',
      ],
      [
        '스타일 정의 하나에 모두 담아요',
        '공통 스타일은 `base`로, variant별 스타일 객체는 `variants`로, 조건부 spread는 `compoundVariants`로, 인자 기본값은 `defaultVariants`로 옮겨요. 새 `size`는 한 곳에 한 항목만 추가하면 돼요.',
      ],
      [
        '타입은 자동으로, 컴포넌트는 한 줄로',
        'props 타입은 `VariantProps`가 스타일 정의를 보고 만들어 줘요. variant를 추가해도 타입을 직접 고칠 필요가 없어요. 컴포넌트는 받은 props를 스타일 함수에 넘기기만 하면 돼요.',
      ],
    ],
    conceptsTitle: '스타일 정의 하나로 모든 조합을',
    conceptsLead: '개념을 골라서 스타일 정의가 어떻게 달라지는지 확인해 보세요.',
    concepts: [
      ['Variants', '스타일 선택지를 한곳에 모아요.'],
      ['Defaults', 'prop을 생략하면 쓰이는 값이에요.'],
      ['Compound', '특정 값 조합에만 스타일을 더해요.'],
      ['Slots', '여러 부분을 한 번에 스타일링해요.'],
      ['Overrides', '쓰는 곳에서 스타일을 덧붙여요.'],
      ['Extend', '기존 스타일 정의를 이어받아요.'],
      ['Responsive', '화면 크기마다 다른 값을 줘요.'],
      ['Types', 'props 타입을 자동으로 만들어요.'],
    ],
    readDocs: '문서 읽기',
    ctaTitle: '컴포넌트 하나부터 시작해 보세요',
    ctaLead: '패키지를 설치하고 컴포넌트 하나의 스타일을 `ev()`로 옮겨 보세요.',
    license: 'MIT 라이선스에 따라 배포돼요.',
    editOnGitHub: 'GitHub에서 이 페이지 편집',
  },
  ja: {
    description:
      'Emotion のための型安全な variant API。css() を何度も呼ぶことなく、複数の variant を持つコンポーネントスタイルを作成できます。',
    docs: 'ドキュメント',
    changelog: '変更履歴',
    title: 'Emotion のための型安全な variant API',
    tagline:
      'css() を繰り返し呼ぶことなく、複数の variant を持つコンポーネントスタイルをすっきり定義できます。',
    getStarted: 'はじめる',
    github: 'GitHub で見る',
    copy: 'コピー',
    copied: 'コピーしました',
    features: [
      [
        '完全な型推論',
        'variant のキーと値、そして組み合わせまで TypeScript が自動で推論します。キャストや `any` は不要です。',
      ],
      [
        'Compound variants',
        '複数の variant が同時に一致したときだけ適用されるスタイルを定義できます。たとえば `large` と `primary` の組み合わせです。',
      ],
      [
        'Default variants',
        '適切なデフォルト値を決めておけば、props を省略してもスタイルが適用されます。',
      ],
      [
        '事前シリアライズ済みのスタイル',
        'base スタイルは定義時に一度だけシリアライズされます。呼び出し時は一致するスタイルを選んで `css` prop に渡すだけです。',
      ],
      [
        'Emotion にそのまま',
        '`@emotion/react` の `css` prop とそのまま連携します。バンドラーの設定も Provider も不要です。',
      ],
      [
        'classNames へのアクセス',
        '生成されたクラス名をコードから直接読み取れます。テストや React 以外の環境で役立ちます。',
      ],
    ],
    compareTitle: 'コードで確認',
    compareLead:
      'スクロールして、素の Emotion のボタンが 1 つの `ev()` 設定に変わっていく様子を見てみましょう。',
    compare: [
      [
        'スタイルが 3 か所に散らばる',
        '素の Emotion では、lookup table、手書きの props 型、コンポーネント内の条件付き spread がすべて同じボタンを表しています。`size` を 1 つ追加するだけで、そのすべてを修正する必要があります。',
      ],
      [
        '1 つの設定にすべてをまとめる',
        '共通スタイルは `base` に、lookup table は `variants` に、条件付き spread は `compoundVariants` に、引数のデフォルト値は `defaultVariants` になります。新しい `size` は 1 か所に 1 項目追加するだけです。',
      ],
      [
        '型は自動で、コンポーネントは1行で',
        '`VariantProps` が設定から props の型を作ってくれます。variant を追加しても型を直す必要はありません。コンポーネントは受け取った props をスタイル関数に渡すだけです。',
      ],
    ],
    conceptsTitle: '1 つの設定で、すべての組み合わせを',
    conceptsLead: 'コンセプトを選んで、設定がどう変わるか確認してみましょう。',
    concepts: [
      ['Variants', 'スタイルの選択肢を一か所にまとめます。'],
      ['Defaults', 'prop を省略したときの値です。'],
      ['Compound', '特定の組み合わせにスタイルを追加します。'],
      ['Slots', '複数のパーツをまとめてスタイリングします。'],
      ['Overrides', '使う場所でスタイルを追加します。'],
      ['Extend', '既存の設定を引き継いで拡張します。'],
      ['Responsive', '画面サイズごとに値を変えます。'],
      ['Types', 'props の型を自動で作ります。'],
    ],
    readDocs: 'ドキュメントを読む',
    ctaTitle: 'まずはコンポーネント 1 つから',
    ctaLead:
      'パッケージをインストールして、コンポーネント 1 つのスタイルを `ev()` に移してみましょう。',
    license: 'MIT ライセンスのもとで公開されています。',
    editOnGitHub: 'GitHub でこのページを編集',
  },
  zh: {
    description:
      '为 Emotion 打造的类型安全 variant API。无需反复调用 css()，即可创建拥有多个 variant 的组件样式。',
    docs: '文档',
    changelog: '更新日志',
    title: '为 Emotion 打造的类型安全 variant API',
    tagline: '无需反复调用 css()，即可清晰地定义拥有多个 variant 的组件样式。',
    getStarted: '快速开始',
    github: '在 GitHub 上查看',
    copy: '复制',
    copied: '已复制',
    features: [
      [
        '完整的类型推导',
        'TypeScript 会自动推导 variant 的键、值以及组合。无需类型断言，也无需 `any`。',
      ],
      [
        'Compound variants',
        '定义仅在多个 variant 同时匹配时才生效的样式，例如 `large` 与 `primary` 的组合。',
      ],
      ['Default variants', '设置合理的默认值后，即使省略 props 也能得到带样式的组件。'],
      [
        '预序列化样式',
        'base 样式在定义时只序列化一次。调用时只需选出匹配的样式并传给 `css` prop。',
      ],
      [
        '直接用于 Emotion',
        '与 `@emotion/react` 的 `css` prop 直接配合使用。无需打包工具配置，也无需 Provider。',
      ],
      ['访问 classNames', '可以直接在代码中读取生成的类名，适合测试或在 React 以外的环境中使用。'],
    ],
    compareTitle: '用代码来看',
    compareLead: '向下滚动，看看原生 Emotion 按钮如何变成一份 `ev()` 配置。',
    compare: [
      [
        '样式分散在三处',
        '使用原生 Emotion 时，查找表、手写的 props 类型以及组件内的条件展开都在描述同一个按钮。新增一个 `size`，就得把它们全部改一遍。',
      ],
      [
        '一份配置容纳一切',
        '公共样式变成 `base`，查找表变成 `variants`，条件展开变成 `compoundVariants`，参数默认值变成 `defaultVariants`。新增 `size` 只需在一处添加一项。',
      ],
      [
        '类型自动推导，组件只需一行',
        '`VariantProps` 会根据配置生成 props 类型。新增 variant 时无需手动修改类型。组件只需把收到的 props 传给样式函数。',
      ],
    ],
    conceptsTitle: '一份配置，覆盖所有组合',
    conceptsLead: '选择一个概念，看看配置如何变化。',
    concepts: [
      ['Variants', '在一处集中定义样式选项。'],
      ['Defaults', '省略 prop 时使用的值。'],
      ['Compound', '仅对特定组合追加样式。'],
      ['Slots', '一次为多个部分设置样式。'],
      ['Overrides', '在调用处追加一次性样式。'],
      ['Extend', '在现有配置基础上扩展。'],
      ['Responsive', '按屏幕尺寸指定不同的值。'],
      ['Types', '自动生成 props 类型。'],
    ],
    readDocs: '阅读文档',
    ctaTitle: '从一个组件开始',
    ctaLead: '安装依赖包，然后把一个组件的样式迁移到 `ev()` 中。',
    license: '基于 MIT 许可证发布。',
    editOnGitHub: '在 GitHub 上编辑此页',
  },
} satisfies Record<Lang, unknown>;
