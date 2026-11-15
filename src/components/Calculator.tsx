'use client';

import { useMoveProfile } from './MoveProfileProvider';
import {
  STATE_CODES_BY_NAME,
  US_STATE_DATA,
  type StateCode,
  computeRaleighEquivalentSalary,
  RALEIGH_METRO_MEDIAN_HOME,
  RALEIGH_STATE_EFFECTIVE_TAX_RATE,
} from '@/data/relocationStateData';
import BarPair from './charts/BarPair';
import StateCostStrip from './charts/StateCostStrip';

const ORANGE = '#E8650A';
const PURPLE = '#3741B5';
const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export default function Calculator() {
  const { origin: stateCode, setOrigin: setStateCode, salary, setSalary } = useMoveProfile();
  const origin = US_STATE_DATA[stateCode];

  const equivalent = Math.round(
    computeRaleighEquivalentSalary(salary, origin.mericIndex, origin.stateTaxRate),
  );
  const gap = salary - equivalent;
  const pct = salary > 0 ? Math.round((gap / salary) * 100) : 0;
  const originTax = salary * origin.stateTaxRate;
  const ncTax = salary * RALEIGH_STATE_EFFECTIVE_TAX_RATE;

  let verdict: string;
  if (salary === 0) verdict = 'Enter your salary to see your Raleigh number.';
  else if (gap > 0)
    verdict = `You could earn ${usd(gap)} less a year in Raleigh (${pct}%) and keep the same lifestyle.`;
  else if (gap < 0)
    verdict = `${origin.name} is already cheaper than Raleigh, so you'd need about ${usd(-gap)} more a year here.`;
  else verdict = 'Your money goes about as far in Raleigh as it does now.';

  return (
    <div className="overflow-hidden rounded-[var(--radius-panel)] border border-line bg-paper">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Inputs and the headline number */}
        <div className="wash flex flex-col gap-8 p-6 sm:p-10">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">Your salary today</span>
              <span className="relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={salary.toLocaleString('en-US')}
                  onChange={(e) => setSalary(Number(e.target.value.replace(/[^\d]/g, '').slice(0, 8) || 0))}
                  className="field pl-8 text-lg font-medium tabular-nums"
                  aria-describedby="salary-help"
                />
              </span>
              <span id="salary-help" className="mt-1.5 block text-xs text-ink-soft">
                Base pay before taxes
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">State you live in now</span>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value as StateCode)}
                className="field text-lg font-medium"
              >
                {STATE_CODES_BY_NAME.filter((c) => c !== 'NC').map((code) => (
                  <option key={code} value={code}>
                    {US_STATE_DATA[code].name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-auto space-y-3" aria-live="polite">
            <p className="text-sm text-ink-soft">Salary with the same buying power in Raleigh</p>
            <p className="text-[clamp(2.75rem,6vw,4.1875rem)] font-semibold leading-none tracking-tight tabular-nums text-ink">
              {usd(equivalent)}
            </p>
            <p className="max-w-md text-base leading-relaxed text-ink">{verdict}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="flex min-w-0 flex-col gap-10 p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <BarPair
              title="Typical home price"
              format={usd}
              data={[
                { label: origin.name, value: origin.medianHome, color: ORANGE },
                { label: 'Raleigh area', value: RALEIGH_METRO_MEDIAN_HOME, color: PURPLE },
              ]}
              caption="State median sale price vs. a Raleigh-area benchmark. Neighborhoods vary a lot."
            />
            <BarPair
              title={`State income tax on ${usd(salary)}`}
              format={usd}
              data={[
                { label: origin.name, value: originTax, color: ORANGE },
                { label: 'North Carolina', value: ncTax, color: PURPLE },
              ]}
              caption="Approximate effective rate, single filer. Federal tax is the same in both places."
            />
          </div>
          <StateCostStrip selected={stateCode} onSelect={setStateCode} />
          <details className="group text-sm text-ink-soft">
            <summary className="cursor-pointer select-none font-medium text-ink">How we calculate this</summary>
            <p className="mt-2 max-w-2xl leading-relaxed">
              Buying power = salary × (1 − state income tax) ÷ cost of living relative to North Carolina. Your
              Raleigh number is the NC salary with the same buying power, using NC&apos;s 4.75% flat income tax.
              Sources: MERIC 2025 cost-of-living index and 2024 state median sale prices. These are estimates
              for comparison, not financial or tax advice.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
