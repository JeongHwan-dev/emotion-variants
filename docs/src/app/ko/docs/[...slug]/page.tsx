import { DocsPageView, docsMetadata, docsParams } from '@/components/site';

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export const generateStaticParams = () => docsParams('ko');

export async function generateMetadata({ params }: Props) {
  return docsMetadata('ko', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <DocsPageView lang="ko" slug={(await params).slug} />;
}
