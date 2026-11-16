import Image from 'next/image';

/**
 * Decorative architectural pencil sketch that sits in a section's edge or corner and fades into
 * the page. On light sections the paper white disappears with `multiply`; on dark sections the
 * drawing is inverted and `screen`ed so the lines read as white chalk on blueprint.
 *
 * The parent section needs `relative isolate overflow-hidden`; the sketch sits at z -10 inside
 * that stacking context, above the section background and below its content.
 * Artwork is illustrative, not a depiction of a real listing or of Raleigh. The ref-* images were
 * supplied by the site owner; confirm their licence before publishing.
 */
const SKETCHES = {
  skyline: { src: '/media/sketches/sketch-skyline.webp', width: 2016, height: 864 },
  tower: { src: '/media/sketches/ref-tower-sketch-top.webp', width: 736, height: 860 },
  cityHaze: { src: '/media/sketches/ref-city-haze.webp', width: 736, height: 720 },
  lookingUp: { src: '/media/sketches/ref-looking-up.webp', width: 736, height: 1313 },
  blueprintBuilding: { src: '/media/sketches/ref-blueprint-building.webp', width: 736, height: 1313 },
} as const;

/** Where the drawing stays solid; everything else fades to nothing. */
const FADES = {
  /** Dissolves outward in every direction from the drawing's centre, like a sketch on paper */
  soft: 'radial-gradient(ellipse 58% 62% at 55% 50%, #000 30%, transparent 74%)',
  /** Only the frame shows: clear in the middle where the content sits, drawing at the edges */
  edges: 'radial-gradient(ellipse 70% 62% at 50% 50%, transparent 55%, #000 100%)',
  'bottom-right': 'radial-gradient(ellipse 85% 90% at 100% 100%, #000 35%, transparent 75%)',
  'bottom-left': 'radial-gradient(ellipse 85% 90% at 0% 100%, #000 35%, transparent 75%)',
  'top-right': 'radial-gradient(ellipse 80% 90% at 100% 0%, #000 30%, transparent 72%)',
  'top-left': 'radial-gradient(ellipse 80% 90% at 0% 0%, #000 30%, transparent 72%)',
  bottom: 'linear-gradient(to top, #000 0%, #000 30%, transparent 85%)',
} as const;

type Props = {
  sketch: keyof typeof SKETCHES;
  fade: keyof typeof FADES;
  /** Position and size classes, e.g. "bottom-0 right-0 w-[70%] max-w-[900px]" */
  className: string;
  tone?: 'light' | 'dark';
  opacity?: number;
  flip?: boolean;
  sizes?: string;
  /** cover: fill the positioned box (cropping); width: natural aspect at the box width */
  fit?: 'width' | 'cover';
};

export default function SketchBackdrop({ sketch, fade, className, tone = 'light', opacity = 0.32, flip = false, sizes = '60vw', fit = 'width' }: Props) {
  const s = SKETCHES[sketch];
  const mask = FADES[fade];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 select-none print:hidden ${className}`}
      style={{
        opacity,
        mixBlendMode: tone === 'dark' ? 'screen' : 'multiply',
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <Image
        src={s.src}
        width={s.width}
        height={s.height}
        alt=""
        sizes={sizes}
        className={fit === 'cover' ? 'h-full w-full object-cover' : 'h-auto w-full'}
        style={{ filter: tone === 'dark' ? 'invert(1)' : undefined, transform: flip ? 'scaleX(-1)' : undefined }}
      />
    </div>
  );
}
