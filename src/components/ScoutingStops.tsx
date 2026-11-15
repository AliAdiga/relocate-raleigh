'use client';

import { useState } from 'react';
import { NEIGHBORHOODS, estimateCommuteMinutes, getNeighborhood } from '@/data/neighborhoods';
import { trackEvent } from '@/lib/analytics';
import { useStoredState } from '@/lib/useStoredState';
import { useMoveProfile } from './MoveProfileProvider';
import { IconArrowLeft, IconArrowRight, IconClose } from './ui/Icons';

export type Stop = { key: string; label: string; hood?: string };
export const NO_STOPS: Stop[] = [];
export const STOPS_KEY = 'rr-trip-stops';
const MAX_STOPS = 8;

const placeQuery = (s: Stop) => {
  const n = s.hood ? getNeighborhood(s.hood) : undefined;
  return n ? `${n.name}, NC` : s.label;
};

/** Google Maps directions through all stops. Opens Google's own live routing; we don't estimate it. */
export function routeUrl(stops: Stop[]) {
  if (stops.length < 2) return null;
  const q = stops.map(placeQuery);
  const params = new URLSearchParams({ api: '1', origin: q[0], destination: q[q.length - 1], travelmode: 'driving' });
  if (q.length > 2) params.set('waypoints', q.slice(1, -1).join('|'));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export default function ScoutingStops() {
  const [stops, setStops] = useStoredState<Stop[]>(STOPS_KEY, NO_STOPS);
  const { shortlist } = useMoveProfile();
  const [custom, setCustom] = useState('');
  const [note, setNote] = useState('');

  const started = () => trackEvent('scouting_planner_started');
  const has = (id: string) => stops.some((s) => s.hood === id);

  const add = (s: Stop) => {
    if (stops.length >= MAX_STOPS) {
      setNote(`A trip works best with ${MAX_STOPS} stops or fewer.`);
      return;
    }
    setNote('');
    started();
    setStops((prev) => [...prev, s]);
  };
  const toggleHood = (id: string) => {
    const n = getNeighborhood(id);
    if (!n) return;
    if (has(id)) setStops((prev) => prev.filter((s) => s.hood !== id));
    else add({ key: `h-${id}`, label: n.name, hood: id });
  };
  const useShortlist = () => {
    started();
    const fresh = shortlist.filter((id) => !has(id)).map((id) => ({ key: `h-${id}`, label: getNeighborhood(id)!.name, hood: id }));
    setStops((prev) => [...prev, ...fresh].slice(0, MAX_STOPS));
  };
  const move = (i: number, dir: -1 | 1) =>
    setStops((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const url = routeUrl(stops);

  return (
    <section aria-labelledby="stops-title" className="grid gap-8 rounded-[var(--radius-panel)] border border-line p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="space-y-5">
        <div>
          <h2 id="stops-title" className="t-card">
            Your stops
          </h2>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
            Pick up to two neighborhoods a day (the guide’s rule), then add your own stops like a school, an office or
            a rental you’ve found. Saved in this browser.
          </p>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Neighborhoods</legend>
          <div className="flex flex-wrap gap-2">
            {NEIGHBORHOODS.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={has(n.id)}
                onClick={() => toggleHood(n.id)}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${has(n.id) ? 'bg-ink text-paper' : 'bg-fog text-ink-soft hover:text-ink'}`}
              >
                {n.name}
              </button>
            ))}
          </div>
          {shortlist.length > 0 && (
            <button type="button" onClick={useShortlist} className="mt-3 text-sm font-medium text-ink underline underline-offset-4">
              Add my saved shortlist ({shortlist.length})
            </button>
          )}
        </fieldset>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const label = custom.trim().slice(0, 80);
            if (!label) return;
            add({ key: `c-${Date.now()}`, label });
            setCustom('');
          }}
        >
          <label htmlFor="custom-stop" className="sr-only">
            Add your own stop
          </label>
          <input id="custom-stop" value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add a stop, e.g. RDU Airport" className="field" maxLength={80} />
          <button type="submit" className="btn-outline shrink-0 px-5 text-sm">
            Add
          </button>
        </form>
        {note && (
          <p role="status" className="text-sm text-ink-soft">
            {note}
          </p>
        )}
      </div>

      <div className="min-w-0">
        {stops.length === 0 ? (
          <div className="flex h-full min-h-[180px] items-center justify-center rounded-[var(--radius-card)] bg-fog p-6 text-center text-[0.9375rem] text-ink-soft">
            Choose neighborhoods or add a stop to build your route.
          </div>
        ) : (
          <>
            <ol className="relative space-y-0" aria-label="Route in visiting order">
              {stops.map((s, i) => {
                const prev = stops[i - 1];
                const a = prev?.hood ? getNeighborhood(prev.hood) : undefined;
                const b = s.hood ? getNeighborhood(s.hood) : undefined;
                const leg = a && b ? estimateCommuteMinutes(a, b) : null;
                const last = i === stops.length - 1;
                return (
                  <li key={s.key}>
                    {i > 0 && (
                      <div className="ml-[9px] flex min-h-9 items-center border-l-2 border-dashed border-ink/25 pl-6 text-xs text-ink-soft">
                        {leg ? `about ${leg} min (rough estimate)` : 'drive time varies'}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span aria-hidden className={`h-5 w-5 shrink-0 rounded-full border-4 border-paper ring-2 ${last ? 'bg-ember ring-ember' : 'bg-ink ring-ink'}`} />
                      <span className="min-w-0 flex-1 truncate font-medium text-ink">
                        <span className="sr-only">Stop {i + 1}: </span>
                        {s.label}
                        {!s.hood && <span className="ml-2 text-xs font-normal text-ink-soft">your stop</span>}
                      </span>
                      <span className="flex shrink-0">
                        <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-fog disabled:opacity-30" aria-label={`Move ${s.label} earlier`}>
                          <IconArrowLeft size={16} className="rotate-90" />
                        </button>
                        <button type="button" onClick={() => move(i, 1)} disabled={last} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-fog disabled:opacity-30" aria-label={`Move ${s.label} later`}>
                          <IconArrowRight size={16} className="rotate-90" />
                        </button>
                        <button type="button" onClick={() => setStops((p) => p.filter((x) => x.key !== s.key))} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-soft hover:bg-fog" aria-label={`Remove ${s.label}`}>
                          <IconClose size={16} />
                        </button>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ink px-5 py-3 text-sm no-print">
                  Open this route in Google Maps
                </a>
              )}
              <button type="button" onClick={() => setStops(NO_STOPS)} className="text-sm text-ink-soft underline underline-offset-4 no-print">
                Clear stops
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Estimates between neighborhoods use straight-line distance. Google Maps shows live routes and traffic.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
