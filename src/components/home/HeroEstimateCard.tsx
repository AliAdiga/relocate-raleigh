'use client';

import { STATE_CODES_BY_NAME, US_STATE_DATA, computeRaleighEquivalentSalary, type StateCode } from '@/data/relocationStateData';
import { useMoveProfile } from '../MoveProfileProvider';

const roundK = (n: number) => `$${Math.round(n / 1000).toLocaleString('en-US')}K`;

/** Floating "quick estimate" card (the reference's dark info card). Shares state with the calculator. */
export default function HeroEstimateCard() {
  const { origin, setOrigin, salary } = useMoveProfile();
  const row = US_STATE_DATA[origin];
  const equivalent = computeRaleighEquivalentSalary(salary, row.mericIndex, row.stateTaxRate);

  return (
    <div className="w-full rounded-[var(--radius-card)] bg-[#1f1f1f]/88 p-5 text-[#f6f4ef] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.6)] backdrop-blur-md lg:w-[260px]">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="hero-origin" className="flex items-center gap-2 text-[0.9375rem] font-semibold">
          Quick estimate
          <span aria-hidden className="h-2 w-2 rounded-full bg-ember" />
        </label>
      </div>
      <p className="mt-2 text-sm text-[#d8d6cf]">Moving from</p>
      <span className="relative mt-1.5 block">
        <select
          id="hero-origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value as StateCode)}
          className="h-10 w-full cursor-pointer appearance-none rounded-full border border-white/15 bg-white/10 pl-3.5 pr-8 text-sm font-semibold text-[#f6f4ef] focus:border-white/60 focus:outline-none [&>option]:text-ink"
        >
          {STATE_CODES_BY_NAME.filter((c) => c !== 'NC').map((c) => (
            <option key={c} value={c}>
              {US_STATE_DATA[c].name}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="10" height="6" viewBox="0 0 10 6" aria-hidden>
          <path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <p className="mt-3 text-sm leading-relaxed text-[#d8d6cf]" aria-live="polite">
        {salary > 0 ? (
          <>
            On {roundK(salary)}, a similar lifestyle here is about{' '}
            <span key={`${origin}-${salary}`} className="value-update inline-block text-base font-semibold text-[#f6f4ef]">
              {roundK(equivalent)}
            </span>{' '}
            (estimate).
          </>
        ) : (
          'Enter your salary in the calculator for an estimate.'
        )}
      </p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs text-[#bdbcb6]">State-level comparison</span>
        <a
          href="#math"
          aria-label="Open the full salary calculator"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ember text-ink transition-transform hover:scale-105"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
