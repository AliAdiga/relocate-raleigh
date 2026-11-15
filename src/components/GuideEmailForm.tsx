'use client';

import { useActionState, useEffect, useId } from 'react';
import { trackEvent } from '@/lib/analytics';
import { submitGuideRequest, type FormState } from '@/lib/actions';
import { IconCheck } from './ui/Icons';
import { useMoveProfile } from './MoveProfileProvider';
import { US_STATE_DATA } from '@/data/relocationStateData';

const initial: FormState = { ok: false };

/** The Figma's pill email field with a dark button, wired to the guide request action. */
export default function GuideEmailForm({ source }: { source: string }) {
  const [state, action, pending] = useActionState(submitGuideRequest, initial);
  const id = useId();
  const { origin } = useMoveProfile();

  useEffect(() => {
    if (state.ok) trackEvent('guide_signup_completed');
  }, [state.ok]);

  if (state.ok) {
    return (
      <p className="flex items-center gap-3 rounded-full bg-paper px-5 py-4 text-[0.9375rem] font-medium text-ink" role="status">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-leaf text-paper">
          <IconCheck size={16} strokeWidth={2.5} />
        </span>
        {state.message}
      </p>
    );
  }

  const error = state.fieldErrors?.email?.[0] ?? (!state.ok ? state.message : undefined);

  return (
    <form action={action} className="relative w-full max-w-[460px]" noValidate aria-busy={pending}>
      <input type="hidden" name="origin" value={`Moving from ${US_STATE_DATA[origin].name} (${source})`} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex items-center rounded-full bg-paper p-1.5 pl-5 shadow-[0_10px_30px_-20px_rgba(31,31,31,0.5)] focus-within:ring-2 focus-within:ring-ink">
        <input
          id={id}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-[0.9375rem] text-ink outline-none placeholder:text-[#8a8a8a]"
        />
        <button type="submit" disabled={pending} className="btn-ink shrink-0 px-5 py-3 text-[0.9375rem] disabled:opacity-60 sm:px-6">
          {pending ? 'Sending…' : 'Email me the guide'}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 pl-5 text-sm text-[#b42318]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
