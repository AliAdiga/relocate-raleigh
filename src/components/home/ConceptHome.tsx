'use client';

import Image from 'next/image';
import { useEffect, useReducer, useRef } from 'react';
import { CONCEPT_HOME, ROOMS, type RoomId } from '@/data/conceptHome';
import { trackEvent } from '@/lib/analytics';
import { useReducedMotion } from '@/lib/usePlaybackConditions';
import { useContactModal } from '../ContactModalProvider';
import RoomPreview from './RoomPreview';
import { IconArrowRight } from '../ui/Icons';

/*
 * Explicit interaction model:
 *   exterior --EXPLORE--> revealing --REVEAL_END | SKIP | REVEAL_FAIL--> cutaway
 *   exterior --EXPLORE (reduced motion) / SELECT--> cutaway
 *   cutaway  --SELECT--> cutaway + room   --CLOSE_ROOM--> cutaway
 *   cutaway  --RESET--> exterior
 * `videoShowing` only tracks whether reveal frames are visible yet (the poster stays until then).
 */
type Phase = 'exterior' | 'revealing' | 'cutaway';
type State = { phase: Phase; room: RoomId | null; videoShowing: boolean; viewed: RoomId[] };
type Action =
  | { type: 'EXPLORE'; reduced: boolean }
  | { type: 'REVEAL_PLAYING' }
  | { type: 'REVEAL_END' }
  | { type: 'SKIP' }
  | { type: 'REVEAL_FAIL' }
  | { type: 'SELECT'; room: RoomId }
  | { type: 'CLOSE_ROOM' }
  | { type: 'RESET' };

const initial: State = { phase: 'exterior', room: null, videoShowing: false, viewed: [] };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'EXPLORE':
      if (s.phase !== 'exterior') return s; // ignore repeated clicks
      return a.reduced ? { ...s, phase: 'cutaway' } : { ...s, phase: 'revealing', videoShowing: false };
    case 'REVEAL_PLAYING':
      return s.phase === 'revealing' ? { ...s, videoShowing: true } : s;
    case 'REVEAL_END':
    case 'SKIP':
    case 'REVEAL_FAIL':
      return s.phase === 'revealing' ? { ...s, phase: 'cutaway', videoShowing: false } : s;
    case 'SELECT':
      return {
        ...s,
        phase: 'cutaway',
        videoShowing: false,
        room: a.room,
        viewed: s.viewed.includes(a.room) ? s.viewed : [...s.viewed, a.room],
      };
    case 'CLOSE_ROOM':
      return { ...s, room: null };
    case 'RESET':
      return { ...initial, viewed: s.viewed };
  }
}

const { exterior, cutaway, revealVideo, aspect } = CONCEPT_HOME;

