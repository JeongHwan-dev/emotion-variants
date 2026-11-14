import { cache } from '@emotion/css';
import { describe, expect, it } from 'vitest';
import { ev } from '../src/ev';

const stylesOf = (result: ReturnType<ReturnType<typeof ev>>) => result.map((s) => s.styles);

describe('ev - Basic Features', () => {
  it('applies base styles only', () => {
    const style = ev({
      base: {
        padding: '10px',
        margin: '5px',
      },
    });

    expect(stylesOf(style())).toEqual(['padding:10px;margin:5px;']);
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

    expect(stylesOf(button({ size: 'small' }))).toEqual(['padding:10px;', 'font-size:12px;']);
  });

  it('applies multiple variants in definition order', () => {
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

    expect(stylesOf(button({ color: 'primary', size: 'large' }))).toEqual([
      'font-size:16px;',
      'background:blue;',
    ]);
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

    expect(stylesOf(button())).toEqual(['font-size:12px;']);
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

    expect(stylesOf(button({ size: 'large' }))).toEqual(['font-size:16px;']);
  });

  it('falls back to default when the prop is undefined', () => {
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

    expect(stylesOf(button({ size: undefined }))).toEqual(stylesOf(button()));
  });

  it('does not replace false or 0 with the default', () => {
    const box = ev({
      variants: {
        outlined: {
          true: { border: '1px solid' },
          false: { border: 'none' },
        },
        level: {
          0: { zIndex: 0 },
          1: { zIndex: 1 },
        },
      },
      defaultVariants: {
        outlined: true,
        level: 1,
      },
    });

    expect(stylesOf(box({ outlined: false, level: 0 }))).toEqual(['border:none;', 'z-index:0;']);
  });
});

describe('ev - Compound Variants', () => {
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
      {
        variants: { size: 'small', color: 'secondary' },
        style: { fontStyle: 'italic' },
      },
    ],
    defaultVariants: {
      size: 'large',
    },
  });

  it('appends compound styles after base and variants when the condition matches', () => {
    expect(stylesOf(button({ size: 'large', color: 'primary' }))).toEqual([
      'padding:10px;',
      'font-size:16px;',
      'background:blue;',
      'font-weight:bold;',
    ]);
  });

  it('does not apply compound variant when condition does not match', () => {
    expect(stylesOf(button({ size: 'small', color: 'primary' }))).toEqual([
      'padding:10px;',
      'font-size:12px;',
      'background:blue;',
    ]);
  });

  it('applies only the matching compound variant', () => {
    expect(stylesOf(button({ size: 'small', color: 'secondary' }))).toContain('font-style:italic;');
    expect(stylesOf(button({ size: 'small', color: 'secondary' }))).not.toContain(
      'font-weight:bold;',
    );
  });

  it('matches compound variants against default values', () => {
    expect(stylesOf(button({ color: 'primary' }))).toContain('font-weight:bold;');
  });

  describe('array conditions', () => {
    const box = ev({
      variants: {
        size: {
          small: {
            fontSize: '12px',
          },
          medium: {
            fontSize: '14px',
          },
          large: {
            fontSize: '16px',
          },
        },
        outlined: {
          true: {
            border: '1px solid',
          },
          false: {
            border: 'none',
          },
        },
        level: {
          1: {
            zIndex: 1,
          },
          2: {
            zIndex: 2,
          },
          3: {
            zIndex: 3,
          },
        },
      },
      compoundVariants: [
        {
          variants: {
            size: ['small', 'medium'],
            outlined: true,
          },
          style: {
            fontWeight: 'bold',
          },
        },
        {
          variants: {
            outlined: [true, false],
            level: [1, 2],
          },
          style: {
            fontStyle: 'italic',
          },
        },
        {
          variants: {
            size: [],
          },
          style: {
            color: 'red',
          },
        },
        {
          variants: {},
          style: {
            margin: 0,
          },
        },
      ],
    });

    it('matches when the variant has any value in the array', () => {
      expect(stylesOf(box({ size: 'small', outlined: true }))).toContain('font-weight:bold;');
      expect(stylesOf(box({ size: 'medium', outlined: true }))).toContain('font-weight:bold;');
    });

    it('does not match a value outside the array or a failing sibling condition', () => {
      expect(stylesOf(box({ size: 'large', outlined: true }))).not.toContain('font-weight:bold;');
      expect(stylesOf(box({ size: 'small', outlined: false }))).not.toContain('font-weight:bold;');
      expect(stylesOf(box({ outlined: true }))).not.toContain('font-weight:bold;');
    });

    it('matches boolean and number values in arrays', () => {
      expect(stylesOf(box({ outlined: false, level: 2 }))).toContain('font-style:italic;');
      expect(stylesOf(box({ outlined: true, level: 3 }))).not.toContain('font-style:italic;');
    });

    it('never matches an empty array and always matches an empty condition', () => {
      expect(stylesOf(box({ size: 'small' }))).not.toContain('color:red;');
      expect(stylesOf(box())).toEqual(['margin:0;']);
    });
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

    expect(button.variants()).toEqual(['size', 'color']);
  });

  it('returns empty array when no variants', () => {
    const button = ev({
      base: {
        padding: '10px',
      },
    });

    expect(button.variants()).toEqual([]);
  });
});

