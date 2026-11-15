'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import ContactModal from './ContactModal'

export type ModalVariant = 'guide' | 'contact'
export type ModalOptions = { message?: string }

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

  return (
    <ModalCtx.Provider
      value={{
        open: (variant, options = {}) => setState({ variant, options }),
        close: () => setState(null),
      }}
    >
      {children}
      {state && (
        <ContactModal
          variant={state.variant}
          defaultMessage={state.options.message}
          onClose={() => setState(null)}
        />
      )}
    </ModalCtx.Provider>
  )
}
