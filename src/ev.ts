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
// A prop is a value, or values keyed by `initial` and breakpoint names.
type Props = Record<string, VariantValue | Values | undefined>;
type Condition = Record<string, VariantValue | ReadonlyArray<VariantValue> | undefined>;
type SlotStyles = Record<string, SerializedStyles>;

// The implementation's view of EvConfig, with the generics erased.
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

// Without `slots`, a config is handled as a single slot under this private name.
const ROOT = '';

// Null-prototype lookups: a runtime value such as 'constructor' must not resolve
// to an inherited Object.prototype member.
const table = <V>(): Record<string, V> => Object.create(null);

// What a config passes on through `extend`. Each config in the chain keeps its own
// layer of styles: merging them with css() would serialize them again under new names.
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

const ROOT_INTERNALS: Internals = {
  variantKeys: [],
  layers: [],
  compoundStyles: [],
  defaultVariants: {},
};

// Keyed by the functions ev() returns, so nothing is attached to the public object.
const registry = new WeakMap<object, Internals>();

// Builds an ev() result. `breakpoints` are the ones declared with createEv(), in order.
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

  const slotNames = (slots ?? parent.slotNames) && [
    ...new Set([...(parent.slotNames ?? []), ...Object.keys(slots ?? {})]),
  ];
  const variantKeys = [...new Set([...parent.variantKeys, ...Object.keys(variants)])];
  const defaultVariants = {
    ...parent.defaultVariants,
    ...ownDefaultVariants,
  };

  const serialize = (styles: Record<string, CSSObject>): SlotStyles => {
    const serialized = table<SerializedStyles>();

    Object.entries(styles).forEach(([slot, style]) => {
      serialized[slot] = css(style);
    });

    return serialized;
  };
  const bySlot = (style: CSSObject) =>
    slotNames
      ? (style as Record<string, CSSObject>)
      : {
          [ROOT]: style,
        };

  const baseStyles = serialize(slots ?? (base ? bySlot(base) : {}));
  const variantStyles = table<Record<string, SlotStyles>>();

  Object.entries(variants).forEach(([key, values]) => {
    variantStyles[key] = table();

    Object.entries(values ?? {}).forEach(([value, style]) => {
      variantStyles[key][value] = serialize(bySlot(style));
    });
  });

  const layers = [
    ...parent.layers,
    {
      base: baseStyles,
      variants: variantStyles,
    },
  ];

  const toCondition = (condition: Condition = {}) => {
    const normalized: Record<string, string[]> = {};

    Object.entries(condition).forEach(([key, value]) => {
      normalized[key] = [value].flat().map(String);
    });

    return normalized;
  };

  const compoundStyles = [
    ...parent.compoundStyles,
    ...compoundVariants.map((compoundVariant) => ({
      condition: toCondition(compoundVariant.variants),
      styles: serialize(bySlot(compoundVariant.style)),
    })),
    ...compoundSlots.map((compoundSlot) => {
      const style = css(compoundSlot.style);
      const styles = table<SerializedStyles>();

      compoundSlot.slots.forEach((slot) => {
        styles[slot] = style;
      });

      return {
        condition: toCondition(compoundSlot.variants),
        styles,
      };
    }),
  ];

  const cellsOf = (key: string, valueKey: string, slot: string) =>
    layers
      .map((layer) => layer.variants[key]?.[valueKey]?.[slot])
      .filter((style) => style !== undefined);

  // Breakpoint styles depend on call-time values, so they are serialized on first use.
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

  function resolve(slot: string, props: Props, slotProps: Props = {}): SerializedStyles[] {
    const styles: SerializedStyles[] = [];
    const resolved: Record<string, string> = {};
    const push = (style: SerializedStyles | undefined) => {
      if (style) {
        styles.push(style);
      }
    };

    layers.forEach((layer) => {
      push(layer.base[slot]);
    });

    variantKeys.forEach((key) => {
      const value = slotProps[key] ?? props[key] ?? defaultVariants[key];

      if (value === undefined) {
        return;
      }

      // A responsive value is left out of `resolved`: no single value holds at every
      // breakpoint, so the axis cannot satisfy a compound condition.
      if (typeof value === 'object') {
        const initial = value.initial ?? defaultVariants[key];

        if (initial !== undefined) {
          styles.push(...cellsOf(key, String(initial), slot));
        }

        breakpoints.forEach(([name, query]) => {
          if (value[name] !== undefined) {
            push(atBreakpoint(query, key, String(value[name]), slot));
          }
        });

        return;
      }

      const valueKey = String(value);

      resolved[key] = valueKey;
      styles.push(...cellsOf(key, valueKey, slot));
    });

    compoundStyles.forEach(({ condition, styles: compound }) => {
      const isMatch = Object.entries(condition).every(([key, values]) =>
        values.includes(resolved[key]),
      );

      if (isMatch) {
        push(compound[slot]);
      }
    });

    return styles;
  }

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
    const forEachSlot = <V>(callback: (slot: string) => V): Record<string, V> =>
      Object.fromEntries(slotNames.map((slot) => [slot, callback(slot)]));

    return register(
      Object.assign(
        (props: Props = {}) =>
          forEachSlot((slot) => (slotProps?: Props) => resolve(slot, props, slotProps)),
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
  // Injecting is a side effect, so each map is built once, on first request.
  const built = new WeakMap<object, EvClassNames<Plain>>();
  const classNameOf = (styles: Array<SerializedStyles | undefined>) => {
    const defined = styles.filter((style) => style !== undefined);

    return defined.length ? css(...defined) : '';
  };

  const className = (
    fn: (props?: Props) => SerializedStyles[] | Record<string, () => SerializedStyles[]>,
    props?: Props,
  ) => {
    const result = fn(props);

    if (Array.isArray(result)) {
      return css(...result);
    }

    return Object.fromEntries(
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

    let result = built.get(fn);

    if (!result) {
      const { layers, variantKeys } = internals;
      const variants: Record<string, Record<string, string>> = {};

      variantKeys.forEach((key) => {
        variants[key] = {};

        layers
          .flatMap((layer) => Object.keys(layer.variants[key] ?? {}))
          .forEach((value) => {
            variants[key][value] = classNameOf(
              layers.map((layer) => layer.variants[key]?.[value]?.[ROOT]),
            );
          });
      });

      result = {
        base: classNameOf(layers.map((layer) => layer.base[ROOT])),
        variants,
      };
      built.set(fn, result);
    }

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
