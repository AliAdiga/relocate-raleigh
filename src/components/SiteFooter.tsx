import Link from 'next/link';
import { NEIGHBORHOODS } from '@/data/neighborhoods';
import { LogoMark } from './ui/Icons';

export default function SiteFooter() {
  return (
    <footer className="no-print dark-surface mt-auto">
      <div className="shell grid gap-12 pb-10 pt-4 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
        <div className="max-w-sm space-y-4">
          <Link href="/" className="inline-flex items-center gap-2.5 text-[#f3f2ee]">
            <LogoMark className="h-8 w-8" />
            <span className="text-[1.0625rem] font-semibold tracking-tight">Relocate Raleigh</span>
          </Link>
          <p className="text-sm leading-relaxed text-[#bdbcb6]">
            Relocation and real-estate help for families moving to Raleigh, Durham, Cary and the rest of the
            Research Triangle, from Nick, a licensed NC Realtor® who made the move himself.
          </p>
        </div>
        <FooterNav
          title="Plan your move"
          links={[
            ['/#neighborhoods', 'Neighborhood explorer'],
            ['/#math', 'Cost calculator'],
            ['/scouting', 'Scouting trip planner'],
            ['/checklist', 'Relocation checklist'],
            ['/#guide', 'Free relocation guide'],
          ]}
        />
        <FooterNav title="Neighborhood guides" links={NEIGHBORHOODS.map((n) => [`/neighborhoods/${n.id}`, n.name])} />
        <div className="space-y-2.5 text-sm">
          <p className="font-medium text-[#f3f2ee]">Contact</p>
          <a className="block text-[#bdbcb6] hover:text-white" href="tel:+13477579850">
            (347) 757-9850
          </a>
          <a className="block break-all text-[#bdbcb6] hover:text-white" href="mailto:team@relocateraleigh.com">
            team@relocateraleigh.com
          </a>
          <Link className="block text-[#bdbcb6] hover:text-white" href="/#about">
            About Nick
          </Link>
        </div>
      </div>
      <div className="shell flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-[#a3a29c] sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Relocate Raleigh. Figures on this site are estimates for comparison, not financial, tax or legal advice.</p>
        <p className="flex gap-5">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/credits" className="hover:text-white">
            Photo credits
          </Link>
        </p>
      </div>
    </footer>
  );
}

function FooterNav({ title, links }: { title: string; links: string[][] }) {
  return (
    <nav aria-label={title} className="space-y-2.5 text-sm">
      <p className="font-medium text-[#f3f2ee]">{title}</p>
      {links.map(([href, label]) => (
        <Link key={href} className="block text-[#bdbcb6] hover:text-white" href={href}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
