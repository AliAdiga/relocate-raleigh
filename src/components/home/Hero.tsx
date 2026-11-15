import Link from 'next/link';
import { IconArrowRight, IconBuilding, IconCalculator, IconCalendar, IconHome, IconKey, IconMapPin } from '../ui/Icons';
import { HeroBlueprintBehind, HeroBlueprintMarks } from './HeroBlueprint';
import HeroActions from './HeroActions';
import HeroEstimateCard from './HeroEstimateCard';
import HeroMedia from './HeroMedia';

/** Ivory sampled from the render's wall, so the scene melts into the page. */
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
    <section aria-labelledby="hero-title" className="bp-grid relative -mt-[var(--header-h,72px)] overflow-x-clip" style={{ backgroundColor: BG }}>
      <div className="shell grid items-center gap-y-6 pb-10 pt-[calc(var(--header-h,72px)+28px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-x-6 lg:pb-20 lg:pt-[calc(var(--header-h,72px)+48px)]">
        {/* Copy */}
        <div className="relative z-10 max-w-[600px] space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper/70 px-3.5 py-1.5 text-sm text-ink backdrop-blur">
            <span aria-hidden className="h-2 w-2 rounded-full bg-ember" />
            Relocation help for Raleigh-Durham
          </p>
          <h1 id="hero-title" className="text-[clamp(2.5rem,1.3rem+3.6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-ink">
            Keep your career.
            <span className="block text-ember-ink">Upgrade your life.</span>
          </h1>
          <p className="lead max-w-[500px] text-ink-soft">
            Local guidance on neighborhoods, homes, commutes and the move itself, from a tech professional who made the
            same move.
          </p>
          <HeroActions />
          <ul
            className="grid max-w-[520px] grid-cols-3 gap-2 rounded-[var(--radius-card)] border border-white/80 bg-white/55 p-3 backdrop-blur-md sm:gap-4 sm:p-4"
            aria-label="What this site covers"
          >
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

        {/* The whole scene, uncropped and modest in size */}
        <div className="relative -mx-5 sm:mx-0 lg:-mt-16">
          <div className="relative">
            <HeroBlueprintBehind />
            <HeroMedia />
            <HeroBlueprintMarks />
            <p className="absolute left-[5%] top-[3%] z-10 rounded-full bg-paper/80 px-2.5 py-0.5 text-[0.6875rem] sm:bottom-[9%] sm:left-[9%] sm:top-auto sm:px-3 sm:py-1 sm:text-xs text-ink-soft backdrop-blur">
              Illustrative model, not a listing
            </p>
          </div>
          {/* Hangs off the bottom edge over the empty desk, never over the house */}
          <div className="relative z-10 mx-5 mt-1 sm:mx-0 sm:ml-auto sm:max-w-[300px] lg:absolute lg:right-0 lg:top-[90%] lg:mt-0">
            <HeroEstimateCard />
          </div>
        </div>
      </div>

      {/* Dark services bar, like the reference */}
      <div className="shell relative z-20 pb-10">
        <ul className="bp-grid bp-grid-dark grid gap-px overflow-hidden rounded-[var(--radius-panel)] text-[#f3f2ee] sm:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: '#1b1b1a' }}>
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
