'use client';

import { useState } from 'react';
import type { RankedNeighborhood } from '@/data/neighborhoods';
import { formatK } from '@/data/neighborhoods';
import ChartTooltip from './ChartTooltip';
import { useElementWidth } from './useElementWidth';

const PURPLE = '#3741B5';
const MUTED = '#BDBDBD';

/**
 * Scatter: commute minutes (x) against median home price (y), one dot per neighborhood.
 * Dots inside your max commute are purple; the rest recede to gray. The selected dot is
 * ringed and direct-labeled; every dot is a keyboard-focusable button with a tooltip.
 */
export default function PriceCommuteScatter({
  data,
  maxCommute,
  selectedId,
  onSelect,
  employerName,
}: {
  data: RankedNeighborhood[];
  maxCommute: number;
  selectedId: string;
  onSelect: (id: string) => void;
  employerName: string;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const height = width < 520 ? 300 : 430;
  const m = { top: 24, right: 20, bottom: 44, left: 58 };
  const iw = Math.max(10, width - m.left - m.right);
  const ih = height - m.top - m.bottom;

  const xMax = Math.max(60, Math.ceil(Math.max(...data.map((d) => d.commute), maxCommute) / 10) * 10);
  const yMin = 300_000;
  const yMax = 1_000_000;
  const x = (v: number) => m.left + (v / xMax) * iw;
  const y = (v: number) => m.top + ih - ((v - yMin) / (yMax - yMin)) * ih;

  const xTicks = Array.from({ length: xMax / 10 + 1 }, (_, i) => i * 10);
  const yTicks = [400_000, 600_000, 800_000, 1_000_000];
  const hovered = data.find((d) => d.id === hoverId) ?? null;
  const selected = data.find((d) => d.id === selectedId) ?? null;
  const sorted = [...data].sort((a, b) => Number(a.id === selectedId) - Number(b.id === selectedId));

  return (
    <div ref={ref} className="relative w-full min-w-0" onPointerLeave={() => setHoverId(null)}>
      <svg
        width={width}
        height={height}
        role="group"
        aria-label={`Home price against estimated drive time to ${employerName}`}
      >
        {/* Recessive grid */}
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={m.left} x2={width - m.right} y1={y(t)} y2={y(t)} stroke="#EFEFEF" />
            <text x={m.left - 10} y={y(t) + 4} textAnchor="end" className="fill-stone text-[11px] tabular-nums">
              {formatK(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={height - m.bottom + 20} textAnchor="middle" className="fill-stone text-[11px] tabular-nums">
            {t}
          </text>
        ))}
        <text x={m.left + iw / 2} y={height - 6} textAnchor="middle" className="fill-ink-soft text-[12px]">
          Drive time to {employerName}, minutes
        </text>
        <line x1={m.left} x2={width - m.right} y1={m.top + ih} y2={m.top + ih} stroke="#D6D6D6" />

        {/* Commute budget: shaded zone + rule */}
        <rect x={m.left} y={m.top} width={Math.max(0, x(maxCommute) - m.left)} height={ih} fill="#3741B5" opacity={0.05} />
        <line x1={x(maxCommute)} x2={x(maxCommute)} y1={m.top - 6} y2={m.top + ih} stroke={PURPLE} strokeDasharray="4 4" />
        <text
          x={x(maxCommute) + (x(maxCommute) > width - 140 ? -6 : 6)}
          y={m.top + 6}
          textAnchor={x(maxCommute) > width - 140 ? 'end' : 'start'}
          className="text-[11px] font-medium"
          fill={PURPLE}
        >
          Your limit: {maxCommute} min
        </text>

        {sorted.map((d) => {
          const inRange = d.commute <= maxCommute;
          const isSel = d.id === selectedId;
          const isHover = d.id === hoverId;
          const cx = x(d.commute);
          const cy = y(Math.min(yMax, Math.max(yMin, d.price)));
          return (
            <g
              key={d.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSel}
              aria-label={`${d.name}: ${formatK(d.price)}, about ${d.commute} minutes, schools ${d.schools} out of 10${inRange ? '' : ', over your limit'}`}
              className="cursor-pointer outline-none [&:focus-visible>circle:nth-child(2)]:stroke-ink"
              onPointerEnter={() => setHoverId(d.id)}
              onFocus={() => setHoverId(d.id)}
              onBlur={() => setHoverId(null)}
              onClick={() => onSelect(d.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(d.id);
                }
              }}
            >
              <circle cx={cx} cy={cy} r={14} fill="transparent" />
              <circle
                cx={cx}
                cy={cy}
                r={isSel ? 11 : 0}
                fill="none"
                stroke={inRange ? PURPLE : '#8A8A8A'}
                strokeWidth={1.5}
              />
              <circle
                cx={cx}
                cy={cy}
                r={isSel || isHover ? 7 : 6}
                fill={inRange ? PURPLE : MUTED}
                stroke="#FEFEFF"
                strokeWidth={2}
              />
            </g>
          );
        })}

        {selected && (
          <text
            x={x(selected.commute) + (x(selected.commute) > width - 150 ? -16 : 16)}
            y={y(Math.min(yMax, Math.max(yMin, selected.price))) + 4}
            textAnchor={x(selected.commute) > width - 150 ? 'end' : 'start'}
            className="pointer-events-none fill-ink text-[13px] font-semibold"
            paintOrder="stroke"
            stroke="#FEFEFF"
            strokeWidth={4}
          >
            {selected.name}
          </text>
        )}
      </svg>

      {hovered && (
        <ChartTooltip
          x={x(hovered.commute)}
          y={y(Math.min(yMax, Math.max(yMin, hovered.price)))}
          containerWidth={width}
          title={hovered.name}
          rows={[
            { value: formatK(hovered.price), label: 'median home' },
            { value: `~${hovered.commute} min`, label: 'drive' },
            { value: `${hovered.schools}/10`, label: 'schools' },
          ]}
        />
      )}
    </div>
  );
}
