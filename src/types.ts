import type { CSSObject, SerializedStyles } from '@emotion/react';

/**
 * Valid types for variant values.
 *
 * Variant values can be strings, numbers, or booleans.
 */
export type VariantValue = string | number | boolean;

/**
 * Configuration type for variants.
 *
 * Maps variant keys to their possible values and corresponding CSS styles.
 */
export type VariantConfig<T extends Record<string, Record<string, CSSObject>>> = {
  [K in keyof T]: T[K];
};

/**
 * Type representing all variant keys.
 *
 * Extracts the keys from a variant configuration type.
 */
export type VariantKeys<T extends VariantConfig<Record<string, Record<string, CSSObject>>>> =
  keyof T;

/**
 * Helper type to convert string keys to their corresponding value types.
 * Handles boolean string keys ("true"/"false") to actual boolean values.
 */
type KeyToValue<K> = K extends 'true'
  ? true
  : K extends 'false'
    ? false
    : K extends string
      ? K
      : K extends number
        ? K
        : never;

/**
 * Type representing valid values for a specific variant key.
 *
 * @typeParam T - The variant configuration type
 * @typeParam K - The specific variant key
 */
export type VariantValueFor<
  T extends VariantConfig<Record<string, Record<string, CSSObject>>>,
  K extends VariantKeys<T>,
> = KeyToValue<keyof T[K] & VariantValue>;

/**
 * Configuration type for compound variants.
 *
 * Compound variants allow you to apply styles when multiple variants have specific values.
 * For example, you can style a button differently when it's both "large" and "primary".
 * A condition can also be an array of values, which matches when the variant has any of them.
 *
 * @typeParam T - The variant configuration type
 */
export type CompoundVariant<T extends VariantConfig<Record<string, Record<string, CSSObject>>>> = {
  /** Variant values that must match for this compound variant to apply */
  variants: Partial<{
    [K in VariantKeys<T>]: VariantValueFor<T, K> | ReadonlyArray<VariantValueFor<T, K>>;
  }>;
  /** CSS styles to apply when the variant conditions are met */
  style: CSSObject;
};

/**
 * Stops a type parameter from being inferred from the position it wraps, so slot names
 * are inferred from `slots` alone. The built-in `NoInfer` would require TypeScript 5.4.
 */
type NoInfer_<T> = [T][T extends unknown ? 0 : never];

/**
 * Style accepted by a compound variant: one style per slot when `slots` is declared,
 * a single style otherwise.
 */
type SlotStyle<N extends string> = [N] extends [never] ? CSSObject : { [K in N]?: CSSObject };

/**
 * Rejects variant styles keyed by anything other than a declared slot.
 */
type OnlySlots<T, N extends string> = [N] extends [never]
  ? unknown
  : {
      [A in keyof T]: {
        [V in keyof T[A]]: { [K in keyof T[A][V]]: K extends N ? CSSObject : never };
      };
    };

/**
 * Anything `ev()` returns, which is what `extend` accepts.
 */
// biome-ignore lint/suspicious/noExplicitAny: matches an ev() result of any config
type AnyEv = EvFunction<any, any> | EvSlotsFunction<any, any, any>;

/**
 * The slot names of the config being extended, or `never` when it has none.
 */
// biome-ignore lint/suspicious/noExplicitAny: only the slot names are read
type ParentSlots<E> = [E] extends [EvSlotsFunction<infer N, any, any>] ? N : never;

/**
 * The variant configuration of the config being extended.
 */
// biome-ignore lint/suspicious/noExplicitAny: only the variants are read
type ParentVariants<E> = [E] extends [EvFunction<infer P, any>]
  ? P
  : // biome-ignore lint/suspicious/noExplicitAny: only the variants are read
    [E] extends [EvSlotsFunction<any, infer P, any>]
    ? P
    : never;

/**
 * The variants of a config together with the ones it inherits through `extend`.
 * An axis declared on both sides accepts the values of either.
 */
