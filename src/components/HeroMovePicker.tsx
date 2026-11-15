'use client';

import { STATE_CODES_BY_NAME, US_STATE_DATA, computeRaleighEquivalentSalary, type StateCode } from '@/data/relocationStateData';
import { useMoveProfile } from './MoveProfileProvider';

export const roundK = (n: number) => `$${Math.round(n / 1000).toLocaleString('en-US')}K`;

/** Compact calculator teaser. Shares origin and salary with the full calculator. */
export default function HeroMovePicker() {
  const { origin, setOrigin, salary } = useMoveProfile();
  const row = US_STATE_DATA[origin];
  const equivalent = computeRaleighEquivalentSalary(salary, row.mericIndex, row.stateTaxRate);

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[0_18px_40px_-30px_rgba(31,31,31,0.5)]">
      <p className="text-[0.9375rem] font-semibold text-ink">Quick salary estimate</p>
      <label className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-[0.9375rem] text-ink">
        <span>Moving from</span>
        <span className="relative">
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value as StateCode)}
            className="cursor-pointer appearance-none rounded-full border border-line bg-fog py-2 pl-3.5 pr-8 font-semibold text-ink focus:border-ink focus:outline-none"
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
        <span>on {salary > 0 ? roundK(salary) : 'your salary'}</span>
      </label>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft" aria-live="polite">
        {salary > 0 ? (
          <>
            Similar buying power in the Raleigh area: about{' '}
            <span key={`${origin}-${salary}`} className="value-update inline-block font-semibold text-ink">
              {roundK(equivalent)}
            </span>{' '}
            a year (estimate).{' '}
            <a href="#math" className="whitespace-nowrap text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
              See the math
            </a>
          </>
        ) : (
          'Enter your salary in the calculator to see an estimate.'
        )}
      </p>
    </div>
  );
}
