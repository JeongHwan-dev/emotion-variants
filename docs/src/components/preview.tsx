'use client';

import type { ReactNode } from 'react';
import { DEMOS } from './demos';
import { useMounted } from './landing/client';

/** Renders a live demo above the code block it wraps. */
export function Preview({ name, children }: { name: keyof typeof DEMOS; children: ReactNode }) {
  // ponytail: Emotion renders after mount only, like the landing demos.
  const mounted = useMounted();
  const Demo = DEMOS[name];

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border">
      <div className="flex min-h-40 flex-wrap items-center justify-center gap-3 border-b bg-fd-background p-6 leading-normal">
        {mounted && <Demo />}
      </div>
      <div className="[&_figure]:my-0 [&_figure]:rounded-none [&_figure]:border-0">{children}</div>
    </div>
  );
}
