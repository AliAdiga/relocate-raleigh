'use client';

import { STATE_CODES_BY_NAME, US_STATE_DATA, computeRaleighEquivalentSalary, type StateCode } from '@/data/relocationStateData';
import { useMoveProfile } from './MoveProfileProvider';

export const roundK = (n: number) => `$${Math.round(n / 1000).toLocaleString('en-US')}K`;

/** Compact, single-line calculator teaser. Shares origin and salary with the full calculator. */
export default function HeroMovePicker() {
  const { origin, setOrigin, salary } = useMoveProfile();
  const row = US_STATE_DATA[origin];
  const equivalent = computeRaleighEquivalentSalary(salary, row.mericIndex, row.stateTaxRate);

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[0.9375rem] text-ink">
      <label htmlFor="hero-origin" className="font-semibold">
        Quick estimate:
      </label>
      <span>moving from</span>
      <span className="relative">
        <select
          id="hero-origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value as StateCode)}
          className="h-10 cursor-pointer appearance-none rounded-full border border-ink/15 bg-paper py-1.5 pl-3.5 pr-8 font-semibold text-ink focus:border-ink focus:outline-none"
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
      <span aria-live="polite">
        {salary > 0 ? (
          <>
            on {roundK(salary)}, similar buying power in the Raleigh area is about{' '}
            <span key={`${origin}-${salary}`} className="value-update inline-block font-semibold">
              {roundK(equivalent)}
            </span>{' '}
            (estimate).
          </>
        ) : (
          'enter your salary in the calculator for an estimate.'
        )}
      </span>
      <a href="#math" className="whitespace-nowrap text-ink-soft underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink">
        See the math
      </a>
    </div>
  );
}
