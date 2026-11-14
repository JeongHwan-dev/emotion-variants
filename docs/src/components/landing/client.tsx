/** @jsxImportSource @emotion/react */
'use client';

import { ShikiMagicMove } from '@shikijs/magic-move/react';
import { ev } from 'emotion-variants';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useTheme } from 'fumadocs-ui/provider/base';
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button';
import Link from 'next/link';
import { type CSSProperties, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createHighlighterCoreSync, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import tsx from 'shiki/langs/tsx.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';
import githubLight from 'shiki/themes/github-light.mjs';
import { CheckIcon, ClipboardIcon } from '../icons';
import { CONCEPTS } from './copy';
import '@shikijs/magic-move/style.css';

let highlighter: HighlighterCore | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCoreSync({
    engine: createJavaScriptRegexEngine(),
    themes: [githubLight, githubDark],
    langs: [tsx],
  });

  return highlighter;
}

/** Animates between code snippets. Browser-only: the theme is unknown on the server. */
export function CodeMorph({ code, duration = 400 }: { code: string; duration?: number }) {
  const { resolvedTheme } = useTheme();

  return (
    <ShikiMagicMove
      key={resolvedTheme}
      lang="tsx"
      theme={resolvedTheme === 'dark' ? 'github-dark' : 'github-light'}
      highlighter={getHighlighter()}
      code={code}
      options={{
        duration,
        stagger: 0,
      }}
      className="!bg-transparent"
    />
  );
}

const subscribe = () => () => {};

export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

type CopyLabels = {
  copy: string;
  copied: string;
};

export function CopyButton({ text, copy, copied }: CopyLabels & { text: string }) {
  const [checked, onClick] = useCopyButton(() => navigator.clipboard.writeText(text));

  return (
    <button
      type="button"
      data-checked={checked || undefined}
      aria-live="polite"
      onClick={onClick}
      className={buttonVariants({
        size: 'icon-xs',
        className:
          'shrink-0 text-fd-muted-foreground hover:text-fd-accent-foreground active:scale-96',
      })}
    >
      {checked ? <CheckIcon /> : <ClipboardIcon />}
      <span className="sr-only">{checked ? copied : copy}</span>
    </button>
  );
}

const VARIANTS = ['filled', 'outlined', 'text'] as const;
const SIZES = ['small', 'medium', 'large'] as const;
const COLORS = ['primary', 'secondary', 'success', 'error', 'info', 'warning'] as const;

const button = ev({
  base: {
    border: '1px solid transparent',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.2s ease',
  },
  variants: {
    variant: {
      filled: {
        background: 'var(--button-color)',
        color: 'white',
      },
      outlined: {
        background: 'transparent',
        borderColor: 'var(--button-color)',
        color: 'var(--button-color)',
      },
      text: {
        background: 'transparent',
        color: 'var(--button-color)',
      },
    },
    size: {
      small: {
        padding: '8px 16px',
        fontSize: 12,
      },
      medium: {
        padding: '10px 20px',
        fontSize: 14,
      },
      large: {
        padding: '12px 24px',
        fontSize: 16,
      },
    },
    color: {
      primary: {
        '--button-color': 'var(--color-primary)',
      },
      secondary: {
        '--button-color': '#475569',
      },
      success: {
        '--button-color': '#16a34a',
      },
      error: {
        '--button-color': '#dc2626',
      },
      info: {
        '--button-color': '#0284c7',
      },
      warning: {
        '--button-color': '#d97706',
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        variant: 'filled',
        size: 'large',
        color: 'primary',
      },
      style: {
        boxShadow: '0 4px 12px color-mix(in srgb, var(--color-primary) 40%, transparent)',
      },
    },
  ],
  defaultVariants: {
    variant: 'filled',
    size: 'medium',
    color: 'primary',
  },
});

