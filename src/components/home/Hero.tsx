import HeroMovePicker from '../HeroMovePicker';
import HeroActions from './HeroActions';
import HeroMedia from './HeroMedia';

/**
 * Architectural hero. Copy, logo and actions are real HTML; the house is an illustrative render
 * (still first, ambient loop when allowed). Local photography lives further down the page.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-[radial-gradient(70%_90%_at_92%_40%,#f6d6bf_0%,transparent_70%),radial-gradient(60%_80%_at_45%_0%,#e4e6e8_0%,transparent_70%),linear-gradient(100deg,#f3f2ef_0%,#f5ebe3_55%,#f3dfd0_100%)]"
    >
      <div className="shell grid items-center gap-6 pb-6 pt-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-4 lg:pb-8 lg:pt-12">
        <div className="relative z-10 space-y-6 lg:space-y-7 lg:pb-6">
          <p className="kicker">For tech professionals and families moving to Raleigh-Durham</p>
          <h1 id="hero-title" className="max-w-[9.6em] text-[clamp(2.5rem,1.3rem+3.3vw,3.9rem)] font-semibold leading-[1.03] tracking-[-0.025em] text-ink">
            Keep your career. Upgrade your life.
          </h1>
          <p className="lead max-w-[520px] text-ink-soft">
            Find your place in Raleigh, Durham, Cary and the Research Triangle, with local guidance on neighborhoods,
            housing, commutes and your move.
          </p>
          <HeroActions />
        </div>
        <div className="relative -mx-2 sm:mx-0 lg:-mr-6">
          <HeroMedia />
        </div>
      </div>

      {/* Compact supporting strip: quick estimate (synced with the calculator) and who Nick is */}
      <div className="border-t border-ink/10 bg-paper/55 backdrop-blur-[2px]">
        <div className="shell grid gap-5 py-5 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:items-center md:gap-10">
          <HeroMovePicker />
          <p className="text-[0.9375rem] leading-relaxed text-ink md:border-l md:border-ink/10 md:pl-10">
            <span className="font-semibold">Nick</span> is a licensed North Carolina Realtor® and a senior IT
            professional in RTP who moved here with his family.{' '}
            <a href="#about" className="whitespace-nowrap font-medium underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
              Meet Nick
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
