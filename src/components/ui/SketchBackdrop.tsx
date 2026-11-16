import Image from 'next/image';

/**
 * Decorative architectural pencil sketch that sits in a section's edge or corner and fades into
 * the page. On light sections the paper white disappears with `multiply`; on dark sections the
 * drawing is inverted and `screen`ed so the lines read as white chalk on blueprint.
 *
 * The parent section needs `relative isolate overflow-hidden`; the sketch sits at z -10 inside
 * that stacking context, above the section background and below its content.
 * Sketches are illustrative (generated), not depictions of a real listing or a real skyline.
 */
const SKETCHES = {
  skyline: { src: '/media/sketches/sketch-skyline.webp', width: 2016, height: 864 },
  street: { src: '/media/sketches/sketch-street.webp', width: 1536, height: 990 },
  aerial: { src: '/media/sketches/sketch-aerial.webp', width: 1536, height: 1024 },
} as const;

/** Where the drawing stays solid; everything else fades to nothing. */
const FADES = {
  /** Dissolves outward in every direction from the drawing's centre, like a sketch on paper */
  soft: 'radial-gradient(ellipse 58% 62% at 55% 50%, #000 30%, transparent 74%)',
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
};

export default function SketchBackdrop({ sketch, fade, className, tone = 'light', opacity = 0.32, flip = false, sizes = '60vw' }: Props) {
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
        className="h-auto w-full"
        style={{ filter: tone === 'dark' ? 'invert(1)' : undefined, transform: flip ? 'scaleX(-1)' : undefined }}
      />
    </div>
  );
}
