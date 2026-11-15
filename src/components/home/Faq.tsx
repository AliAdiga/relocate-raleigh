/**
 * Answers based only on services described in the guide ("How Nick helps") and on the original site.
 * No fees, guarantees or commitments are stated because none are documented.
 */
export const FAQS: { q: string; a: string }[] = [
  {
    q: 'Can you help if I’m still deciding whether to move?',
    a: 'Yes. That’s what the first call is for. Nick will talk through what you’re optimizing for and whether the Triangle actually fits. If it doesn’t, he’ll tell you.',
  },
  {
    q: 'What happens during the first call?',
    a: 'It’s a free, roughly 30-minute conversation about where you are in the process, your priorities (commute, schools, budget, community) and sensible next steps. It isn’t a sales pitch.',
  },
  {
    q: 'Can you help with renting before buying?',
    a: 'Yes. Nick helps families find a home to rent or to buy in the area that suits them. Renting first is a common way to learn the region before committing.',
  },
  {
    q: 'Can you help plan a scouting trip?',
    a: 'Yes, including the pre-work: which neighborhoods and specific addresses are worth seeing, so a 3-day trip is productive. The scouting planner on this site is a good starting point.',
  },
  {
    q: 'How should I read the commute estimates?',
    a: 'Drive times to employers on this site are rough estimates from straight-line distance, not live traffic. The rush-hour ranges on each neighborhood guide come from Nick’s guide. On your trip, test your actual route at rush hour with DriveNC or a maps app.',
  },
  {
    q: 'How current are the neighborhood figures?',
    a: 'Prices are Redfin and Homes.com snapshots from March 2026 and school patterns are from early 2026, compiled in the guide. Markets and school assignments change, so treat them as a starting point and confirm for any specific home.',
  },
  {
    q: 'What does relocation support include?',
    a: 'Help finding a home to rent or buy, introductions to mortgage brokers, coordinating moving logistics, local answers about neighborhoods, schools and careers, community connections, and property management if you keep a home here.',
  },
  {
    q: 'Do you only work with tech families?',
    a: 'No. Nick works with families moving to the Triangle from anywhere in the U.S. for any reason: tech jobs, healthcare careers, aging parents, schools or a calmer pace of life.',
  },
];

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y border-t border-line">
      <div className="shell grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
        <div>
          <h2 id="faq-title" className="t-section">
            Questions families ask
          </h2>
          <p className="lead mt-4 text-ink-soft">Straight answers about how this works.</p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg font-semibold tracking-tight text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-ink" />
                  <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-ink transition-transform group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[640px] pb-6 text-base leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