type Merged<T, E> = Extract<
  [E] extends [undefined]
    ? T
    : string extends keyof T
      ? ParentVariants<E>
      : string extends keyof ParentVariants<E>
        ? T
        : {
            [K in keyof ParentVariants<E> | keyof T]: (K extends keyof ParentVariants<E>
              ? ParentVariants<E>[K]
              : unknown) &
              (K extends keyof T ? T[K] : unknown);
          },
  VariantConfig<Record<string, Record<string, CSSObject>>>
>;

/**
 * Configuration object for the ev function.
 *
 * @typeParam T - The variant configuration type
 * @typeParam N - The slot names, inferred from `slots`
 * @typeParam E - The type of the ev() result passed as `extend`
 */
export interface EvConfig<
  T extends VariantConfig<Record<string, Record<string, CSSObject>>>,
  N extends string = never,
  E extends AnyEv | undefined = undefined,
> {
  /**
   * Another ev() result to build on. Its styles come first and its variants, compound
   * variants, and default variants are inherited. A config with `slots` can only extend
   * one with `slots`
   */
  // biome-ignore lint/suspicious/noExplicitAny: matches a slot function of any config
  extend?: E & ([N] extends [never] ? unknown : EvSlotsFunction<any, any, any>);
  /** Base styles applied to all variants. Use `slots` instead when it is declared */
  base?: [N | ParentSlots<E>] extends [never] ? CSSObject : never;
  /** Named parts of a component and their base styles */
  slots?: Record<N, CSSObject>;
  /** Variant-specific style definitions, keyed by slot when `slots` is declared */
  variants?: T & OnlySlots<T, NoInfer_<N> | ParentSlots<E>>;
  /** Styles for specific variant combinations */
  compoundVariants?: Array<{
    /** Variant values that must match for this compound variant to apply */
    variants: CompoundVariant<Merged<T, E>>['variants'];
    /** CSS styles to apply, keyed by slot when `slots` is declared */
    style: SlotStyle<NoInfer_<N> | ParentSlots<E>>;
  }>;
  /** Styles applied to several slots at once, optionally only for a variant combination */
  compoundSlots?: [N | ParentSlots<E>] extends [never]
    ? never
    : Array<{
        /** Slots that receive the style */
        slots: ReadonlyArray<NoInfer_<N> | ParentSlots<E>>;
        /** Variant values that must match. Always applies when omitted */
        variants?: CompoundVariant<Merged<T, E>>['variants'];
        /** CSS styles to apply to every listed slot */
        style: CSSObject;
      }>;
  /** Default values for variants. A default is a single value, never a responsive one */
  defaultVariants?: EvVariants<Merged<T, E>>;
}

/**
 * A variant value, or one value per breakpoint when breakpoints are declared.
 * `initial` is the value below every breakpoint.
 */
type Responsive<V, B extends string> = [B] extends [never] ? V : V | { [K in 'initial' | B]?: V };

/**
 * Type for variant values passed to the ev function.
 *
 * All variant keys are optional, allowing partial variant application.
 *
 * @typeParam T - The variant configuration type
 * @typeParam B - The breakpoint names declared with `createEv`
 */
export type EvVariants<
  T extends VariantConfig<Record<string, Record<string, CSSObject>>>,
  B extends string = never,
> = Partial<{
  [K in VariantKeys<T>]: Responsive<VariantValueFor<T, K>, B>;
}>;

/**
 * Extracts the variant props accepted by an `ev()` result.
 *
 * @typeParam T - The type of a function returned by `ev()`, e.g. `typeof button`
 *
 * @example
 * ```typescript
 * type ButtonVariants = VariantProps<typeof button>;
 * // { size?: 'small' | 'large'; color?: 'primary' | 'secondary' }
 * ```
 */
export type VariantProps<T> = T extends (variants?: infer P) => unknown ? NonNullable<P> : never;

/**
 * Class names generated for the base style and each variant value.
 *
 * Styles are injected through `@emotion/css` when the class names are first accessed.
 *
 * @typeParam T - The variant configuration type
 */
