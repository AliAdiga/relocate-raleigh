import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import BarPair from '@/components/charts/BarPair';
import { SchoolMeter } from '@/components/Shortlist';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCalculator,
  IconCalendar,
  IconCheck,
  IconHeart,
  IconKey,
  IconMapPin,
  IconMessages,
  IconPhone,
  IconPrinter,
  IconSearch,
  IconTrash,
  Logo,
  LogoMark,
} from '@/components/ui/Icons';

export const metadata: Metadata = {
  title: 'Brand and style guide | Relocate Raleigh',
  robots: { index: false },
};

const COLORS = [
  { name: 'Mist', hex: '#C4DFE8', role: 'Brand wash, left side' },
  { name: 'Peach', hex: '#FCDABD', role: 'Brand wash, right side' },
  { name: 'Ink', hex: '#1F1F1F', role: 'Text, primary buttons' },
  { name: 'Ink soft', hex: '#545454', role: 'Secondary text' },
  { name: 'Stone', hex: '#6E6E6E', role: 'Captions, axis labels' },
  { name: 'Line', hex: '#E7E7E7', role: 'Borders and dividers' },
  { name: 'Fog', hex: '#F6F6F4', role: 'Panels and controls' },
  { name: 'Paper', hex: '#FEFEFF', role: 'Page background' },
];

const ACCENTS = [
  { name: 'Leaf', hex: '#58BF52', role: 'Step 1 icons, school meter, success' },
  { name: 'Ember', hex: '#FF791A', role: 'Step 2 icons, Raleigh dot in the logo' },
  { name: 'Violet', hex: '#3741B5', role: 'Step 3 icons, focus ring, Raleigh in charts' },
  { name: 'Ember deep', hex: '#E8650A', role: '"Your state" in charts, dates' },
];

const TYPE = [
  { px: 89, use: 'Display (rare)' },
  { px: 67, use: 'Hero headline' },
  { px: 50, use: 'Section headline' },
  { px: 38, use: 'Sub-headline, big stats' },
  { px: 28, use: 'Card titles' },
  { px: 21, use: 'Lead paragraph' },
  { px: 16, use: 'Body' },
  { px: 12, use: 'Captions, footnotes' },
];

const ICONS = [
  { C: IconCalculator, n: 'Calculator' },
  { C: IconMapPin, n: 'Map pin' },
  { C: IconKey, n: 'Key' },
  { C: IconMessages, n: 'Messages' },
  { C: IconSearch, n: 'Search' },
  { C: IconHeart, n: 'Save' },
  { C: IconPhone, n: 'Phone' },
  { C: IconCalendar, n: 'Calendar' },
  { C: IconPrinter, n: 'Print' },
  { C: IconTrash, n: 'Remove' },
  { C: IconCheck, n: 'Check' },
  { C: IconArrowLeft, n: 'Back' },
  { C: IconArrowRight, n: 'Next' },
];

