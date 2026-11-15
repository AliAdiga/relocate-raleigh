import Image from 'next/image';
import Link from 'next/link';
import GuideEmailForm from '../GuideEmailForm';

/** Real contents of content/relocation-guide.md (chapter titles), summarized. */
const CONTENTS = [
  ['Is Raleigh right for you?', 'An honest filter, the tech job market and the trailing-spouse question'],
  ['Neighborhood playbook', 'Nine neighborhoods compared on price, commute, schools and walkability'],
  ['The scouting trip', '3- and 5-day itineraries that test real daily life'],
  ['Schools deep dive', 'How Wake County assignment works, key dates and private options'],
  ['The money chapter', 'Taxes, property tax, vehicle taxes and hidden costs'],
  ['Logistics and the first 90 days', 'Movers, cars, the DMV, healthcare handoffs and waitlists'],
  ['Cultural infrastructure', 'Grocers, festivals, tech meetups, coworking and communities'],
  ['Seasonal survival guide', 'Pollen, humidity, storms and what to pack'],
];

export default function GuideSection() {
  return (
    <section id="guide" aria-labelledby="guide-title" className="section-y">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <div className="space-y-6" data-reveal>
          <h2 id="guide-title" className="t-section">
            The free Relocate Raleigh guide
          </h2>
          <p className="lead text-ink-soft">
            Everything Nick wishes his family had known before moving: eight chapters plus printable checklists,
            emailed to you as a PDF.
          </p>
          <GuideEmailForm source="Guide section" />
          <p className="text-sm text-ink-soft">
            Prefer to start right away?{' '}
            <Link href="/checklist" className="font-medium text-ink underline underline-offset-4">
              Use the online relocation checklist
            </Link>
            .
          </p>
          <Image src="/renders/house-isometric.png" alt="" width={244} height={224} className="hidden h-auto w-[180px] lg:block" />
        </div>
        <div data-reveal style={{ ['--i' as string]: 1 }}>
          <h3 className="text-sm font-medium text-ink-soft">What’s inside</h3>
          <ol className="mt-3 divide-y divide-line border-y border-line">
            {CONTENTS.map(([title, desc], i) => (
              <li key={title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-2 py-3.5">
                <span className="text-sm font-medium tabular-nums text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="block font-semibold text-ink">{title}</span>
                  <span className="block text-sm leading-relaxed text-ink-soft">{desc}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-ink-soft">Plus a scouting checklist, a first-90-days checklist and a cost worksheet.</p>
        </div>
      </div>
    </section>
  );
}
