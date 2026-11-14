import { DocsPageView, docsMetadata, docsParams } from '@/components/site';

type Props = {
  params: Promise<{
    slug: string[];
  }>;
};

export const generateStaticParams = () => docsParams('zh');

export async function generateMetadata({ params }: Props) {
  return docsMetadata('zh', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <DocsPageView lang="zh" slug={(await params).slug} />;
}
