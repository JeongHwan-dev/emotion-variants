import type { ReactNode } from 'react';
import { RootLayout, rootMetadata } from '@/components/site';

export { viewport } from '@/components/site';

export const metadata = rootMetadata('ko');

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayout lang="ko">{children}</RootLayout>;
}
