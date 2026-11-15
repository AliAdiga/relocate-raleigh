'use client';

import Image from 'next/image';
import { useRef } from 'react';

/** The hero render with a gentle pointer tilt. Off for touch and for reduced-motion users. */
export default function HeroHouse() {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="relative flex min-h-[300px] items-end justify-center px-4 sm:min-h-[420px] lg:min-h-0"
    >
      <div
        ref={ref}
        className="relative w-full max-w-[640px] transition-transform duration-500 ease-out will-change-transform lg:absolute lg:-bottom-[50px] lg:right-0 lg:max-w-[min(56vw,800px)]"
      >
        <Image
          src="/renders/hero-house.png"
          alt="A modern two-story home with warm interior lights and a landscaped yard"
          width={807}
          height={713}
          priority
          sizes="(min-width: 1024px) 760px, 92vw"
          className="house-settle h-auto w-full"
        />
      </div>
    </div>
  );
}
