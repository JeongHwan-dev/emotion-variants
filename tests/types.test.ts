import type { SerializedStyles } from '@emotion/react';
import { describe, expectTypeOf, it } from 'vitest';
import { ev } from '../src/ev';
import type { EvFunction, VariantProps } from '../src/types';

describe('ev - Type Tests', () => {
  it('infers basic variant types', () => {
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

    button({ size: 'small', color: 'primary' });
    button({ size: 'large' });
    button({ color: 'secondary' });
    button();

    type ButtonVariants = Parameters<typeof button>[0];

    const _test1: ButtonVariants = { size: 'small', color: 'primary' };
    const _test2: ButtonVariants = { size: 'large' };
    const _test3: ButtonVariants = { color: 'secondary' };
    const _test4: ButtonVariants = {};

    expectTypeOf(_test1).not.toBeNever();
    expectTypeOf(_test2).not.toBeNever();
    expectTypeOf(_test3).not.toBeNever();
    expectTypeOf(_test4).not.toBeNever();
  });

  it('boolean variant types', () => {
    const button = ev({
      variants: {
        outlined: {
          true: { border: '1px solid' },
          false: { border: 'none' },
        },
        disabled: {
          true: { opacity: 0.5 },
        },
      },
    });

    button({ outlined: true });
    button({ outlined: false });
    button({ disabled: true });

    type ButtonVariants = Parameters<typeof button>[0];

    const _test1: ButtonVariants = { outlined: true };
    const _test2: ButtonVariants = { outlined: false };
    const _test3: ButtonVariants = { disabled: true };

    expectTypeOf(_test1).not.toBeNever();
    expectTypeOf(_test2).not.toBeNever();
    expectTypeOf(_test3).not.toBeNever();
  });

  it('number variant types', () => {
    const box = ev({
      variants: {
        level: {
          1: { zIndex: 1 },
          2: { zIndex: 2 },
          3: { zIndex: 3 },
        },
      },
    });

    box({ level: 1 });
    box({ level: 2 });

    type BoxVariants = Parameters<typeof box>[0];

    const _test1: BoxVariants = { level: 1 };
    const _test2: BoxVariants = { level: 2 };
    const _test3: BoxVariants = {};

    expectTypeOf(_test1).not.toBeNever();
    expectTypeOf(_test2).not.toBeNever();
    expectTypeOf(_test3).not.toBeNever();
  });

  it('EvFunction type', () => {
    const button = ev({
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
      },
    });

    type ButtonConfig = {
      size: {
        small: { fontSize: string };
        large: { fontSize: string };
      };
    };

    expectTypeOf(button).toMatchTypeOf<EvFunction<ButtonConfig>>();
    expectTypeOf(button.variants).toBeFunction();
    expectTypeOf(button()).toEqualTypeOf<SerializedStyles[]>();
  });

  it('classNames and className types', () => {
    const button = ev({
      base: { padding: '10px' },
      variants: {
        size: {
          small: { fontSize: '12px' },
          large: { fontSize: '16px' },
        },
        outlined: {
          true: { border: '1px solid' },
          false: { border: 'none' },
        },
        level: {
          1: { zIndex: 1 },
          2: { zIndex: 2 },
        },
      },
    });

    expectTypeOf(button.classNames.base).toBeString();
    expectTypeOf(button.classNames.variants.size).toEqualTypeOf<{ small: string; large: string }>();
    expectTypeOf(button.classNames.variants.outlined).toEqualTypeOf<{
      true: string;
      false: string;
    }>();
    expectTypeOf(button.classNames.variants.level).toEqualTypeOf<{ 1: string; 2: string }>();
    expectTypeOf(button.className).parameter(0).toEqualTypeOf<Parameters<typeof button>[0]>();
    expectTypeOf(button.className()).toBeString();
  });

  it('VariantProps extracts the call props', () => {
    const button = ev({
      variants: {
        size: {
          small: {
            fontSize: '12px',
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
        },
      },
    });
    const plain = ev({
      base: {
        padding: '10px',
      },
    });

    expectTypeOf<VariantProps<typeof button>>().toEqualTypeOf<{
      size?: 'small' | 'large';
      outlined?: boolean;
      level?: 1 | 2;
    }>();
    expectTypeOf<VariantProps<typeof button>>().toEqualTypeOf<
      NonNullable<Parameters<typeof button>[0]>
    >();
    expectTypeOf<VariantProps<typeof plain>>().toEqualTypeOf<
      NonNullable<Parameters<typeof plain>[0]>
    >();
    expectTypeOf<VariantProps<string>>().toBeNever();
  });

  it('compound variant conditions accept a value or an array of values', () => {
    ev({
      variants: {
        size: {
          small: {
            fontSize: '12px',
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
      },
      compoundVariants: [
        {
          variants: {
            size: ['small', 'large'],
            outlined: [true, false],
          },
          style: {
            fontWeight: 'bold',
          },
        },
        {
          variants: {
            size: ['small', 'large'] as const,
            outlined: true,
          },
          style: {
            fontWeight: 'bold',
          },
        },
        {
          variants: {
            // @ts-expect-error - 'medium' is not a size value
            size: ['small', 'medium'],
          },
          style: {
            fontWeight: 'bold',
          },
        },
        {
          variants: {
            // @ts-expect-error - 'medium' is not a size value
            size: 'medium',
          },
          style: {
            fontWeight: 'bold',
          },
        },
      ],
    });
  });

  it('slots return a style function and a class name per slot', () => {
    const card = ev({
      slots: {
        root: {
          padding: '8px',
        },
        title: {
          fontWeight: 'bold',
        },
      },
      variants: {
        size: {
          small: {
            title: {
              fontSize: '12px',
            },
          },
          large: {
            title: {
              fontSize: '20px',
            },
          },
        },
      },
      compoundVariants: [
        {
          variants: {
            size: 'large',
          },
          style: {
            root: {
              padding: '16px',
            },
          },
        },
      ],
      compoundSlots: [
        {
          slots: ['root', 'title'],
          variants: {
            size: ['small', 'large'],
          },
          style: {
            margin: '0',
          },
        },
      ],
      defaultVariants: {
        size: 'small',
      },
    });

    type Variants = {
      size?: 'small' | 'large';
    };
    type SlotFunction = (slotVariants?: Variants) => SerializedStyles[];

    expectTypeOf(card()).toEqualTypeOf<{
      root: SlotFunction;
      title: SlotFunction;
    }>();
    expectTypeOf(card.className()).toEqualTypeOf<{
      root: string;
      title: string;
    }>();
    expectTypeOf<VariantProps<typeof card>>().toEqualTypeOf<Variants>();
    expectTypeOf(card).not.toHaveProperty('classNames');
    card().title({
      // @ts-expect-error - 'medium' is not a size value
      size: 'medium',
    });
  });

  it('slots reject styles that are not keyed by a declared slot', () => {
    ev({
      slots: {
        root: {
          padding: '8px',
        },
      },
      variants: {
        size: {
          small: {
            // @ts-expect-error - 'title' is not a slot
            title: {
              fontSize: '12px',
            },
          },
        },
      },
    });

    ev({
      slots: {
        root: {
          padding: '8px',
        },
      },
      compoundSlots: [
        {
          // @ts-expect-error - 'title' is not a slot
          slots: ['root', 'title'],
          style: {
            margin: '0',
          },
        },
      ],
    });

    ev({
      slots: {
        root: {
          padding: '8px',
        },
      },
      compoundVariants: [
        {
          variants: {},
          style: {
            // @ts-expect-error - a slot-mode compound style is keyed by slot
            margin: '0',
          },
        },
      ],
    });
  });

  it('slots and base are mutually exclusive', () => {
    ev({
      // @ts-expect-error - use `slots` for base styles once it is declared
      base: {
        padding: '8px',
      },
      slots: {
        root: {
          padding: '8px',
        },
      },
    });

    ev({
      base: {
        padding: '8px',
      },
      // @ts-expect-error - compoundSlots needs `slots`
      compoundSlots: [],
    });
  });

  it('type-safe with empty variants', () => {
    const style = ev({
      base: { padding: '10px' },
    });

    style();
    style({});

    type StyleVariants = Parameters<typeof style>[0];
    const _test1: StyleVariants = {};
    expectTypeOf(_test1).not.toBeNever();
  });
});
