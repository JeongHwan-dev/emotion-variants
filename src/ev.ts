import type { CSSObject, SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import type {
  ClassNameHelpers,
  Ev,
  EvClassNames,
  EvFunction,
  EvSlotsFunction,
  VariantConfig,
  VariantValue,
} from './types';

type Plain = VariantConfig<Record<string, Record<string, CSSObject>>>;
type Values = Record<string, VariantValue | undefined>;
type Props = Record<string, VariantValue | Values | undefined>;
type Condition = Record<string, VariantValue | ReadonlyArray<VariantValue> | undefined>;
type SlotStyles = Record<string, SerializedStyles>;

interface Config {
  extend?: object;
  base?: CSSObject;
  slots?: Record<string, CSSObject>;
  variants?: Record<string, Record<string, CSSObject>>;
  compoundVariants?: Array<{
    variants: Condition;
    style: CSSObject;
  }>;
  compoundSlots?: Array<{
    slots: ReadonlyArray<string>;
    variants?: Condition;
    style: CSSObject;
  }>;
  defaultVariants?: Values;
}

interface Internals {
  slotNames?: string[];
  variantKeys: string[];
  layers: Array<{
    base: SlotStyles;
    variants: Record<string, Record<string, SlotStyles>>;
  }>;
  compoundStyles: Array<{
    condition: Record<string, string[]>;
    styles: SlotStyles;
  }>;
  defaultVariants: Values;
}

const ROOT = '';

const ROOT_INTERNALS: Internals = {
  variantKeys: [],
  layers: [],
  compoundStyles: [],
  defaultVariants: {},
};

const registry = new WeakMap<object, Internals>();

const isDefined = <T>(value: T | undefined): value is T => value !== undefined;

const unique = <T>(values: T[]): T[] => [...new Set(values)];

const table = <V>(entries: Array<readonly [string, V]>): Record<string, V> =>
  Object.assign(Object.create(null), Object.fromEntries(entries));

const mapTable = <T, V>(source: Record<string, T>, transform: (value: T) => V): Record<string, V> =>
  table(Object.entries(source).map(([key, value]) => [key, transform(value)] as const));

const toCondition = (condition: Condition = {}): Record<string, string[]> =>
  Object.fromEntries(
    Object.entries(condition).map(([key, value]) => [key, [value].flat().map(String)]),
  );

function define(
  {
    extend,
    base,
    slots,
    variants = {},
    compoundVariants = [],
    compoundSlots = [],
    defaultVariants: ownDefaultVariants = {},
  }: Config,
  breakpoints: Array<[name: string, query: string]>,
): EvFunction<Plain> | EvSlotsFunction<string, Plain> {
  const parent = extend ? registry.get(extend) : ROOT_INTERNALS;

  if (!parent) {
    throw new Error(
      '[emotion-variants] `extend` must be a function returned by `ev()`. If it is one, two copies of emotion-variants may be installed.',
    );
  }

  if (slots && extend && !parent.slotNames) {
    throw new Error('[emotion-variants] A config with `slots` cannot extend one without `slots`.');
  }

  const slotNames =
    (slots ?? parent.slotNames) &&
    unique([...(parent.slotNames ?? []), ...Object.keys(slots ?? {})]);
  const variantKeys = unique([...parent.variantKeys, ...Object.keys(variants)]);
  const defaultVariants = {
    ...parent.defaultVariants,
    ...ownDefaultVariants,
  };

  const serialize = (styles: Record<string, CSSObject>): SlotStyles =>
    mapTable(styles, (style) => css(style));
  const bySlot = (style: CSSObject) =>
    slotNames
      ? (style as Record<string, CSSObject>)
      : {
          [ROOT]: style,
        };

  const layers = [
    ...parent.layers,
    {
      base: serialize(slots ?? (base ? bySlot(base) : {})),
      variants: mapTable(variants, (values) =>
        mapTable(values ?? {}, (style) => serialize(bySlot(style))),
      ),
    },
  ];

  const compoundStyles = [
    ...parent.compoundStyles,
    ...compoundVariants.map((compoundVariant) => ({
      condition: toCondition(compoundVariant.variants),
      styles: serialize(bySlot(compoundVariant.style)),
    })),
    ...compoundSlots.map((compoundSlot) => {
      const style = css(compoundSlot.style);

      return {
        condition: toCondition(compoundSlot.variants),
        styles: table(compoundSlot.slots.map((slot) => [slot, style] as const)),
      };
    }),
  ];

  const cellsOf = (key: string, valueKey: string, slot: string) =>
    layers.map((layer) => layer.variants[key]?.[valueKey]?.[slot]).filter(isDefined);

  const breakpointStyles = new Map<string, SerializedStyles>();

  const atBreakpoint = (query: string, key: string, valueKey: string, slot: string) => {
    const cacheKey = JSON.stringify([query, key, valueKey, slot]);
    const cells = cellsOf(key, valueKey, slot);

    if (cells.length && !breakpointStyles.has(cacheKey)) {
      breakpointStyles.set(
        cacheKey,
        css({
          [query]: cells,
        }),
      );
    }

    return breakpointStyles.get(cacheKey);
  };

  const stylesOf = (key: string, value: VariantValue | Values, slot: string) => {
    if (typeof value !== 'object') {
      return cellsOf(key, String(value), slot);
    }

    const initial = value.initial ?? defaultVariants[key];

    return [
      ...(initial === undefined ? [] : cellsOf(key, String(initial), slot)),
      ...breakpoints
        .filter(([name]) => value[name] !== undefined)
        .map(([name, query]) => atBreakpoint(query, key, String(value[name]), slot))
        .filter(isDefined),
    ];
  };

  const resolve = (slot: string, props: Props, slotProps: Props = {}): SerializedStyles[] => {
    const values = variantKeys
      .map((key) => [key, slotProps[key] ?? props[key] ?? defaultVariants[key]] as const)
      .filter((entry): entry is [string, VariantValue | Values] => entry[1] !== undefined);
    const resolved: Record<string, string> = Object.fromEntries(
      values
        .filter(([, value]) => typeof value !== 'object')
        .map(([key, value]) => [key, String(value)]),
    );

    return [
      ...layers.map((layer) => layer.base[slot]),
      ...values.flatMap(([key, value]) => stylesOf(key, value, slot)),
      ...compoundStyles
        .filter(({ condition }) =>
          Object.entries(condition).every(([key, matches]) => matches.includes(resolved[key])),
        )
        .map(({ styles }) => styles[slot]),
    ].filter(isDefined);
  };

  const register = <F extends object>(result: F): F => {
    registry.set(result, {
      slotNames,
      variantKeys,
      layers,
      compoundStyles,
      defaultVariants,
    });

    return result;
  };

  if (slotNames) {
    return register(
      Object.assign(
        (props: Props = {}) =>
          Object.fromEntries(
            slotNames.map((slot) => [slot, (slotProps?: Props) => resolve(slot, props, slotProps)]),
          ),
        {
          variants: () => variantKeys,
        },
      ),
    );
  }

  return register(
    Object.assign((props: Props = {}) => resolve(ROOT, props), {
      variants: () => variantKeys,
    }),
  );
}

/**
 * Creates class-name helpers bound to an Emotion `css` function, such as the one from
 * `@emotion/css` or from an instance made with `@emotion/css/create-instance`.
 *
 * Styles are injected into the cache that `css` function belongs to.
 *
 * @param css - Function that injects styles and returns a class name
 * @returns `className` and `classNames` helpers
 *
 * @example
 * ```typescript
 * import { css } from '@emotion/css';
 *
 * export const { className, classNames } = createClassName(css);
 *
 * <button className={className(button, { size: 'large' })}>Click me</button>
 * ```
 */
export function createClassName(css: (...styles: SerializedStyles[]) => string): ClassNameHelpers {
  const built = new WeakMap<object, EvClassNames<Plain>>();

  const classNameOf = (styles: Array<SerializedStyles | undefined>) => {
    const defined = styles.filter(isDefined);

    return defined.length ? css(...defined) : '';
  };

  const build = ({ layers, variantKeys }: Internals): EvClassNames<Plain> => {
    const variants = Object.fromEntries(
      variantKeys.map((key) => [
        key,
        Object.fromEntries(
          unique(layers.flatMap((layer) => Object.keys(layer.variants[key] ?? {}))).map((value) => [
            value,
            classNameOf(layers.map((layer) => layer.variants[key]?.[value]?.[ROOT])),
          ]),
        ),
      ]),
    );

    return {
      base: classNameOf(layers.map((layer) => layer.base[ROOT])),
      variants,
    };
  };

  const className = (
    fn: (props?: Props) => SerializedStyles[] | Record<string, () => SerializedStyles[]>,
    props?: Props,
  ) => {
    const result = fn(props);

    return Array.isArray(result)
      ? css(...result)
      : Object.fromEntries(
          Object.entries(result).map(([slot, styles]) => [slot, css(...styles())]),
        );
  };

  const classNames = (fn: object) => {
    const internals = registry.get(fn);

    if (!internals || internals.slotNames) {
      throw new Error(
        '[emotion-variants] `classNames()` expects a function returned by `ev()` without `slots`. If it is one, two copies of emotion-variants may be installed.',
      );
    }

    const result = built.get(fn) ?? build(internals);

    built.set(fn, result);

    return result;
  };

  return {
    className,
    classNames,
  } as ClassNameHelpers;
}

/**
 * Creates an `ev` function that accepts responsive variant values.
 *
 * Declare the breakpoints once, mobile first, and every variant prop of the returned
 * `ev` also takes an object keyed by `initial` and the breakpoint names.
 *
 * @param options.breakpoints - Media queries keyed by breakpoint name, smallest first
 * @returns An object holding the configured `ev` function
 *
 * @example
 * ```typescript
 * export const { ev } = createEv({
 *   breakpoints: {
 *     md: '@media (min-width: 768px)',
 *     lg: '@media (min-width: 1024px)',
 *   },
 * });
 *
 * button({
 *   size: {
 *     initial: 'small',
 *     md: 'large',
 *   },
 * });
 * ```
 */
export function createEv<B extends string = never>({
  breakpoints = {},
}: {
  breakpoints?: Partial<Record<B, string>> & { initial?: never };
} = {}): { ev: Ev<B> } {
  const queries = Object.entries<string | undefined>(breakpoints).filter(
    (entry): entry is [string, string] => entry[1] !== undefined,
  );

  return {
    ev: ((config: Config) => define(config, queries)) as Ev<B>,
  };
}

export const { ev } = createEv();