export type EvClassNames<T extends VariantConfig<Record<string, Record<string, CSSObject>>>> = {
  /** Class name for the base style, or an empty string when no base style is defined */
  base: string;
  /** Class names for each variant value, keyed by variant name and the value's string form */
  variants: {
    [K in VariantKeys<T>]: {
      [V in VariantValueFor<T, K> as `${V}`]: string;
    };
  };
};

/**
 * Function type returned by the ev function.
 *
 * This is a callable object that also exposes the available variant keys and
 * class-name helpers backed by `@emotion/css`.
 *
 * @typeParam T - The variant configuration type
 * @typeParam B - The breakpoint names declared with `createEv`
 */
export interface EvFunction<
  T extends VariantConfig<Record<string, Record<string, CSSObject>>>,
  B extends string = never,
> {
  /**
   * Main function that accepts variant values and returns the matching styles.
   *
   * @param variants - Optional variant values to apply
   * @returns Array of SerializedStyles that can be passed to the css prop or `css()`
   */
  (variants?: EvVariants<T, B>): SerializedStyles[];

  /**
   * Returns an array of all available variant keys.
   *
   * @returns Array of variant key names
   */
  variants: () => Array<VariantKeys<T>>;

  /**
   * Returns a single class name for the given variant values.
   *
   * Base, variant, and compound variant styles are merged and injected through
   * `@emotion/css`'s global cache. Use it for `className` props or outside React.
   *
   * @param variants - Optional variant values to apply
   * @returns Generated class name
   */
  className: (variants?: EvVariants<T, B>) => string;

  /**
   * Class names for the base style and each variant value.
   *
   * Generated and injected on first access.
   */
  classNames: EvClassNames<T>;
}

/**
 * Function type returned by the ev function when `slots` is declared.
 *
 * @typeParam N - The slot names
 * @typeParam T - The variant configuration type
 * @typeParam B - The breakpoint names declared with `createEv`
 */
export interface EvSlotsFunction<
  N extends string,
  T extends VariantConfig<Record<string, Record<string, CSSObject>>>,
  B extends string = never,
> {
  /**
   * Main function that accepts variant values and returns one style function per slot.
   *
   * Each slot function accepts its own variant values, which take precedence over the
   * ones passed here.
   *
   * @param variants - Optional variant values shared by every slot
   * @returns Style functions keyed by slot name
   */
  (
    variants?: EvVariants<T, B>,
  ): {
    [K in N]: (slotVariants?: EvVariants<T, B>) => SerializedStyles[];
  };

  /**
   * Returns an array of all available variant keys.
   *
   * @returns Array of variant key names
   */
  variants: () => Array<VariantKeys<T>>;

  /**
   * Returns a class name per slot for the given variant values.
   *
   * @param variants - Optional variant values to apply
   * @returns Generated class names keyed by slot name
   */
  className: (variants?: EvVariants<T, B>) => { [K in N]: string };
}

/**
 * The `ev` function. `createEv` returns one that accepts responsive variant values.
 *
 * @typeParam B - The breakpoint names declared with `createEv`
 */
export interface Ev<B extends string = never> {
  /**
   * Creates a type-safe multi-variant style function for Emotion.
   *
   * This function generates a style function that applies different CSS styles based on
   * variant combinations. It supports base styles, multiple variants, compound variants,
   * and default variant values. All styles are applied without requiring explicit `css()`
   * calls - you can pass CSSObject directly.
   *
   * @param config - Configuration object for the ev function
   * @param config.extend - Another ev() result whose styles and variants this one builds on
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
  // biome-ignore lint/style/useShorthandFunctionType: a call signature keeps the JSDoc on hover
  <
    T extends VariantConfig<Record<string, Record<string, CSSObject>>>,
    N extends string = never,
    E extends AnyEv | undefined = undefined,
  >(
    config: EvConfig<T, N, E>,
  ): [N | ParentSlots<E>] extends [never]
    ? EvFunction<Merged<T, E>, B>
    : EvSlotsFunction<NoInfer_<N> | ParentSlots<E>, Merged<T, E>, B>;
}
