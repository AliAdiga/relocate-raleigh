import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import ClosingCta from '@/components/ClosingCta';
import RelocationChecklist from '@/components/RelocationChecklist';

export const metadata: Metadata = {
  title: 'Relocation checklist for moving to North Carolina | Relocate Raleigh',
  description:
    'What to do before the move, in your arrival week and in your first 30 to 90 days in the Triangle: waitlists, utilities, NC DMV, registration, schools and settling in.',
  alternates: { canonical: '/checklist' },
};

export default function ChecklistPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1">
        <section className="shell pb-6 pt-10 lg:pt-16">
          <h1 className="t-display max-w-[780px]">Your relocation checklist</h1>
          <p className="lead mt-5 max-w-[640px] text-ink-soft">
            The order matters. Waitlists and DMV appointments are the usual bottlenecks, so this list puts them first.
            Tick things off as you go; your progress stays in this browser.
          </p>
        </section>
        <div className="shell pb-20 pt-8">
          <RelocationChecklist />
        </div>
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}
