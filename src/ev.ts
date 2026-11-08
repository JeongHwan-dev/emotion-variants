import { css as cssClassName } from '@emotion/css';
import type { CSSObject, SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import type {
  EvClassNames,
  EvConfig,
  EvFunction,
  EvVariants,
  VariantConfig,
  VariantKeys,
} from './types';

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
export function ev<T extends VariantConfig<Record<string, Record<string, CSSObject>>>>({
  base,
  variants = {} as T,
  compoundVariants = [],
  defaultVariants = {},
}: EvConfig<T>): EvFunction<T> {
  const variantKeys = Object.keys(variants) as Array<VariantKeys<T>>;
  const baseStyle = base ? css(base) : null;
  const variantStyles: Record<string, Record<string, SerializedStyles>> = {};

  variantKeys.forEach((key) => {
    const variantConfig = variants[key];

    if (variantConfig) {
      variantStyles[key as string] = {};

      Object.keys(variantConfig).forEach((value) => {
        variantStyles[key as string][value] = css(variantConfig[value]);
      });
    }
  });

  const compoundVariantStyles = compoundVariants.map((compoundVariant) => {
    const condition: Record<string, string> = {};

    Object.entries(compoundVariant.variants).forEach(([key, value]) => {
      condition[key] = String(value);
    });

    return {
      condition,
      style: css(compoundVariant.style),
    };
  });

  function evFunction(props: EvVariants<T> = {}): SerializedStyles[] {
    const styles: SerializedStyles[] = baseStyle ? [baseStyle] : [];
    const resolved: Record<string, string> = {};

    variantKeys.forEach((key) => {
      const value = props[key] ?? defaultVariants[key];

      if (value === undefined) {
        return;
      }

      const valueKey = String(value);
      const style = variantStyles[key as string]?.[valueKey];

      resolved[key as string] = valueKey;

      if (style) {
        styles.push(style);
      }
    });

    compoundVariantStyles.forEach(({ condition, style }) => {
      const isMatch = Object.entries(condition).every(([key, value]) => resolved[key] === value);

      if (isMatch) {
        styles.push(style);
      }
    });

    return styles;
  }

  // Class names are injected into @emotion/css's global cache, so build them on first
  // access instead of at definition time; css-prop-only users never pay for them.
  let classNames: EvClassNames<T> | undefined;

  const createClassNames = (): EvClassNames<T> => {
    const variantClassNames: Record<string, Record<string, string>> = {};

    variantKeys.forEach((key) => {
      variantClassNames[key as string] = {};

      Object.entries(variantStyles[key as string] ?? {}).forEach(([value, style]) => {
        variantClassNames[key as string][value] = cssClassName(style);
      });
    });

    return {
      base: baseStyle ? cssClassName(baseStyle) : '',
      variants: variantClassNames as EvClassNames<T>['variants'],
    };
  };

  const result = Object.assign(evFunction, {
    variants: () => variantKeys,
    className: (props?: EvVariants<T>) => cssClassName(evFunction(props)),
  }) as EvFunction<T>;

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
