'use client';

import { useMemo } from 'react';
import { BEFORE_YOU_BOOK, SKIP_LIST, TRIP_PLANS } from '@/data/scoutingTrip';
import { useStoredState } from '@/lib/useStoredState';
import { useContactModal } from './ContactModalProvider';
import { IconCalendar, IconCheck, IconPrinter } from './ui/Icons';

// Stable fallbacks (useSyncExternalStore needs referentially stable snapshots).
const NO_DONE: string[] = [];
const DEFAULT_LENGTH: 3 | 5 = 3;
const NO_DATE = '';

function addDays(iso: string, n: number) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d + n);
  return dt;
}

const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

/** Warnings from the guide: pollen season, weekend days that hide the real commute. */
function tripWarnings(start: string, days: number): string[] {
  if (!start) return [];
  const out: string[] = [];
  const dates = Array.from({ length: days }, (_, i) => addDays(start, i));
  const pollen = dates.some((d) => (d.getMonth() === 2 && d.getDate() >= 20) || d.getMonth() === 3);
  if (pollen) out.push('These dates fall in pollen season (late March to April). Consider another week if you can.');
  const weekend = dates.filter((d) => d.getDay() === 0 || d.getDay() === 6).length;
  if (weekend > 0 && dates[0].getDay() !== 1 && weekend >= Math.ceil(days / 2))
    out.push('Most of this trip is on a weekend, so you won’t see real rush-hour traffic. Start on a weekday.');
  else if (dates[0].getDay() === 0 || dates[0].getDay() === 6)
    out.push('Day 1 is a weekend, but it includes the RTP rush-hour drive. Try to start on a weekday.');
  return out;
}

export default function ScoutingPlanner() {
  const { open } = useContactModal();
  const [length, setLength] = useStoredState<3 | 5>('rr-trip-length', DEFAULT_LENGTH);
  const [start, setStart] = useStoredState<string>('rr-trip-start', NO_DATE);
  const [done, setDone] = useStoredState<string[]>('rr-trip-done', NO_DONE);

  const plan = TRIP_PLANS[length];
  const total = plan.reduce((n, d) => n + d.tasks.length, 0);
  const completed = plan.reduce((n, d) => n + d.tasks.filter((t) => done.includes(t.id)).length, 0);
  const warnings = useMemo(() => tripWarnings(start, length), [start, length]);

  const toggle = (id: string) => setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const sendPlan = () => {
    const when = start ? `arriving ${fmt(addDays(start, 0))}` : 'dates not set yet';
    open('contact', {
      message: [
        `Hi Nick, I'm planning a ${length}-day scouting trip (${when}).`,
        '',
        ...plan.map((d, i) => `Day ${i + 1}: ${d.title}`),
        '',
        'Could you help me pick the right neighborhoods and schools to visit?',
      ].join('\n'),
    });
  };

  return (
    <div className="space-y-10">
      {/* Controls */}
      <div className="flex flex-col gap-5 rounded-[var(--radius-card)] bg-fog p-5 sm:p-6 lg:flex-row lg:items-end print:hidden">
        <div>
          <span className="mb-2 block text-sm font-medium text-ink">Trip length</span>
          <div className="flex rounded-full bg-paper p-1" role="group" aria-label="Trip length">
            {([3, 5] as const).map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={length === n}
                onClick={() => setLength(n)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium ${length === n ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'}`}
              >
                {n} days{n === 5 ? ', more certainty' : ''}
              </button>
            ))}
          </div>
        </div>
        <label className="block lg:w-[240px]">
          <span className="mb-2 block text-sm font-medium text-ink">Arrival date</span>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="field" />
        </label>
        <div className="flex flex-1 flex-wrap items-center gap-3 lg:justify-end">
          <p className="text-sm text-ink-soft" aria-live="polite">
            <span className="font-semibold text-ink">
              {completed} of {total}
            </span>{' '}
            done
          </p>
          <button type="button" onClick={() => window.print()} className="btn-outline px-5 py-3 text-sm">
            <IconPrinter size={18} />
            Print
          </button>
          <button type="button" onClick={sendPlan} className="btn-ink px-6 py-3 text-sm">
            Send my plan to Nick
          </button>
        </div>
      </div>

      {warnings.length > 0 && (
        <ul className="space-y-2" role="status">
          {warnings.map((w) => (
            <li key={w} className="flex items-start gap-3 rounded-[var(--radius-card)] border border-[#f3c9a8] bg-[#fff6ee] px-5 py-3.5 text-[0.9375rem] text-ink">
              <IconCalendar size={20} className="mt-0.5 shrink-0 text-ember-deep" />
              {w}
            </li>
          ))}
        </ul>
      )}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Itinerary: a real sequence, so the days are numbered */}
        <ol className="space-y-5">
          {plan.map((day, i) => {
            const date = start ? fmt(addDays(start, i)) : null;
            const dayDone = day.tasks.every((t) => done.includes(t.id));
            return (
              <li key={day.id} className="rounded-[var(--radius-card)] border border-line bg-paper p-6 sm:p-7 print:break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="text-xl font-semibold tracking-tight">
                    <span className="mr-2 text-ember-deep">Day {i + 1}</span>
                    {day.title}
                  </h3>
                  {date && <span className="text-sm text-ink-soft">{date}</span>}
                </div>
                <p className="mt-1 text-[0.9375rem] text-ink-soft">
                  {day.focus}
                  {dayDone && <span className="ml-2 font-medium text-leaf">Done</span>}
                </p>
                <ul className="mt-5 space-y-1">
                  {day.tasks.map((t) => {
                    const checked = done.includes(t.id);
                    return (
                      <li key={t.id}>
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 hover:bg-fog">
                          <input type="checkbox" checked={checked} onChange={() => toggle(t.id)} className="peer sr-only" />
                          <span
                            aria-hidden
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet ${
                              checked ? 'border-ink bg-ink text-paper' : 'border-[#bdbdbd]'
                            }`}
                          >
                            {checked && <IconCheck size={14} strokeWidth={3} />}
                          </span>
                          <span className={`text-[0.9375rem] leading-relaxed ${checked ? 'text-stone line-through' : 'text-ink'}`}>
                            {t.text}
                            {t.href && (
                              <>
                                {' '}
                                <a
                                  href={t.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-ink-soft underline underline-offset-4 hover:text-ink print:hidden"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Link
                                </a>
                              </>
                            )}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>

        <aside className="space-y-6">
          <div className="wash rounded-[var(--radius-card)] p-6">
            <h3 className="text-lg font-semibold tracking-tight">Before you book</h3>
            <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-ink">
              {BEFORE_YOU_BOOK.map((b) => (
                <li key={b} className="flex gap-3">
                  <IconCheck size={18} strokeWidth={2} className="mt-1 shrink-0 text-violet" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line p-6">
            <h3 className="text-lg font-semibold tracking-tight">Skip these</h3>
            <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              {SKIP_LIST.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          {completed > 0 && (
            <button type="button" onClick={() => setDone(NO_DONE)} className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink print:hidden">
              Clear all checkmarks
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
