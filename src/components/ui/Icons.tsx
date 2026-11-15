import type { SVGProps } from 'react';

/** Linear 24px icons in the style of the Figma file's vuesax/linear set (1.5px stroke, round joins). */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconCalculator(p: IconProps) {
  return (
    <Base {...p}>
      <rect x="4.5" y="2.5" width="15" height="19" rx="3" />
      <rect x="7.5" y="5.5" width="9" height="4" rx="1" />
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01" strokeWidth={2.2} />
    </Base>
  );
}

export function IconMapPin(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M12 21.5s-7-5.6-7-11.5a7 7 0 1 1 14 0c0 5.9-7 11.5-7 11.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </Base>
  );
}

export function IconKey(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="8" cy="15" r="4.5" />
      <path d="m11.2 11.8 8.3-8.3M16.5 6.5l2.5 2.5M14.5 8.5l2 2" />
    </Base>
  );
}

export function IconMessages(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M8.5 19H8c-4 0-6-1-6-6V8c0-4 2-6 6-6h8c4 0 6 2 6 6v5c0 4-2 6-6 6h-.5a1 1 0 0 0-.8.4l-1.5 2a1.4 1.4 0 0 1-2.4 0l-1.5-2a1.1 1.1 0 0 0-.8-.4Z" />
      <path d="M15.99 11h.01M11.99 11h.01M7.99 11h.01" strokeWidth={2} />
    </Base>
  );
}

export function IconArrowRight(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M14.4 6 20.5 12l-6.1 6M3.5 12h16.8" />
    </Base>
  );
}

export function IconArrowLeft(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M9.6 6 3.5 12l6.1 6M20.5 12H3.7" />
    </Base>
  );
}

export function IconClose(p: IconProps) {
  return (
    <Base {...p}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Base>
  );
}

export function IconMenu(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 7h18M3 12h18M3 17h18" />
    </Base>
  );
}

export function IconCheck(p: IconProps) {
  return (
    <Base {...p}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Base>
  );
}

export function IconCalendar(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M8 2v3M16 2v3M3.5 9.1h17" />
      <rect x="3" y="3.5" width="18" height="18" rx="4" />
    </Base>
  );
}

export function IconPhone(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M21.97 18.33c0 .36-.08.73-.25 1.09-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.6.25-1.25.38-1.95.38-1.02 0-2.11-.24-3.26-.73a17.6 17.6 0 0 1-3.44-1.98 28.75 28.75 0 0 1-3.28-2.8 28.42 28.42 0 0 1-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.54.53 1.06 1.02 1.59 1.47.52.44.95.74 1.29.92.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78Z" />
    </Base>
  );
}

export function IconBuilding(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 21.5h18M5 21.5V5.5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M15 9.5h2.5a1.5 1.5 0 0 1 1.5 1.5v10.5M8.5 7.5h3M8.5 11h3M8.5 14.5h3M10 21.5v-3" />
    </Base>
  );
}

export function IconHome(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M3 10.5 12 3l9 7.5M5 9v11.5h14V9M10 20.5v-6h4v6" />
    </Base>
  );
}

export function IconSearch(p: IconProps) {
  return (
    <Base {...p}>
      <circle cx="11.5" cy="11.5" r="8.5" />
      <path d="m22 22-4-4" />
    </Base>
  );
}

export function IconHeart({ filled, ...p }: IconProps & { filled?: boolean }) {
  return (
    <Base {...p}>
      <path
        d="M12.6 20.8c-.3.1-.9.1-1.2 0C8.8 19.9 3 16.2 3 9.9A5 5 0 0 1 8 4.9c1.6 0 3.1.8 4 2 .9-1.2 2.4-2 4-2a5 5 0 0 1 5 5c0 6.3-5.8 10-8.4 10.9Z"
        fill={filled ? 'currentColor' : 'none'}
      />
    </Base>
  );
}

export function IconPrinter(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M7.3 7V4.5c0-1 .8-2 2-2h5.4c1.2 0 2 1 2 2V7M16.5 15v4.5c0 1-.8 2-2 2h-5c-1.2 0-2-1-2-2V15" />
      <path d="M5.5 17.5H4a2 2 0 0 1-2-2v-6A2.5 2.5 0 0 1 4.5 7h15A2.5 2.5 0 0 1 22 9.5v6a2 2 0 0 1-2 2h-1.5M6 15h12M7 11h3" />
    </Base>
  );
}

export function IconTrash(p: IconProps) {
  return (
    <Base {...p}>
      <path d="M21 6H3M8 6V4.5C8 3.7 8.7 3 9.5 3h5c.8 0 1.5.7 1.5 1.5V6M18.5 6l-.8 13a2 2 0 0 1-2 2H8.3a2 2 0 0 1-2-2L5.5 6M10 11v5M14 11v5" />
    </Base>
  );
}

/**
 * Brand mark: the Research Triangle as a roofline. Durham at the apex, Chapel Hill and
 * Raleigh at the base. Raleigh, the destination, is the warm orange dot.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d="M16 6.5 5.5 24.5h21L16 6.5Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="16" cy="6.5" r="3.4" fill="currentColor" />
      <circle cx="5.5" cy="24.5" r="3.4" fill="currentColor" />
      <circle cx="26.5" cy="24.5" r="3.9" fill="#FF791A" stroke="#FEFEFF" strokeWidth="1.6" />
    </svg>
  );
}

/** Horizontal lockup used in the nav and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ''}`}>
      <LogoMark className="h-8 w-8" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-semibold tracking-tight">Relocate Raleigh</span>
        <span className="mt-1 text-[0.6875rem] text-ink-soft">Tech families to the Triangle</span>
      </span>
    </span>
  );
}
