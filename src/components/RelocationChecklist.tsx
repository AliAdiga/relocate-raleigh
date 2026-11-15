'use client';

import { CHECKLIST, CHECKLIST_DEADLINE } from '@/data/checklist';
import { useStoredState } from '@/lib/useStoredState';
import { IconCheck, IconPrinter } from './ui/Icons';

const NONE: string[] = [];

export default function RelocationChecklist() {
  const [done, setDone] = useStoredState<string[]>('rr-checklist', NONE);
  const total = CHECKLIST.reduce((n, g) => n + g.items.length, 0);
  const toggle = (id: string) => setDone((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const pct = Math.round((done.length / total) * 100);

  return (
    <div className="space-y-10">
      <div className="no-print flex flex-col gap-4 rounded-[var(--radius-card)] bg-fog p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[0.9375rem] text-ink" aria-live="polite">
            <span className="font-semibold">
              {done.length} of {total}
            </span>{' '}
            done. Saved in this browser only.
          </p>
          <div className="mt-2 h-2 max-w-sm rounded-full bg-line" aria-hidden>
            <div className="h-full rounded-full bg-ink transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => window.print()} className="btn-outline px-5 py-3 text-sm">
            <IconPrinter size={18} /> Print
          </button>
          {done.length > 0 && (
            <button type="button" onClick={() => setDone(NONE)} className="text-sm text-ink-soft underline underline-offset-4">
              Clear
            </button>
          )}
        </div>
      </div>

      <p className="rounded-[var(--radius-card)] border-l-4 border-ember bg-sand px-5 py-4 text-[0.9375rem] leading-relaxed text-ink">
        <span className="font-semibold">Deadline to know: </span>
        {CHECKLIST_DEADLINE}
      </p>

      <ol className="grid gap-10 lg:grid-cols-2 lg:gap-x-16">
        {CHECKLIST.map((g, gi) => (
          <li key={g.id} className="print:break-inside-avoid">
            <h2 className="flex items-baseline gap-3">
              <span aria-hidden className={`h-3 w-3 shrink-0 translate-y-[-2px] rounded-full ${gi === CHECKLIST.length - 1 ? 'bg-ember' : 'bg-ink'}`} />
              <span className="t-card">{g.title}</span>
            </h2>
            <p className="mt-1 pl-6 text-sm text-ink-soft">{g.when}</p>
            <ul className="mt-4 space-y-1">
              {g.items.map((it) => {
                const checked = done.includes(it.id);
                return (
                  <li key={it.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 hover:bg-fog">
                      <input type="checkbox" checked={checked} onChange={() => toggle(it.id)} className="peer sr-only" />
                      <span
                        aria-hidden
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet ${
                          checked ? 'border-ink bg-ink text-paper' : 'border-[#bdbdbd]'
                        }`}
                      >
                        {checked && <IconCheck size={14} strokeWidth={3} />}
                      </span>
                      <span className={`text-[0.9375rem] leading-relaxed ${checked ? 'text-stone line-through' : 'text-ink'}`}>
                        {it.text}
                        {it.href && (
                          <>
                            {' '}
                            <a href={it.href} target="_blank" rel="noopener noreferrer" className="text-ink-soft underline underline-offset-4 hover:text-ink" onClick={(e) => e.stopPropagation()}>
                              Official site
                            </a>
                          </>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
