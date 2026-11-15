import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { PHOTOS } from '@/data/photos';

export const metadata: Metadata = {
  title: 'Photo credits | Relocate Raleigh',
  description: 'Credits and licenses for the photography used on Relocate Raleigh.',
  alternates: { canonical: '/credits' },
};

export default function CreditsPage() {
  return (
    <>
      <SiteNav />
      <main id="main" className="shell section-y flex-1">
        <h1 className="t-section">Photo credits</h1>
        <p className="lead mt-4 max-w-[640px] text-ink-soft">
          Local photography on this site comes from Wikimedia Commons under the licenses below, used unchanged
          except for resizing. House renders are illustrations, not real listings.
        </p>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {Object.entries(PHOTOS).map(([key, p]) => (
            <li key={key} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6">
              <span className="font-medium">{p.place}</span>
              <span className="text-sm text-ink-soft">
                &ldquo;{p.title}&rdquo; by {p.author}, {p.license}.{' '}
                <a href={p.source} className="text-ink underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                  Source
                </a>
              </span>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter />
    </>
  );
}
