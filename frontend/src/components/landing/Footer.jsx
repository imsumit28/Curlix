import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] dark:border-white/[0.05] animate-fade-up">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
              <span className="text-[13px] font-semibold tracking-[0.14em] dark:text-white text-gray-900">
                CURLIX
              </span>
            </Link>
            <p className="mt-4 text-[13px] text-ink-muted max-w-xs leading-relaxed">
              URL infrastructure for engineers — Redis caching, queue-based
              analytics, stateless redirects.
            </p>
            <p className="mt-4 text-[12px] font-mono text-ink-dim max-w-[22rem] leading-relaxed">
              Built for fast redirects, observable systems,
              and boring infrastructure that scales.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-4">
              Product
            </h4>
            <ul className="space-y-2 text-[13px]">
              <FooterLink to="/app">Shorten</FooterLink>
              <FooterLink to="/dashboard">My Links</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#architecture">Architecture</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-[13px]">
              <FooterLink href="https://github.com/" external>Documentation</FooterLink>
              <FooterLink href="https://github.com/" external>System Design</FooterLink>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-4">
              Developer
            </h4>
            <ul className="space-y-2 text-[13px]">
              <FooterLink href="https://github.com/" external>GitHub</FooterLink>
              <FooterLink href="https://linkedin.com/in/" external>LinkedIn</FooterLink>
              <FooterLink href="https://yourportfolio.dev/" external>Portfolio</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-black/[0.06] dark:border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-ink-dim">
          <span>© {new Date().getFullYear()} Curlix</span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:text-ink-muted transition-colors duration-200 cursor-default select-none">
            v1.0.2 · status:{' '}
            <span className="inline-flex items-center gap-1.5 ml-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-green" />
              </span>
              <span className="text-accent-green">operational</span>
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, href, external, children }) {
  const className =
    'relative inline-block text-ink-muted hover:text-ink transition-colors duration-200 ' +
    'after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current ' +
    'after:transition-all after:duration-200 hover:after:w-full';
  if (to) {
    return (
      <li>
        <Link to={to} className={className}>{children}</Link>
      </li>
    );
  }
  return (
    <li>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    </li>
  );
}
