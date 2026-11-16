import Link from 'next/link';
import ModalTriggerButton from './ModalTriggerButton';
import { TriangleOutline } from './ui/BrandLines';
import SketchBackdrop from './ui/SketchBackdrop';

/** The dark consultation invitation that closes every main page, flowing into the dark footer. */
export default function ClosingCta({ title = 'Let’s find your place in the Triangle.' }: { title?: string }) {
  return (
    <section aria-labelledby="closing-title" className="no-print dark-surface relative isolate overflow-hidden">
      <SketchBackdrop sketch="skyline" fade="bottom" tone="dark" className="-bottom-6 right-0 w-[160%] max-w-none sm:w-[110%] lg:w-[78%]" opacity={0.2} sizes="80vw" />
      <TriangleOutline
        className="pointer-events-none absolute -right-24 -top-10 w-[720px] max-w-none sm:-right-10 lg:right-[6%]"
        stroke="#ffffff"
        opacity={0.07}
        strokeWidth={1.5}
      />
      <span aria-hidden className="absolute right-[18%] top-[64%] hidden h-3 w-3 rounded-full bg-ember lg:block" />
      <div className="shell relative pb-16 pt-20 lg:pb-24 lg:pt-28">
        <h2 id="closing-title" className="t-section max-w-[680px] text-[#f8f7f3]">
          {title}
        </h2>
        <p className="lead mt-5 max-w-[560px] text-[#cfcec8]">
          A free first call is a 30-minute conversation about where you are, what matters most, and whether the
          Triangle fits. If it doesn&apos;t, Nick will tell you.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ModalTriggerButton variant="contact" className="inline-flex items-center justify-center rounded-full bg-paper px-7 py-4 text-[0.9375rem] font-semibold text-ink hover:bg-white">
            Request a relocation call
          </ModalTriggerButton>
          <Link href="/#guide" className="text-[0.9375rem] font-medium text-[#f3f2ee] underline decoration-white/30 underline-offset-[6px] hover:decoration-white">
            Or start with the free guide
          </Link>
        </div>
      </div>
    </section>
  );
}
