'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CONCEPT_HOME } from '@/data/conceptHome';
import { useActiveOnScreen, useReducedMotion, useSaveData } from '@/lib/usePlaybackConditions';

const { hero } = CONCEPT_HOME;

// Feather all four edges so the render dissolves into the hero background (inline because the CSS
// pipeline drops multi-layer mask declarations from the global stylesheet).
const EDGES =
  'linear-gradient(to right, transparent 0, #000 16%, #000 95%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 14%, #000 93%, transparent 100%)';
const FEATHER = {
  WebkitMaskImage: EDGES,
  WebkitMaskComposite: 'source-in',
  maskImage: EDGES,
  maskComposite: 'intersect',
} as const;

/**
 * Architectural hero: the still renders immediately (and stays as the fallback); the ambient loop
 * gets its source only once the hero is on screen, motion is allowed and Data Saver is off (or the
 * visitor presses Play). hero-ambient.mp4 is a crossfaded seamless loop (see
 * scripts/prepare-relocation-media.sh), so `loop` is safe.
 */
export default function HeroMedia() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const saveData = useSaveData();
  const active = useActiveOnScreen(wrapRef);
  const [manualStart, setManualStart] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);

  const allowed = !reduced && !failed;
  const started = allowed && (manualStart || !saveData);

  // Sync the <video> element with the conditions: attach the source lazily, play only while
  // on screen in a visible tab, pause otherwise.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (started && active && !userPaused) {
      if (!v.getAttribute('src')) v.src = hero.video;
      v.play().catch((err: DOMException) => {
        // Only a real autoplay refusal stops us; AbortError just means a pause interrupted play().
        if (err?.name === 'NotAllowedError') setUserPaused(true);
      });
    } else if (v.getAttribute('src')) {
      v.pause();
    }
  }, [started, active, userPaused]);

  const toggle = () => {
    if (!started) {
      setManualStart(true);
      setUserPaused(false);
    } else {
      setUserPaused((p) => !p);
    }
  };

  const playing = started && visible && !userPaused;

  return (
    // Phones: a 4:3 frame cropped toward the house (the render keeps empty space on its left).
    // Wider screens: the full 16:9 composition, uncropped.
    <div ref={wrapRef} className="relative aspect-[4/3] w-full sm:aspect-[1672/941]">
      {/* Soft edge mask so the render melts into the hero background instead of sitting in a box */}
      <div className="absolute inset-0" style={FEATHER}>
        <Image src={hero.still.src} alt={hero.alt} fill priority sizes="(min-width: 1024px) 760px, 100vw" className="object-cover object-[80%_62%] sm:object-contain" />
        {allowed && (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover object-[80%_62%] transition-opacity sm:object-contain duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setVisible(true)}
            onError={() => {
              if (videoRef.current?.getAttribute('src')) {
                setFailed(true);
                setVisible(false);
              }
            }}
          />
        )}
      </div>
      <p className="absolute bottom-2 left-2 text-xs text-ink-soft sm:left-4">Illustrative home, not a listing</p>
      {allowed && (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={!playing}
          className="absolute bottom-0 right-1 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-paper/85 px-3 text-xs font-medium text-ink shadow-[0_6px_18px_-10px_rgba(31,31,31,0.5)] backdrop-blur hover:bg-paper sm:right-3 sm:px-3.5"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <rect x="2" y="1.5" width="2.6" height="9" rx="0.8" fill="currentColor" />
              <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.8" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M3 1.8v8.4c0 .5.5.8.9.5l6.3-4.2a.6.6 0 0 0 0-1L3.9 1.3c-.4-.3-.9 0-.9.5Z" fill="currentColor" />
            </svg>
          )}
          <span className="sr-only sm:not-sr-only">{playing ? 'Pause animation' : 'Play animation'}</span>
        </button>
      )}
    </div>
  );
}
