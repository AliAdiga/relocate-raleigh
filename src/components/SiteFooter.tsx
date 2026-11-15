import Link from 'next/link';
import { NEIGHBORHOODS } from '@/data/neighborhoods';
import { Logo } from './ui/Icons';

export default function SiteFooter() {
  return (
    <footer className="mt-auto px-3 pb-28 sm:px-[30px] sm:pb-8">
      <div className="mx-auto grid max-w-[1380px] gap-10 border-t border-line px-2 pt-12 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div className="max-w-sm space-y-4">
          <Link href="/" className="inline-block text-ink">
            <Logo />
          </Link>
          <p className="text-sm leading-relaxed text-stone">
            Relocation help for tech families moving to Raleigh, Durham, Cary and the rest of the Triangle. Figures
            on this site are estimates for comparison, not financial or tax advice.
          </p>
        </div>
        <nav aria-label="Plan" className="space-y-2.5 text-sm">
          <p className="font-medium text-ink">Plan</p>
          <Link className="block text-ink-soft hover:text-ink" href="/#math">Salary calculator</Link>
          <Link className="block text-ink-soft hover:text-ink" href="/#neighborhoods">Neighborhood explorer</Link>
          <Link className="block text-ink-soft hover:text-ink" href="/scouting">Scouting trip planner</Link>
          <Link className="block text-ink-soft hover:text-ink" href="/events">Events calendar</Link>
        </nav>
        <nav aria-label="Neighborhoods" className="space-y-2.5 text-sm">
          <p className="font-medium text-ink">Neighborhoods</p>
          {NEIGHBORHOODS.slice(0, 6).map((n) => (
            <Link key={n.id} className="block text-ink-soft hover:text-ink" href={`/neighborhoods/${n.id}`}>
              {n.name}
            </Link>
          ))}
        </nav>
        <nav aria-label="Contact" className="space-y-2.5 text-sm">
          <p className="font-medium text-ink">Contact</p>
          <a className="block text-ink-soft hover:text-ink" href="tel:+13477579850">(347) 757-9850</a>
          <a className="block text-ink-soft hover:text-ink" href="mailto:team@relocateraleigh.com">team@relocateraleigh.com</a>
          <Link className="block text-ink-soft hover:text-ink" href="/#about">About Nick</Link>
          <Link className="block text-ink-soft hover:text-ink" href="/styleguide">Brand and style guide</Link>
        </nav>
      </div>
      <p className="mx-auto mt-12 max-w-[1380px] px-2 text-xs text-stone">© {new Date().getFullYear()} Relocate Raleigh</p>
    </footer>
  );
}
