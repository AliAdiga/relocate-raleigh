import Calculator from '@/components/Calculator';
import ClosingCta from '@/components/ClosingCta';
import NeighborhoodExplorer from '@/components/NeighborhoodExplorer';
import NickBio from '@/components/NickBio';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import EverydayLife from '@/components/home/EverydayLife';
import Faq, { FAQS } from '@/components/home/Faq';
import GuideSection from '@/components/home/GuideSection';
import Hero from '@/components/home/Hero';
import JourneySection from '@/components/home/JourneySection';
import NickIntro from '@/components/home/NickIntro';
import ScoutingPreview from '@/components/home/ScoutingPreview';

export default function Home() {
  // Only facts the business has published: name, URL, phone, email, service area. No ratings or address.
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'Relocate Raleigh',
      url: 'https://relocateraleigh.com',
      logo: 'https://relocateraleigh.com/icon.svg',
      telephone: '+1-347-757-9850',
      email: 'team@relocateraleigh.com',
      areaServed: ['Raleigh, NC', 'Durham, NC', 'Cary, NC', 'Chapel Hill, NC', 'Research Triangle, NC'],
      description: 'Relocation and real-estate help for families moving to the Raleigh-Durham Research Triangle.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];

  return (
    <>
      <SiteNav />
      <main id="main" className="flex-1">
        <Hero />
        <NickIntro />

        <JourneySection />

        <section id="neighborhoods" aria-labelledby="hoods-title" className="section-y">
          <div className="shell">
            <div className="mb-10 max-w-[760px]" data-reveal>
              <h2 id="hoods-title" className="t-section">
                Find neighborhoods that fit your commute and budget
              </h2>
              <p className="lead mt-4 text-ink-soft">
                Choose where you&apos;ll work, the longest drive you&apos;ll accept and a budget. Nine neighborhoods, with
                sourced prices and honest tradeoffs from Nick&apos;s guide.
              </p>
            </div>
            <NeighborhoodExplorer />
          </div>
        </section>

        <section id="math" aria-labelledby="math-title" className="section-y bg-fog">
          <div className="shell">
            <div className="mb-10 max-w-[760px]" data-reveal>
              <h2 id="math-title" className="t-section">
                What your salary is worth in the Raleigh area
              </h2>
              <p className="lead mt-4 text-ink-soft">
                Compare cost of living, state income tax and home prices against where you live now. Covers all 50
                states and DC.
              </p>
            </div>
            <Calculator />
          </div>
        </section>

        <ScoutingPreview />

        <section id="everyday" aria-labelledby="everyday-title" className="section-y bg-sand/60">
          {/* Older links pointed at #community */}
          <span id="community" aria-hidden className="block" />
          <div className="shell">
            <div className="mb-10 max-w-[760px]" data-reveal>
              <h2 id="everyday-title" className="t-section">
                Everyday life in the Triangle
              </h2>
              <p className="lead mt-4 text-ink-soft">
                The places that make a new city feel like home. Pick what matters to you.
              </p>
            </div>
            <EverydayLife />
          </div>
        </section>

        <NickBio />
        <GuideSection />
        <Faq />
        <ClosingCta />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
