'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { US_STATE_DATA } from '@/data/relocationStateData';
import { NEIGHBORHOOD_DATA_AS_OF, formatBand, getNeighborhood } from '@/data/neighborhoods';
import { PHOTOS } from '@/data/photos';
import { trackEvent } from '@/lib/analytics';
import { useExplorerState, useRankedNeighborhoods } from '@/lib/explorerState';
import { useContactModal } from './ContactModalProvider';
import { SHORTLIST_MAX, useMoveProfile } from './MoveProfileProvider';
import { IconClose, IconHeart, IconTrash } from './ui/Icons';

/** Heart toggle. Explains a full shortlist instead of silently replacing a saved neighborhood. */
export function SaveButton({ id, name, className = '', withLabel = false }: { id: string; name: string; className?: string; withLabel?: boolean }) {
  const { shortlist, toggleShortlisted } = useMoveProfile();
  const [note, setNote] = useState<string | null>(null);
  const saved = shortlist.includes(id);

  const onClick = () => {
    const result = toggleShortlisted(id);
    if (result === 'full') setNote(`Your shortlist holds ${SHORTLIST_MAX}. Remove one to add ${name}.`);
    else {
      setNote(null);
      if (result === 'added') trackEvent('neighborhood_saved');
    }
  };

  return (
    <span className={`${className.includes('absolute') || className.includes('fixed') ? '' : 'relative '}inline-flex ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        aria-label={withLabel ? undefined : saved ? `Remove ${name} from shortlist` : `Save ${name} to shortlist`}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-full bg-paper shadow-[0_6px_16px_-8px_rgba(31,31,31,0.5)] transition-colors ${
          withLabel ? 'border border-line px-4 text-sm font-medium' : 'w-11'
        } ${saved ? 'text-ember-deep' : 'text-ink hover:text-ember-deep'}`}
      >
        <IconHeart size={20} filled={saved} />
        {withLabel && <span className="text-ink">{saved ? 'Saved to shortlist' : 'Save to shortlist'}</span>}
      </button>
      <span role="status" className={note ? 'absolute right-0 top-full z-20 mt-2 w-60 rounded-xl bg-ink px-3 py-2 text-xs leading-relaxed text-paper' : 'sr-only'}>
        {note}
      </span>
    </span>
  );
}

/** Text the visitor will see (and can edit) in the contact form before anything is sent. */
export function shortlistContext(ids: string[], employerName: string, originName: string) {
  const lines = ids
    .map(getNeighborhood)
    .filter(Boolean)
    .map((n) => `- ${n!.name}: 4-bedroom homes ${formatBand(n!)}, RTP rush hour ${n!.rtp.min}–${n!.rtp.max} min`);
  return [`Moving from: ${originName}`, `Working near: ${employerName}`, '', 'My shortlist:', ...lines].join('\n');
}

/** Floating tray shown on every page once something is saved; opens the side-by-side comparison. */
export function ShortlistTray() {
  const { shortlist, removeFromShortlist, clearShortlist, origin } = useMoveProfile();
  const { open } = useContactModal();
  const [state] = useExplorerState();
  const { employer, ranked } = useRankedNeighborhoods(state.employerId);
  const [compareOpen, setCompareOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const items = shortlist.map((id) => ranked.find((n) => n.id === id)).filter((n): n is NonNullable<typeof n> => Boolean(n));

  useEffect(() => {
    document.body.style.paddingBottom = items.length ? '88px' : '';
    return () => {
      document.body.style.paddingBottom = '';
    };
  }, [items.length]);

  useEffect(() => {
    if (!compareOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const f = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button');
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    const close = () => {
      setCompareOpen(false);
      openerRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [compareOpen]);


  if (items.length === 0) return null;
  const showCompare = compareOpen;

  const closeCompare = () => {
    setCompareOpen(false);
    openerRef.current?.focus();
  };
  const send = () => {
    setCompareOpen(false);
    open('contact', {
      context: shortlistContext(shortlist, employer.name, US_STATE_DATA[origin].name),
      contextLabel: 'Your shortlist (included with your request)',
    });
  };

  return (
    <>
      <div className="no-print fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-[640px] items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-paper shadow-[0_18px_40px_-16px_rgba(31,31,31,0.6)]">
        <IconHeart size={18} filled className="shrink-0 text-ember" />
        <p className="min-w-0 flex-1 truncate text-sm">
          <span className="font-semibold">
            {items.length} of {SHORTLIST_MAX} saved
          </span>
          <span className="hidden text-paper/75 sm:inline">: {items.map((n) => n.name).join(', ')}</span>
        </p>
        <button
          ref={openerRef}
          type="button"
          onClick={() => {
            setCompareOpen(true);
            trackEvent('comparison_opened', { count: items.length });
          }}
          className="shrink-0 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink hover:bg-white"
        >
          Compare
        </button>
      </div>

      {showCompare && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center bg-ink/45 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && closeCompare()}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-title"
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-t-[var(--radius-panel)] bg-paper p-5 sm:rounded-[var(--radius-panel)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="compare-title" className="t-card">
                  Compare your shortlist
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Drive estimates are to {employer.name}. Prices from the guide ({NEIGHBORHOOD_DATA_AS_OF}).
                </p>
              </div>
              <button type="button" onClick={closeCompare} className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-fog" aria-label="Close comparison">
                <IconClose size={20} />
              </button>
            </div>

            <ul className={`mt-6 grid grid-cols-1 gap-4 ${items.length > 1 ? 'md:grid-cols-2' : ''} ${items.length > 2 ? 'lg:grid-cols-3' : ''}`}>
              {items.map((n) => {
                const photo = PHOTOS[n.photo];
                return (
                  <li key={n.id} className="overflow-hidden rounded-[var(--radius-card)] border border-line">
                    <div className="relative h-32">
                      <Image src={photo.src} alt="" fill sizes="320px" className="object-cover" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold tracking-tight">{n.name}</h3>
                        <button
                          type="button"
                          onClick={() => {
                            if (items.length === 1) setCompareOpen(false);
                            removeFromShortlist(n.id);
                          }}
                          className="-mr-2 -mt-1 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-fog hover:text-ink"
                          aria-label={`Remove ${n.name} from shortlist`}
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                      <dl className="mt-3 space-y-3 text-sm">
                        <Row label="4-bedroom homes" value={formatBand(n)} />
                        <Row label="Median sale" value={n.median.label} />
                        <Row label="RTP at rush hour" value={`${n.rtp.min}–${n.rtp.max} min`} />
                        <Row label={`Drive to ${employer.name.replace(/\s*\(.*\)/, '')}`} value={`~${n.commute} min (estimate)`} />
                        <Row label="Walk Score" value={n.walkScore} />
                        <Row label="Strength" value={n.strength} />
                        <Row label="Tradeoff" value={n.tradeoff} />
                      </dl>
                      <Link href={`/neighborhoods/${n.id}`} className="mt-4 inline-block text-sm font-medium underline underline-offset-4" onClick={() => setCompareOpen(false)}>
                        Full {n.name} guide
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setCompareOpen(false);
                  clearShortlist();
                }}
                className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
                Clear shortlist
              </button>
              <button type="button" onClick={send} className="btn-ink px-7 py-4 text-[0.9375rem]">
                Send my shortlist to Nick
              </button>
            </div>
            <p className="mt-3 text-right text-xs text-ink-soft">You’ll see and can edit exactly what’s included before sending.</p>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}
