import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon: the Triangle mark on the brand wash. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(120deg, #C4DFE8 0%, #E9E3D8 55%, #FCDABD 100%)',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M16 6.5 5.5 24.5h21L16 6.5Z" fill="none" stroke="#1F1F1F" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="16" cy="6.5" r="3.4" fill="#1F1F1F" />
          <circle cx="5.5" cy="24.5" r="3.4" fill="#1F1F1F" />
          <circle cx="26.5" cy="24.5" r="3.9" fill="#FF791A" stroke="#FEFEFF" strokeWidth="1.6" />
        </svg>
      </div>
    ),
    size,
  );
}
