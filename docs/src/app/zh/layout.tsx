import type { ReactNode } from 'react';
import { RootLayout, rootMetadata } from '@/components/site';

export { viewport } from '@/components/site';

export const metadata = rootMetadata('zh');

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayout lang="zh">{children}</RootLayout>;
}
