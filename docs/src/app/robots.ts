import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

// AI crawlers are welcome too: being cited by them is the point of /llms.txt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE}/sitemap.xml`,
  };
}
