import type { CSSObject, Interpolation } from '@emotion/react';
import { css } from '@emotion/react';
import type { EvConfig, EvFunction, EvVariants, VariantConfig, VariantKeys } from './types';

/**
 * Internal helper function that generates class names for the ev function.
 *
 * @param variantKeys - Array of variant keys
 * @param variants - Variant configuration object
 * @param baseStyle - Base style (result of css function) or null
 * @returns Generated class names object with base and variant-specific class names
 * @internal
 */
function createEvClassNames<T extends VariantConfig<Record<string, Record<string, CSSObject>>>>(
  variantKeys: Array<VariantKeys<T>>,
  variants: T,
  baseStyle: ReturnType<typeof css> | null,
): EvFunction<T>['classNames'] {
  const classNames = {
    base: baseStyle ? String(baseStyle) : '',
    variants: {} as EvFunction<T>['classNames']['variants'],
  };

  variantKeys.forEach((key) => {
    const variantConfig = variants[key];
    const hasVariantConfig = variantConfig !== undefined && variantConfig !== null;

    if (hasVariantConfig) {
      classNames.variants[key] = {} as EvFunction<T>['classNames']['variants'][typeof key];

      Object.keys(variantConfig).forEach((value) => {
        const style = variantConfig[value];
        const cssStyle = css(style);

        (classNames.variants[key] as Record<string, string>)[value] = String(cssStyle);
      });
    }
  });

  return classNames;
}

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
 * @returns A function that accepts variant values and returns Emotion Interpolation
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
 * // Usage
 * <button css={button({ size: 'large', color: 'primary' })}>Click me</button>
 * ```
 */
export function ev<T extends VariantConfig<Record<string, Record<string, CSSObject>>>>({
  base,
  variants = {} as T,
  compoundVariants = [],
  defaultVariants = {},
}: EvConfig<T>): EvFunction<T> {
  const variantKeys = Object.keys(variants) as Array<VariantKeys<T>>;
  const baseStyle = base ? css(base) : null;
  const variantStyles: Record<string, Record<string, ReturnType<typeof css>>> = {};

  variantKeys.forEach((key) => {
    const variantConfig = variants[key];

    if (variantConfig) {
      variantStyles[key as string] = {};

      Object.keys(variantConfig).forEach((value) => {
        const style = variantConfig[value];
        const cssStyle = css(style);

        variantStyles[key as string][value] = cssStyle;
      });
    }
  });

  const compoundVariantStyles: Array<{
    condition: Record<string, string>;
    style: ReturnType<typeof css>;
  }> = compoundVariants.map((compoundVariant) => {
    const condition: Record<string, string> = {};

    Object.entries(compoundVariant.variants).forEach(([key, value]) => {
      condition[key] = String(value);
    });

    const style = css(compoundVariant.style);

    return {
      condition,
      style,
    };
  });

  function evFunction(variants: EvVariants<T> = {}): Interpolation<unknown> {
    const mergedVariants = {
      ...defaultVariants,
      ...variants,
    };
    const styles: Interpolation<unknown>[] = [];

    if (baseStyle !== null) {
      styles.push(baseStyle);
    }

    variantKeys.forEach((key) => {
      const value = mergedVariants[key];

      if (value !== undefined && variantStyles[key as string]?.[String(value)]) {
        styles.push(variantStyles[key as string][String(value)]);
      }
    });

    compoundVariantStyles.forEach(({ condition, style }) => {
      const isCompoundVariantMatch = Object.entries(condition).every(
        ([key, value]) => String(mergedVariants[key as VariantKeys<T>]) === value,
      );

      if (isCompoundVariantMatch) {
        styles.push(style);
      }
    });

    return styles.length === 1 ? styles[0] : styles;
  }

  evFunction.variants = () => variantKeys;
  evFunction.classNames = createEvClassNames(variantKeys, variants, baseStyle);

  return evFunction;
}
