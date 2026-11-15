import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ClosingCta from '@/components/ClosingCta';
import ScoutingPlanner from '@/components/ScoutingPlanner';
import { TriangleOutline } from '@/components/ui/BrandLines';

export const metadata: Metadata = {
  title: 'Plan your Raleigh-Durham scouting trip | Relocate Raleigh',
  description:
    'Build a scouting route through Triangle neighborhoods, follow a 3- or 5-day itinerary, avoid pollen-season and weekend pitfalls, and print your plan.',
  alternates: { canonical: '/scouting' },
};

export default function ScoutingPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1">
        <section className="no-print relative overflow-hidden border-b border-line bg-sand">
          <TriangleOutline className="pointer-events-none absolute -right-20 -top-24 w-[560px] text-ink" opacity={0.06} />
          <div className="shell relative py-14 lg:py-20">
            <h1 className="t-display max-w-[760px]">Plan your scouting trip</h1>
            <p className="lead mt-5 max-w-[620px] text-ink-soft">
              You get one, maybe two trips before you decide. Build your route, follow a suggested itinerary that
              treats the visit as a test run of daily life, and print it for the car.
            </p>
          </div>
        </section>
        <p className="hidden text-2xl font-semibold print:block">Relocate Raleigh scouting trip</p>
        <div className="shell section-y print:p-0">
          <ScoutingPlanner />
        </div>
        <ClosingCta title="Want help choosing which addresses to see?" />
      </main>
      <SiteFooter />
    </>
  );
}
