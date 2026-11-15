'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { SaveButton, SchoolMeter, ShortlistCompare } from './Shortlist';
import { COMMUTE_EMPLOYERS } from '@/data/commuteEmployers';
import { formatK, withCommutes, type RankedNeighborhood } from '@/data/neighborhoods';
import PriceCommuteScatter from './charts/PriceCommuteScatter';
import CommuteMap from './CommuteMap';
import { useContactModal } from './ContactModalProvider';
import { useMoveProfile } from './MoveProfileProvider';
import { IconArrowLeft, IconArrowRight } from './ui/Icons';

type View = 'chart' | 'map';

export default function NeighborhoodExplorer() {
  const { open } = useContactModal();
  const { employerId, setEmployerId } = useMoveProfile();
  const [maxCommute, setMaxCommute] = useState(25);
  const [view, setView] = useState<View>('chart');
  const [selectedId, setSelectedId] = useState('morrisville');
  const railRef = useRef<HTMLUListElement>(null);

  const employer = COMMUTE_EMPLOYERS.find((e) => e.id === employerId) ?? COMMUTE_EMPLOYERS[0];
  const ranked = useMemo(() => withCommutes(employer), [employer]);
  const ordered = useMemo(
    () =>
      [...ranked].sort((a, b) => {
        const aOk = a.commute <= maxCommute ? 0 : 1;
        const bOk = b.commute <= maxCommute ? 0 : 1;
        return aOk - bOk || a.commute - b.commute;
      }),
    [ranked, maxCommute],
  );
  const selected = ranked.find((n) => n.id === selectedId) ?? ranked[0];
  const inRangeCount = ranked.filter((n) => n.commute <= maxCommute).length;

  const select = (id: string) => {
    setSelectedId(id);
    const card = railRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`);
    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  };

  const scrollRail = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * Math.min(rail.clientWidth * 0.8, 480), behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Filters: one row above everything they scope */}
      <div className="flex flex-col gap-5 rounded-[var(--radius-card)] bg-fog p-5 sm:p-6 lg:flex-row lg:items-end">
        <label className="block lg:w-[300px]">
          <span className="mb-2 block text-sm font-medium text-ink">Where you&apos;ll work</span>
          <select value={employerId} onChange={(e) => setEmployerId(e.target.value)} className="field">
            {COMMUTE_EMPLOYERS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1">
          <span className="mb-2 flex items-baseline justify-between text-sm font-medium text-ink">
            Longest drive you&apos;ll accept
            <span className="tabular-nums text-ink">{maxCommute} min</span>
          </span>
          <input
            type="range"
            min={10}
            max={50}
            step={5}
            value={maxCommute}
            onChange={(e) => setMaxCommute(Number(e.target.value))}
            className="range my-3"
            aria-valuetext={`${maxCommute} minutes`}
          />
        </label>
        <div className="flex rounded-full bg-paper p-1" role="group" aria-label="Explorer view">
          {(['chart', 'map'] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                view === v ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {v === 'chart' ? 'Price vs. drive' : 'Map'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 rounded-[var(--radius-card)] border border-line bg-paper p-4 sm:p-6">
          <p className="mb-4 text-sm text-ink-soft" aria-live="polite">
            <span className="font-semibold text-ink">{inRangeCount} of {ranked.length}</span> neighborhoods are within{' '}
            {maxCommute} minutes of {employer.name}.
          </p>
          {view === 'chart' ? (
            <PriceCommuteScatter
              data={ranked}
              maxCommute={maxCommute}
              selectedId={selected.id}
              onSelect={select}
              employerName={employer.name}
            />
          ) : (
            <CommuteMap
              employer={employer}
              neighborhoods={ranked}
              maxCommute={maxCommute}
              selectedId={selected.id}
              onSelect={select}
            />
          )}
        </div>

        <DetailCard n={selected} maxCommute={maxCommute} employerName={employer.name} onAsk={() => open('contact')} />
      </div>

      {/* Card rail, styled after the Figma "recent projects" carousel */}
      <div className="flex items-center justify-between pt-4">
        <h3 className="text-xl font-semibold tracking-tight">All neighborhoods, closest first</h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-fog"
            aria-label="Scroll neighborhoods left"
          >
            <IconArrowLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => scrollRail(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper hover:bg-black"
            aria-label="Scroll neighborhoods right"
          >
            <IconArrowRight size={22} />
          </button>
        </div>
      </div>
      <ul
        ref={railRef}
        className="-mx-3 flex snap-x snap-mandatory gap-5 overflow-x-auto px-3 pb-4 [scrollbar-width:thin]"
      >
        {ordered.map((n) => (
          <li key={n.id} data-id={n.id} className="w-[min(82vw,320px)] shrink-0 snap-start">
            <NeighborhoodCard n={n} ok={n.commute <= maxCommute} selected={n.id === selected.id} onSelect={() => select(n.id)} />
          </li>
        ))}
      </ul>

      <ShortlistCompare ranked={ranked} employerName={employer.name} />
    </div>
  );
}

function DetailCard({
  n,
  maxCommute,
  employerName,
  onAsk,
}: {
  n: RankedNeighborhood;
  maxCommute: number;
  employerName: string;
  onAsk: () => void;
}) {
  const ok = n.commute <= maxCommute;
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper" aria-live="polite">
      <div className="relative h-[190px] overflow-hidden border-b border-line">
        <Image src={n.image} alt="" fill sizes="380px" className="object-cover" />
        <SaveButton id={n.id} name={n.name} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{n.name}</h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{n.blurb}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <div>
            <dt className="text-stone">Median home</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">{formatK(n.price)}</dd>
          </div>
          <div>
            <dt className="text-stone">Drive to {employerName.replace(/\s*\(.*\)/, '')}</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">
              ~{n.commute} min
              {!ok && <span className="ml-1.5 align-middle text-xs font-medium text-ember-deep">over limit</span>}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="mb-1 text-stone">Schools</dt>
            <dd>
              <SchoolMeter score={n.schools} />
            </dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-col gap-2">
          <button type="button" onClick={onAsk} className="btn-ink px-6 py-3.5 text-[0.9375rem]">
            Ask Nick about {n.name}
          </button>
          <Link href={`/neighborhoods/${n.id}`} className="btn-outline px-6 py-3 text-[0.9375rem]">
            Full neighborhood guide
          </Link>
        </div>
      </div>
    </article>
  );
}

function NeighborhoodCard({
  n,
  ok,
  selected,
  onSelect,
}: {
  n: RankedNeighborhood;
  ok: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`relative h-full overflow-hidden rounded-[var(--radius-card)] border bg-paper transition-[border-color,opacity] ${
        selected ? 'border-ink' : 'border-line hover:border-[#c9c9c9]'
      } ${ok ? '' : 'opacity-60'}`}
    >
      <button type="button" onClick={onSelect} aria-pressed={selected} className="flex h-full w-full flex-col text-left">
        <span className="relative block h-[170px] w-full overflow-hidden border-b border-line">
          <Image src={n.image} alt="" fill sizes="320px" className="object-cover" />
        </span>
        <span className="flex flex-1 flex-col gap-3 p-5">
          <span className="text-lg font-semibold tracking-tight">{n.name}</span>
          <span className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{n.blurb}</span>
          <span className="mt-auto flex items-center justify-between gap-3 pt-1 text-sm">
            <span className="font-semibold tabular-nums">{formatK(n.price)}</span>
            <span className="tabular-nums text-ink-soft">~{n.commute} min</span>
            <span className="tabular-nums text-ink-soft">Schools {n.schools}/10</span>
          </span>
        </span>
      </button>
      <SaveButton id={n.id} name={n.name} className="absolute right-3 top-3" />
    </div>
  );
}
