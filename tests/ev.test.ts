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
