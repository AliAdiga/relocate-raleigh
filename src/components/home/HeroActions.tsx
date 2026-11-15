'use client';

import { trackEvent } from '@/lib/analytics';
import { IconArrowRight } from '../ui/Icons';

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
          href="#home"
          onClick={() => trackEvent('hero_cta_clicked', { action: 'explore_home' })}
          className="group inline-flex items-center gap-3 text-[0.9375rem] font-medium text-ink"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 bg-paper/60 transition-colors group-hover:border-ink">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M3 1.8v8.4c0 .5.5.8.9.5l6.3-4.2a.6.6 0 0 0 0-1L3.9 1.3c-.4-.3-.9 0-.9.5Z" fill="currentColor" />
            </svg>
          </span>
          Explore the home
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
