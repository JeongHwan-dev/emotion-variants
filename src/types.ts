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
 *
 * @typeParam T - The variant configuration type
 */
export type CompoundVariant<T extends VariantConfig<Record<string, Record<string, CSSObject>>>> = {
  /** Variant values that must match for this compound variant to apply */
  variants: Partial<{
    [K in VariantKeys<T>]: VariantValueFor<T, K>;
  }>;
  /** CSS styles to apply when the variant conditions are met */
  style: CSSObject;
};

/**
 * Configuration object for the ev function.
 *
 * @typeParam T - The variant configuration type
 */
export interface EvConfig<T extends VariantConfig<Record<string, Record<string, CSSObject>>>> {
  /** Base styles applied to all variants */
  base?: CSSObject;
  /** Variant-specific style definitions */
  variants?: T;
  /** Styles for specific variant combinations */
  compoundVariants?: Array<CompoundVariant<T>>;
  /** Default values for variants */
  defaultVariants?: Partial<{
    [K in VariantKeys<T>]: VariantValueFor<T, K>;
  }>;
}

/**
 * Type for variant values passed to the ev function.
 *
 * All variant keys are optional, allowing partial variant application.
 *
 * @typeParam T - The variant configuration type
 */
export type EvVariants<T extends VariantConfig<Record<string, Record<string, CSSObject>>>> =
  Partial<{
    [K in VariantKeys<T>]: VariantValueFor<T, K>;
  }>;

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
 */
export interface EvFunction<T extends VariantConfig<Record<string, Record<string, CSSObject>>>> {
  /**
   * Main function that accepts variant values and returns the matching styles.
   *
   * @param variants - Optional variant values to apply
   * @returns Array of SerializedStyles that can be passed to the css prop or `css()`
   */
  (variants?: EvVariants<T>): SerializedStyles[];

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
  className: (variants?: EvVariants<T>) => string;

  /**
   * Class names for the base style and each variant value.
   *
   * Generated and injected on first access.
   */
  classNames: EvClassNames<T>;
}
