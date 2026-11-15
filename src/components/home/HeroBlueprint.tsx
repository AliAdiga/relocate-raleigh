/**
 * Decorative drafting marks around the hero scene: a dashed construction circle behind the model,
 * dimension lines along its top and right edges, and a north arrow. Purely visual (aria-hidden),
 * drawn in the same blueprint blue as the page grid and kept away from the text column.
 */
const INK = 'rgb(46 94 140 / 0.38)';
const SOFT = 'rgb(46 94 140 / 0.22)';

function Tick({ x, y, vertical }: { x: number; y: number; vertical?: boolean }) {
  // Architectural "slash" tick at a dimension-line end
  return vertical ? (
    <path d={`M${x - 5} ${y + 5} L${x + 5} ${y - 5} M${x - 7} ${y} H${x + 7}`} stroke={INK} strokeWidth="1.2" />
  ) : (
    <path d={`M${x - 5} ${y + 5} L${x + 5} ${y - 5} M${x} ${y - 7} V${y + 7}`} stroke={INK} strokeWidth="1.2" />
  );
}

/** Behind the scene: construction circle and crosshair centred on the model. */
export function HeroBlueprintBehind() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1000 558" preserveAspectRatio="xMidYMid meet">
      <circle cx="500" cy="300" r="300" fill="none" stroke={SOFT} strokeWidth="1.2" strokeDasharray="6 7" />
      <circle cx="500" cy="300" r="210" fill="none" stroke={SOFT} strokeWidth="1" />
      <path d="M140 300 H860 M500 -30 V640" stroke={SOFT} strokeWidth="1" strokeDasharray="14 6 3 6" />
    </svg>
  );
}

/** Over the scene's margins: dimension lines and a north arrow (never over the house itself). */
export function HeroBlueprintMarks() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible sm:block" viewBox="0 0 1000 558" preserveAspectRatio="xMidYMid meet">
      {/* Top dimension line spanning the model's width */}
      <path d="M250 -26 V-4 M770 -26 V-4" stroke={SOFT} strokeWidth="1" />
      <path d="M250 -16 H770" stroke={INK} strokeWidth="1.2" />
      <Tick x={250} y={-16} />
      <Tick x={770} y={-16} />
      {/* Right dimension line spanning the model's height */}
      <path d="M968 150 H1002 M968 500 H1002" stroke={SOFT} strokeWidth="1" />
      <path d="M992 150 V500" stroke={INK} strokeWidth="1.2" />
      <Tick x={992} y={150} vertical />
      <Tick x={992} y={500} vertical />
      {/* North arrow, top left over the plain wall */}
      <g transform="translate(70 70)">
        <circle r="22" fill="none" stroke={INK} strokeWidth="1.2" />
        <path d="M0 -17 L7 9 L0 4 L-7 9 Z" fill={INK} />
        <text y="-28" textAnchor="middle" fontSize="13" fontWeight="600" fill={INK} fontFamily="inherit">
          N
        </text>
      </g>
    </svg>
  );
}
