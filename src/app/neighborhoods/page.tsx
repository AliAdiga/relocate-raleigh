import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ClosingCta from '@/components/ClosingCta';
import { SaveButton } from '@/components/Shortlist';
import { NEIGHBORHOODS, NEIGHBORHOOD_DATA_AS_OF, formatBand } from '@/data/neighborhoods';
import { PHOTOS } from '@/data/photos';

export const metadata: Metadata = {
  title: 'Triangle neighborhood guides | Relocate Raleigh',
  description:
    'Nine Raleigh-Durham neighborhoods families often shortlist, from Morrisville and Cary to Chapel Hill and Wake Forest: home prices, RTP commutes, schools and tradeoffs.',
  alternates: { canonical: '/neighborhoods' },
};

export default function NeighborhoodsIndex() {
  const ordered = [...NEIGHBORHOODS].sort((a, b) => a.rtp.min - b.rtp.min);
  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1">
        <section className="shell pb-10 pt-10 lg:pt-16">
          <h1 className="t-display max-w-[760px]">Neighborhood guides</h1>
          <p className="lead mt-5 max-w-[620px] text-ink-soft">
            Nine places tech families often shortlist, ordered by how quickly you can reach RTP. Each guide covers
            housing, commutes, schools and honest tradeoffs.
          </p>
          <Link href="/#neighborhoods" className="btn-ink mt-8 px-7 py-4 text-[0.9375rem]">
            Filter by your commute and budget
          </Link>
        </section>
        <ul className="shell grid gap-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((n) => {
            const p = PHOTOS[n.photo];
            return (
              <li key={n.id} className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper hover:border-[#c9c9c9]">
                <div className="relative aspect-[16/10]">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 92vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-sm text-ink-soft">{n.inOneWord}</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight">
                    <Link href={`/neighborhoods/${n.id}`} className="after:absolute after:inset-0">
                      {n.name}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{n.character}</p>
                  <p className="mt-3 flex justify-between text-sm">
                    <span className="font-semibold tabular-nums">{formatBand(n)}</span>
                    <span className="text-ink-soft">
                      RTP {n.rtp.min}–{n.rtp.max} min
                    </span>
                  </p>
                </div>
                <SaveButton id={n.id} name={n.name} className="absolute right-3 top-3 z-10" />
              </li>
            );
          })}
        </ul>
        <p className="shell -mt-12 pb-16 text-xs text-stone">
          4-bedroom ranges and RTP rush-hour ranges from the Relocate Raleigh guide ({NEIGHBORHOOD_DATA_AS_OF}).
        </p>
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
