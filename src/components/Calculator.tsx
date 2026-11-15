'use client';

import { useState } from 'react';
import {
  STATE_CODES_BY_NAME,
  US_STATE_DATA,
  type StateCode,
  computeRaleighEquivalentSalary,
  NC_MERIC_INDEX,
  RALEIGH_METRO_MEDIAN_HOME,
  RALEIGH_STATE_EFFECTIVE_TAX_RATE,
} from '@/data/relocationStateData';
import BarPair from './charts/BarPair';
import StateCostStrip from './charts/StateCostStrip';
import { useMoveProfile } from './MoveProfileProvider';

const ORANGE = '#E8650A';
const VIOLET = '#3741B5';
const MAX_SALARY = 5_000_000;

/** Display rounding only; calculations keep full precision. */
const roundTo = (n: number, step: number) => Math.round(n / step) * step;
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export default function Calculator() {
  const { origin: stateCode, setOrigin: setStateCode, salary, setSalary } = useMoveProfile();
  const [raw, setRaw] = useState(() => String(salary));
  const origin = US_STATE_DATA[stateCode];

  const digits = raw.replace(/[^\d]/g, '');
  const parsed = digits ? Number(digits) : NaN;
  const error = !digits
    ? 'Enter your current salary to see an estimate.'
    : parsed === 0
      ? 'Enter a salary above $0.'
      : parsed > MAX_SALARY
        ? `Enter a salary up to ${usd(MAX_SALARY)}.`
        : null;

  const onSalary = (value: string) => {
    setRaw(value);
    const d = value.replace(/[^\d]/g, '');
    const n = d ? Number(d) : 0;
    if (n > 0 && n <= MAX_SALARY) setSalary(n);
  };

  const valid = !error;
  const equivalent = valid ? computeRaleighEquivalentSalary(parsed, origin.mericIndex, origin.stateTaxRate) : 0;
  const gap = parsed - equivalent;
  const pct = valid ? Math.round((gap / parsed) * 100) : 0;
  const shownEquivalent = roundTo(equivalent, 1000);
  const shownGap = roundTo(Math.abs(gap), 1000);

  let verdict = '';
  if (valid) {
    if (shownGap === 0) verdict = 'Your money would go about as far in the Raleigh area as it does now.';
    else if (gap > 0) verdict = `About ${usd(shownGap)} less a year (${pct}%) could keep a similar lifestyle in the Raleigh area.`;
    else verdict = `${origin.name} is already less expensive overall, so you'd need about ${usd(shownGap)} more a year here.`;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-paper">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* 1. Inputs and 2. the main estimate */}
        <div className="flex flex-col gap-8 bg-sand p-6 sm:p-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div>
              <label htmlFor="calc-salary" className="mb-2 block text-sm font-medium text-ink">
                Your salary today
              </label>
              <span className="relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">$</span>
                <input
                  id="calc-salary"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={digits ? Number(digits).toLocaleString('en-US') : raw.replace(/[^\d]/g, '')}
                  onChange={(e) => onSalary(e.target.value)}
                  className="field pl-8 text-lg font-medium tabular-nums"
                  aria-invalid={Boolean(error)}
                  aria-describedby="calc-salary-help"
                  maxLength={11}
                />
              </span>
              <p id="calc-salary-help" className={`mt-1.5 text-sm ${error ? 'text-[#8c1d18]' : 'text-ink-soft'}`} aria-live="polite">
                {error ?? 'Base pay before taxes. Stays in your browser.'}
              </p>
            </div>
            <div>
              <label htmlFor="calc-state" className="mb-2 block text-sm font-medium text-ink">
                State you live in now
              </label>
              <select id="calc-state" value={stateCode} onChange={(e) => setStateCode(e.target.value as StateCode)} className="field text-lg font-medium">
                {STATE_CODES_BY_NAME.filter((c) => c !== 'NC').map((code) => (
                  <option key={code} value={code}>
                    {US_STATE_DATA[code].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-auto space-y-3" aria-live="polite">
            <p className="text-sm text-ink-soft">Estimated salary with similar buying power in the Raleigh area</p>
            <p
              key={`${stateCode}-${shownEquivalent}`}
              className="value-update text-[clamp(2.5rem,5.5vw,3.75rem)] font-semibold leading-none tracking-tight tabular-nums text-ink"
            >
              {valid ? `≈ ${usd(shownEquivalent)}` : '—'}
            </p>
            <p className="max-w-md text-base leading-relaxed text-ink">{verdict}</p>
            <p className="text-sm text-ink-soft">Rounded to the nearest $1,000. State-level comparison, not city to city.</p>
          </div>
        </div>

        {/* 3. Supporting comparisons */}
        <div className="flex min-w-0 flex-col gap-10 p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <BarPair
              title="Typical home price"
              format={(n) => usd(roundTo(n, 1000))}
              data={[
                { label: `${origin.name} (state median)`, value: origin.medianHome, color: ORANGE },
                { label: 'Raleigh-area benchmark', value: RALEIGH_METRO_MEDIAN_HOME, color: VIOLET },
              ]}
              caption="State medians are 2024 figures. The Raleigh benchmark is a single illustrative figure; family neighborhoods often cost more. See the explorer for neighborhood ranges."
            />
            <BarPair
              title={valid ? `State income tax on ${usd(parsed)}` : 'State income tax'}
              format={(n) => usd(roundTo(n, 100))}
              data={[
                { label: origin.name, value: valid ? parsed * origin.stateTaxRate : 0, color: ORANGE },
                { label: 'North Carolina', value: valid ? parsed * RALEIGH_STATE_EFFECTIVE_TAX_RATE : 0, color: VIOLET },
              ]}
              caption={`Approximate effective rates (${(origin.stateTaxRate * 100).toFixed(1)}% vs. ${(RALEIGH_STATE_EFFECTIVE_TAX_RATE * 100).toFixed(2)}%) for a single filer near $200,000. Real taxes depend on your situation.`}
            />
          </div>
          <StateCostStrip selected={stateCode} onSelect={setStateCode} />

          {/* 4. Methodology and sources, always visible */}
          <div id="math-method" className="rounded-[var(--radius-card)] bg-fog p-5 text-sm leading-relaxed text-ink-soft">
            <p className="font-medium text-ink">How this estimate works</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Take your salary after your state&apos;s income tax.</li>
              <li>
                Adjust for cost of living using each state&apos;s MERIC index ({origin.name} {origin.mericIndex} vs. North
                Carolina {NC_MERIC_INDEX}; U.S. average = 100). The index covers goods, housing, transport and
                services, not taxes, so taxes are counted once.
              </li>
              <li>Solve for the NC salary that leaves the same buying power after NC&apos;s flat income tax.</li>
            </ol>
            <p className="mt-3">
              Sources: MERIC 2025 annual cost-of-living index; state median sale prices (Rocket Mortgage, 2024). Federal
              tax is the same in both places and left out. North Carolina-wide cost data stands in for the Raleigh
              area. An estimate for comparison, not financial or tax advice.
            </p>
          </div>

          {/* 5. Next step */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="text-[0.9375rem] text-ink">Next, see which neighborhoods fit your commute and budget.</p>
            <a href="#neighborhoods" className="btn-ink px-6 py-3.5 text-[0.9375rem]">
              Explore neighborhoods
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
