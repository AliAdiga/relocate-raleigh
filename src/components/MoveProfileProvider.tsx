'use client';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { StateCode } from '@/data/relocationStateData';
import { NEIGHBORHOODS } from '@/data/neighborhoods';

const NEIGHBORHOOD_IDS = new Set(NEIGHBORHOODS.map((n) => n.id));

/**
 * What the visitor has told us so far. The hero's "moving from" picker and the calculator share
 * origin + salary; the neighborhood shortlist persists in localStorage across pages and visits.
 */
type Profile = {
  origin: StateCode;
  setOrigin: (s: StateCode) => void;
  salary: number;
  setSalary: (n: number) => void;
  shortlist: string[];
  /** Returns what happened so callers can explain a full shortlist instead of silently dropping one. */
  toggleShortlisted: (id: string) => 'added' | 'removed' | 'full';
  removeFromShortlist: (id: string) => void;
  clearShortlist: () => void;
};

export const SHORTLIST_MAX = 3;
const KEY = 'rr-shortlist';
const EMPTY: string[] = [];

// Tiny external store so every component reads the same shortlist without hydration mismatches.
const listeners = new Set<() => void>();
let cache: string[] | null = null;

function read(): string[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    cache = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string' && NEIGHBORHOOD_IDS.has(x)).slice(0, SHORTLIST_MAX)
      : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode: keep in memory only */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}

const Ctx = createContext<Profile | null>(null);

export function useMoveProfile() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useMoveProfile must be used inside <MoveProfileProvider>');
  return ctx;
}

export default function MoveProfileProvider({ children }: { children: ReactNode }) {
  const [origin, setOrigin] = useState<StateCode>('WA');
  const [salary, setSalary] = useState(200_000);
  const shortlist = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggleShortlisted = useCallback((id: string): 'added' | 'removed' | 'full' => {
    const cur = read();
    if (cur.includes(id)) {
      write(cur.filter((x) => x !== id));
      return 'removed';
    }
    if (cur.length >= SHORTLIST_MAX) return 'full';
    write([...cur, id]);
    return 'added';
  }, []);
  const removeFromShortlist = useCallback((id: string) => write(read().filter((x) => x !== id)), []);
  const clearShortlist = useCallback(() => write([]), []);

  const value = useMemo(
    () => ({
      origin,
      setOrigin,
      salary,
      setSalary,
      shortlist,
      toggleShortlisted,
      removeFromShortlist,
      clearShortlist,
    }),
    [origin, salary, shortlist, toggleShortlisted, removeFromShortlist, clearShortlist],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
