'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef } from 'react';
import { COMMUTE_EMPLOYERS } from '@/data/commuteEmployers';
import { COMMUTE_METHOD, NEIGHBORHOOD_DATA_AS_OF, formatBand, formatK, type RankedNeighborhood } from '@/data/neighborhoods';
import { PHOTOS } from '@/data/photos';
import { US_STATE_DATA } from '@/data/relocationStateData';
import { trackEvent } from '@/lib/analytics';
import { BUDGET_OPTIONS, COMMUTE_RANGE, EXPLORER_DEFAULTS, matchFor, useExplorerState, useRankedNeighborhoods } from '@/lib/explorerState';
import PriceCommuteScatter from './charts/PriceCommuteScatter';
import CommuteMap from './CommuteMap';
import { useContactModal } from './ContactModalProvider';
import { useMoveProfile } from './MoveProfileProvider';
import { SaveButton } from './Shortlist';
import { IconArrowLeft, IconArrowRight, IconCheck } from './ui/Icons';

const budgetLabel = (b: number) => (b === 0 ? 'Any budget' : `Up to ${formatK(b)}`);

export default function NeighborhoodExplorer() {
  const { open } = useContactModal();
  const { origin } = useMoveProfile();
  const [state, update] = useExplorerState();
  const { employer, ranked } = useRankedNeighborhoods(state.employerId);
  const railRef = useRef<HTMLUListElement>(null);

  const isMatch = (n: RankedNeighborhood) => matchFor(n, state).matches;
  const ordered = useMemo(
    () => [...ranked].sort((a, b) => Number(!matchFor(a, state).matches) - Number(!matchFor(b, state).matches) || a.commute - b.commute),
    [ranked, state],
  );
  const matchCount = ranked.filter(isMatch).length;
  const selected = ranked.find((n) => n.id === state.selectedId) ?? ordered[0];

  const changed = {
    employer: state.employerId !== EXPLORER_DEFAULTS.employerId,
    commute: state.maxCommute !== EXPLORER_DEFAULTS.maxCommute,
    budget: state.budget !== 0,
  };
  const anyChanged = changed.employer || changed.commute || changed.budget;

  const setFilter = (patch: Parameters<typeof update>[0], name: string) => {
    update(patch);
    trackEvent('neighborhood_filter_changed', { filter: name });
  };

  /** Select without moving the page: scroll only the card rail, horizontally. */
  const select = (id: string) => {
    update({ selectedId: id });
    const rail = railRef.current;
    const card = rail?.querySelector<HTMLElement>(`[data-id="${id}"]`);
    if (rail && card) {
      const left = card.offsetLeft - rail.offsetLeft - 12;
      rail.scrollTo({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  };

  const scrollRail = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (rail) rail.scrollBy({ left: dir * Math.min(rail.clientWidth * 0.85, 700), behavior: 'smooth' });
  };

  // Suggestions for relaxing filters when nothing matches.
  const suggestions = useMemo(() => {
    if (matchCount > 0) return [];
    const out: string[] = [];
    const byCommute = ranked.filter((n) => matchFor(n, { ...state, maxCommute: COMMUTE_RANGE.max }).matches).sort((a, b) => a.commute - b.commute)[0];
    if (byCommute) out.push(`Raise your drive limit to ${Math.ceil(byCommute.commute / 5) * 5} minutes to include ${byCommute.name}.`);
    const byBudget = ranked.filter((n) => n.commute <= state.maxCommute).sort((a, b) => a.band.low - b.band.low)[0];
    if (byBudget && state.budget) out.push(`Raise your budget to ${formatK(BUDGET_OPTIONS.find((o) => o >= byBudget.band.low) ?? byBudget.band.low)} to include ${byBudget.name}.`);
    return out;
  }, [matchCount, ranked, state]);

  const askAbout = (n: RankedNeighborhood) =>
    open('contact', {
      context: `Interested in: ${n.name}\nMoving from: ${US_STATE_DATA[origin].name}\nWorking near: ${employer.name}`,
      contextLabel: 'Details to include',
    });

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid gap-5 rounded-[var(--radius-card)] bg-fog p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] lg:items-end">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink">Where you&apos;ll work</span>
          <select value={employer.id} onChange={(e) => setFilter({ employerId: e.target.value }, 'employer')} className="field">
            {COMMUTE_EMPLOYERS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 flex items-baseline justify-between text-sm font-medium text-ink">
            Longest drive you&apos;ll accept
            <span className="tabular-nums">{state.maxCommute} min</span>
          </span>
          <input
            type="range"
            min={COMMUTE_RANGE.min}
            max={COMMUTE_RANGE.max}
            step={COMMUTE_RANGE.step}
            value={state.maxCommute}
            onChange={(e) => setFilter({ maxCommute: Number(e.target.value) }, 'commute')}
            className="range my-3"
            aria-valuetext={`${state.maxCommute} minutes`}
          />
        </label>
        <label className="block md:col-span-2 lg:col-span-1">
          <span className="mb-2 block text-sm font-medium text-ink">Budget for a 4-bedroom home</span>
          <select value={state.budget} onChange={(e) => setFilter({ budget: Number(e.target.value) }, 'budget')} className="field">
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {budgetLabel(b)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Result summary and active filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div aria-live="polite" className="flex flex-wrap items-center gap-2 text-[0.9375rem] text-ink">
          <span>
            <span className="font-semibold">
              {matchCount} of {ranked.length}
            </span>{' '}
            neighborhoods match:
          </span>
          <Chip>within {state.maxCommute} min of {employer.name}</Chip>
          {state.budget > 0 && <Chip>4-bedroom range starts at or under {formatK(state.budget)}</Chip>}
          {anyChanged && (
            <button
              type="button"
              onClick={() => update({ employerId: EXPLORER_DEFAULTS.employerId, maxCommute: EXPLORER_DEFAULTS.maxCommute, budget: 0 })}
              className="ml-1 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              Reset filters
            </button>
          )}
        </div>
        <div className="flex self-start rounded-full bg-fog p-1" role="group" aria-label="Explorer view">
          {(
            [
              ['map', 'Map'],
              ['chart', 'Compare price and commute'],
            ] as const
          ).map(([v, label]) => (
            <button
              key={v}
              type="button"
              aria-pressed={state.view === v}
              onClick={() => update({ view: v })}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${state.view === v ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {matchCount === 0 && (
        <div role="status" className="rounded-[var(--radius-card)] border border-dashed border-[#cfcfcf] p-5">
          <p className="font-medium text-ink">No neighborhoods match all your filters.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem] text-ink-soft">
            {suggestions.map((s) => (
              <li key={s}>{s}</li>
            ))}
            {suggestions.length === 0 && <li>Try a longer drive limit or a different employer.</li>}
          </ul>
        </div>
      )}

      {/* Map or chart, with the selected neighborhood beside it */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          {state.view === 'map' ? (
            <CommuteMap employer={employer} neighborhoods={ranked} isMatch={isMatch} selectedId={selected.id} onSelect={select} />
          ) : (
            <PriceCommuteScatter
              data={ranked}
              maxCommute={state.maxCommute}
              budget={state.budget}
              isMatch={isMatch}
              selectedId={selected.id}
              onSelect={select}
              employerName={employer.name}
            />
          )}
        </div>
        <SelectedPanel n={selected} match={matchFor(selected, state)} maxCommute={state.maxCommute} budget={state.budget} employerName={employer.name} onAsk={() => askAbout(selected)} />
      </div>

      {/* Accessible list equivalent: every neighborhood as a card, matches first */}
      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h3 className="t-card">All nine neighborhoods</h3>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scrollRail(-1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink hover:border-ink" aria-label="Scroll neighborhoods left">
              <IconArrowLeft size={20} />
            </button>
            <button type="button" onClick={() => scrollRail(1)} className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper hover:bg-black" aria-label="Scroll neighborhoods right">
              <IconArrowRight size={20} />
            </button>
          </div>
        </div>
        <ul ref={railRef} className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8 [scrollbar-width:thin]">
          {ordered.map((n) => (
            <li key={n.id} data-id={n.id} className="w-[min(84vw,330px)] shrink-0 snap-start">
              <NeighborhoodCard n={n} match={matchFor(n, state)} selected={n.id === selected.id} employerName={employer.name} onSelect={() => select(n.id)} />
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Prices: Redfin and Homes.com snapshots ({NEIGHBORHOOD_DATA_AS_OF}) from the Relocate Raleigh guide. Drive times: {COMMUTE_METHOD}
        </p>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-sand px-3 py-1 text-sm text-ink">{children}</span>;
}

function MatchLine({ match, maxCommute, budget }: { match: ReturnType<typeof matchFor>; maxCommute: number; budget: number }) {
  if (match.matches)
    return (
      <p className="flex items-start gap-1.5 text-sm font-medium text-ink">
        <IconCheck size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-leaf" />
        <span>
          Within your {maxCommute}-minute limit{budget > 0 ? '; the price range overlaps your budget' : ''}
        </span>
      </p>
    );
  return (
    <p className="text-sm text-ink-soft">
      Outside your filters:{' '}
      {[!match.commuteOk && 'longer drive', !match.budgetOk && 'price range starts above your budget'].filter(Boolean).join(', ')}
    </p>
  );
}

function SelectedPanel({
  n,
  match,
  maxCommute,
  budget,
  employerName,
  onAsk,
}: {
  n: RankedNeighborhood;
  match: ReturnType<typeof matchFor>;
  maxCommute: number;
  budget: number;
  employerName: string;
  onAsk: () => void;
}) {
  const photo = PHOTOS[n.photo];
  return (
    <article aria-labelledby="sel-name" className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border-2 border-ink bg-paper">
      <div className="relative aspect-[16/9]">
        <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 460px, 92vw" className="object-cover" />
        <SaveButton id={n.id} name={n.name} className="absolute right-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div>
          <p className="flex items-center gap-2 text-sm text-ink-soft">
            <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-ember" /> Selected
          </p>
          <h3 id="sel-name" className="t-card mt-1">
            {n.name}
          </h3>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{n.character}</p>
        </div>
        <MatchLine match={match} maxCommute={maxCommute} budget={budget} />
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-ink-soft">4-bedroom homes</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">{formatBand(n)}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Drive to {employerName.replace(/\s*\(.*\)/, '')}</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">~{n.commute} min, estimate</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Strength</dt>
            <dd className="mt-0.5 text-ink">{n.strength}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Tradeoff</dt>
            <dd className="mt-0.5 text-ink">{n.tradeoff}</dd>
          </div>
        </dl>
        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row lg:flex-col 2xl:flex-row">
          <Link href={`/neighborhoods/${n.id}`} className="btn-ink flex-1 px-5 py-3.5 text-[0.9375rem]">
            Read the full guide
          </Link>
          <button type="button" onClick={onAsk} className="btn-outline flex-1 px-5 py-3.5 text-[0.9375rem]">
            Ask Nick about it
          </button>
        </div>
      </div>
    </article>
  );
}

function NeighborhoodCard({
  n,
  match,
  selected,
  employerName,
  onSelect,
}: {
  n: RankedNeighborhood;
  match: ReturnType<typeof matchFor>;
  selected: boolean;
  employerName: string;
  onSelect: () => void;
}) {
  const photo = PHOTOS[n.photo];
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border-2 bg-paper transition-colors ${
        selected ? 'border-ink' : 'border-line hover:border-[#c9c9c9]'
      }`}
    >
      <div className="relative aspect-[16/10]">
        <Image src={photo.src} alt="" fill sizes="330px" className="object-cover" />
        {selected && <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper">Selected</span>}
        <SaveButton id={n.id} name={n.name} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h4 className="text-lg font-semibold tracking-tight">
            <button type="button" onClick={onSelect} aria-pressed={selected} className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none [&:focus-visible]:underline">
              {n.name}
            </button>
          </h4>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-soft">{n.character}</p>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-soft">4-bedroom homes</dt>
            <dd className="font-semibold tabular-nums">{formatBand(n)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-soft">Drive to {employerName.replace(/\s*\(.*\)/, '')}</dt>
            <dd className="tabular-nums">~{n.commute} min</dd>
          </div>
        </dl>
        <p className="text-sm text-ink">
          <span className="font-medium">+</span> {n.strength}
          <br />
          <span className="font-medium">−</span> {n.tradeoff}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {match.matches ? (
            <span className="flex items-center gap-1 text-sm font-medium text-ink">
              <IconCheck size={15} strokeWidth={2.5} className="text-leaf" /> Matches
            </span>
          ) : (
            <span className="text-sm text-ink-soft">Outside filters</span>
          )}
          <Link href={`/neighborhoods/${n.id}`} className="relative z-10 text-sm font-medium underline underline-offset-4">
            Full guide
          </Link>
        </div>
      </div>
    </article>
  );
}