/** Measures the active button so a highlight behind it can slide to it. */
function useIndicator<K extends PropertyKey>(active: K) {
  const buttons = useRef(new Map<K, HTMLButtonElement>());
  const [style, setStyle] = useState<CSSProperties>();

  useLayoutEffect(() => {
    const button = buttons.current.get(active);
    if (!button?.parentElement) return;

    const measure = () =>
      setStyle({
        width: button.offsetWidth,
        height: button.offsetHeight,
        translate: `${button.offsetLeft}px ${button.offsetTop}px`,
      });
    measure();

    // Wrapping or a layout switch moves the button without changing `active`.
    const observer = new ResizeObserver(measure);
    observer.observe(button.parentElement);
    return () => observer.disconnect();
  }, [active]);

  return {
    style,
    ref: (key: K) => (button: HTMLButtonElement | null) => {
      if (button) buttons.current.set(key, button);
      else buttons.current.delete(key);
    },
  };
}

const slide =
  'absolute top-0 left-0 transition-[translate,width,height] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none';

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  const indicator = useIndicator(value);

  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 font-mono text-xs text-fd-muted-foreground">{label}</span>
      <div className="relative inline-flex flex-wrap gap-0.5 rounded-lg border bg-fd-secondary p-0.5">
        {indicator.style && (
          <span
            aria-hidden
            style={indicator.style}
            className={`${slide} rounded-md bg-white shadow-sm dark:bg-fd-background`}
          />
        )}
        {options.map((option) => (
          <button
            key={option}
            ref={indicator.ref(option)}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className="relative cursor-pointer rounded-md px-2 py-1 font-mono text-xs text-fd-muted-foreground transition-colors duration-300 hover:text-fd-foreground aria-pressed:text-fd-foreground"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HeroDemo() {
  const [variant, setVariant] = useState<(typeof VARIANTS)[number]>('filled');
  const [size, setSize] = useState<(typeof SIZES)[number]>('medium');
  const [color, setColor] = useState<(typeof COLORS)[number]>('primary');
  // ponytail: Emotion renders after mount only, so the app needs no SSR style registry.
  const mounted = useMounted();

  return (
    <div className="overflow-hidden rounded-2xl border bg-fd-card shadow-lg">
      <div className="flex h-44 items-center justify-center border-b bg-fd-background">
        {mounted && (
          <button
            type="button"
            css={button({
              variant,
              size,
              color,
            })}
          >
            Button
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3 p-4">
        <Segmented label="variant" options={VARIANTS} value={variant} onChange={setVariant} />
        <Segmented label="size" options={SIZES} value={size} onChange={setSize} />
        <Segmented label="color" options={COLORS} value={color} onChange={setColor} />
      </div>
      <div className="h-[7.875rem] overflow-x-auto border-t px-4 py-3 text-sm">
        {mounted && (
          <CodeMorph
            code={`button({\n  variant: '${variant}',\n  size: '${size}',\n  color: '${color}',\n});`}
          />
        )}
      </div>
    </div>
  );
}

type Concept = {
  name: string;
  description: string;
  href: string;
  code: string;
};

export function Concepts({ items, readDocs }: { items: Concept[]; readDocs: string }) {
  const [index, setIndex] = useState(0);
  // The theme is only known in the browser, so the code window stays empty until then.
  const mounted = useMounted();
  const current = items[index];
  const indicator = useIndicator(index);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="relative flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {indicator.style && (
          <span
            aria-hidden
            style={indicator.style}
            className={`${slide} rounded-lg border border-fd-primary/30 bg-fd-primary/10`}
          />
        )}
        {items.map((item, i) => {
          const Icon = CONCEPTS[i].icon;
          return (
            <button
              key={item.href}
              ref={indicator.ref(i)}
              type="button"
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className="relative shrink-0 cursor-pointer rounded-lg border border-transparent px-3 py-2 text-left transition-colors duration-300 hover:bg-fd-accent aria-pressed:text-fd-primary aria-pressed:hover:bg-transparent"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4 shrink-0" />
                {item.name}
              </span>
              <span className="hidden text-sm text-fd-muted-foreground lg:block">
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
      <div className="min-w-0 overflow-hidden rounded-2xl border bg-fd-card">
        <div className="flex items-center justify-between gap-4 border-b px-4 py-2.5 text-sm">
          <span className="text-fd-muted-foreground">{current.description}</span>
          <Link
            href={current.href}
            className="shrink-0 font-medium text-fd-primary hover:underline"
          >
            {readDocs} →
          </Link>
        </div>
        <div className="overflow-x-auto p-4 text-sm leading-normal">
          {mounted && <CodeMorph code={current.code} />}
        </div>
      </div>
    </div>
  );
}
