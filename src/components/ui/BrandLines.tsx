/**
 * Logo-derived line art: triangle outlines, connected nodes and the orange destination dot.
 * Decorative only (aria-hidden). These are abstract diagrams, never geographic maps.
 */

/** A large, cropped triangle outline for backgrounds. Keep opacity around 3–6% on its surface. */
export function TriangleOutline({
  className = '',
  stroke = 'currentColor',
  opacity = 0.05,
  strokeWidth = 1.5,
  dot = false,
}: {
  className?: string;
  stroke?: string;
  opacity?: number;
  strokeWidth?: number;
  dot?: boolean;
}) {
  return (
    <svg viewBox="0 0 400 346" className={className} aria-hidden fill="none" preserveAspectRatio="xMidYMid meet">
      <path
        d="M200 12 388 334H12L200 12Z"
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {dot && <circle cx="388" cy="334" r="9" fill="#FF791A" />}
    </svg>
  );
}

/** The orange destination dot with a paper ring, for marking "you are here / selected". */
export function DestinationDot({ className = '', size = 12 }: { className?: string; size?: number }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full bg-ember ring-[3px] ring-paper ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
