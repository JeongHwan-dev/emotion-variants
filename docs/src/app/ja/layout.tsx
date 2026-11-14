import type { ReactNode } from 'react';
import { RootLayout, rootMetadata } from '@/components/site';

export { viewport } from '@/components/site';

export const metadata = rootMetadata('ja');

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayout lang="ja">{children}</RootLayout>;
}
