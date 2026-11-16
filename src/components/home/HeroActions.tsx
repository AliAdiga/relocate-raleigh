'use client';

import { trackEvent } from '@/lib/analytics';
import { IconArrowDown, IconArrowRight } from '../ui/Icons';

export default function HeroActions() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <a
          href="#neighborhoods"
          onClick={() => trackEvent('hero_cta_clicked', { action: 'explore' })}
          className="btn-ink gap-2 px-6 py-4 text-[0.9375rem]"
        >
          Explore neighborhoods
          <IconArrowRight size={18} />
        </a>
        <a
          href="#journey"
          onClick={() => trackEvent('hero_cta_clicked', { action: 'how_it_works' })}
          className="group inline-flex items-center gap-3 text-[0.9375rem] font-medium text-ink"
        >
          {/* Scrolls to the journey section on this page, so an arrow (not a play symbol) */}
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 bg-paper/60 transition-[border-color,transform] group-hover:translate-y-0.5 group-hover:border-ink motion-reduce:group-hover:translate-y-0">
            <IconArrowDown size={18} />
          </span>
          See how it works
        </a>
      </div>
      <a
        href="#guide"
        onClick={() => trackEvent('hero_cta_clicked', { action: 'guide' })}
        className="inline-block text-sm font-medium text-ink underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink"
      >
        Get the free relocation guide
      </a>
    </div>
  );
}
