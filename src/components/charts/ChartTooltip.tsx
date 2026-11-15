/** Hover/focus readout: the value leads, the label follows (dataviz interaction spec). */
export default function ChartTooltip({
  x,
  y,
  containerWidth,
  rows,
  title,
}: {
  x: number;
  y: number;
  containerWidth: number;
  title: string;
  rows: { value: string; label: string; color?: string }[];
}) {
  const flip = x > containerWidth - 200;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-[160px] rounded-xl border border-line bg-paper px-3.5 py-2.5 shadow-[0_12px_30px_-16px_rgba(31,31,31,0.45)]"
      style={{
        left: flip ? undefined : x + 14,
        right: flip ? containerWidth - x + 14 : undefined,
        top: Math.max(0, y - 20),
      }}
    >
      <p className="text-xs text-stone">{title}</p>
      <ul className="mt-1 space-y-0.5">
        {rows.map((r) => (
          <li key={r.label} className="flex items-center gap-2 text-sm">
            {r.color && <span className="h-[2px] w-3 rounded-full" style={{ background: r.color }} aria-hidden />}
            <span className="font-semibold text-ink">{r.value}</span>
            <span className="text-stone">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
