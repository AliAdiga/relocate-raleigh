import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ClosingCta from '@/components/ClosingCta';
import AskNickButton from '@/components/AskNickButton';
import { SaveButton } from '@/components/Shortlist';
import { COMMUTE_EMPLOYERS } from '@/data/commuteEmployers';
import { CULTURE_STORES, CULTURE_TABS } from '@/data/cultureStores';
import {
  COMMUTE_METHOD,
  NEIGHBORHOODS,
  NEIGHBORHOOD_DATA_AS_OF,
  estimateCommuteMinutes,
  formatBand,
  formatK,
  getNeighborhood,
} from '@/data/neighborhoods';
import { PHOTOS } from '@/data/photos';
import { RESOURCES } from '@/data/resources';

export function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({ slug: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNeighborhood(slug);
  if (!n) return {};
  const title = `Moving to ${n.name}: homes, commutes and everyday life | Relocate Raleigh`;
  const description = `${n.character} 4-bedroom homes typically ${formatBand(n)}; ${n.rtp.min}–${n.rtp.max} minutes to RTP at rush hour.`;
  return {
    title,
    description,
    alternates: { canonical: `/neighborhoods/${n.id}` },
    openGraph: { title, description, images: [{ url: PHOTOS[n.photo].src, width: PHOTOS[n.photo].width, height: PHOTOS[n.photo].height }] },
  };
}

const mapsLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default async function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = getNeighborhood(slug);
  if (!n) notFound();
  const photo = PHOTOS[n.photo];

  const commutes = COMMUTE_EMPLOYERS.map((e) => ({ ...e, minutes: estimateCommuteMinutes(e, n) })).sort((a, b) => a.minutes - b.minutes);
  const maxMinutes = Math.max(...commutes.map((c) => c.minutes));
  // Extra headroom so the label after the widest range never runs off a phone screen.
  const priceMax = Math.max(...NEIGHBORHOODS.map((x) => x.band.high)) * 1.3;
  const byBand = [...NEIGHBORHOODS].sort((a, b) => a.band.low - b.band.low);

  const parks = RESOURCES.parks
    .filter((p) => p.lat && p.lng)
    .map((p) => ({ ...p, minutes: estimateCommuteMinutes({ lat: p.lat!, lng: p.lng! }, n) }))
    .sort((a, b) => a.minutes - b.minutes)
    .slice(0, 3);
  const grocers = CULTURE_TABS.flatMap((t) => CULTURE_STORES[t.id].map((s) => ({ ...s, group: t.label })))
    .map((s) => ({ ...s, minutes: estimateCommuteMinutes(s, n) }))
    .sort((a, b) => a.minutes - b.minutes)
    .slice(0, 5);
  const related = NEIGHBORHOODS.filter((x) => x.id !== n.id)
    .map((x) => ({ ...x, minutes: estimateCommuteMinutes(x, n) }))
    .sort((a, b) => a.minutes - b.minutes)
    .slice(0, 3);

  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1">
        {/* Header: real local photo, name, character, actions */}
        <section className="shell pb-12 pt-6 lg:pb-16 lg:pt-10" aria-labelledby="hood-title">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
            <Link href="/#neighborhoods" className="underline-offset-4 hover:text-ink hover:underline">
              Explorer
            </Link>
            <span aria-hidden> / </span>
            <Link href="/neighborhoods" className="underline-offset-4 hover:text-ink hover:underline">
              Neighborhoods
            </Link>
            <span aria-hidden> / </span>
            <span className="text-ink">{n.name}</span>
          </nav>
          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
            <div className="space-y-6">
              <p className="kicker">In one word: {n.inOneWord}</p>
              <h1 id="hood-title" className="t-display text-ink">
                {n.name}
              </h1>
              <p className="lead max-w-[520px] text-ink-soft">{n.character}</p>
              <div className="flex flex-wrap items-center gap-3">
                <AskNickButton topic={n.name} className="btn-ink px-6 py-3.5 text-[0.9375rem]">
                  Ask Nick about {n.name}
                </AskNickButton>
                <SaveButton id={n.id} name={n.name} withLabel />
              </div>
            </div>
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] sm:aspect-[16/10]">
                <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 680px, 92vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 text-xs text-ink-soft">
                {photo.place}. Photo: {photo.author}, {photo.license}.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* Key facts */}
        <section className="border-y border-line bg-sand/60" aria-label="Key figures">
          <dl className="shell grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
            <Fact label="Realistic 4-bedroom budget" value={formatBand(n)} note="From the guide’s family-home bands" />
            <Fact label="Median sale price" value={n.median.label} note={n.median.note ?? `Redfin, ${NEIGHBORHOOD_DATA_AS_OF}`} />
            <Fact label="Drive to central RTP, rush hour" value={`${n.rtp.min}–${n.rtp.max} min`} note="Typical range from most addresses" />
            <Fact label="Walk Score" value={n.walkScore} note="Higher is more walkable" />
          </dl>
        </section>

        <div className="shell section-y grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Overview */}
          <section aria-labelledby="overview" className="space-y-8">
            <h2 id="overview" className="t-card">
              What it’s like
            </h2>
            <div>
              <h3 className="font-semibold text-ink">Housing</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{n.housing}</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-ink">Why families choose it</h3>
                <ul className="mt-2 space-y-1.5 text-ink-soft">
                  {n.pros.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ink">Honest tradeoffs</h3>
                <ul className="mt-2 space-y-1.5 text-ink-soft">
                  {n.cons.map((c) => (
                    <li key={c} className="flex gap-2">
                      <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full border border-ink" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-[var(--radius-card)] bg-fog p-5">
              <h3 className="font-semibold text-ink">Schools</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Representative assignment patterns from the guide (early 2026). Schools are assigned by address and can
                change each year, so check a specific address before you sign.
              </p>
              <ul className="mt-3 space-y-1.5 text-[0.9375rem] text-ink">
                {n.schoolPatterns.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <a href={n.district.lookupUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-ink underline underline-offset-4">
                {n.district.name} assignment lookup
              </a>
            </div>
          </section>

          {/* Commute */}
          <section aria-labelledby="commute" className="space-y-6">
            <h2 id="commute" className="t-card">
              Drive times to tech employers
            </h2>
            <p className="text-sm leading-relaxed text-ink-soft">{COMMUTE_METHOD} Bars under 25 minutes are dark.</p>
            <ul className="space-y-2.5">
              {commutes.map((c) => (
                <li key={c.id} className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)_3.75rem] items-center gap-3 text-sm">
                  <span className="truncate text-ink">{c.name}</span>
                  <span className="h-2.5 rounded-r-[4px] bg-fog" aria-hidden>
                    <span className="block h-full rounded-r-[4px]" style={{ width: `${(c.minutes / maxMinutes) * 100}%`, background: c.minutes <= 25 ? '#1F1F1F' : '#C9C9C9' }} />
                  </span>
                  <span className="text-right tabular-nums text-ink">~{c.minutes} min</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Price context */}
          <section aria-labelledby="price" className="space-y-6">
            <h2 id="price" className="t-card">
              4-bedroom budgets across the Triangle
            </h2>
            <p className="text-sm leading-relaxed text-ink-soft">
              Realistic ranges for a 4-bedroom family home, from the Relocate Raleigh guide ({NEIGHBORHOOD_DATA_AS_OF}).
            </p>
            <ul className="space-y-2.5">
              {byBand.map((x) => {
                const me = x.id === n.id;
                return (
                  <li key={x.id} className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] items-center gap-3 text-sm">
                    {me ? (
                      <span className="flex items-center gap-2 truncate font-semibold text-ink">
                        <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-ember" />
                        {x.name}
                      </span>
                    ) : (
                      <Link href={`/neighborhoods/${x.id}`} className="truncate text-ink-soft underline-offset-4 hover:text-ink hover:underline">
                        {x.name}
                      </Link>
                    )}
                    <span className="relative h-5" aria-label={`${x.name}: ${formatBand(x)}`}>
                      <span
                        className={`absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full ${me ? 'bg-ember-deep' : 'bg-[#C9C9C9]'}`}
                        style={{ left: `${(x.band.low / priceMax) * 100}%`, width: `${((x.band.high - x.band.low) / priceMax) * 100}%` }}
                      />
                      <span className={`absolute top-1/2 -translate-y-1/2 pl-2 text-xs tabular-nums ${me ? 'font-semibold text-ink' : 'text-ink-soft'}`} style={{ left: `${(x.band.high / priceMax) * 100}%` }}>
                        {formatK(x.band.high)}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Everyday life nearby */}
          <section aria-labelledby="nearby" className="space-y-6">
            <h2 id="nearby" className="t-card">
              Everyday life nearby
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-ink">Closest big parks</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {parks.map((p) => (
                    <li key={p.id}>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline-offset-4 hover:underline">
                        {p.name}
                      </a>
                      <span className="block text-ink-soft">~{p.minutes} min drive (estimate)</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ink">Specialty grocers</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {grocers.map((g) => (
                    <li key={g.id}>
                      <a href={mapsLink(`${g.name} ${g.address}`)} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline-offset-4 hover:underline">
                        {g.name}
                      </a>
                      <span className="block text-ink-soft">
                        {g.group}, ~{g.minutes} min
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Related */}
        <section className="border-t border-line" aria-labelledby="related">
          <div className="shell section-y">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="related" className="t-card">
                Nearby alternatives
              </h2>
              <Link href="/#neighborhoods" className="text-[0.9375rem] font-medium underline underline-offset-4">
                Back to the explorer (your filters are saved)
              </Link>
            </div>
            <ul className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((x) => {
                const p = PHOTOS[x.photo];
                return (
                  <li key={x.id} className="relative overflow-hidden rounded-[var(--radius-card)] border border-line hover:border-[#c9c9c9]">
                    <div className="relative aspect-[16/9]">
                      <Image src={p.src} alt="" fill sizes="(min-width: 768px) 30vw, 92vw" className="object-cover" />
                    </div>
                    <div className="p-5">
                      <Link href={`/neighborhoods/${x.id}`} className="text-lg font-semibold tracking-tight after:absolute after:inset-0">
                        {x.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink-soft">
                        {x.inOneWord}. 4-bedroom homes {formatBand(x)}.
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-10 max-w-3xl text-xs leading-relaxed text-stone">
              Sources: Redfin and Homes.com market snapshots ({NEIGHBORHOOD_DATA_AS_OF}) and representative school
              patterns (GreatSchools, early 2026), compiled in the Relocate Raleigh guide. Figures are a starting point;
              confirm with current listings and the district lookup.
            </p>
          </div>
        </section>
        <ClosingCta title={`Thinking about ${n.name}? Let’s talk it through.`} />
      </main>
      <SiteFooter />
    </>
  );
}

function Fact({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div>
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="mt-1 text-[clamp(1.375rem,1.1rem+0.9vw,1.875rem)] font-semibold leading-tight tracking-tight tabular-nums text-ink">{value}</dd>
      <dd className="mt-1 text-xs text-ink-soft">{note}</dd>
    </div>
  );
}
