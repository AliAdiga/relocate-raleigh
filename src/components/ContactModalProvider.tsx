'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import ContactModal from './ContactModal'

export type ModalVariant = 'guide' | 'contact'
/** `context` is shown to the visitor, editable, and only sent if they keep it. */
export type ModalOptions = { context?: string; contextLabel?: string }

type Ctx = {
  open: (variant: ModalVariant, options?: ModalOptions) => void
  close: () => void
}

const ModalCtx = createContext<Ctx | null>(null)

export function useContactModal() {
  const ctx = useContext(ModalCtx)
  if (!ctx) throw new Error('useContactModal must be used inside <ContactModalProvider>')
  return ctx
}

export default function ContactModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ variant: ModalVariant; options: ModalOptions } | null>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const open = useCallback((variant: ModalVariant, options: ModalOptions = {}) => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setState({ variant, options })
  }, [])

  const close = useCallback(() => {
    setState(null)
    const el = returnFocus.current
    if (el && document.contains(el)) requestAnimationFrame(() => el.focus())
  }, [])

  const value = useMemo(() => ({ open, close }), [open, close])

  return (
    <ModalCtx.Provider value={value}>
      {children}
      {state && <ContactModal variant={state.variant} options={state.options} onClose={close} />}
    </ModalCtx.Provider>
  )
}
