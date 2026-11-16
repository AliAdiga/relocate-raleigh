import Image from 'next/image';
import { IconFloorPlan, IconSun } from '../ui/Icons';

/**
 * Static architectural showcase: centred heading, a short intro, the owner-approved concept cutaway
 * as the dominant visual, and two feature cards. No interaction, video or animation by design.
 *
 * Artwork: public/media/showcase/concept-cutaway.webp, trimmed of empty margin only from
 * content/source-art/concept-cutaway-original.jpg (the untouched original).
 */
const ART = { src: '/media/showcase/concept-cutaway.webp', width: 1296, height: 914 };

/** Near-white sampled from the artwork's background, so the image sits on the page without a box. */
const BG = '#f5f5f3';

/**
 * Feathers only the empty outer margin into the section colour (the building sits well inside it).
 * Inline because the CSS pipeline drops multi-layer mask rules.
 */
const FEATHER = [
  'linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%)',
  'linear-gradient(to bottom, transparent 0%, #000 8%, #000 96%, transparent 100%)',
].join(', ');

const FEATURES = [
  {
    icon: IconFloorPlan,
    title: 'Space for everyday living',
    body: 'Consider how the kitchen, dining, and living areas connect—and whether that flow suits your daily routine.',
  },
  {
    icon: IconSun,
    title: 'Details that shape the feel',
    body: 'Natural materials, daylight, and quiet corners can make a space feel comfortable and personal.',
  },
];

export default function HomePerspective() {
  return (
    <section aria-labelledby="perspective-title" className="section-y" style={{ backgroundColor: BG }}>
      <div className="shell grid gap-y-8 xl:grid-cols-[minmax(0,2.25fr)_minmax(0,7.75fr)_minmax(0,2.5fr)] xl:gap-x-6 xl:gap-y-4">
        <h2 id="perspective-title" className="t-section mx-auto max-w-[760px] text-center text-ink xl:col-span-3" data-reveal>
          A different perspective on home
        </h2>

        <p className="lead mx-auto max-w-[560px] text-center text-ink-soft xl:col-start-1 xl:row-start-2 xl:mx-0 xl:mt-6 xl:text-left" data-reveal>
          Think beyond the address. Consider how a home’s layout, natural light, and shared spaces could support the
          way you live.
        </p>

        <figure className="-mx-5 sm:mx-0 xl:col-start-2 xl:row-start-2">
          <div style={{ maskImage: FEATHER, WebkitMaskImage: FEATHER, maskComposite: 'intersect', WebkitMaskComposite: 'source-in' }}>
            <Image
              src={ART.src}
              width={ART.width}
              height={ART.height}
              sizes="(min-width: 1280px) 760px, (min-width: 640px) 90vw, 100vw"
              alt="Concept model of a single-storey home with the roof removed, showing a bathroom, kitchen with an island, a living room with a sofa and a bedroom, with exposed timber rafters over the bedroom, resting on architectural drawings"
              className="mx-auto h-auto w-full max-w-[900px] xl:max-w-none"
            />
          </div>
          <figcaption className="mt-2 px-5 text-center text-xs text-ink-soft sm:px-0">
            Concept architectural visualization—not an available property.
          </figcaption>
        </figure>

        <ul className="grid gap-4 sm:grid-cols-2 xl:col-start-3 xl:row-start-2 xl:mt-8 xl:grid-cols-1 xl:self-start">
          {FEATURES.map((f) => (
            <li key={f.title} className="rounded-[var(--radius-card)] border border-line/80 bg-white/70 p-5 xl:p-4" data-reveal>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ember/10 text-ember-deep xl:h-9 xl:w-9">
                <f.icon size={22} />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink xl:mt-3">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{f.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
