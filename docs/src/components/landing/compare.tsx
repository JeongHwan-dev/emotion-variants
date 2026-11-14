'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { CodeMorph, useMounted } from './client';

type CompareStep = {
  title: string;
  body: ReactNode;
  code: string;
};

function CompareBadge({ after }: { after: boolean }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-xs transition-colors duration-300 ${
        after
          ? 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary'
          : 'bg-fd-muted text-fd-muted-foreground'
      }`}
    >
      {after ? 'After' : 'Before'}
    </span>
  );
}

/**
 * Scrollytelling: on large screens the code stays pinned and morphs to the step being read.
 * Smaller screens have no room for a pinned panel, so each step carries its own code.
 */
export function BeforeAfter({ steps }: { steps: CompareStep[] }) {
  const [index, setIndex] = useState(0);
  const mounted = useMounted();
  const list = useRef<HTMLOListElement>(null);
  const code = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!list.current) return;

    // The root shrinks to the viewport's horizontal center line: the step crossing it is active.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setIndex(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      {
        rootMargin: '-50% 0px -50% 0px',
      },
    );
    for (const step of list.current.children) observer.observe(step);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const panel = code.current;
    if (!panel) return;
    // A step that keeps the previous step's code explains its end: the type and the component.
    const continues = steps[index].code === steps[index - 1]?.code;
    panel.scrollTo({
      top: continues ? panel.scrollHeight : 0,
    });
  }, [index, steps]);

  return (
    <div className="lg:grid lg:grid-cols-[1fr_1.5fr] lg:gap-10">
      {/* The bottom padding keeps the panel pinned until the last step reaches the center. */}
      <ol ref={list} className="flex flex-col gap-12 lg:gap-0 lg:pb-[25vh]">
        {steps.map((step, i) => (
          <li
            key={step.title}
            data-index={i}
            data-active={i === index || undefined}
            className="motion-reduce:transition-none lg:flex lg:min-h-[50vh] lg:flex-col lg:items-start lg:justify-center lg:opacity-30 lg:blur-sm lg:transition-[opacity,filter] lg:duration-300 lg:data-active:opacity-100 lg:data-active:blur-none"
          >
            <CompareBadge after={i > 0} />
            <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
            <p className="mt-2 text-fd-muted-foreground">{step.body}</p>
            {/* A step that keeps the previous step's code does not repeat it. */}
            {step.code !== steps[i - 1]?.code && (
              <div className="mt-4 overflow-x-auto rounded-xl border bg-fd-card p-4 text-xs leading-normal lg:hidden">
                {mounted && <CodeMorph code={step.code} />}
              </div>
            )}
          </li>
        ))}
      </ol>
      <div className="hidden lg:block">
        <div className="sticky top-18 flex h-[calc(100dvh-5.5rem)] max-h-[47rem] flex-col overflow-hidden rounded-2xl border bg-fd-card">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <span className="font-mono text-sm text-fd-muted-foreground">Button.tsx</span>
            <CompareBadge after={index > 0} />
          </div>
          {/* The panel keeps its height; code longer than it scrolls inside. */}
          <div
            ref={code}
            className="flex-1 overflow-auto p-4 text-xs leading-normal motion-safe:scroll-smooth"
          >
            {mounted && <CodeMorph code={steps[index].code} duration={700} />}
          </div>
        </div>
      </div>
    </div>
  );
}
