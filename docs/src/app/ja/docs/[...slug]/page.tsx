import { DocsPageView, docsMetadata, docsParams } from '@/components/site';

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export const generateStaticParams = () => docsParams('ja');

export async function generateMetadata({ params }: Props) {
  return docsMetadata('ja', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <DocsPageView lang="ja" slug={(await params).slug} />;
}
