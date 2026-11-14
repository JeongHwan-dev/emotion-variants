import type { ReactNode } from 'react';
import { RootLayout, rootMetadata } from '@/components/site';

export { viewport } from '@/components/site';

export const metadata = rootMetadata('en');

export default function Layout({ children }: { children: ReactNode }) {
  return <RootLayout lang="en">{children}</RootLayout>;
}
