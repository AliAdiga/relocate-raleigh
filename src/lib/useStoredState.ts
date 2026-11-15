'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * JSON state persisted in localStorage, shared across components and tabs.
 * Server render (and first client render) uses `fallback`, so there is no hydration mismatch.
 */
const listeners = new Map<string, Set<() => void>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

function readKey<T>(key: string, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    /* unavailable */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

export function useStoredState<T>(key: string, fallback: T) {
  const subscribe = useCallback(
    (l: () => void) => {
      const set = listeners.get(key) ?? new Set();
      set.add(l);
      listeners.set(key, set);
      const onStorage = (e: StorageEvent) => e.key === key && l();
      window.addEventListener('storage', onStorage);
      return () => {
        set.delete(l);
        window.removeEventListener('storage', onStorage);
      };
    },
    [key],
  );
  const value = useSyncExternalStore(
    subscribe,
    () => readKey(key, fallback),
    () => fallback,
  );
  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readKey(key, fallback);
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        /* ignore */
      }
      listeners.get(key)?.forEach((l) => l());
    },
    [key, fallback],
  );
  return [value, setValue] as const;
}
