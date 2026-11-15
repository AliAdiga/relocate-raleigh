'use server'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { Resend } from 'resend'
import { z } from 'zod'
import { guideEmailHtml } from './guideEmail'

const DEST = 'team@relocateraleigh.com'
const FROM = 'Relocate Raleigh <team@relocateraleigh.com>'
const GUIDE_PDF_PATH = path.join(process.cwd(), 'content', 'relocation-guide.pdf')
const GUIDE_PDF_FILENAME = 'Relocate-Raleigh-Guide.pdf'

/** Hidden field real people never fill in. Bots that do get a generic failure, never a fake success. */
const HONEYPOT = 'company_website'

async function loadGuidePdf(): Promise<Buffer | null> {
  try {
    return await readFile(GUIDE_PDF_PATH)
  } catch (err) {
    console.error('Guide PDF not found at', GUIDE_PDF_PATH, err)
    return null
  }
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined))

const guideSchema = z.object({
  name: optionalText(100),
  email: z.email('Enter an email address like name@example.com'),
  origin: optionalText(120),
})

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(100),
  email: z.email('Enter an email address like name@example.com'),
  timeline: optionalText(50),
  message: optionalText(5000),
  context: optionalText(3000),
})

export type FormState = {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string[] | undefined>
}

const fail = (message: string): FormState => ({ ok: false, message })

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  return key ? new Resend(key) : null
}

/** Resend returns `{ error }` instead of throwing, so check it explicitly. */
async function send(resend: Resend, payload: Parameters<Resend['emails']['send']>[0]) {
  const { error } = await resend.emails.send(payload)
  if (error) throw new Error(`${error.name}: ${error.message}`)
}

const read = (fd: FormData, k: string) => {
  const v = fd.get(k)
  return typeof v === 'string' ? v : undefined
}

export async function submitGuideRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  if (read(formData, HONEYPOT)) return fail('We couldn’t send that. Please email team@relocateraleigh.com.')

  const parsed = guideSchema.safeParse({
    name: read(formData, 'name'),
    email: read(formData, 'email'),
    origin: read(formData, 'origin'),
  })
  if (!parsed.success) return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }

  const resend = getClient()
  if (!resend) {
    console.error('submitGuideRequest: RESEND_API_KEY is not set')
    return fail('The guide can’t be emailed right now. Please try again later or write to team@relocateraleigh.com.')
  }

  const { name, email, origin } = parsed.data
  const pdfBuffer = await loadGuidePdf()

  try {
    await send(resend, {
      from: FROM,
      to: email,
      replyTo: DEST,
      subject: 'Your Relocate Raleigh guide',
      html: guideEmailHtml({ name, hasPdf: Boolean(pdfBuffer) }),
      text:
        `Hi ${name ?? 'there'},\n\n` +
        (pdfBuffer
          ? 'Your Relocate Raleigh guide is attached as a PDF: 8 chapters plus checklists, written by a local who made the move himself.\n\n'
          : 'Thanks for requesting the Relocate Raleigh guide. We will email the PDF shortly.\n\n') +
        'Reply to this email with any questions about the move. We read every response.\n\nThe Relocate Raleigh team',
      ...(pdfBuffer ? { attachments: [{ filename: GUIDE_PDF_FILENAME, content: pdfBuffer }] } : {}),
    })
  } catch (err) {
    console.error('submitGuideRequest failed:', err)
    return fail('We couldn’t send the guide. Check the address and try again, or write to team@relocateraleigh.com.')
  }

  // The visitor already has their guide; a failed team notification shouldn't turn that into an error.
  try {
    await send(resend, {
      from: FROM,
      to: DEST,
      replyTo: email,
      subject: `New guide request: ${name ?? email}`,
      text: [name ? `Name: ${name}` : null, `Email: ${email}`, origin ? `Context: ${origin}` : null].filter(Boolean).join('\n'),
    })
  } catch (err) {
    console.error('Guide team notification failed:', err)
  }

  return {
    ok: true,
    message: pdfBuffer ? `Sent. Check ${email} for the guide.` : `Sent. Check ${email} for a confirmation.`,
  }
}

export async function submitContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  if (read(formData, HONEYPOT)) return fail('We couldn’t send that. Please email team@relocateraleigh.com.')

  const parsed = contactSchema.safeParse({
    name: read(formData, 'name'),
    email: read(formData, 'email'),
    timeline: read(formData, 'timeline'),
    message: read(formData, 'message'),
    context: read(formData, 'context'),
  })
  if (!parsed.success) return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors }

  const resend = getClient()
  if (!resend) {
    console.error('submitContactMessage: RESEND_API_KEY is not set')
    return fail('Requests can’t be sent from the site right now. Please call (347) 757-9850 or email team@relocateraleigh.com.')
  }

  const { name, email, timeline, message, context } = parsed.data
  try {
    await send(resend, {
      from: FROM,
      to: DEST,
      replyTo: email,
      subject: `Relocation call request: ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Timeline: ${timeline ?? 'Not given'}`,
        '',
        'Message:',
        message ?? '(none)',
        ...(context ? ['', 'Context the visitor chose to include:', context] : []),
      ].join('\n'),
    })
  } catch (err) {
    console.error('submitContactMessage failed:', err)
    return fail('Your request didn’t go through. Please try again, or call (347) 757-9850.')
  }

  return { ok: true, message: 'Request sent. Nick usually replies within a day or two to suggest a time to talk.' }
}
