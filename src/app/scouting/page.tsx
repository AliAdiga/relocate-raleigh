import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ScoutingPlanner from '@/components/ScoutingPlanner';

export const metadata: Metadata = {
  title: 'Plan your Raleigh scouting trip | Relocate Raleigh',
  description:
    'A 3- or 5-day itinerary for families scouting Raleigh, Durham, Cary and RTP. Check off stops, catch pollen season and weekend pitfalls, and print your plan.',
};

export default function ScoutingPage() {
  return (
    <>
      <div className="print:hidden">
        <SiteNav />
      </div>
      <main className="flex-1">
        <section className="px-3 pt-4 sm:px-[30px] sm:pt-6 print:hidden">
          <div className="wash mx-auto max-w-[1380px] rounded-[var(--radius-panel)] px-6 py-14 sm:px-12 lg:py-16">
            <h1 className="max-w-[820px] text-[clamp(2.5rem,5.5vw,4.1875rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Plan your scouting trip
            </h1>
            <p className="mt-5 max-w-[640px] text-lg leading-relaxed text-ink">
              You get one, maybe two trips before you decide. This plan treats the visit as a test run of daily
              life, not a highlights tour. Set your dates, tick off stops as you go, and print it for the car.
            </p>
          </div>
        </section>
        <h1 className="hidden text-2xl font-semibold print:block">Relocate Raleigh scouting trip</h1>
        <div className="mx-auto max-w-[1380px] px-6 py-14 sm:px-[30px] lg:px-[46px] print:p-0">
          <ScoutingPlanner />
        </div>
      </main>
      <div className="print:hidden">
        <SiteFooter />
      </div>
    </>
  );
}
