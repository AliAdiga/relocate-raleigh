import ModalTriggerButton from './ModalTriggerButton';
import { IconCheck, IconPhone } from './ui/Icons';

const SERVICES = [
  { title: 'Find your home', body: 'Houses to rent or buy in the area that suits your family.' },
  { title: 'Mortgage introductions', body: 'Trusted local mortgage brokers.' },
  { title: 'Moving logistics', body: 'Help coordinating movers, timing and the details.' },
  { title: 'Local answers', body: 'Neighborhoods, schools, careers and everyday life.' },
  { title: 'Community connections', body: 'Introductions to communities, businesses and events.' },
  { title: 'Property management', body: 'Repairs and regular inspections if you keep a home here.' },
];

const FACTS = [
  { value: '15', label: 'tech campuses mapped' },
  { value: '50', label: 'states in the calculator' },
  { value: '4', label: 'languages spoken at home' },
];

export default function NickBio() {
  return (
    <section id="about" className="mx-auto max-w-[1380px] px-6 py-24 sm:px-[30px]" aria-labelledby="about-title">
      <h2
        id="about-title"
        className="mx-auto max-w-[800px] text-center text-[clamp(2rem,4vw,3.125rem)] font-semibold leading-[1.1] tracking-[-0.015em]"
      >
        A local who made the same move
      </h2>

      <div className="mt-16 grid items-start gap-14 lg:grid-cols-2 lg:gap-20 lg:px-16">
        <div className="space-y-8">
          <h3 className="text-[clamp(1.75rem,3vw,2.375rem)] font-semibold leading-tight tracking-tight">
            I&apos;m Nick. I moved my tech career here, and now I help families do the same.
          </h3>
          <div className="space-y-4 text-base leading-relaxed text-ink-soft">
            <p>
              I work as a senior IT professional at a major tech company in Research Triangle Park, and I made the
              cross-country move myself. I know what it takes to find the right community while keeping a
              fast-moving career on track.
            </p>
            <p>
              My wife and I run this business together. We don&apos;t just sell houses: we help families land in a
              community. At home we speak English, Russian, Ukrainian and Mandarin, so we understand the cultural
              and school priorities that matter to international tech families.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ModalTriggerButton variant="contact" className="btn-ink px-7 py-4 text-[0.9375rem]">
              Book a free call
            </ModalTriggerButton>
            <a href="tel:+13477579850" className="btn-outline px-7 py-4 text-[0.9375rem]">
              <IconPhone size={18} />
              (347) 757-9850
            </a>
          </div>
          <dl className="grid grid-cols-3 gap-6 pt-6">
            {FACTS.map((f) => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block text-[clamp(2.5rem,5vw,4.1875rem)] font-semibold leading-none tracking-tight">
                    {f.value}
                  </span>
                  <span className="mt-2 block text-sm text-ink-soft">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="wash rounded-[var(--radius-panel)] p-6 sm:p-10">
          <p className="text-[0.9375rem] font-medium text-ink">Credentials</p>
          <ul className="mt-4 space-y-2.5 text-base text-ink">
            {['Licensed NC Realtor®', 'Senior IT professional in RTP', 'Medical professional on the team', 'English, Russian, Ukrainian, Mandarin'].map((c) => (
              <li key={c} className="flex items-start gap-3">
                <IconCheck size={20} strokeWidth={2} className="mt-0.5 shrink-0 text-violet" />
                {c}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[0.9375rem] font-medium text-ink">How we help</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <li key={s.title} className="rounded-[var(--radius-card)] bg-paper/80 p-4">
                <p className="font-semibold tracking-tight">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
