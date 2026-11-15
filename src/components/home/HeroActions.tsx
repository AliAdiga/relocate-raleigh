'use client';

import { trackEvent } from '@/lib/analytics';
import { useContactModal } from '../ContactModalProvider';

export default function HeroActions() {
  const { open } = useContactModal();
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
      <a
        href="#neighborhoods"
        onClick={() => trackEvent('hero_cta_clicked', { action: 'explore' })}
        className="btn-ink px-7 py-4 text-[0.9375rem]"
      >
        Explore neighborhoods
      </a>
      <button
        type="button"
        onClick={() => {
          trackEvent('hero_cta_clicked', { action: 'request_call' });
          open('contact');
        }}
        className="btn-outline px-7 py-4 text-[0.9375rem]"
      >
        Request a relocation call
      </button>
      <a
        href="#guide"
        onClick={() => trackEvent('hero_cta_clicked', { action: 'guide' })}
        className="text-center text-[0.9375rem] font-medium text-ink underline decoration-ink/25 underline-offset-[6px] hover:decoration-ink sm:text-left"
      >
        Get the free relocation guide
      </a>
    </div>
  );
}