export default function ConceptHome() {
  const [s, dispatch] = useReducer(reducer, initial);
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { open } = useContactModal();

  // Start the reveal once the <video> mounts; never let a stalled load trap the visitor.
  useEffect(() => {
    if (s.phase !== 'revealing') return;
    const v = videoRef.current;
    v?.play().catch(() => dispatch({ type: 'REVEAL_FAIL' }));
    const t = window.setTimeout(() => dispatch({ type: 'REVEAL_FAIL' }), 6000);
    const clear = () => window.clearTimeout(t);
    v?.addEventListener('playing', clear, { once: true });
    return () => {
      clear();
      v?.removeEventListener('playing', clear);
    };
  }, [s.phase]);

  // When the cutaway appears from an explicit action, move focus to the first room control so
  // keyboard users land somewhere useful (not on a button that no longer exists).
  const prevPhase = useRef<Phase>(s.phase);
  useEffect(() => {
    if (prevPhase.current === 'revealing' && s.phase === 'cutaway') {
      stageRef.current?.querySelector<HTMLElement>('[data-hotspot]')?.focus({ preventScroll: true });
    }
    prevPhase.current = s.phase;
  }, [s.phase]);

  const explore = () => {
    trackEvent('home_explorer_opened');
    dispatch({ type: 'EXPLORE', reduced });
  };
  const select = (room: RoomId, el: HTMLElement) => {
    triggerRef.current = el;
    trackEvent('room_selected', { room });
    dispatch({ type: 'SELECT', room });
  };
  const closeRoom = () => {
    dispatch({ type: 'CLOSE_ROOM' });
    const el = triggerRef.current;
    if (el && document.contains(el)) requestAnimationFrame(() => el.focus());
  };

  const discuss = () => {
    const names = ROOMS.filter((r) => s.viewed.includes(r.id)).map((r) => r.name.toLowerCase());
    open('contact', {
      contextLabel: 'Housing priorities (included with your request)',
      context: names.length
        ? `Spaces that matter to us: ${names.join(', ')}.\n(From the illustrative home on your site, not a specific listing.)`
        : 'I’d like to talk through what we need in a home.',
    });
  };

  // Once reveal frames are showing, the final cutaway sits ready underneath the video, so the
  // hand-off at the end (the cutaway still IS the video's last frame) has no flash.
  const cutawayOn = s.phase === 'cutaway' || (s.phase === 'revealing' && s.videoShowing);
  const exteriorOn = !cutawayOn;
  const room = ROOMS.find((r) => r.id === s.room) ?? null;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-10">
        {/* Stage: same 16:9 coordinate system for images, video and hotspots */}
        <div>
          <div
            ref={stageRef}
            className="relative overflow-hidden rounded-[var(--radius-panel)] bg-[#f6ece4]"
            style={{ aspectRatio: `${aspect.w} / ${aspect.h}` }}
          >
            <Image
              src={exterior.still.src}
              alt={exteriorOn ? exterior.alt : ''}
              fill
              sizes="(min-width: 1024px) 860px, 100vw"
              className={`object-contain transition-opacity duration-500 ${exteriorOn ? 'opacity-100' : 'opacity-0'}`}
            />
            <Image
              src={cutaway.still.src}
              alt={cutawayOn ? cutaway.alt : ''}
              fill
              sizes="(min-width: 1024px) 860px, 100vw"
              className={`object-contain transition-opacity duration-500 ${cutawayOn ? 'opacity-100' : 'opacity-0'}`}
            />
            {s.phase === 'revealing' && (
              <video
                ref={videoRef}
                src={revealVideo}
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                tabIndex={-1}
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${s.videoShowing ? 'opacity-100' : 'opacity-0'}`}
                onPlaying={() => dispatch({ type: 'REVEAL_PLAYING' })}
                onEnded={() => dispatch({ type: 'REVEAL_END' })}
                onError={() => dispatch({ type: 'REVEAL_FAIL' })}
              />
            )}

            {/* Hotspots: only the three rooms with content, only once the cutaway is showing */}
            {s.phase === 'cutaway' &&
              ROOMS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  data-hotspot
                  onClick={(e) => select(r.id, e.currentTarget)}
                  aria-label={`Preview the ${r.name.toLowerCase()}`}
                  aria-haspopup="dialog"
                  aria-pressed={s.room === r.id}
                  className="group absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2 rounded-full outline-none"
                  style={{ left: `${r.hotspot.x}%`, top: `${r.hotspot.y}%` }}
                >
                  <span
                    aria-hidden
                    className={`h-4 w-4 rounded-full bg-ember ring-[3px] ring-paper shadow-[0_0_0_5px_rgba(31,31,31,0.18)] transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125 group-focus-visible:shadow-[0_0_0_5px_#3741B5] ${
                      s.room === r.id ? 'scale-125 shadow-[0_0_0_5px_#1F1F1F]' : ''
                    }`}
                  />
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-full mt-0.5 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/85 px-2.5 py-1 text-xs font-medium text-paper sm:block"
                  >
                    {r.name}
                  </span>
                </button>
              ))}

            {/* Stage controls */}
            {s.phase === 'exterior' && (
              <div className="absolute inset-x-0 bottom-0 hidden justify-center bg-gradient-to-t from-ink/25 to-transparent p-6 sm:flex">
                <button type="button" onClick={explore} className="btn-ink px-6 py-3.5 text-[0.9375rem]">
                  Explore the home
                </button>
              </div>
            )}
            {s.phase === 'revealing' && (
              <div className="absolute bottom-3 right-3 flex items-center gap-3">
                <span className="sr-only" role="status">
                  Revealing the floor plan
                </span>
                <button type="button" onClick={() => dispatch({ type: 'SKIP' })} className="inline-flex h-11 items-center rounded-full bg-paper/90 px-4 text-sm font-medium text-ink shadow hover:bg-paper">
                  Skip animation
                </button>
              </div>
            )}
            {s.phase === 'cutaway' && (
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESET' })}
                className="absolute right-3 top-3 inline-flex h-10 items-center rounded-full bg-paper/90 px-4 text-xs font-medium text-ink shadow hover:bg-paper"
              >
                Show the exterior
              </button>
            )}
          </div>
          {s.phase === 'exterior' && (
            <button type="button" onClick={explore} className="btn-ink mt-4 w-full px-6 py-3.5 text-[0.9375rem] sm:hidden">
              Explore the home
            </button>
          )}
          <p className="mt-3 text-sm text-ink-soft">
            <span className="font-medium text-ink">Illustrative home—not an available listing.</span>{' '}
            {s.phase === 'cutaway' ? 'Select a marked room, or use the list.' : 'Explore it, or jump straight to a room.'}
          </p>
        </div>

        {/* The same functionality as a plain list, usable without the animation or the image */}
        <nav aria-label="Rooms in the illustrative home">
          <h3 className="text-sm font-medium text-ink-soft">Rooms to preview</h3>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {ROOMS.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={(e) => select(r.id, e.currentTarget)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span>
                    <span className="flex items-center gap-2 font-semibold text-ink">
                      <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${s.viewed.includes(r.id) ? 'bg-ember' : 'border-2 border-ink/30'}`} />
                      {r.name}
                    </span>
                    <span className="mt-1 block pl-[18px] text-sm leading-relaxed text-ink-soft">{r.description}</span>
                  </span>
                  <IconArrowRight size={18} className="shrink-0 text-ink-soft" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Lead back into the real service */}
      <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
        <a href="#neighborhoods" className="btn-ink px-7 py-4 text-[0.9375rem]">
          Explore neighborhoods
        </a>
        <button type="button" onClick={discuss} className="btn-outline px-7 py-4 text-[0.9375rem]">
          Discuss your housing priorities with Nick
        </button>
      </div>

      {room && <RoomPreview room={room} reduced={reduced} onClose={closeRoom} />}
    </div>
  );
}
