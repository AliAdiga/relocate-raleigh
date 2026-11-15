'use client'

import { useActionState, useEffect, useRef } from 'react'
import { submitGuideRequest, submitContactMessage, type FormState } from '@/lib/actions'
import type { ModalOptions, ModalVariant } from './ContactModalProvider'
import { useMoveProfile } from './MoveProfileProvider'
import { US_STATE_DATA } from '@/data/relocationStateData'
import { IconCheck, IconClose } from './ui/Icons'
import { trackEvent } from '@/lib/analytics'

const initialState: FormState = { ok: false }

const COPY = {
  contact: {
    title: 'Request a relocation call',
    subtitle: 'Tell Nick where you are in the process. He usually replies within a day or two to suggest a time for a free, no-pressure call.',
    submit: 'Send request',
  },
  guide: {
    title: 'Get the free relocation guide',
    subtitle: 'We’ll email you the PDF: neighborhoods, schools, money, a scouting plan and your first 90 days.',
    submit: 'Email me the guide',
  },
} as const

export default function ContactModal({
  variant,
  options,
  onClose,
}: {
  variant: ModalVariant
  options: ModalOptions
  onClose: () => void
}) {
  const action = variant === 'guide' ? submitGuideRequest : submitContactMessage
  const [state, formAction, pending] = useActionState(action, initialState)
  const dialogRef = useRef<HTMLDivElement>(null)
  const { origin } = useMoveProfile()
  const copy = COPY[variant]

  // Body scroll lock, Escape to close, and a focus trap.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([type=hidden]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useEffect(() => {
    if (state.ok) {
      trackEvent(variant === 'guide' ? 'guide_signup_completed' : 'contact_submitted')
      dialogRef.current?.querySelector<HTMLElement>('[data-success-focus]')?.focus()
    }
  }, [state.ok, variant])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/45 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        aria-describedby="contact-modal-desc"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[var(--radius-panel)] bg-paper p-6 shadow-[0_30px_80px_-30px_rgba(31,31,31,0.5)] sm:max-w-lg sm:rounded-[var(--radius-panel)] sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <h2 id="contact-modal-title" className="text-xl font-semibold tracking-tight text-ink">
              {copy.title}
            </h2>
            <p id="contact-modal-desc" className="mt-2 text-sm leading-relaxed text-ink-soft">
              {copy.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-fog hover:text-ink"
            aria-label="Close"
          >
            <IconClose size={20} />
          </button>
        </div>

        {state.ok ? (
          <div className="py-8 text-center" role="status">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
              <IconCheck size={28} strokeWidth={2.5} />
            </div>
            <p className="mb-8 text-base text-ink">{state.message}</p>
            <button type="button" data-success-focus onClick={onClose} className="btn-outline px-8 py-3">
              Close
            </button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4" noValidate>
            {/* Spam trap: hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Company website
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <Field
              label={variant === 'guide' ? 'First name (optional)' : 'Your name'}
              name="name"
              autoComplete={variant === 'guide' ? 'given-name' : 'name'}
              required={variant !== 'guide'}
              autoFocus
              errors={state.fieldErrors?.name}
            />
            <Field label="Email" name="email" type="email" autoComplete="email" required errors={state.fieldErrors?.email} />

            {variant === 'guide' ? (
              <input type="hidden" name="origin" value={`Moving from ${US_STATE_DATA[origin].name} (guide dialog)`} />
            ) : (
              <>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-ink">Moving timeline</span>
                  <select name="timeline" defaultValue="" className="field">
                    <option value="">Choose one (optional)</option>
                    <option value="Still deciding whether to move">Still deciding whether to move</option>
                    <option value="Within 6 months">Within 6 months</option>
                    <option value="6 to 12 months">6 to 12 months</option>
                    <option value="More than a year">More than a year</option>
                  </select>
                </label>
                <TextArea label="Message (optional)" name="message" rows={4} errors={state.fieldErrors?.message} />
                {options.context && (
                  <TextArea
                    label={options.contextLabel ?? 'Details to include'}
                    hint="This is what will be sent along with your request. Edit or clear it as you like."
                    name="context"
                    rows={6}
                    defaultValue={options.context}
                    errors={state.fieldErrors?.context}
                  />
                )}
              </>
            )}

            {state.message && !state.ok && (
              <p className="rounded-xl bg-[#fdecea] px-4 py-3 text-sm font-medium text-[#8c1d18]" role="alert">
                {state.message}
              </p>
            )}

            <button type="submit" disabled={pending} aria-busy={pending} className="btn-ink w-full px-8 py-4 disabled:cursor-wait disabled:opacity-60">
              {pending ? 'Sending…' : copy.submit}
            </button>
            <p className="text-center text-xs leading-relaxed text-ink-soft">
              {variant === 'guide'
                ? 'We use your email to send the guide and an occasional follow-up. No spam, and you can opt out any time.'
                : 'Your details go only to Nick and his team. Prefer the phone? '}
              {variant === 'contact' && (
                <a href="tel:+13477579850" className="font-semibold text-ink underline underline-offset-4">
                  (347) 757-9850
                </a>
              )}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  autoFocus,
  errors,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  autoFocus?: boolean
  errors?: string[]
}) {
  const id = `f-${name}`
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-invalid={Boolean(errors?.[0])}
        aria-describedby={errors?.[0] ? `${id}-err` : undefined}
        className="field"
      />
      {errors?.[0] && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-[#8c1d18]">
          {errors[0]}
        </p>
      )}
    </div>
  )
}

function TextArea({
  label,
  name,
  rows,
  hint,
  defaultValue,
  errors,
}: {
  label: string
  name: string
  rows?: number
  hint?: string
  defaultValue?: string
  errors?: string[]
}) {
  const id = `f-${name}`
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="-mt-1 mb-2 text-xs text-ink-soft">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        aria-invalid={Boolean(errors?.[0])}
        aria-describedby={[hint ? `${id}-hint` : '', errors?.[0] ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined}
        className="field"
      />
      {errors?.[0] && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-[#8c1d18]">
          {errors[0]}
        </p>
      )}
    </div>
  )
}
