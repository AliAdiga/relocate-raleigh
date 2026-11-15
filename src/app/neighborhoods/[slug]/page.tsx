import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ModalTriggerButton from '@/components/ModalTriggerButton';
import { SaveButton, SchoolMeter } from '@/components/Shortlist';
import { COMMUTE_EMPLOYERS } from '@/data/commuteEmployers';
import { CULTURE_STORES, CULTURE_TABS } from '@/data/cultureStores';
import { NEIGHBORHOODS, estimateCommuteMinutes, formatK } from '@/data/neighborhoods';

const PURPLE = '#3741B5';
const ORANGE = '#E8650A';
const MUTED = '#CFCFCF';

export function generateStaticParams() {
  return NEIGHBORHOODS.map((n) => ({ slug: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = NEIGHBORHOODS.find((x) => x.id === slug);
  if (!n) return {};
  return {
    title: `Moving to ${n.name}, NC: commutes, prices and schools | Relocate Raleigh`,
    description: `${n.blurb} Median home around ${formatK(n.price)}. Drive times from ${n.name} to 15 Triangle tech employers.`,
  };
}

export default async function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = NEIGHBORHOODS.find((x) => x.id === slug);
  if (!n) notFound();

  const commutes = COMMUTE_EMPLOYERS.map((e) => ({ ...e, minutes: estimateCommuteMinutes(e, n) })).sort(
    (a, b) => a.minutes - b.minutes,
  );
  const maxMinutes = Math.max(...commutes.map((c) => c.minutes));
  const byPrice = [...NEIGHBORHOODS].sort((a, b) => b.price - a.price);
  const maxPrice = byPrice[0].price;
  const rank = byPrice.findIndex((x) => x.id === n.id) + 1;

  const grocers = CULTURE_TABS.flatMap((t) => CULTURE_STORES[t.id].map((s) => ({ ...s, group: t.label })))
    .map((s) => ({ ...s, minutes: estimateCommuteMinutes({ id: s.id, name: s.name, lat: s.lat, lng: s.lng }, n) }))
    .sort((a, b) => a.minutes - b.minutes)
    .slice(0, 6);

  const others = NEIGHBORHOODS.filter((x) => x.id !== n.id);

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="px-3 pt-4 sm:px-[30px] sm:pt-6" aria-labelledby="hood-title">
          <div className="wash mx-auto grid max-w-[1380px] items-center gap-8 rounded-[var(--radius-panel)] px-6 py-12 sm:px-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:py-16">
            <div className="space-y-6">
              <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
                <Link href="/neighborhoods" className="underline-offset-4 hover:underline">
                  Neighborhoods
                </Link>{' '}
                / <span className="text-ink">{n.name}</span>
              </nav>
              <h1 id="hood-title" className="text-[clamp(2.5rem,5.5vw,4.1875rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                {n.name}
              </h1>
              <p className="max-w-[520px] text-lg leading-relaxed text-ink">{n.blurb}</p>
              <dl className="flex flex-wrap gap-x-10 gap-y-5">
                <div>
                  <dt className="text-sm text-ink-soft">Median home</dt>
                  <dd className="text-[2.375rem] font-semibold leading-tight tracking-tight tabular-nums">{formatK(n.price)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">Shortest tech commute</dt>
                  <dd className="text-[2.375rem] font-semibold leading-tight tracking-tight tabular-nums">~{commutes[0].minutes} min</dd>
                </div>
                <div>
                  <dt className="mb-2 text-sm text-ink-soft">Schools</dt>
                  <dd>
                    <SchoolMeter score={n.schools} />
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap items-center gap-3">
                <ModalTriggerButton variant="contact" className="btn-ink px-7 py-4 text-[0.9375rem]">
                  Ask Nick about {n.name}
                </ModalTriggerButton>
                <span className="flex items-center gap-2 text-sm text-ink-soft">
                  <SaveButton id={n.id} name={n.name} />
                  Save to shortlist
                </span>
              </div>
            </div>
            <div className="relative mx-auto aspect-[333/212] w-full max-w-[520px] overflow-hidden rounded-[var(--radius-card)] bg-paper">
              <Image src={n.image} alt="" fill sizes="520px" className="object-cover" priority />
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-[1380px] gap-16 px-6 py-20 sm:px-[30px] lg:grid-cols-2 lg:gap-20 lg:px-[46px]">
          <section aria-labelledby="commute-title">
            <h2 id="commute-title" className="text-[clamp(1.75rem,3vw,2.375rem)] font-semibold tracking-tight">
              Drive times to tech employers
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              Estimated from straight-line distance, so expect longer at rush hour. Purple bars are under 25 minutes.
            </p>
            <ul className="mt-8 space-y-3">
              {commutes.map((c) => (
                <li key={c.id} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_3.5rem] items-center gap-3 text-sm">
                  <span className="truncate text-ink">{c.name}</span>
                  <span className="h-3 rounded-r-[4px] bg-fog" aria-hidden>
                    <span
                      className="block h-full rounded-r-[4px]"
                      style={{ width: `${(c.minutes / maxMinutes) * 100}%`, background: c.minutes <= 25 ? PURPLE : MUTED }}
                    />
                  </span>
                  <span className="text-right font-semibold tabular-nums">{c.minutes} min</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-16">
            <section aria-labelledby="price-title">
              <h2 id="price-title" className="text-[clamp(1.75rem,3vw,2.375rem)] font-semibold tracking-tight">
                Price compared with the Triangle
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                {n.name} is the {rank === 1 ? '' : `${ordinal(rank)} `}most expensive of the {NEIGHBORHOODS.length}{' '}
                neighborhoods we track.
              </p>
              <ul className="mt-8 space-y-3">
                {byPrice.map((x) => {
                  const me = x.id === n.id;
                  return (
                    <li key={x.id} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_3.5rem] items-center gap-3 text-sm">
                      {me ? (
                        <span className="truncate font-semibold text-ink">{x.name}</span>
                      ) : (
                        <Link href={`/neighborhoods/${x.id}`} className="truncate text-ink-soft underline-offset-4 hover:text-ink hover:underline">
                          {x.name}
                        </Link>
                      )}
                      <span className="h-3 rounded-r-[4px] bg-fog" aria-hidden>
                        <span
                          className="block h-full rounded-r-[4px]"
                          style={{ width: `${(x.price / maxPrice) * 100}%`, background: me ? ORANGE : MUTED }}
                        />
                      </span>
                      <span className={`text-right tabular-nums ${me ? 'font-semibold' : 'text-ink-soft'}`}>{formatK(x.price)}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section aria-labelledby="grocers-title">
              <h2 id="grocers-title" className="text-[clamp(1.75rem,3vw,2.375rem)] font-semibold tracking-tight">
                Nearest specialty grocers
              </h2>
              <ul className="mt-6 divide-y divide-line rounded-[var(--radius-card)] border border-line">
                {grocers.map((g) => (
                  <li key={g.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <span>
                      <span className="block font-medium text-ink">{g.name}</span>
                      <span className="block text-sm text-ink-soft">{g.group}</span>
                    </span>
                    <span className="shrink-0 text-sm tabular-nums text-ink-soft">~{g.minutes} min</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <section className="mx-auto max-w-[1380px] px-6 pb-24 sm:px-[30px]" aria-labelledby="others-title">
          <h2 id="others-title" className="text-xl font-semibold tracking-tight">
            Other neighborhoods
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {others.map((o) => (
              <li key={o.id}>
                <Link href={`/neighborhoods/${o.id}`} className="block rounded-full bg-fog px-5 py-2.5 text-sm text-ink hover:bg-line">
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-3xl text-xs leading-relaxed text-stone">
            Prices are rough median home values and school scores are simplified 1–10 ratings. Use them to start a
            conversation, then confirm with current listings and the Wake County school assignment tool.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ordinal(n: number) {
  if (n === 1) return '';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
