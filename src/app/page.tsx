import Image from "next/image";
import HeroHouse from "@/components/HeroHouse";
import HeroMovePicker from "@/components/HeroMovePicker";
import Link from "next/link";
import Calculator from "@/components/Calculator";
import NeighborhoodExplorer from "@/components/NeighborhoodExplorer";
import InfrastructureCultureMap from "@/components/InfrastructureCultureMap";
import NickBio from "@/components/NickBio";
import ModalTriggerButton from "@/components/ModalTriggerButton";
import GuideEmailForm from "@/components/GuideEmailForm";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { IconCalculator, IconKey, IconMapPin, IconCalendar, IconCheck, IconMessages, IconPhone } from "@/components/ui/Icons";
import { getUpcomingEvents, formatDateLabel } from "@/data/events";

const TRUST = [
  { icon: IconCheck, color: "text-leaf", title: "Licensed NC Realtor®", body: "Buying, renting and selling" },
  { icon: IconCalculator, color: "text-violet", title: "Works in RTP tech", body: "Knows your commute and career" },
  { icon: IconMessages, color: "text-ember", title: "4 languages", body: "English, Russian, Ukrainian, Mandarin" },
  { icon: IconPhone, color: "text-ink", title: "Free first call", body: "No pressure, no obligation" },
];

const STEPS = [
  {
    icon: IconCalculator,
    color: "text-leaf",
    title: "Run your numbers",
    body: "Compare your salary, state taxes and home prices with Raleigh. It takes under a minute.",
    href: "#math",
    cta: "Open the calculator",
  },
  {
    icon: IconMapPin,
    color: "text-ember",
    title: "Shortlist neighborhoods",
    body: "Pick where you'll work and see which neighborhoods fit your commute, budget and schools.",
    href: "#neighborhoods",
    cta: "Explore neighborhoods",
  },
  {
    icon: IconKey,
    color: "text-violet",
    title: "Plan the move with Nick",
    body: "Book a free call. Nick helps you scout, buy or rent, and settle in once you arrive.",
    href: "#about",
    cta: "Meet Nick",
  },
];

