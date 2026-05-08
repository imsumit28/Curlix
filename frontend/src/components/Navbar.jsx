import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleAnchor(e, target) {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${target}`);
    }
    setOpen(false);
  }

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-surface-base backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.05]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center">
        {/* Left: brand + nav */}
        <div className="flex items-center gap-7 flex-1">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
            <span className="text-[13px] font-semibold tracking-[0.14em] dark:text-white text-gray-900">
              CURLIX
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavItem onClick={(e) => handleAnchor(e, 'features')}>Features</NavItem>
            <NavItem onClick={(e) => handleAnchor(e, 'architecture')}>Architecture</NavItem>
            <NavItem href="https://github.com/" external>Docs</NavItem>
            <NavItem href="https://github.com/" external>API</NavItem>
            <NavItem href="https://github.com/" external>GitHub</NavItem>
          </div>
        </div>

        {/* Right: theme toggle + CTA */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md text-ink-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link to="/app" className="hidden sm:inline-flex btn-ghost">
            Get started
            <Arrow />
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded-md text-ink-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'}}>
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></>
                : <><rect x="3" y="5" width="18" height="2.5" rx="1.25" fill="currentColor"/><rect x="3" y="11" width="18" height="2.5" rx="1.25" fill="currentColor"/><rect x="3" y="17" width="18" height="2.5" rx="1.25" fill="currentColor"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/[0.06] dark:border-white/[0.05] bg-surface-base backdrop-blur-md">
          <div className="px-6 py-3 flex flex-col gap-0.5">
            <MobileItem onClick={(e) => handleAnchor(e, 'features')}>Features</MobileItem>
            <MobileItem onClick={(e) => handleAnchor(e, 'architecture')}>Architecture</MobileItem>
            <MobileItem href="https://github.com/" external>Docs</MobileItem>
            <MobileItem href="https://github.com/" external>API</MobileItem>
            <MobileItem href="https://github.com/" external>GitHub</MobileItem>
            <Link to="/app" onClick={() => setOpen(false)} className="mt-2 btn-primary w-fit">
              Get started
              <Arrow />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({ onClick, href, external, children }) {
  const className =
    'px-2.5 py-1.5 rounded-md text-[13px] font-medium text-ink-muted hover:text-ink transition-colors';
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function MobileItem({ onClick, href, external, children }) {
  const className =
    'px-2 py-2 rounded-md text-[13px] font-medium text-ink-muted hover:text-ink transition-colors text-left';
  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

function Arrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'}}>
      <defs>
        <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
        </linearGradient>
      </defs>
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
      <polyline points="12 5 19 12 12 19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SunIcon() {
  return (
    <span style={{ fontSize: '16px', lineHeight: 1, display: 'inline-flex', filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.9)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} aria-hidden="true">☀️</span>
  );
}

function MoonIcon() {
  return (
    <span style={{ fontSize: '15px', lineHeight: 1, display: 'inline-flex', filter: 'drop-shadow(0 0 5px rgba(139,92,246,0.9)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }} aria-hidden="true">🌙</span>
  );
}
