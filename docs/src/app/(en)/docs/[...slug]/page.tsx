import { DocsPageView, docsMetadata, docsParams } from '@/components/site';

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export const generateStaticParams = () => docsParams('en');

export async function generateMetadata({ params }: Props) {
  return docsMetadata('en', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <DocsPageView lang="en" slug={(await params).slug} />;
}
