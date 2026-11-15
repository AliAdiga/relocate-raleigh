'use client'

import { useActionState, useEffect } from 'react'
import {
  submitGuideRequest,
  submitContactMessage,
  type FormState,
} from '@/lib/actions'
import type { ModalVariant } from './ContactModalProvider'
import { IconCheck, IconClose } from './ui/Icons'

const initialState: FormState = { ok: false }

export default function ContactModal({
  variant,
  defaultMessage,
  onClose,
}: {
  variant: ModalVariant
  defaultMessage?: string
  onClose: () => void
}) {
  const action = variant === 'guide' ? submitGuideRequest : submitContactMessage
  const [state, formAction, pending] = useActionState(action, initialState)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const title = variant === 'guide' ? 'Get the relocation guide' : 'Talk to Nick'
  const subtitle =
    variant === 'guide'
      ? "We'll email you the PDF. No spam, and you can unsubscribe anytime."
      : "Tell Nick a bit about what you're planning. He'll reply within a day or two."

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-panel)] bg-paper p-6 shadow-[0_30px_80px_-30px_rgba(31,31,31,0.5)] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6 gap-6">
          <div>
            <h3 id="contact-modal-title" className="text-xl font-semibold tracking-tight text-ink">
              {title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 -mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-fog hover:text-ink"
            aria-label="Close"
          >
            <IconClose size={20} />
          </button>
        </div>

        {state.ok ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-leaf text-paper">
              <IconCheck size={28} strokeWidth={2.5} />
            </div>
            <p className="mb-2 text-lg font-semibold text-ink">Got it.</p>
            <p className="mb-8 text-sm text-ink-soft">{state.message}</p>
            <button
              onClick={onClose}
              className="btn-outline px-8 py-3"
            >
              Close
            </button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <Field
              label="Your name"
              name="name"
              type="text"
              required
              errors={state.fieldErrors?.name}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              errors={state.fieldErrors?.email}
            />

            {variant === 'guide' ? (
              <Field
                label="Where are you moving from? (optional)"
                name="origin"
                type="text"
                placeholder="e.g. San Francisco, Seattle, NYC"
              />
            ) : (
              <>
                <SelectField
                  label="Timeline"
                  name="timeline"
                  options={[
                    { value: '', label: 'When are you hoping to move?' },
                    { value: 'exploring', label: 'Just exploring' },
                    { value: '3-6mo', label: 'Planning in 3–6 months' },
                    { value: 'actively', label: 'Actively looking' },
                  ]}
                />
                <TextareaField
                  label="Message"
                  name="message"
                  required
                  rows={defaultMessage ? 8 : 5}
                  defaultValue={defaultMessage}
                  errors={state.fieldErrors?.message}
                />
              </>
            )}

            {state.message && !state.ok && (
              <p className="text-sm font-medium text-[#b42318]" aria-live="polite">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="btn-ink w-full px-8 py-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending
                ? 'Sending...'
                : variant === 'guide'
                  ? 'Send me the guide'
                  : 'Send message'}
            </button>
            {variant !== 'guide' && (
              <p className="pt-2 text-center text-sm text-ink-soft">
                Or call Nick at{' '}
                <a
                  href="tel:+13477579850"
                  className="font-semibold text-ink underline underline-offset-4"
                >
                  (347) 757-9850
                </a>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

const fieldClass = 'field'

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  errors,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  errors?: string[]
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={fieldClass}
      />
      {errors?.[0] && <span className="mt-1.5 block text-xs text-[#b42318]">{errors[0]}</span>}
    </label>
  )
}

function TextareaField({
  label,
  name,
  required,
  rows,
  defaultValue,
  errors,
}: {
  label: string
  name: string
  required?: boolean
  rows?: number
  defaultValue?: string
  errors?: string[]
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">
        {label}
      </span>
      <textarea name={name} required={required} rows={rows} defaultValue={defaultValue} className={fieldClass} />
      {errors?.[0] && <span className="mt-1.5 block text-xs text-[#b42318]">{errors[0]}</span>}
    </label>
  )
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string
  name: string
  options: { value: string; label: string }[]
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">
        {label}
      </span>
      <select name={name} defaultValue="" className={fieldClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
