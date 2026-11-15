'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useContactModal } from './ContactModalProvider';
import SearchPalette from './SearchPalette';
import { DestinationDot } from './ui/BrandLines';
import { IconArrowRight, IconClose, IconMenu, IconSearch, LogoMark } from './ui/Icons';

type NavLink = { href: string; label: string; hint?: string; section?: string };
type NavGroup = { id: string; label: string; items: NavLink[] };
type NavEntry = NavLink | NavGroup;

const NAV: NavEntry[] = [
  { href: '/#neighborhoods', label: 'Explore neighborhoods', section: 'neighborhoods' },
  {
    id: 'plan',
    label: 'Plan your move',
    items: [
      { href: '/#math', label: 'Cost calculator', hint: 'What your salary is worth here', section: 'math' },
      { href: '/scouting', label: 'Scouting trip planner', hint: 'A 3- or 5-day itinerary' },
      { href: '/checklist', label: 'Relocation checklist', hint: 'Before the move to day 30' },
      { href: '/#guide', label: 'Free relocation guide', hint: 'The full PDF playbook', section: 'guide' },
    ],
  },
  {
    id: 'life',
    label: 'Life in the Triangle',
    items: [
      { href: '/#everyday', label: 'Everyday resources', hint: 'Parks, groceries, libraries, healthcare', section: 'everyday' },
      { href: '/neighborhoods', label: 'Neighborhood guides', hint: 'Nine places families shortlist' },
    ],
  },
  { href: '/#about', label: 'About Nick', section: 'about' },
];

const isGroup = (e: NavEntry): e is NavGroup => 'items' in e;
const SECTIONS = NAV.flatMap((e) => (isGroup(e) ? e.items : [e])).map((l) => l.section).filter(Boolean) as string[];

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
        else if (window.scrollY < 300) setActive(null);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    els.forEach((el) => io.observe(el));
    // Near the top no section is "current", even if the observer last saw one.
    const onScroll = () => window.scrollY < 300 && setActive(null);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled]);
  return enabled ? active : null;
}