const VOICE = [
  ['Say what it does', '"Get the guide", not "Submit". "Send my shortlist to Nick", not "Continue".'],
  ['Show the math', 'Every number says where it came from and that it is an estimate.'],
  ['Plain and warm', 'Sentence case, short sentences, no hype. Talk to a family, not an investor.'],
  ['Only real proof', 'No stock "clients", no invented counts. Leave the slot empty until it is true.'],
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="border-t border-line py-14">
      <h2 id={`${id}-t`} className="mb-8 text-[clamp(1.75rem,3vw,2.375rem)] font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({ name, hex, role }: { name: string; hex: string; role: string }) {
  return (
    <li className="overflow-hidden rounded-[var(--radius-card)] border border-line">
      <div className="h-24" style={{ background: hex }} />
      <div className="p-4">
        <p className="font-semibold">{name}</p>
        <p className="text-sm tabular-nums text-ink-soft">{hex}</p>
        <p className="mt-1 text-sm text-stone">{role}</p>
      </div>
    </li>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-[1380px] flex-1 px-6 pb-20 pt-12 sm:px-[30px] lg:px-[46px]">
        <h1 className="text-[clamp(2.5rem,5.5vw,4.1875rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          Brand and style guide
        </h1>
        <p className="mt-5 max-w-[680px] text-lg leading-relaxed text-ink-soft">
          The building blocks of Relocate Raleigh: logo, color, type, components, charts and voice. Use this page
          when adding anything new so the site, guide and emails stay one family.
        </p>

        <Section id="logo" title="Logo">
          <p className="mb-8 max-w-[680px] text-base leading-relaxed text-ink-soft">
            The mark is the Research Triangle drawn as a roofline: Durham at the top, Chapel Hill and Raleigh at the
            base. Raleigh, the destination, is the orange dot. Keep clear space equal to one dot around it, and never
            recolor the orange.
          </p>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <li className="flex h-44 items-center justify-center rounded-[var(--radius-card)] border border-line">
              <Logo />
            </li>
            <li className="wash flex h-44 items-center justify-center rounded-[var(--radius-card)]">
              <LogoMark className="h-20 w-20 text-ink" />
            </li>
            <li className="flex h-44 items-center justify-center rounded-[var(--radius-card)] bg-ink">
              <LogoMark className="h-20 w-20 text-paper" />
            </li>
            <li className="flex h-44 items-center justify-center gap-6 rounded-[var(--radius-card)] border border-line">
              <LogoMark className="h-8 w-8 text-ink" />
              <LogoMark className="h-5 w-5 text-ink" />
              <LogoMark className="h-4 w-4 text-ink" />
            </li>
          </ul>
        </Section>

        <Section id="color" title="Color">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COLORS.map((c) => (
              <Swatch key={c.hex} {...c} />
            ))}
          </ul>
          <h3 className="mb-5 mt-12 text-xl font-semibold tracking-tight">Accents</h3>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ACCENTS.map((c) => (
              <Swatch key={c.hex} {...c} />
            ))}
          </ul>
          <div className="wash mt-12 flex h-40 items-end rounded-[var(--radius-panel)] p-6">
            <p className="font-medium">The wash: mist to peach, used on hero panels and calls to action.</p>
          </div>
        </Section>

        <Section id="type" title="Type">
          <p className="mb-8 max-w-[680px] text-base leading-relaxed text-ink-soft">
            Poppins in three weights (400 body, 500 labels, 600 headings). Base 16px on a 1.33 scale. Headlines
            use tight tracking and balanced wrapping; body lines stay under 80 characters.
          </p>
          <ul className="space-y-5">
            {TYPE.map((t) => (
              <li key={t.px} className="grid items-baseline gap-4 border-b border-line pb-5 sm:grid-cols-[8rem_minmax(0,1fr)]">
                <span className="text-sm text-stone">
                  {t.px}px, {t.use}
                </span>
                <span
                  className={`truncate ${t.px >= 28 ? 'font-semibold tracking-tight' : ''}`}
                  style={{ fontSize: Math.min(t.px, 67), lineHeight: 1.15 }}
                >
                  Keep your career
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="components" title="Components">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn-ink px-7 py-4 text-[0.9375rem]">Book a free call</button>
                <button type="button" className="btn-outline px-7 py-4 text-[0.9375rem]">See the full calendar</button>
                <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper" aria-label="Next">
                  <IconArrowRight size={22} />
                </button>
              </div>
              <h3 className="pt-4 text-lg font-semibold">Fields</h3>
              <label className="block max-w-sm">
                <span className="mb-2 block text-sm font-medium">Your salary today</span>
                <input className="field" defaultValue="200,000" />
              </label>
              <div className="flex max-w-[460px] items-center rounded-full bg-paper p-1.5 pl-5 shadow-[0_10px_30px_-20px_rgba(31,31,31,0.5)] ring-1 ring-line">
                <span className="flex-1 text-[0.9375rem] text-[#8a8a8a]">Enter your email</span>
                <span className="btn-ink px-6 py-3 text-[0.9375rem]">Get the guide</span>
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="text-lg font-semibold">Chips and meters</h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">Selected</span>
                <span className="rounded-full bg-fog px-5 py-2.5 text-sm font-medium text-ink-soft">Option</span>
                <span className="rounded-full bg-fog px-3 py-1 text-xs">Tag</span>
              </div>
              <SchoolMeter score={8} />
              <h3 className="pt-4 text-lg font-semibold">Radii</h3>
              <div className="flex items-end gap-4">
                <div className="h-20 w-28 rounded-[var(--radius-panel)] bg-fog" title="Panel 28px" />
                <div className="h-16 w-24 rounded-[var(--radius-card)] bg-fog" title="Card 20px" />
                <div className="h-12 w-20 rounded-[0.875rem] bg-fog" title="Field 14px" />
                <div className="h-10 w-20 rounded-full bg-fog" title="Pill" />
              </div>
              <p className="text-sm text-stone">Panel 28px, card 20px, field 14px, pill for buttons and chips.</p>
            </div>
          </div>
        </Section>

        <Section id="icons" title="Icons">
          <p className="mb-8 max-w-[680px] text-base leading-relaxed text-ink-soft">
            24px linear icons with a 1.5px stroke and round joins. Color them with an accent only when they mark a
            step or a state.
          </p>
          <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-7">
            {ICONS.map(({ C, n }) => (
              <li key={n} className="flex flex-col items-center gap-2 rounded-[var(--radius-card)] border border-line py-5 text-sm text-ink-soft">
                <C size={28} className="text-ink" />
                {n}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="charts" title="Charts">
          <p className="mb-8 max-w-[680px] text-base leading-relaxed text-ink-soft">
            Two series colors, checked for color-blind safety: orange (#E8650A) for &ldquo;where you live now&rdquo; and
            violet (#3741B5) for Raleigh. Everything else is gray. Bars are thin with rounded ends, values are written
            out, and every chart has a hover readout.
          </p>
          <div className="max-w-md">
            <BarPair
              title="Typical home price"
              format={(n) => `$${n.toLocaleString('en-US')}`}
              data={[
                { label: 'Washington', value: 552256, color: '#E8650A' },
                { label: 'Raleigh area', value: 420000, color: '#3741B5' },
              ]}
            />
          </div>
        </Section>

        <Section id="voice" title="Voice">
          <ul className="grid gap-5 md:grid-cols-2">
            {VOICE.map(([t, b]) => (
              <li key={t} className="rounded-[var(--radius-card)] bg-fog p-6">
                <p className="font-semibold">{t}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{b}</p>
              </li>
            ))}
          </ul>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
