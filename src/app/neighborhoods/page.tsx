import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { SaveButton } from '@/components/Shortlist';
import { NEIGHBORHOODS, formatK } from '@/data/neighborhoods';

export const metadata: Metadata = {
  title: 'Triangle neighborhoods for tech families | Relocate Raleigh',
  description: 'Compare Raleigh, Cary, Apex, Durham and more by home price, schools and commute to RTP tech employers.',
};

export default function NeighborhoodsIndex() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="px-3 pt-4 sm:px-[30px] sm:pt-6">
          <div className="wash mx-auto max-w-[1380px] rounded-[var(--radius-panel)] px-6 py-14 sm:px-12 lg:py-16">
            <h1 className="max-w-[760px] text-[clamp(2.5rem,5.5vw,4.1875rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Triangle neighborhoods
            </h1>
            <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-ink">
              Eight places tech families often shortlist. Open one for commutes to every major employer, nearby
              grocers and how its prices compare.
            </p>
            <Link href="/#neighborhoods" className="btn-ink mt-8 px-7 py-4 text-[0.9375rem]">
              Compare them by commute
            </Link>
          </div>
        </section>
        <ul className="mx-auto grid max-w-[1380px] gap-5 px-6 py-16 sm:grid-cols-2 sm:px-[30px] lg:grid-cols-3 xl:grid-cols-4">
          {NEIGHBORHOODS.map((n) => (
            <li key={n.id} className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper hover:border-[#c9c9c9]">
              <Link href={`/neighborhoods/${n.id}`} className="flex h-full flex-col">
                <span className="relative block h-[170px] border-b border-line">
                  <Image src={n.image} alt="" fill sizes="(min-width: 1280px) 330px, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                </span>
                <span className="flex flex-1 flex-col gap-2 p-5">
                  <span className="text-lg font-semibold tracking-tight">{n.name}</span>
                  <span className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{n.blurb}</span>
                  <span className="mt-auto flex justify-between pt-2 text-sm">
                    <span className="font-semibold tabular-nums">{formatK(n.price)}</span>
                    <span className="text-ink-soft">Schools {n.schools}/10</span>
                  </span>
                </span>
              </Link>
              <SaveButton id={n.id} name={n.name} className="absolute right-3 top-3" />
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
