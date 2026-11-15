import Image from 'next/image';
import type { Photo } from '@/data/photos';
import ModalTriggerButton from './ModalTriggerButton';
import { TriangleOutline } from './ui/BrandLines';

/** Services listed on the original site. */
const SERVICES = [
  ['Find your home', 'Houses to rent or buy in the area that suits your family.'],
  ['Mortgage introductions', 'Connections to trusted local mortgage brokers.'],
  ['Moving logistics', 'Help coordinating the details of the move.'],
  ['Local answers', 'Neighborhoods, schools, careers and everyday life.'],
  ['Community connections', 'Introductions to communities, businesses and events.'],
  ['Property management', 'Repairs and regular inspections if you keep a home here.'],
];

/**
 * Fuller introduction. Pass `portrait` once a real photo of Nick (and his wife, if they agree) exists;
 * until then no stand-in image is shown, so nothing implies a likeness that isn't theirs.
 */
export default function NickBio({ portrait }: { portrait?: Photo }) {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative overflow-hidden">
      <TriangleOutline className="pointer-events-none absolute -left-40 top-10 hidden w-[560px] text-ink lg:block" opacity={0.045} />
      <div className="shell relative grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
        <div>
          <h2 id="about-title" className="t-section max-w-[640px]">
            Nick and his wife made this move. Now they help families do the same.
          </h2>
          {portrait && (
            <figure className="mt-8 overflow-hidden rounded-[var(--radius-panel)]">
              <Image src={portrait.src} alt={portrait.alt} width={portrait.width} height={portrait.height} className="h-auto w-full object-cover" />
            </figure>
          )}
          <div className="mt-8 max-w-[640px] space-y-5 text-[1.0625rem] leading-relaxed text-ink-soft">
            <p>
              Nick is a senior IT professional at a major tech company in Research Triangle Park. He made the
              cross-country move himself, finding the right community while keeping a fast-moving tech career on track.
            </p>
            <p>
              He and his wife run Relocate Raleigh together. They don&apos;t just sell houses; they help families land in
              a community. Their household speaks English, Russian, Ukrainian and Mandarin, so they understand the
              cultural and school priorities that matter to international tech families.
            </p>
            <p className="border-l-2 border-ember pl-5 text-ink">
              “The real work is figuring out which of those nine neighborhoods fits your kids, your commute, and your
              budget.”
              <span className="mt-1 block text-sm text-ink-soft">From the Relocate Raleigh guide</span>
            </p>
          </div>
          <div className="mt-9 flex flex-wrap gap-3">
            <ModalTriggerButton variant="contact" className="btn-ink px-7 py-4 text-[0.9375rem]">
              Request a relocation call
            </ModalTriggerButton>
            <a href="tel:+13477579850" className="btn-outline px-7 py-4 text-[0.9375rem]">
              Call (347) 757-9850
            </a>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-medium text-ink-soft">Credentials</h3>
            <ul className="mt-3 space-y-2 text-base text-ink">
              <li>Licensed North Carolina Realtor®</li>
              <li>Senior IT professional in RTP</li>
              <li>Medical professional on the team</li>
              <li>English, Russian and Ukrainian; Mandarin at home</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-ink-soft">How they help</h3>
            <dl className="mt-3 divide-y divide-line border-y border-line">
              {SERVICES.map(([t, b]) => (
                <div key={t} className="py-3">
                  <dt className="font-semibold text-ink">{t}</dt>
                  <dd className="text-sm leading-relaxed text-ink-soft">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
