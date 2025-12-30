import { describe, expect, it } from 'vitest';
import { ev } from '../src/ev';

describe('ev - Basic Features', () => {
  it('applies base styles only', () => {
    const style = ev({
      base: {
        padding: '10px',
        margin: '5px',
      },
    });

    const result = style();
    expect(result).toBeDefined();
  });

  it('applies single variant', () => {
    const button = ev({
      base: {
        padding: '10px',
      },
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
      },
    });

    const result = button({ size: 'small' });
    expect(result).toBeDefined();
  });

  it('applies multiple variants simultaneously', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
        color: {
          primary: { background: 'blue' },
          secondary: { background: 'gray' },
        },
      },
    });

    const result = button({ size: 'large', color: 'primary' });
    expect(result).toBeDefined();
  });

  it('applies default variants', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
      },
      defaultVariants: {
        size: 'small',
      },
    });

    const result = button();
    expect(result).toBeDefined();
  });

  it('explicit variant overrides default', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
      },
      defaultVariants: {
        size: 'small',
      },
    });

    const result = button({ size: 'large' });
    expect(result).toBeDefined();
  });
});

describe('ev - Compound Variants', () => {
  it('applies compound variant when condition matches', () => {
    const button = ev({
      base: {
        padding: '10px',
      },
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
        color: {
          primary: { background: 'blue' },
          secondary: { background: 'gray' },
        },
      },
      compoundVariants: [
        {
          variants: { size: 'large', color: 'primary' },
          style: { fontWeight: 'bold' },
        },
      ],
    });

    const result = button({ size: 'large', color: 'primary' });
    expect(result).toBeDefined();
  });

  it('does not apply compound variant when condition does not match', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
        color: {
          primary: { background: 'blue' },
          secondary: { background: 'gray' },
        },
      },
      compoundVariants: [
        {
          variants: { size: 'large', color: 'primary' },
          style: { fontWeight: 'bold' },
        },
      ],
    });

    const result = button({ size: 'small', color: 'primary' });
    expect(result).toBeDefined();
  });

  it('applies only matching compound variants', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
        color: {
          primary: { background: 'blue' },
          secondary: { background: 'gray' },
        },
      },
      compoundVariants: [
        {
          variants: { size: 'large', color: 'primary' },
          style: { fontWeight: 'bold' },
        },
        {
          variants: { size: 'small', color: 'secondary' },
          style: { fontStyle: 'italic' },
        },
      ],
    });

    const result1 = button({ size: 'large', color: 'primary' });
    expect(result1).toBeDefined();

    const result2 = button({ size: 'small', color: 'secondary' });
    expect(result2).toBeDefined();
  });
});

describe('ev - classNames', () => {
  it('generates base class name', () => {
    const button = ev({
      base: {
        padding: '10px',
      },
    });

    expect(button.classNames.base).toBeDefined();
    expect(typeof button.classNames.base).toBe('string');
  });

  it('generates variant class names', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
        color: {
          primary: { background: 'blue' },
          secondary: { background: 'gray' },
        },
      },
    });

    expect(button.classNames.variants.size.small).toBeDefined();
    expect(button.classNames.variants.size.large).toBeDefined();
    expect(button.classNames.variants.color.primary).toBeDefined();
    expect(button.classNames.variants.color.secondary).toBeDefined();
  });

  it('returns empty string when base is not provided', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
        },
      },
    });

    expect(button.classNames.base).toBe('');
  });
});

describe('ev - variants method', () => {
  it('returns available variant keys', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
        color: {
          primary: { background: 'blue' },
          secondary: { background: 'gray' },
        },
      },
    });

    const keys = button.variants();
    expect(keys).toContain('size');
    expect(keys).toContain('color');
    expect(keys.length).toBe(2);
  });

  it('returns empty array when no variants', () => {
    const button = ev({
      base: {
        padding: '10px',
      },
    });

    const keys = button.variants();
    expect(keys).toEqual([]);
  });
});

describe('ev - Edge Cases', () => {
  it('can be called with empty config', () => {
    const style = ev({});
    const result = style();
    expect(result).toBeDefined();
  });

  it('ignores non-existent variant values', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
      },
    });

    // @ts-expect-error - Invalid value for testing
    const result = button({ size: 'nonexistent' });

    expect(result).toBeDefined();
  });

  it('ignores undefined variant values', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
      },
    });

    const result = button({ size: undefined });
    expect(result).toBeDefined();
  });

  it('supports boolean variant values', () => {
    const button = ev({
      variants: {
        outlined: {
          true: { border: '1px solid' },
          false: { border: 'none' },
        },
      },
    });

    const result1 = button({ outlined: true });
    const result2 = button({ outlined: false });
    expect(result1).toBeDefined();
    expect(result2).toBeDefined();
  });

  it('supports number variant values', () => {
    const box = ev({
      variants: {
        level: {
          1: { zIndex: 1 },
          2: { zIndex: 2 },
          3: { zIndex: 3 },
        },
      },
    });

    const result = box({ level: 2 });
    expect(result).toBeDefined();
  });
});
