'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useContactModal } from './ContactModalProvider';
import SearchPalette from './SearchPalette';
import { IconClose, IconMenu, IconPhone, IconSearch, Logo } from './ui/Icons';

const LINKS = [
  { href: '/#math', label: 'The math', section: 'math' },
  { href: '/#neighborhoods', label: 'Neighborhoods', section: 'neighborhoods' },
  { href: '/#community', label: 'Community', section: 'community' },
  { href: '/scouting', label: 'Scouting trip', section: null },
  { href: '/events', label: 'Events', section: null },
  { href: '/#about', label: 'About Nick', section: 'about' },
];

/** Which home-page section is under the nav, for highlighting the matching link. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const ids = LINKS.map((l) => l.section).filter(Boolean) as string[];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
        else if (window.scrollY < 400) setActive(null);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return enabled ? active : null;
}

export default function SiteNav() {
  const { open } = useContactModal();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(pathname === '/');
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      const typing = t instanceof Element && t.closest('input, textarea, select, [contenteditable]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isCurrent = (l: (typeof LINKS)[number]) => (l.section ? active === l.section : pathname.startsWith(l.href));

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 sm:px-[30px] sm:pt-5">
        <nav
          aria-label="Main"
          className={`mx-auto flex max-w-[1380px] items-center justify-between gap-4 rounded-[1.5rem] px-4 py-3 backdrop-blur-md transition-[background-color,box-shadow] duration-300 sm:px-6 lg:py-4 ${
            scrolled ? 'bg-fog/95 shadow-[0_14px_40px_-28px_rgba(31,31,31,0.45)]' : 'bg-fog/80'
          }`}
        >
          <Link href="/" className="text-ink" aria-label="Relocate Raleigh home">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 rounded-full bg-paper px-2 py-1.5 xl:flex">
            {LINKS.map((l) => {
              const current = isCurrent(l);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={current ? (l.section ? 'location' : 'page') : undefined}
                    className={`block rounded-full px-4 py-2 text-[0.9375rem] transition-colors ${
                      current ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-fog hover:text-ink'
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-fog"
                aria-label="Search (Ctrl K)"
                title="Search (Ctrl K)"
              >
                <IconSearch size={20} />
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink xl:hidden"
              aria-label="Search"
            >
              <IconSearch size={20} />
            </button>
            <button
              type="button"
              onClick={() => open('contact')}
              className="btn-outline hidden px-6 py-3 text-[0.9375rem] sm:inline-flex"
            >
              Talk to Nick
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="mx-auto mt-2 max-w-[1380px] rounded-[1.5rem] border border-line bg-paper p-3 shadow-[0_18px_40px_-24px_rgba(31,31,31,0.35)] xl:hidden"
          >
            <ul>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-base ${isCurrent(l) ? 'bg-fog font-medium text-ink' : 'text-ink hover:bg-fog'}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* Phones: a persistent way to reach Nick */}
      <div className="fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-full bg-ink p-1.5 shadow-[0_18px_40px_-16px_rgba(31,31,31,0.6)] sm:hidden">
        <a href="tel:+13477579850" className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-[0.9375rem] font-medium text-paper">
          <IconPhone size={18} />
          Call Nick
        </a>
        <button
          type="button"
          onClick={() => open('contact')}
          className="flex-1 rounded-full bg-paper py-3 text-[0.9375rem] font-semibold text-ink"
        >
          Book a free call
        </button>
      </div>

      <SearchPalette open={searchOpen} onClose={closeSearch} />
    </>
  );
}
