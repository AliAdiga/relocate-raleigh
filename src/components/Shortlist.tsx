'use client';

import Link from 'next/link';
import { US_STATE_DATA } from '@/data/relocationStateData';
import { formatK, type RankedNeighborhood } from '@/data/neighborhoods';
import { useContactModal } from './ContactModalProvider';
import { SHORTLIST_MAX, useMoveProfile } from './MoveProfileProvider';
import { IconHeart, IconTrash } from './ui/Icons';

export function SchoolMeter({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="flex gap-[2px]" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className={`h-2.5 w-1.5 rounded-[2px] ${i < score ? 'bg-leaf' : 'bg-line'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold tabular-nums text-ink">{score}/10</span>
    </span>
  );
}

/** Heart toggle that adds/removes a neighborhood from the persisted shortlist. */
export function SaveButton({ id, name, className = '' }: { id: string; name: string; className?: string }) {
  const { shortlist, toggleShortlisted } = useMoveProfile();
  const saved = shortlist.includes(id);
  return (
    <button
      type="button"
      onClick={() => toggleShortlisted(id)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from shortlist` : `Save ${name} to shortlist`}
      title={saved ? 'Saved to shortlist' : 'Save to shortlist'}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper shadow-[0_6px_16px_-8px_rgba(31,31,31,0.5)] transition-colors ${
        saved ? 'text-ember-deep' : 'text-ink hover:text-ember-deep'
      } ${className}`}
    >
      <IconHeart size={20} filled={saved} />
    </button>
  );
}

function CompareBar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <dt className="text-stone">{label}</dt>
        <dd className="font-semibold tabular-nums text-ink">{value}</dd>
      </div>
      <div className="h-2.5 rounded-r-[4px] bg-fog" aria-hidden>
        <div className="h-full rounded-r-[4px]" style={{ width: `${Math.max(4, pct * 100)}%`, background: color }} />
      </div>
    </div>
  );
}

/** Side-by-side comparison of up to three saved neighborhoods, with a hand-off to Nick. */
export function ShortlistCompare({ ranked, employerName }: { ranked: RankedNeighborhood[]; employerName: string }) {
  const { shortlist, removeFromShortlist, clearShortlist, origin, salary } = useMoveProfile();
  const { open } = useContactModal();
  const items = shortlist
    .map((id) => ranked.find((n) => n.id === id))
    .filter((n): n is RankedNeighborhood => Boolean(n));
  const maxPrice = Math.max(...ranked.map((n) => n.price));
  const maxCommute = Math.max(...ranked.map((n) => n.commute), 1);

  if (items.length === 0) {
    return (
      <div
        id="shortlist"
        className="flex flex-col items-start gap-3 rounded-[var(--radius-card)] border border-dashed border-[#d4d4d4] p-6 sm:flex-row sm:items-center"
      >
        <IconHeart size={28} className="shrink-0 text-ember-deep" />
        <p className="text-[0.9375rem] text-ink-soft">
          Save up to {SHORTLIST_MAX} neighborhoods with the heart to compare them side by side and send your
          shortlist to Nick.
        </p>
      </div>
    );
  }

  const send = () => {
    const lines = items.map(
      (n) => `- ${n.name}: about ${formatK(n.price)}, ~${n.commute} min to ${employerName}, schools ${n.schools}/10`,
    );
    const from = US_STATE_DATA[origin].name;
    open('contact', {
      message: [
        `Hi Nick, I'm thinking about moving from ${from} (salary around $${Math.round(salary / 1000)}k) and working at ${employerName}.`,
        '',
        'My shortlist:',
        ...lines,
        '',
        'Could we talk through these?',
      ].join('\n'),
    });
  };

  const cols = items.length > 2 ? 'md:grid-cols-2 lg:grid-cols-3' : items.length > 1 ? 'md:grid-cols-2' : '';

  return (
    <section id="shortlist" aria-labelledby="shortlist-title" className="rounded-[var(--radius-panel)] bg-fog p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 id="shortlist-title" className="text-xl font-semibold tracking-tight">
            Your shortlist
          </h3>
          <p className="mt-1 text-sm text-ink-soft">
            {items.length} of {SHORTLIST_MAX} saved. Drive times are to {employerName}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={clearShortlist} className="btn-outline px-5 py-3 text-sm">
            Clear
          </button>
          <button type="button" onClick={send} className="btn-ink px-6 py-3 text-sm">
            Send my shortlist to Nick
          </button>
        </div>
      </div>
      <ul className={`grid grid-cols-1 gap-4 ${cols}`}>
        {items.map((n) => (
          <li key={n.id} className="rounded-[var(--radius-card)] bg-paper p-5">
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/neighborhoods/${n.id}`}
                className="text-lg font-semibold tracking-tight underline-offset-4 hover:underline"
              >
                {n.name}
              </Link>
              <button
                type="button"
                onClick={() => removeFromShortlist(n.id)}
                className="-mr-2 -mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-fog hover:text-ink"
                aria-label={`Remove ${n.name}`}
              >
                <IconTrash size={18} />
              </button>
            </div>
            <dl className="mt-4 space-y-4 text-sm">
              <CompareBar label="Median home" value={formatK(n.price)} pct={n.price / maxPrice} color="#E8650A" />
              <CompareBar label="Drive" value={`~${n.commute} min`} pct={n.commute / maxCommute} color="#3741B5" />
              <div>
                <dt className="mb-1 text-stone">Schools</dt>
                <dd>
                  <SchoolMeter score={n.schools} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
