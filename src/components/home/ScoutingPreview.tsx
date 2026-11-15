import Link from 'next/link';
import { TRIP_PLANS } from '@/data/scoutingTrip';

/** Home-page teaser for the scouting planner, drawn as a route of connected stops. */
export default function ScoutingPreview() {
  const days = TRIP_PLANS[3];
  return (
    <section aria-labelledby="scout-title" className="section-y border-t border-line">
      <div className="shell grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div data-reveal>
          <h2 id="scout-title" className="t-section">
            Make your scouting trip count
          </h2>
          <p className="lead mt-4 text-ink-soft">
            Build a route through the neighborhoods you saved, then follow a suggested itinerary that tests real
            weekday life: the rush-hour drive, the school run and the grocery stop.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/scouting" className="btn-ink px-7 py-4 text-[0.9375rem]">
              Plan your scouting trip
            </Link>
            <Link href="/checklist" className="text-[0.9375rem] font-medium underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink">
              See the relocation checklist
            </Link>
          </div>
        </div>
        <ol className="relative space-y-0" aria-label="Suggested 3-day itinerary" data-reveal style={{ ['--i' as string]: 1 }}>
          {days.map((d, i) => (
            <li key={d.id} className="relative pb-8 pl-12 last:pb-0">
              {i < days.length - 1 && <span aria-hidden className="absolute left-[11px] top-7 h-[calc(100%-1.25rem)] border-l-2 border-dashed border-ink/25" />}
              <span aria-hidden className={`absolute left-0 top-1 h-6 w-6 rounded-full border-[5px] border-paper ring-2 ${i === days.length - 1 ? 'bg-ember ring-ember' : 'bg-ink ring-ink'}`} />
              <p className="text-sm font-medium text-ink-soft">Day {i + 1}</p>
              <h3 className="text-xl font-semibold tracking-tight text-ink">{d.title}</h3>
              <p className="mt-1 text-[0.9375rem] text-ink-soft">{d.focus}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