export default function Home() {
  const upcomingEvents = getUpcomingEvents(3);

  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* Hero: the Figma's gradient panel with the house breaking out of its frame */}
        <section className="px-3 pt-4 sm:px-[30px] sm:pt-6" aria-labelledby="hero-title">
          <div className="wash relative mx-auto grid max-w-[1380px] rounded-[var(--radius-panel)] lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="relative z-10 flex flex-col justify-center gap-7 px-6 pb-4 pt-12 sm:px-12 lg:py-20 lg:pl-[46px] lg:pr-0">
              <p className="text-[0.9375rem] text-ink">For tech families moving to Raleigh-Durham</p>
              <h1 id="hero-title" className="max-w-[560px] text-[clamp(2.75rem,6.4vw,4.1875rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
                Keep your career. Upgrade your life.
              </h1>
              <p className="max-w-[460px] text-base leading-relaxed text-ink">
                The Triangle has hybrid tech jobs, lower housing costs and strong public schools. Nick works in RTP
                tech and made the move himself. He&apos;ll help your family do it right.
              </p>
              <HeroMovePicker />
              <div className="space-y-2">
                <GuideEmailForm source="Homepage hero" />
                <p className="pl-5 text-xs text-ink-soft">Free relocation guide: 8 chapters plus checklists, emailed as a PDF.</p>
              </div>
            </div>

            <HeroHouse />
          </div>

          {/* Trust strip: verifiable facts only (add real client reviews here once Nick has them) */}
          <ul className="mx-auto mt-16 grid max-w-[1380px] grid-cols-2 gap-x-6 gap-y-5 px-3 sm:px-[46px] lg:mt-20 lg:grid-cols-4">
            {TRUST.map((t) => (
              <li key={t.title} className="flex items-start gap-3">
                <t.icon size={26} className={`mt-0.5 shrink-0 ${t.color}`} />
                <span>
                  <span className="block text-[0.9375rem] font-semibold text-ink">{t.title}</span>
                  <span className="block text-sm text-ink-soft">{t.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Three steps */}
        <section className="mx-auto max-w-[1380px] px-6 pb-24 pt-28 sm:px-[30px] lg:pt-36" aria-labelledby="steps-title">
          <h2 id="steps-title" className="mx-auto max-w-[800px] text-center text-[clamp(2rem,4vw,3.125rem)] font-semibold leading-[1.1] tracking-[-0.015em]">
            Three steps from curious to moved in
          </h2>
          <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10 lg:px-9">
            {STEPS.map((s) => (
              <li key={s.title} className="flex flex-col gap-4">
                <s.icon size={64} strokeWidth={1.2} className={s.color} />
                <h3 className="text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="max-w-[330px] text-base leading-relaxed text-ink-soft">{s.body}</p>
                <a href={s.href} className="w-fit text-[0.9375rem] font-medium text-ink underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-ink">
                  {s.cta}
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* The math */}
        <section id="math" className="mx-auto max-w-[1380px] px-3 py-16 sm:px-[30px]" aria-labelledby="math-title">
          <div className="mb-10 max-w-[720px] px-3 sm:px-0">
            <h2 id="math-title" className="text-[clamp(2rem,4vw,3.125rem)] font-semibold leading-[1.1] tracking-[-0.015em]">
              What your salary is worth in Raleigh
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Enter your pay and your state. We compare cost of living, state income tax and home prices, so you
              can see what the move means before you talk to anyone.
            </p>
          </div>
          <Calculator />
        </section>

        {/* Neighborhoods */}
        <section id="neighborhoods" className="mx-auto max-w-[1380px] px-3 py-20 sm:px-[30px]" aria-labelledby="hoods-title">
          <div className="mb-10 max-w-[720px] px-3 sm:px-0">
            <h2 id="hoods-title" className="text-[clamp(2rem,4vw,3.125rem)] font-semibold leading-[1.1] tracking-[-0.015em]">
              Find neighborhoods that fit your commute
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Choose one of 15 Triangle tech employers and set the longest drive you&apos;ll put up with. Prices
              and school ratings are simplified starting points. Nick fills in the details on a call.
            </p>
          </div>
          <NeighborhoodExplorer />
        </section>

        {/* Community */}
        <section id="community" className="mx-auto max-w-[1380px] px-3 py-20 sm:px-[30px]" aria-labelledby="community-title">
          <div className="mb-10 max-w-[720px] px-3 sm:px-0">
            <h2 id="community-title" className="text-[clamp(2rem,4vw,3.125rem)] font-semibold leading-[1.1] tracking-[-0.015em]">
              The groceries that make it feel like home
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Slavic, Asian, Indian and American specialty stores across the Triangle. Pick a community, then
              choose a store to see it on the map.
            </p>
          </div>
          <InfrastructureCultureMap />
        </section>

        {/* Events */}
        <section className="mx-auto max-w-[1380px] px-3 py-20 sm:px-[30px]" aria-labelledby="events-title">
          <div className="mb-10 flex flex-col justify-between gap-6 px-3 sm:flex-row sm:items-end sm:px-0">
            <div className="max-w-[640px]">
              <h2 id="events-title" className="text-[clamp(2rem,4vw,3.125rem)] font-semibold leading-[1.1] tracking-[-0.015em]">
                Meet people before you move
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Tech meetups, cultural festivals and family events around the Triangle, updated every week.
              </p>
            </div>
            <Link href="/events" className="btn-outline w-fit shrink-0 px-7 py-3.5 text-[0.9375rem]">
              See the full calendar
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <ul className="grid gap-5 md:grid-cols-3">
              {upcomingEvents.map((event) => (
                <li key={`${event.date}-${event.title}`}>
                  <a
                    href={event.url ?? undefined}
                    target={event.url ? "_blank" : undefined}
                    rel={event.url ? "noopener noreferrer" : undefined}
                    className="flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-paper p-6 hover:border-[#c9c9c9]"
                  >
                    <span className="text-sm font-medium text-ember-deep">{formatDateLabel(event.date)}</span>
                    <span className="text-lg font-semibold leading-snug tracking-tight">{event.title}</span>
                    <span className="mt-auto flex items-center justify-between gap-3 text-sm text-ink-soft">
                      <span>{event.location}</span>
                      <span className="rounded-full bg-fog px-3 py-1 text-xs text-ink">{event.category}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] bg-fog p-8 sm:flex-row sm:items-center">
              <IconCalendar size={40} className="shrink-0 text-violet" />
              <p className="flex-1 text-base text-ink-soft">
                No events are listed right now. Get the guide and Nick will send you the best upcoming meetups
                for your family.
              </p>
              <ModalTriggerButton variant="guide" className="btn-ink shrink-0 px-6 py-3.5 text-[0.9375rem]">
                Get the guide
              </ModalTriggerButton>
            </div>
          )}
        </section>

        <NickBio />

        {/* Guide CTA: the Figma's newsletter panel */}
        <section className="px-3 pb-24 pt-16 sm:px-[30px]" aria-labelledby="guide-title">
          <div className="wash relative mx-auto grid max-w-[1380px] items-center gap-8 rounded-[var(--radius-panel)] px-6 py-12 sm:px-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:min-h-[457px]">
            <div className="space-y-6">
              <h2 id="guide-title" className="text-[clamp(2rem,4vw,3.125rem)] font-semibold leading-[1.1] tracking-[-0.015em]">
                Get the Relocate Raleigh guide
              </h2>
              <p className="max-w-[520px] text-base leading-relaxed text-ink">
                Neighborhoods, Wake County schools, the real cost of the move, a 3-day scouting plan and your
                first 90 days, all in one PDF. Free, and written for families like yours.
              </p>
              <GuideEmailForm source="Homepage guide panel" />
            </div>
            <div className="flex justify-center md:justify-end">
              <Image
                src="/renders/house-isometric.png"
                alt=""
                width={244}
                height={224}
                className="h-auto w-[200px] sm:w-[244px]"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
