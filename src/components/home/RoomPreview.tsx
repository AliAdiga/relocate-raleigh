'use client';

import Image from 'next/image';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { Room } from '@/data/conceptHome';
import { IconClose } from '../ui/Icons';

type Playback = 'idle' | 'playing' | 'paused' | 'ended' | 'failed';

/**
 * Room preview dialog. The still shows immediately; only this room's video loads, plays once
 * (not looped), and is torn down when the dialog closes. Reduced-motion visitors get the still
 * with an optional Play button.
 */
export default function RoomPreview({ room, reduced, onClose }: { room: Room; reduced: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playback, setPlayback] = useState<Playback>('idle');
  const [frames, setFrames] = useState(false); // video frames visible (crossfade from the still)
  const [wantPlay, setWantPlay] = useState(!reduced);

  const requestClose = useEffectEvent(() => onClose());

  // Dialog mechanics: scroll lock, initial focus, Escape, focus containment. Runs once per open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('[data-initial-focus]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const f = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')];
      if (!f.length) return;
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault();
        f[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Start or stop this room's video. The element is removed when the dialog closes, which also
  // stops any download in progress.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !wantPlay) return;
    v.play().catch(() => setPlayback('failed'));
  }, [wantPlay, room.id]);

  const pause = () => {
    videoRef.current?.pause();
  };
  const resume = () => {
    if (!wantPlay) setWantPlay(true);
    else videoRef.current?.play().catch(() => setPlayback('failed'));
  };
  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => setPlayback('failed'));
  };

  return (
    <div className="fixed inset-0 z-[96] flex items-end justify-center bg-ink/50 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-title"
        aria-describedby="room-desc"
        className="room-enter flex max-h-[94vh] w-full max-w-4xl flex-col overflow-y-auto rounded-t-[var(--radius-panel)] bg-paper sm:rounded-[var(--radius-panel)]"
      >
        <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-4 sm:px-7 sm:pt-5">
          <div>
            <p className="text-xs text-ink-soft">Illustrative home, not a listing</p>
            <h3 id="room-title" className="t-card">
              {room.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-fog"
            aria-label={`Close the ${room.name.toLowerCase()} preview`}
          >
            <IconClose size={20} />
          </button>
        </div>

        <div className="relative mx-3 overflow-hidden rounded-[var(--radius-card)] bg-[#efe3d6] sm:mx-5" style={{ aspectRatio: `${room.still.width} / ${room.still.height}` }}>
          <Image src={room.still.src} alt={room.alt} fill priority sizes="(min-width: 900px) 860px, 100vw" className="object-cover" />
          {playback !== 'failed' && wantPlay && (
            <video
              ref={videoRef}
              src={room.video}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${frames ? 'opacity-100' : 'opacity-0'}`}
              onPlaying={() => {
                setFrames(true);
                setPlayback('playing');
              }}
              onPause={() => setPlayback((p) => (p === 'ended' ? p : 'paused'))}
              onEnded={() => setPlayback('ended')}
              onError={() => setPlayback('failed')}
            />
          )}
        </div>

        <div className="flex flex-col gap-5 px-5 pb-5 pt-4 sm:flex-row sm:items-start sm:justify-between sm:px-7 sm:pb-7">
          <p id="room-desc" className="max-w-[520px] text-base leading-relaxed text-ink">
            {room.description}
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            {playback !== 'failed' &&
              (playback === 'playing' ? (
                <button type="button" onClick={pause} className="btn-outline h-11 px-5 text-sm">
                  Pause
                </button>
              ) : playback === 'ended' ? (
                <button type="button" onClick={replay} className="btn-outline h-11 px-5 text-sm">
                  Replay
                </button>
              ) : (
                <button type="button" onClick={resume} className="btn-outline h-11 px-5 text-sm">
                  {wantPlay ? 'Play' : 'Play preview'}
                </button>
              ))}
            <button type="button" data-initial-focus onClick={onClose} className="btn-ink h-11 px-5 text-sm">
              Back to layout
            </button>
          </div>
        </div>
        <span className="sr-only" role="status">
          {playback === 'playing' ? 'Preview playing' : playback === 'ended' ? 'Preview finished' : playback === 'failed' ? 'Video unavailable, showing a still image' : ''}
        </span>
      </div>
    </div>
  );
}
