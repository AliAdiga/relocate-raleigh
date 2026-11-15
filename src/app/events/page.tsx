import type { Metadata } from 'next'
import EventsCalendar from '@/components/EventsCalendar'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import { getAllUpcomingEvents } from '@/data/events'
import eventsData from '@/data/events.json'

export const metadata: Metadata = {
  title: 'Triangle events calendar | Relocate Raleigh',
  description:
    'Upcoming networking, cultural, tech, family, and outdoor events across the Raleigh-Durham-Chapel Hill Triangle. Refreshed weekly.',
}

export default function EventsPage() {
  const events = getAllUpcomingEvents()
  const generatedAt = new Date(eventsData.generatedAt)

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="px-3 pt-4 sm:px-[30px] sm:pt-6">
          <div className="wash mx-auto max-w-[1380px] rounded-[var(--radius-panel)] px-6 py-16 sm:px-12 lg:py-20">
            <h1 className="max-w-[760px] text-[clamp(2.5rem,5.5vw,4.1875rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Triangle events calendar
            </h1>
            <p className="mt-5 max-w-[620px] text-lg leading-relaxed text-ink">
              Networking, cultural, tech, family and outdoor events across Raleigh, Durham and Chapel Hill, plus a
              few worth the drive.
            </p>
            <p className="mt-6 text-sm text-ink-soft">
              Last updated{' '}
              {generatedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1100px] px-6 pb-28 pt-14 sm:px-[30px]">
          <EventsCalendar events={events} />
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
