'use client';

import { useMemo, useState } from 'react';
import { US_STATE_DATA, NC_MERIC_INDEX, type StateCode } from '@/data/relocationStateData';
import ChartTooltip from './ChartTooltip';
import { useElementWidth } from './useElementWidth';

const ORANGE = '#E8650A';
const PURPLE = '#3741B5';
const MUTED = '#C9C9C9';

type Dot = { code: StateCode; name: string; index: number; cx: number; cy: number };

/**
 * One-axis dot strip: every state's cost-of-living index (MERIC, U.S. = 100).
 * Overlapping dots stack (a simple beeswarm). Your state is orange, North Carolina purple.
 * Click a dot to switch the calculator to that state.
 */
export default function StateCostStrip({
  selected,
  onSelect,
}: {
  selected: StateCode;
  onSelect: (code: StateCode) => void;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<Dot | null>(null);

  const padX = 14;
  const r = 5;
  const rowH = 11;
  const baseY = 58;

  const { dots, domain, ticks } = useMemo(() => {
    const rows: { code: StateCode; name: string; index: number }[] = (Object.keys(US_STATE_DATA) as StateCode[])
      .filter((c) => c !== 'NC')
      .map((code) => ({ code, name: US_STATE_DATA[code].name, index: US_STATE_DATA[code].mericIndex }));
    rows.push({ code: 'NC', name: 'North Carolina', index: NC_MERIC_INDEX });
    const lo = Math.floor(Math.min(...rows.map((d) => d.index)) / 5) * 5;
    const hi = Math.ceil(Math.max(...rows.map((d) => d.index)) / 5) * 5;
    const x = (v: number) => padX + ((v - lo) / (hi - lo)) * (width - padX * 2);

    // Greedy stacking: alternate above/below the baseline when dots would overlap.
    const placed: Dot[] = [];
    const sorted = [...rows].sort((a, b) => a.index - b.index);
    for (const d of sorted) {
      const cx = x(d.index);
      let level = 0;
      for (;;) {
        const offset = level === 0 ? 0 : Math.ceil(level / 2) * rowH * (level % 2 ? -1 : 1);
        const cy = baseY + offset;
        const clash = placed.some((p) => Math.abs(p.cx - cx) < r * 2 + 1 && Math.abs(p.cy - cy) < r * 2);
        if (!clash || level > 8) {
          placed.push({ ...d, cx, cy });
          break;
        }
        level++;
      }
    }
    const tickVals: number[] = [];
    for (let t = lo; t <= hi; t += 10) tickVals.push(t);
    return { dots: placed, domain: [lo, hi] as const, ticks: tickVals.map((t) => ({ t, x: x(t) })) };
  }, [width]);

  const height = 118;
  const usX = padX + ((100 - domain[0]) / (domain[1] - domain[0])) * (width - padX * 2);
  // Draw highlighted dots last so they sit on top.
  const ordered = [...dots].sort((a, b) => rank(a.code, selected) - rank(b.code, selected));
  const origin = US_STATE_DATA[selected];

  return (
    <figure className="space-y-3">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-[0.9375rem] font-medium text-ink">Cost of living, every state</span>
        <span className="flex items-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: ORANGE }} aria-hidden />
            {origin.name}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: PURPLE }} aria-hidden />
            North Carolina
          </span>
        </span>
      </figcaption>

      <div ref={ref} className="relative min-w-0 overflow-hidden" onPointerLeave={() => setHover(null)}>
        <svg width={width} height={height} role="img" aria-label={`Cost of living index by state. ${origin.name} is ${origin.mericIndex}; North Carolina is ${NC_MERIC_INDEX}; the U.S. average is 100.`}>
          <line x1={padX} x2={width - padX} y1={height - 22} y2={height - 22} stroke="#E7E7E7" />
          {ticks.map(({ t, x }) => (
            <text key={t} x={x} y={height - 6} textAnchor="middle" className="fill-stone text-[11px] tabular-nums">
              {t}
            </text>
          ))}
          <line x1={usX} x2={usX} y1={8} y2={height - 22} stroke="#9B9B9B" strokeDasharray="3 4" />
          <text x={usX + 6} y={14} className="fill-stone text-[11px]">U.S. average</text>

          {ordered.map((d) => {
            const isOrigin = d.code === selected;
            const isNC = d.code === 'NC';
            const fill = isOrigin ? ORANGE : isNC ? PURPLE : MUTED;
            const big = isOrigin || isNC;
            return (
              <g
                key={d.code}
                className="cursor-pointer"
                onPointerEnter={() => setHover(d)}
                onClick={() => d.code !== 'NC' && onSelect(d.code)}
              >
                {/* Hit target bigger than the mark */}
                <circle cx={d.cx} cy={d.cy} r={11} fill="transparent" />
                <circle
                  cx={d.cx}
                  cy={d.cy}
                  r={big ? 7 : hover?.code === d.code ? 6 : r}
                  fill={fill}
                  stroke="#FEFEFF"
                  strokeWidth={2}
                />
              </g>
            );
          })}
        </svg>
        {hover && (
          <ChartTooltip
            x={hover.cx}
            y={hover.cy}
            containerWidth={width}
            title={hover.code === 'NC' ? 'North Carolina' : `${hover.name}${hover.code === selected ? ' (selected)' : ''}`}
            rows={[{ value: hover.index.toFixed(1), label: 'cost-of-living index' }]}
          />
        )}
      </div>
      <p className="text-xs leading-relaxed text-stone">
        Hover a dot to see the state, click to compare it. Index from MERIC 2025, where 100 is the U.S. average.
      </p>
    </figure>
  );
}

function rank(code: StateCode, selected: StateCode) {
  if (code === selected) return 2;
  if (code === 'NC') return 1;
  return 0;
}
