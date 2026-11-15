'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { COMMUTE_EMPLOYERS } from '@/data/commuteEmployers';
import { NEIGHBORHOODS, formatBand } from '@/data/neighborhoods';
import { CULTURE_STORES, CULTURE_TABS } from '@/data/cultureStores';
import { useExplorerState } from '@/lib/explorerState';
import { IconSearch } from './ui/Icons';

type Item = { id: string; group: string; label: string; hint: string; run: () => void };

/** Quick search across neighborhoods, employers, grocers and pages. Opens with Ctrl/⌘+K or "/". */
export default function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [, updateExplorer] = useExplorerState();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      onClose();
      router.push(href);
    };
    const pages: Item[] = [
      { id: 'p-hoods', group: 'Pages', label: 'Neighborhood explorer', hint: 'Commute and price', run: go('/#neighborhoods') },
      { id: 'p-math', group: 'Pages', label: 'Cost calculator', hint: 'What your salary is worth', run: go('/#math') },
      { id: 'p-scout', group: 'Pages', label: 'Scouting trip planner', hint: '3- or 5-day plan', run: go('/scouting') },
      { id: 'p-check', group: 'Pages', label: 'Relocation checklist', hint: 'Before the move to day 30', run: go('/checklist') },
      { id: 'p-life', group: 'Pages', label: 'Everyday resources', hint: 'Parks, groceries, healthcare', run: go('/#everyday') },
      { id: 'p-faq', group: 'Pages', label: 'Questions and answers', hint: 'How Nick helps', run: go('/#faq') },
      { id: 'p-about', group: 'Pages', label: 'About Nick', hint: 'His story', run: go('/#about') },
    ];
    const hoods: Item[] = NEIGHBORHOODS.map((n) => ({
      id: `n-${n.id}`,
      group: 'Neighborhoods',
      label: n.name,
      hint: `${n.inOneWord}, 4BR ${formatBand(n)}`,
      run: go(`/neighborhoods/${n.id}`),
    }));
    const employers: Item[] = COMMUTE_EMPLOYERS.map((e) => ({
      id: `e-${e.id}`,
      group: 'Employers',
      label: e.name,
      hint: 'See commutes',
      run: () => {
        updateExplorer({ employerId: e.id });
        go('/#neighborhoods')();
      },
    }));
    const stores: Item[] = CULTURE_TABS.flatMap((t) =>
      CULTURE_STORES[t.id].map((s) => ({
        id: `s-${s.id}`,
        group: 'Grocers',
        label: s.name,
        hint: s.address.split(',').slice(-2, -1)[0]?.trim() ?? t.label,
        run: go('/#everyday'),
      })),
    );
    return [...pages, ...hoods, ...employers, ...stores];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((i) => i.group === 'Pages' || i.group === 'Neighborhoods');
    return items.filter((i) => `${i.label} ${i.hint} ${i.group}`.toLowerCase().includes(q)).slice(0, 12);
  }, [items, query]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      results[active]?.run();
    }
  };

  let lastGroup = '';
  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/30 px-3 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        className="w-full max-w-xl overflow-hidden rounded-[var(--radius-card)] bg-paper shadow-[0_30px_80px_-30px_rgba(31,31,31,0.55)]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <IconSearch size={20} className="shrink-0 text-ink-soft" />
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Search neighborhoods, employers, grocers…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-[#8a8a8a]"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `opt-${results[active].id}` : undefined}
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 text-xs text-stone">Esc</kbd>
        </div>
        <ul id="search-results" role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-ink-soft">
              Nothing matches &ldquo;{query}&rdquo;. Try a town like Apex or an employer like Cisco.
            </li>
          )}
          {results.map((r, i) => {
            const header = r.group !== lastGroup ? r.group : null;
            lastGroup = r.group;
            return (
              <li key={r.id} role="presentation">
                {header && <p className="px-3 pb-1 pt-3 text-xs text-stone">{header}</p>}
                <button
                  id={`opt-${r.id}`}
                  role="option"
                  aria-selected={i === active}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={r.run}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left ${
                    i === active ? 'bg-fog' : ''
                  }`}
                >
                  <span className="font-medium text-ink">{r.label}</span>
                  <span className="truncate text-sm text-ink-soft">{r.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
