'use client';

import { useState } from 'react';
import { formatBand, formatK, type RankedNeighborhood } from '@/data/neighborhoods';
import ChartTooltip from './ChartTooltip';
import { useElementWidth } from './useElementWidth';

const INK = '#1F1F1F';
const MUTED = '#BDBDBD';
const ORANGE = '#FF791A';
const VIOLET = '#3741B5';

/**
 * Commute estimate (x) against the guide's realistic 4-bedroom price band (y, drawn as a range).
 * Your commute limit and budget appear as dashed rules. Matches are ink, the rest gray and hollow,
 * the selection orange with a ring and a direct label.
 */
export default function PriceCommuteScatter({
  data,
  maxCommute,
  budget,
  isMatch,
  selectedId,
  onSelect,
  employerName,
}: {
  data: RankedNeighborhood[];
  maxCommute: number;
  budget: number;
  isMatch: (n: RankedNeighborhood) => boolean;
  selectedId: string;
  onSelect: (id: string) => void;
  employerName: string;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hoverId, setHoverId] = useState<string | null>(null);

  const height = width < 520 ? 320 : 400;
  const m = { top: 28, right: 24, bottom: 48, left: 60 };
  const iw = Math.max(10, width - m.left - m.right);
  const ih = height - m.top - m.bottom;
  const xMax = Math.max(60, Math.ceil(Math.max(...data.map((d) => d.commute), maxCommute) / 10) * 10);
  const yMin = 400_000;
  const yMax = 1_800_000;
  const x = (v: number) => m.left + (v / xMax) * iw;
  const y = (v: number) => m.top + ih - ((Math.min(yMax, Math.max(yMin, v)) - yMin) / (yMax - yMin)) * ih;
  const xTicks = Array.from({ length: xMax / 10 + 1 }, (_, i) => i * 10);
  const yTicks = [500_000, 750_000, 1_000_000, 1_250_000, 1_500_000];
  const hovered = data.find((d) => d.id === hoverId) ?? null;
  const ordered = [...data].sort((a, b) => Number(a.id === selectedId) - Number(b.id === selectedId));
  const flipLimit = x(maxCommute) > width - 150;

  return (
    <figure>
      <div ref={ref} className="relative w-full min-w-0" onPointerLeave={() => setHoverId(null)}>
        <svg width={width} height={height} role="group" aria-label={`4-bedroom price range against estimated drive to ${employerName}`}>
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
          <text x={m.left + iw / 2} y={height - 8} textAnchor="middle" className="fill-ink-soft text-[12px]">
            Estimated drive to {employerName}, minutes
          </text>
          <line x1={m.left} x2={width - m.right} y1={m.top + ih} y2={m.top + ih} stroke="#D6D6D6" />

          {/* Your limits */}
          <rect x={m.left} y={m.top} width={Math.max(0, x(maxCommute) - m.left)} height={ih} fill={VIOLET} opacity={0.045} />
          <line x1={x(maxCommute)} x2={x(maxCommute)} y1={m.top - 8} y2={m.top + ih} stroke={VIOLET} strokeDasharray="4 4" />
          <text x={x(maxCommute) + (flipLimit ? -6 : 6)} y={m.top + 4} textAnchor={flipLimit ? 'end' : 'start'} className="text-[11px] font-medium" fill={VIOLET}>
            Your limit: {maxCommute} min
          </text>
          {budget > 0 && budget <= yMax && (
            <g>
              <line x1={m.left} x2={width - m.right} y1={y(budget)} y2={y(budget)} stroke={VIOLET} strokeDasharray="4 4" />
              <text x={width - m.right} y={y(budget) - 6} textAnchor="end" className="text-[11px] font-medium" fill={VIOLET}>
                Your budget: {formatK(budget)}
              </text>
            </g>
          )}

          {ordered.map((d) => {
            const ok = isMatch(d);
            const sel = d.id === selectedId;
            const cx = x(d.commute);
            const color = sel ? ORANGE : ok ? INK : MUTED;
            return (
              <g
                key={d.id}
                role="button"
                tabIndex={0}
                aria-pressed={sel}
                aria-label={`${d.name}: 4-bedroom homes ${formatBand(d)}, about ${d.commute} minutes${ok ? ', matches' : ', outside your filters'}`}
                className="cursor-pointer outline-none [&:focus-visible_rect.hit]:stroke-[#3741B5]"
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
                <rect className="hit" x={cx - 14} y={y(d.band.high) - 10} width="28" height={y(d.band.low) - y(d.band.high) + 20} rx="10" fill="transparent" strokeWidth="2" />
                <line x1={cx} x2={cx} y1={y(d.band.low)} y2={y(d.band.high)} stroke={color} strokeWidth={sel ? 8 : 6} strokeLinecap="round" opacity={ok || sel ? 1 : 0.9} />
                {!ok && !sel && <line x1={cx} x2={cx} y1={y(d.band.low)} y2={y(d.band.high)} stroke="#FEFEFF" strokeWidth="2" strokeLinecap="round" />}
                {sel && <circle cx={cx} cy={y(d.band.low)} r="9" fill="none" stroke={INK} strokeWidth="2" />}
              </g>
            );
          })}

          {data
            .filter((d) => d.id === selectedId)
            .map((d) => {
              const cx = x(d.commute);
              const right = cx < width - 160;
              return (
                <text
                  key="label"
                  x={cx + (right ? 14 : -14)}
                  y={y(d.band.high) - 6}
                  textAnchor={right ? 'start' : 'end'}
                  className="pointer-events-none fill-ink text-[13px] font-semibold"
                  paintOrder="stroke"
                  stroke="#FEFEFF"
                  strokeWidth={4}
                >
                  {d.name}
                </text>
              );
            })}
        </svg>

        {hovered && (
          <ChartTooltip
            x={x(hovered.commute)}
            y={y(hovered.band.high)}
            containerWidth={width}
            title={hovered.name}
            rows={[
              { value: formatBand(hovered), label: '4-bedroom homes' },
              { value: hovered.median.label, label: 'median sale' },
              { value: `~${hovered.commute} min`, label: 'drive (estimate)' },
            ]}
          />
        )}
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">
        Each bar spans the realistic 4-bedroom price range from the Relocate Raleigh guide (Redfin and Homes.com,
        March 2026). Gray bars are outside your filters.
      </figcaption>
    </figure>
  );
}
