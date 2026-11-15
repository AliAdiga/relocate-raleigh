'use client';

import {
  STATE_CODES_BY_NAME,
  US_STATE_DATA,
  computeRaleighEquivalentSalary,
  type StateCode,
} from '@/data/relocationStateData';
import { useMoveProfile } from './MoveProfileProvider';

const k = (n: number) => `$${Math.round(n / 1000)}k`;

/**
 * The hero's hook: pick where you live now and see, live, what the same lifestyle costs in Raleigh.
 * Shares state with the calculator further down the page.
 */
export default function HeroMovePicker() {
  const { origin, setOrigin, salary } = useMoveProfile();
  const row = US_STATE_DATA[origin];
  const equivalent = computeRaleighEquivalentSalary(salary, row.mericIndex, row.stateTaxRate);
  const cheaper = equivalent < salary;

  return (
    <div className="w-full max-w-[460px] rounded-[1.25rem] bg-paper/70 p-4 backdrop-blur-sm">
      <label className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9375rem] text-ink">
        <span>Moving from</span>
        <span className="relative">
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value as StateCode)}
            className="cursor-pointer appearance-none rounded-full border border-line bg-paper py-1.5 pl-3.5 pr-8 font-semibold text-ink focus:border-ink focus:outline-none"
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
        <span>on {k(salary)}?</span>
      </label>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink" aria-live="polite">
        The same lifestyle in Raleigh takes about{' '}
        <span className={`font-semibold ${cheaper ? 'text-violet' : 'text-ember-deep'}`}>{k(equivalent)}</span>.{' '}
        <a href="#math" className="font-medium underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink">
          See the math
        </a>
      </p>
    </div>
  );
}
