
/**
 * Two horizontal bars on one shared scale: "your state" (orange) vs Raleigh (purple).
 * Thin bars with 4px rounded data-ends anchored at the baseline, values and names direct-labeled
 * so identity never depends on color alone.
 */
export type BarDatum = { label: string; value: number; color: string };

export default function BarPair({
  title,
  data,
  format,
  caption,
}: {
  title: string;
  data: [BarDatum, BarDatum];
  format: (n: number) => string;
  caption?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <figure className="space-y-3">
      <figcaption className="text-[0.9375rem] font-medium text-ink">{title}</figcaption>
      <ul className="space-y-3">
        {data.map((d) => {
          const pct = Math.max(0.5, (d.value / max) * 100);
          return (
            <li key={d.label} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-ink-soft">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: d.color }} aria-hidden />
                  {d.label}
                </span>
                <span className="font-semibold tabular-nums text-ink">{format(d.value)}</span>
              </div>
              <div className="h-3 w-full rounded-r-[4px] bg-fog">
                <div
                  className="h-full rounded-r-[4px] transition-[width] duration-500 ease-out"
                  style={{ width: `${pct}%`, background: d.color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {caption && <p className="text-xs leading-relaxed text-stone">{caption}</p>}
    </figure>
  );
}
