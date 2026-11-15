import Link from 'next/link';

/**
 * Compact introduction near the top: who Nick is (verified facts only) and how working with him goes.
 * The three steps come from "How Nick helps" in the guide and the services listed on the original site.
 */
const STEPS = [
  {
    title: 'An honest first call',
    body: 'A free 30-minute conversation about where you are, what you’re optimizing for, and whether the Triangle fits.',
  },
  {
    title: 'Neighborhoods and a scouting plan',
    body: 'Guidance on neighborhoods, commutes and school lookups for your situation, plus which addresses to see on your trip.',
  },
  {
    title: 'Buy or rent, then settle in',
    body: 'Help finding a home to rent or buy, introductions to lenders and movers, and answers once you arrive.',
  },
];

export default function NickIntro() {
  return (
    <section aria-labelledby="nick-intro-title" className="bp-grid border-y border-line bg-sand/60">
      <div className="shell grid gap-12 py-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20 lg:py-20">
        <div data-reveal>
          <h2 id="nick-intro-title" className="t-card text-ink">
            A local guide who has made this exact move
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Nick works in tech in Research Triangle Park and relocated here with his own family. He and his wife now
            help other families weigh the same tradeoffs: schools, commute, cost and community.
          </p>
          <ul className="mt-6 space-y-2 text-[0.9375rem] text-ink">
            <li>Licensed North Carolina Realtor®</li>
            <li>Senior IT professional in RTP</li>
            <li>Speaks English, Russian and Ukrainian; Mandarin is spoken at home</li>
          </ul>
          <Link href="#about" className="mt-6 inline-block text-[0.9375rem] font-medium text-ink underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink">
            Read Nick’s story
          </Link>
        </div>

        <ol className="relative grid gap-8 sm:grid-cols-3 sm:gap-6" aria-label="How working with Nick goes">
          {/* Connecting route between the three nodes (decorative) */}
          <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-ink/15 sm:left-2 sm:right-8 sm:top-[7px] sm:h-px sm:w-auto" />
          {STEPS.map((s, i) => (
            <li key={s.title} data-reveal style={{ ['--i' as string]: i }} className="relative pl-8 sm:pl-0 sm:pt-9">
              <span
                aria-hidden
                className={`absolute left-0 top-1 h-[15px] w-[15px] rounded-full ring-4 ring-sand sm:top-0 ${i === 2 ? 'bg-ember' : 'bg-ink'}`}
              />
              <p className="text-sm font-medium text-ink-soft">Step {i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold leading-snug tracking-tight text-ink">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
