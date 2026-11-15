import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy | Relocate Raleigh',
  description: 'What information Relocate Raleigh collects and how it is used.',
  alternates: { canonical: '/privacy' },
};

/**
 * Plain-language description of what this website actually does with data.
 * Not a legal policy: the business owner should review and replace it with their own.
 */
export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell section-y flex-1">
        <div className="max-w-[680px] space-y-6 text-base leading-relaxed text-ink-soft">
          <h1 className="t-section text-ink">Privacy</h1>
          <p className="lead text-ink">A plain description of what this website does with your information.</p>
          <h2 className="t-card pt-4 text-ink">What you send us</h2>
          <p>
            When you request the guide or a relocation call, the details you type (such as your name, email, moving
            timeline, message and any neighborhood details you choose to include) are emailed to the Relocate
            Raleigh team so we can reply. The guide request also emails the PDF to the address you enter.
          </p>
          <h2 className="t-card pt-4 text-ink">What stays in your browser</h2>
          <p>
            Your saved neighborhoods, explorer filters, scouting plan and checklist progress are stored only in
            your own browser (local storage). They are not sent anywhere unless you choose to include them in a
            request. Clearing your browser data removes them.
          </p>
          <h2 className="t-card pt-4 text-ink">What we don’t do</h2>
          <p>
            This site doesn’t use advertising trackers or sell personal information. The calculator runs in your
            browser; your salary is not sent to us.
          </p>
          <h2 className="t-card pt-4 text-ink">Questions</h2>
          <p>
            Email{' '}
            <a href="mailto:team@relocateraleigh.com" className="text-ink underline underline-offset-4">
              team@relocateraleigh.com
            </a>{' '}
            to ask about or delete information you’ve sent us.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