describe('ev - Edge Cases', () => {
  it('returns an empty array for an empty config', () => {
    const style = ev({});

    expect(style()).toEqual([]);
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
    expect(button({ size: 'nonexistent' })).toEqual([]);
  });

  it('ignores values that only exist on Object.prototype', () => {
    const button = ev({
      variants: {
        size: {
          small: {
            fontSize: '12px',
          },
        },
      },
    });

    // @ts-expect-error - Invalid value for testing
    expect(button({ size: 'constructor' })).toEqual([]);
    // @ts-expect-error - Invalid value for testing
    expect(button({ size: 'toString' })).toEqual([]);
  });

  it('ignores undefined variant values without defaults', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
      },
    });

    expect(button({ size: undefined })).toEqual([]);
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

    expect(stylesOf(button({ outlined: true }))).toEqual(['border:1px solid;']);
    expect(stylesOf(button({ outlined: false }))).toEqual(['border:none;']);
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

    expect(stylesOf(box({ level: 2 }))).toEqual(['z-index:2;']);
  });
});

describe('ev - classNames', () => {
  it('does not inject styles until classNames is accessed', () => {
    const before = Object.keys(cache.inserted).length;
    const box = ev({
      base: { padding: '99px' },
      variants: {
        tone: {
          loud: { fontWeight: 900 },
        },
      },
    });

    expect(Object.keys(cache.inserted).length).toBe(before);

    expect(box.classNames).toBeDefined();

    expect(Object.keys(cache.inserted).length).toBe(before + 2);
  });

  it('generates injected class names for base and variants', () => {
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

    expect(button.classNames.base).toMatch(/^css-/);
    expect(cache.registered[button.classNames.base]).toBe('padding:10px;');
    expect(cache.registered[button.classNames.variants.size.small]).toBe('font-size:12px;');
    expect(cache.registered[button.classNames.variants.size.large]).toBe('font-size:16px;');
  });

  it('keys boolean and number variants by their string form', () => {
    const box = ev({
      variants: {
        outlined: {
          true: { border: '1px solid' },
          false: { border: 'none' },
        },
        level: {
          1: { zIndex: 1 },
        },
      },
    });

    expect(cache.registered[box.classNames.variants.outlined.true]).toBe('border:1px solid;');
    expect(cache.registered[box.classNames.variants.outlined.false]).toBe('border:none;');
    expect(cache.registered[box.classNames.variants.level[1]]).toBe('z-index:1;');
  });

  it('returns an empty base class name when base is not provided', () => {
    const box = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
        },
      },
    });

    expect(box.classNames.base).toBe('');
  });

  it('returns the same object on repeated access', () => {
    const box = ev({ base: { margin: 0 } });

    expect(box.classNames).toBe(box.classNames);
  });
});

describe('ev - className', () => {
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
      },
    },
    compoundVariants: [
      {
        variants: { size: 'large', color: 'primary' },
        style: { fontWeight: 'bold' },
      },
    ],
    defaultVariants: {
      size: 'small',
    },
  });

  it('returns one class name covering base, variants and compound variants', () => {
    const className = button.className({ size: 'large', color: 'primary' });

    expect(className).toMatch(/^css-/);
    expect(cache.registered[className]).toContain('padding:10px;');
    expect(cache.registered[className]).toContain('font-size:16px;');
    expect(cache.registered[className]).toContain('background:blue;');
    expect(cache.registered[className]).toContain('font-weight:bold;');
  });

  it('applies default variants', () => {
    const className = button.className();

    expect(cache.registered[className]).toContain('font-size:12px;');
    expect(cache.registered[className]).not.toContain('font-weight:bold;');
  });
});
