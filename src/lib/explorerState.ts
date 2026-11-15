'use client';

import { useMemo } from 'react';
import { COMMUTE_EMPLOYERS } from '@/data/commuteEmployers';
import { withCommutes, type RankedNeighborhood } from '@/data/neighborhoods';
import { useStoredState } from './useStoredState';

export type ExplorerView = 'map' | 'chart';

export type ExplorerState = {
  employerId: string;
  maxCommute: number;
  /** Top of budget for a 4BR home in USD; 0 means "any". */
  budget: number;
  view: ExplorerView;
  selectedId: string;
};

export const EXPLORER_DEFAULTS: ExplorerState = {
  employerId: 'cisco',
  maxCommute: 30,
  budget: 0,
  view: 'map',
  selectedId: 'morrisville',
};

export const BUDGET_OPTIONS = [0, 600_000, 750_000, 900_000, 1_200_000, 1_500_000] as const;
export const COMMUTE_RANGE = { min: 10, max: 60, step: 5 } as const;

/** Explorer filters persist in localStorage so they survive a trip to a neighborhood guide and back. */
export function useExplorerState() {
  const [raw, setRaw] = useStoredState<ExplorerState>('rr-explorer', EXPLORER_DEFAULTS);
  const state: ExplorerState = useMemo(() => {
    const s = { ...EXPLORER_DEFAULTS, ...(raw ?? {}) };
    if (!COMMUTE_EMPLOYERS.some((e) => e.id === s.employerId)) s.employerId = EXPLORER_DEFAULTS.employerId;
    if (typeof s.maxCommute !== 'number' || s.maxCommute < COMMUTE_RANGE.min || s.maxCommute > COMMUTE_RANGE.max)
      s.maxCommute = EXPLORER_DEFAULTS.maxCommute;
    if (!BUDGET_OPTIONS.includes(s.budget as (typeof BUDGET_OPTIONS)[number])) s.budget = 0;
    if (s.view !== 'map' && s.view !== 'chart') s.view = 'map';
    return s;
  }, [raw]);
  const update = (patch: Partial<ExplorerState>) => setRaw((prev) => ({ ...EXPLORER_DEFAULTS, ...prev, ...patch }));
  return [state, update] as const;
}

export type Match = { commuteOk: boolean; budgetOk: boolean; matches: boolean };

export function matchFor(n: RankedNeighborhood, s: Pick<ExplorerState, 'maxCommute' | 'budget'>): Match {
  const commuteOk = n.commute <= s.maxCommute;
  const budgetOk = s.budget === 0 || n.band.low <= s.budget;
  return { commuteOk, budgetOk, matches: commuteOk && budgetOk };
}

export function useRankedNeighborhoods(employerId: string) {
  const employer = COMMUTE_EMPLOYERS.find((e) => e.id === employerId) ?? COMMUTE_EMPLOYERS[0];
  const ranked = useMemo(() => withCommutes(employer), [employer]);
  return { employer, ranked };
}