export default function SiteNav() {
  const { open } = useContactModal();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(pathname === '/');
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // Publish the resting header height so the hero can sit underneath the transparent header.
    // Measured only at the top of the page, so the shrink-on-scroll never shifts the layout.
    const el = headerRef.current;
    const ro = new ResizeObserver(() => {
      if (el && window.scrollY <= 12) document.documentElement.style.setProperty('--header-h', `${Math.round(el.offsetHeight)}px`);
    });
    if (el) ro.observe(el);
    return () => {
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  // Global shortcuts: Ctrl/⌘+K or "/" opens search; Escape closes menus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      const typing = t instanceof Element && t.closest('input, textarea, select, [contenteditable]');
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        if (menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
        setOpenGroup(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Close dropdowns on outside click.
  useEffect(() => {
    if (!openGroup) return;
    const onDown = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenGroup(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [openGroup]);

  // Mobile menu: focus the first link and keep focus inside while open.
  useEffect(() => {
    if (!menuOpen) return;
    const panel = menuRef.current;
    panel?.querySelector<HTMLElement>('a, button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panel) return;
      const items = [menuButtonRef.current, ...panel.querySelectorAll<HTMLElement>('a, button')].filter(Boolean) as HTMLElement[];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const isCurrent = (l: NavLink) => (l.section ? active === l.section : pathname === l.href || pathname.startsWith(`${l.href}/`));
  const closeAll = () => {
    setMenuOpen(false);
    setOpenGroup(null);
  };
  const requestCall = () => {
    closeAll();
    open('contact');
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        className={`no-print sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled || menuOpen
            ? 'border-line bg-paper/92 backdrop-blur-md'
            : pathname === '/'
              ? 'border-transparent bg-transparent'
              : 'border-transparent bg-paper'
        }`}
      >
        <nav
          ref={navRef}
          aria-label="Main"
          className={`shell flex items-center justify-between gap-4 transition-[padding] duration-300 ${scrolled ? 'py-2.5' : 'py-3.5 lg:py-4'}`}
        >
          <Link href="/" className="flex items-center gap-2.5 text-ink" aria-label="Relocate Raleigh home" onClick={closeAll}>
            <LogoMark className="h-8 w-8" />
            <span className="flex flex-col leading-none">
              <span className="text-[1.0625rem] font-semibold tracking-tight">Relocate Raleigh</span>
              <span className="mt-1 hidden text-[0.6875rem] text-ink-soft sm:block">Your next chapter in the Triangle</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 xl:flex">
            {NAV.map((entry) =>
              isGroup(entry) ? (
                <li key={entry.id} className="relative">
                  <button
                    type="button"
                    aria-expanded={openGroup === entry.id}
                    aria-controls={`nav-${entry.id}`}
                    onClick={() => setOpenGroup((g) => (g === entry.id ? null : entry.id))}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors hover:bg-fog ${
                      entry.items.some(isCurrent) ? 'font-medium text-ink' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {entry.items.some(isCurrent) && <DestinationDot size={7} className="ring-0" />}
                    {entry.label}
                    <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className={`transition-transform ${openGroup === entry.id ? 'rotate-180' : ''}`}>
                      <path d="m1 1 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  {openGroup === entry.id && (
                    <div
                      id={`nav-${entry.id}`}
                      className="absolute left-0 top-full mt-2 w-[300px] rounded-[var(--radius-card)] border border-line bg-paper p-2 shadow-[0_24px_50px_-28px_rgba(31,31,31,0.45)]"
                    >
                      <ul>
                        {entry.items.map((l) => (
                          <li key={l.href}>
                            <Link
                              href={l.href}
                              onClick={closeAll}
                              aria-current={isCurrent(l) ? 'location' : undefined}
                              className="block rounded-xl px-3.5 py-2.5 hover:bg-fog"
                            >
                              <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink">
                                {isCurrent(l) && <DestinationDot size={7} className="ring-0" />}
                                {l.label}
                              </span>
                              {l.hint && <span className="mt-0.5 block text-sm text-ink-soft">{l.hint}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ) : (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    aria-current={isCurrent(entry) ? 'location' : undefined}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[0.9375rem] transition-colors hover:bg-fog ${
                      isCurrent(entry) ? 'font-medium text-ink' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {isCurrent(entry) && <DestinationDot size={7} className="ring-0" />}
                    {entry.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-soft hover:bg-fog hover:text-ink"
              aria-label="Search the site"
              title="Search (Ctrl K)"
            >
              <IconSearch size={20} />
            </button>
            <button type="button" onClick={requestCall} className="btn-ink whitespace-nowrap px-4 py-2.5 text-sm sm:px-5 sm:text-[0.9375rem]">
              <span className="sm:hidden">Contact</span>
              <span className="hidden sm:inline">Request a call</span>
              <IconArrowRight size={16} className="hidden sm:block" />
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-fog xl:hidden"
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
          <div id="mobile-menu" ref={menuRef} className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-line bg-paper xl:hidden">
            <div className="shell space-y-6 py-6">
              {NAV.map((entry) =>
                isGroup(entry) ? (
                  <div key={entry.id}>
                    <p className="kicker mb-2">{entry.label}</p>
                    <ul className="space-y-1">
                      {entry.items.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} onClick={closeAll} className="block rounded-xl px-3 py-3 text-base text-ink hover:bg-fog">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link key={entry.href} href={entry.href} onClick={closeAll} className="block rounded-xl px-3 py-3 text-lg font-medium text-ink hover:bg-fog">
                    {entry.label}
                  </Link>
                ),
              )}
              <button type="button" onClick={requestCall} className="btn-ink w-full px-6 py-4">
                Request a relocation call
              </button>
            </div>
          </div>
        )}
      </header>

      <SearchPalette open={searchOpen} onClose={closeSearch} />
    </>
  );
}
