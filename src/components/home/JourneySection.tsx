'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PHOTOS, type PhotoKey } from '@/data/photos';

const STAGES: { key: 'work' | 'home' | 'life'; label: string; title: string; body: string; photo: PhotoKey }[] = [
  {
    key: 'work',
    label: 'Work',
    title: 'Start from where you’ll work',
    body: 'Most Triangle tech jobs cluster around RTP, Durham, Morrisville and downtown Raleigh. Your office (or how often you go in) shapes everything else.',
    photo: 'raleigh-skyline',
  },
  {
    key: 'home',
    label: 'Home',
    title: 'Find homes within a commute you’ll accept',
    body: 'A 15-minute and a 45-minute drive lead to very different neighborhoods, prices and school options. Set your limit and compare honestly.',
    photo: 'oakwood-home',
  },
  {
    key: 'life',
    label: 'Everyday life',
    title: 'Check the life around it',
    body: 'Parks, groceries, libraries and the routines that make a place feel like home: weekend trails, a nearby market, a library card.',
    photo: 'umstead-trail',
  },
];

/** Node positions in the abstract diagram (viewBox 400 x 360). */
const P = { work: [62, 296], home: [338, 296], life: [200, 64] } as const;

function Diagram({ stage, compact = false }: { stage: number; compact?: boolean }) {
  const seg = (x1: number, y1: number, x2: number, y2: number, on: boolean, key: string) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    return (
      <line
        key={key}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={on ? 0 : len}
        style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    );
  };
  const node = (k: keyof typeof P, on: boolean, label: string, destination = false) => {
    const [x, y] = P[k];
    const below = k !== 'life';
    return (
      <g key={k} style={{ opacity: on ? 1 : 0.18, transition: 'opacity 0.45s ease' }}>
        <circle cx={x} cy={y} r={destination ? 15 : 12} fill={destination && on ? '#FF791A' : '#1F1F1F'} stroke="#F4EFE7" strokeWidth="5" />
        <text x={x} y={below ? y + 40 : y - 28} textAnchor="middle" fontSize={compact ? 22 : 17} fontWeight={600} fill="#1F1F1F">
          {label}
        </text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 400 360" className="h-auto w-full" role="img" aria-label="Diagram: work, home and everyday life connected as a triangle. Not a map.">
      <path d="M200 64 338 296H62L200 64Z" fill="none" stroke="#1F1F1F" strokeOpacity="0.06" strokeWidth="2" strokeDasharray="4 6" />
      {seg(P.work[0], P.work[1], P.home[0], P.home[1], stage >= 2, 'wh')}
      {seg(P.home[0], P.home[1], P.life[0], P.life[1], stage >= 3, 'hl')}
      {seg(P.life[0], P.life[1], P.work[0], P.work[1], stage >= 3, 'lw')}
      {node('work', stage >= 1, 'Work')}
      {node('life', stage >= 3, 'Everyday life')}
      {node('home', stage >= 2, 'Home', true)}
    </svg>
  );
}

const RM = '(prefers-reduced-motion: reduce)';
function useReducedMotion() {
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

export default function JourneySection() {
  const [scrolledStage, setStage] = useState(1);
  const reduced = useReducedMotion();
  // Reduced motion: show the finished diagram straight away.
  const stage = reduced ? 3 : scrolledStage;
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.stage);
          setStage((s) => Math.max(s, i + 1));
        }
      },
      { rootMargin: '-40% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="journey" aria-labelledby="journey-title" className="bp-grid section-y bg-sand">
      <div className="shell">
        <div className="max-w-[720px]" data-reveal>
          <h2 id="journey-title" className="t-section text-ink">
            Connect your work, home and everyday life.
          </h2>
          <p className="lead mt-4 text-ink-soft">
            A good move balances three points. Get one wrong and the other two feel it every day.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          {/* Desktop: sticky diagram that builds as the stages pass */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="rounded-[var(--radius-panel)] border border-ink/10 p-10">
                <Diagram stage={stage} />
              </div>
              <p className="mt-3 text-sm text-ink-soft">An abstract diagram of how the pieces connect, not a map.</p>
            </div>
          </div>

          <ol className="space-y-12 lg:space-y-0">
            {STAGES.map((s, i) => {
              const photo = PHOTOS[s.photo];
              return (
                <li
                  key={s.key}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-stage={i}
                  className="lg:flex lg:min-h-[46vh] lg:items-center lg:py-6"
                >
                  <article className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center lg:grid-cols-1">
                    <div className="relative overflow-hidden rounded-[var(--radius-card)]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        sizes="(min-width: 1024px) 560px, (min-width: 640px) 45vw, 92vw"
                        className={`aspect-[16/10] h-auto w-full object-cover ${s.photo === 'raleigh-skyline' ? 'object-[50%_78%]' : ''}`}
                      />
                      <span className="absolute bottom-2.5 left-2.5 rounded-full bg-paper/90 px-3 py-1 text-xs text-ink-soft">{photo.place}</span>
                    </div>
                    <div>
                      <p className="flex items-center gap-2.5 text-sm font-medium text-ink-soft">
                        <span aria-hidden className={`h-3 w-3 rounded-full ${s.key === 'home' ? 'bg-ember' : 'bg-ink'}`} />
                        {i + 1}. {s.label}
                      </p>
                      <h3 className="t-card mt-2 text-ink">{s.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-ink-soft">{s.body}</p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:mt-4 lg:justify-end">
          <p className="text-base text-ink-soft">See which neighborhoods fit your commute.</p>
          <a href="#neighborhoods" className="btn-ink px-7 py-4 text-[0.9375rem]">
            Open the neighborhood explorer
          </a>
        </div>
      </div>
    </section>
  );
}
