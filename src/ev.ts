import { css as cssClassName } from '@emotion/css';
import type { CSSObject, SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import type {
  EvClassNames,
  EvConfig,
  EvFunction,
  EvSlotsFunction,
  NoInfer_,
  VariantConfig,
  VariantValue,
} from './types';

type Plain = VariantConfig<Record<string, Record<string, CSSObject>>>;
type Props = Record<string, VariantValue | undefined>;
type Condition = Record<string, VariantValue | ReadonlyArray<VariantValue> | undefined>;
type SlotStyles = Record<string, SerializedStyles>;

// The implementation's view of EvConfig, with the generics erased.
interface Config {
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
  defaultVariants?: Props;
}

// Without `slots`, a config is handled as a single slot under this private name.
const ROOT = '';

// Null-prototype lookups: a runtime value such as 'constructor' must not resolve
// to an inherited Object.prototype member.
const table = <V>(): Record<string, V> => Object.create(null);

/**
 * Creates a type-safe multi-variant style function for Emotion.
 *
 * This function generates a style function that applies different CSS styles based on
 * variant combinations. It supports base styles, multiple variants, compound variants,
 * and default variant values. All styles are applied without requiring explicit `css()`
 * calls - you can pass CSSObject directly.
 *
 * @param config - Configuration object for the ev function
 * @param config.base - Base styles applied to all variants
 * @param config.variants - Object defining variant-specific styles
 * @param config.compoundVariants - Array of styles for specific variant combinations
 * @param config.defaultVariants - Default values for variants
 * @returns A function that accepts variant values and returns an array of SerializedStyles
 *
 * @example
 * ```typescript
 * const button = ev({
 *   base: {
 *     padding: '10px 20px',
 *     borderRadius: '4px',
 *   },
 *   variants: {
 *     size: {
 *       small: {
 *         fontSize: '12px',
 *       },
 *       large: {
 *         fontSize: '16px',
 *       },
 *     },
 *     color: {
 *       primary: {
 *         background: 'blue',
 *       },
 *       secondary: {
 *         background: 'gray',
 *       },
 *     }
 *   },
 *   compoundVariants: [
 *     {
 *       variants: { size: 'large', color: 'primary' },
 *       style: {
 *         fontWeight: 'bold',
 *       },
 *     }
 *   ],
 *   defaultVariants: {
 *     size: 'small',
 *     color: 'primary'
 *   }
 * });
 *
 * // css prop
 * <button css={button({ size: 'large', color: 'primary' })}>Click me</button>
 *
 * // className
 * <button className={button.className({ size: 'large', color: 'primary' })}>Click me</button>
 * ```
 */
export function ev<T extends Plain, N extends string = never>(
  config: EvConfig<T, N>,
): [N] extends [never] ? EvFunction<T> : EvSlotsFunction<NoInfer_<N>, T>;
export function ev({
  base,
  slots,
  variants = {},
  compoundVariants = [],
  compoundSlots = [],
  defaultVariants = {},
}: Config): EvFunction<Plain> | EvSlotsFunction<string, Plain> {
  const variantKeys = Object.keys(variants);

  const serialize = (styles: Record<string, CSSObject>): SlotStyles => {
    const serialized = table<SerializedStyles>();

    Object.entries(styles).forEach(([slot, style]) => {
      serialized[slot] = css(style);
    });

    return serialized;
  };
  const bySlot = (style: CSSObject) =>
    slots
      ? (style as Record<string, CSSObject>)
      : {
          [ROOT]: style,
        };

  const baseStyles = serialize(slots ?? (base ? bySlot(base) : {}));
  const variantStyles = table<Record<string, SlotStyles>>();

  variantKeys.forEach((key) => {
    variantStyles[key] = table();

    Object.entries(variants[key] ?? {}).forEach(([value, style]) => {
      variantStyles[key][value] = serialize(bySlot(style));
    });
  });

  const toCondition = (condition: Condition = {}) => {
    const normalized: Record<string, string[]> = {};

    Object.entries(condition).forEach(([key, value]) => {
      normalized[key] = [value].flat().map(String);
    });

    return normalized;
  };

  const compoundStyles = [
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

  function resolve(slot: string, props: Props, slotProps: Props = {}): SerializedStyles[] {
    const styles: SerializedStyles[] = [];
    const resolved: Record<string, string> = {};
    const push = (style: SerializedStyles | undefined) => {
      if (style) {
        styles.push(style);
      }
    };

    push(baseStyles[slot]);

    variantKeys.forEach((key) => {
      const value = slotProps[key] ?? props[key] ?? defaultVariants[key];

      if (value === undefined) {
        return;
      }

      const valueKey = String(value);

      resolved[key] = valueKey;
      push(variantStyles[key][valueKey]?.[slot]);
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

  if (slots) {
    const slotNames = Object.keys(slots);
    const forEachSlot = <V>(callback: (slot: string) => V): Record<string, V> =>
      Object.fromEntries(slotNames.map((slot) => [slot, callback(slot)]));

    return Object.assign(
      (props: Props = {}) =>
        forEachSlot((slot) => (slotProps?: Props) => resolve(slot, props, slotProps)),
      {
        variants: () => variantKeys,
        className: (props: Props = {}) => forEachSlot((slot) => cssClassName(resolve(slot, props))),
      },
    );
  }

  const evFunction = (props: Props = {}) => resolve(ROOT, props);

  // Class names are injected into @emotion/css's global cache, so build them on first
  // access instead of at definition time; css-prop-only users never pay for them.
  let classNames: EvClassNames<Plain> | undefined;

  const createClassNames = (): EvClassNames<Plain> => {
    const variantClassNames: Record<string, Record<string, string>> = {};

    variantKeys.forEach((key) => {
      variantClassNames[key] = {};

      Object.entries(variantStyles[key]).forEach(([value, styles]) => {
        variantClassNames[key][value] = cssClassName(styles[ROOT]);
      });
    });

    return {
      base: baseStyles[ROOT] ? cssClassName(baseStyles[ROOT]) : '',
      variants: variantClassNames,
    };
  };

  const result = Object.assign(evFunction, {
    variants: () => variantKeys,
    className: (props?: Props) => cssClassName(evFunction(props)),
  }) as EvFunction<Plain>;

  Object.defineProperty(result, 'classNames', {
    enumerable: true,
    get: () => {
      if (!classNames) {
        classNames = createClassNames();
      }

      return classNames;
    },
  });

  return result;
}
