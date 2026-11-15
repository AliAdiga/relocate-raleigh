'use client';

import { useEffect, useState, useSyncExternalStore, type RefObject } from 'react';

const RM = '(prefers-reduced-motion: reduce)';

/** True when the visitor asks for reduced motion. Server render assumes motion is allowed. */
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(RM);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    () => window.matchMedia(RM).matches,
    () => false,
  );
}

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };

/** True when the browser reports Data Saver or a 2G-class connection (where detectable). */
export function useSaveData() {
  return useSyncExternalStore(
    () => () => {},
    () => {
      const c = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
      return Boolean(c?.saveData) || /(^|-)2g$/.test(c?.effectiveType ?? '');
    },
    () => false,
  );
}

/** True while the element is at least partly on screen and the browser tab is visible. */
export function useActiveOnScreen(ref: RefObject<HTMLElement | null>, rootMargin = '0px') {
  const [onScreen, setOnScreen] = useState(false);
  const pageVisible = useSyncExternalStore(
    (cb) => {
      document.addEventListener('visibilitychange', cb);
      return () => document.removeEventListener('visibilitychange', cb);
    },
    () => document.visibilityState === 'visible',
    () => true,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return onScreen && pageVisible;
}
