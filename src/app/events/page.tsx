import Link from 'next/link'
import type { Metadata } from 'next'
import EventsCalendar from '@/components/EventsCalendar'
import SiteNav from '@/components/SiteNav'
import SiteFooter from '@/components/SiteFooter'
import ClosingCta from '@/components/ClosingCta'
import { eventsFeedAgeDays, getAllUpcomingEvents } from '@/data/events'
import eventsData from '@/data/events.json'

export const metadata: Metadata = {
  title: 'Triangle events | Relocate Raleigh',
  description: 'Upcoming networking, cultural, tech, family and outdoor events around Raleigh, Durham and Chapel Hill, when available.',
  alternates: { canonical: '/events' },
}

/** Re-render hourly so expired events drop off without a redeploy. */
export const revalidate = 3600

/** How old the feed can get before we stop presenting it as current. */
const STALE_AFTER_DAYS = 21

export default function EventsPage() {
  const events = getAllUpcomingEvents()
  const generatedAt = new Date(eventsData.generatedAt)
  const stale = eventsFeedAgeDays(eventsData.generatedAt) > STALE_AFTER_DAYS
  const updated = generatedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' })

  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1">
        <section className="shell pb-8 pt-10 lg:pt-16">
          <h1 className="t-display max-w-[760px]">Triangle events</h1>
          <p className="lead mt-5 max-w-[620px] text-ink-soft">
            Networking, cultural, tech, family and outdoor events across Raleigh, Durham and Chapel Hill.
          </p>
          <p className="mt-4 text-sm text-ink-soft">Event list last updated {updated}.</p>
        </section>

        <div className="shell pb-20 pt-6">
          {stale && events.length === 0 ? (
            <div className="max-w-[720px] rounded-[var(--radius-card)] bg-fog p-6 sm:p-8">
              <h2 className="t-card">No current events are listed</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                This calendar isn&apos;t being updated right now, so we&apos;d rather show nothing than out-of-date
                listings. In the meantime, the everyday resources section covers parks, libraries and other
                year-round places to get connected.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/#everyday" className="btn-ink px-6 py-3.5 text-[0.9375rem]">
                  Browse everyday resources
                </Link>
                <Link href="/scouting" className="btn-outline px-6 py-3.5 text-[0.9375rem]">
                  Plan a scouting trip
                </Link>
              </div>
            </div>
          ) : (
            <EventsCalendar events={events} />
          )}
        </div>
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  )
}
