import Link from 'next/link';
import { IconArrowRight, IconBuilding, IconCalculator, IconCalendar, IconHome, IconKey, IconMapPin } from '../ui/Icons';
import HeroActions from './HeroActions';
import HeroEstimateCard from './HeroEstimateCard';
import HeroMedia from './HeroMedia';

/** Ivory sampled from the hero render's wall, so the image fades into the page. */
const BG = '#f4eee6';

/** Coverage the site actually has. No client counts, awards or ratings: none are verified. */
const FACTS = [
  { icon: IconMapPin, value: '9', label: 'Neighborhoods compared' },
  { icon: IconBuilding, value: '15', label: 'Tech employers mapped' },
  { icon: IconCalculator, value: '50', label: 'States in the calculator' },
];

/** Services from the original site and the guide's "How Nick helps". */
const SERVICES = [
  { icon: IconMapPin, title: 'Neighborhood guidance', body: 'Commutes, schools and honest tradeoffs for your situation.', href: '/#neighborhoods' },
  { icon: IconHome, title: 'Find your home', body: 'Rent or buy, with introductions to trusted local lenders.', href: '/#about' },
  { icon: IconCalendar, title: 'Scouting trips', body: 'A practical plan for a visit that tests real daily life.', href: '/scouting' },
  { icon: IconKey, title: 'Settling in', body: 'Movers, utilities, the DMV and finding your community.', href: '/checklist' },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative -mt-[var(--header-h,72px)]" style={{ backgroundColor: BG }}>
      <div className="relative">
        {/* Copy column, layered over the image on large screens */}
        <div className="shell relative z-10 pb-8 pt-[calc(var(--header-h,72px)+28px)] lg:min-h-[max(680px,46vw)] lg:pb-36 lg:pt-[calc(var(--header-h,72px)+64px)]">
          <div className="max-w-[600px] space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper/70 px-3.5 py-1.5 text-sm text-ink backdrop-blur">
              <span aria-hidden className="h-2 w-2 rounded-full bg-ember" />
              Relocation help for Raleigh-Durham
            </p>
            <h1
              id="hero-title"
              className="text-[clamp(2.5rem,1.3rem+3.6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-ink"
            >
              Keep your career.
              <span className="block text-ember-ink">Upgrade your life.</span>
            </h1>
            <p className="lead max-w-[500px] text-ink-soft">
              Local guidance on neighborhoods, homes, commutes and the move itself, from a tech professional who made
              the same move.
            </p>
            <HeroActions />
            <ul className="grid max-w-[520px] grid-cols-3 gap-2 rounded-[var(--radius-card)] border border-white/80 bg-white/55 p-3 backdrop-blur-md sm:gap-4 sm:p-4" aria-label="What this site covers">
              {FACTS.map((f) => (
                <li key={f.label} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                  <f.icon size={26} className="shrink-0 text-ember-ink" />
                  <span>
                    <span className="block text-xl font-semibold leading-none tracking-tight text-ink sm:text-2xl">{f.value}</span>
                    <span className="mt-1 block text-xs leading-snug text-ink-soft">{f.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Image: in flow on phones and tablets; full-height on the right from 1024px */}
        <div className="relative aspect-[4/5] md:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[68%] 2xl:w-[64%]">
          <HeroMedia />
          {/* Blend into the page: from the top on small screens, from the text side on large ones */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/4 lg:hidden" style={{ background: `linear-gradient(to bottom, ${BG}, transparent)` }} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ background: `linear-gradient(to right, ${BG} 0%, ${BG}e6 12%, ${BG}80 24%, ${BG}00 40%)` }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-1/5 lg:block" style={{ background: `linear-gradient(to top, ${BG}, transparent)` }} />
          <p className="absolute bottom-[4.25rem] left-3 z-10 rounded-full bg-paper/75 px-3 py-1 text-xs text-ink-soft backdrop-blur lg:bottom-28 lg:left-auto lg:right-5">
            Illustrative model, not a listing
          </p>
        </div>

        {/* Floating quick estimate: over the image on large screens, below it on small ones */}
        <div className="shell relative z-10 -mt-14 lg:absolute lg:right-[4%] lg:top-[calc(var(--header-h,72px)+30%)] lg:mt-0 lg:w-auto lg:px-0">
          <HeroEstimateCard />
        </div>
      </div>

      {/* Dark services bar, overlapping the bottom of the image like the reference */}
      <div className="shell relative z-20 pb-10 pt-6 lg:-mt-24 lg:pt-0">
        <ul className="grid gap-px overflow-hidden rounded-[var(--radius-panel)] bg-white/10 text-[#f3f2ee] sm:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: '#1b1b1a' }}>
          {SERVICES.map((s) => (
            <li key={s.title}>
              <Link href={s.href} className="group flex h-full gap-4 p-5 transition-colors hover:bg-white/[0.04] sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-ember">
                  <s.icon size={22} />
                </span>
                <span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    {s.title}
                    <IconArrowRight size={15} className="opacity-0 transition-opacity group-hover:opacity-70" />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-[#bdbcb6]">{s.body}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
