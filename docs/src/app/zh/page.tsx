import { HomePage, homeMetadata } from '@/components/site';

export const metadata = homeMetadata('zh');

export default function Page() {
  return <HomePage lang="zh" />;
}
