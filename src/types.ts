import type { CSSObject } from '@emotion/react';

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
 * Helper type to convert value types back to string keys for classNames.
 * Converts boolean values back to string keys.
 */
type ValueToKey<V> = V extends true
  ? 'true'
  : V extends false
    ? 'false'
    : V extends string | number
      ? string
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
 * Function type returned by the ev function.
 *
 * This is a callable object that also has additional properties for accessing
 * variant information and generated class names.
 *
 * @typeParam T - The variant configuration type
 */
export interface EvFunction<T extends VariantConfig<Record<string, Record<string, CSSObject>>>> {
  /**
   * Main function that accepts variant values and returns Emotion Interpolation.
   *
   * @param variants - Optional variant values to apply
   * @returns Emotion Interpolation that can be used with the css prop
   */
  (variants?: EvVariants<T>): import('@emotion/react').Interpolation<unknown>;

  /**
   * Returns an array of all available variant keys.
   *
   * @returns Array of variant key names
   */
  variants: () => Array<VariantKeys<T>>;

  /**
   * Provides access to generated class names for base styles and variants.
   *
   * Useful for accessing individual class names without applying styles,
   * or for use in non-React contexts.
   */
  classNames: {
    /** Class name for the base style */
    base: string;
    /** Class names for each variant value */
    variants: {
      [K in VariantKeys<T>]: {
        [V in VariantValueFor<T, K> as ValueToKey<V>]: string;
      };
    };
  };
}
