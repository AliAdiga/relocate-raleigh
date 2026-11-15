import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const alt = 'Relocate Raleigh: keep your tech career, upgrade your life';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Link-preview image in the site's brand: the blue-to-peach wash, the Triangle mark and the hero house. */
export default async function OgImage() {
  const house = await readFile(path.join(process.cwd(), 'public', 'media', 'hero', 'hero-home-square.jpg'));
  const houseSrc = `data:image/jpeg;base64,${house.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(100deg, #C4DFE8 0%, #E9E3D8 52%, #FCDABD 100%)',
          color: '#1F1F1F',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', padding: '64px 0 64px 72px', width: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <svg width="56" height="56" viewBox="0 0 32 32">
              <path d="M16 6.5 5.5 24.5h21L16 6.5Z" fill="none" stroke="#1F1F1F" strokeWidth="2.4" strokeLinejoin="round" />
              <circle cx="16" cy="6.5" r="3.4" fill="#1F1F1F" />
              <circle cx="5.5" cy="24.5" r="3.4" fill="#1F1F1F" />
              <circle cx="26.5" cy="24.5" r="3.9" fill="#FF791A" stroke="#FEFEFF" strokeWidth="1.6" />
            </svg>
            <div style={{ fontSize: 34, fontWeight: 700 }}>Relocate Raleigh</div>
          </div>
          <div style={{ marginTop: 70, fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>
            Keep your career. Upgrade your life.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, lineHeight: 1.4, color: '#3d3d3d', width: 500 }}>
            Salaries, neighborhoods and commutes for tech families moving to Raleigh-Durham.
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={houseSrc} width={630} height={630} style={{ position: 'absolute', right: 0, top: 0, objectFit: 'cover' }} alt="" />
      </div>
    ),
    size,
  );
}
