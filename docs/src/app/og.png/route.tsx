import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { copy } from '@/components/landing/copy';

export const dynamic = 'force-static';

// ponytail: one card for the whole site; per-page cards when shared links need to tell pages apart.
export async function GET() {
  const logo = await readFile(join(process.cwd(), 'public/logo.svg'), 'base64');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 96,
        gap: 32,
        background: 'linear-gradient(135deg, #ffffff 55%, #fbe6f6 100%)',
        color: '#18181b',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
        }}
      >
        <img src={`data:image/svg+xml;base64,${logo}`} alt="" width={112} height={112} />
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          emotion-variants
        </div>
      </div>
      <div
        style={{
          fontSize: 44,
          color: '#d36ac2',
          fontWeight: 600,
        }}
      >
        {copy.en.title}
      </div>
      <div
        style={{
          fontSize: 32,
          color: '#52525b',
        }}
      >
        {copy.en.tagline}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
