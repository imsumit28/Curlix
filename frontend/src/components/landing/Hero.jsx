import HeroShortener from './HeroShortener';

export default function Hero() {
  return (
    <section className="relative pt-28 sm:pt-32 pb-20">
      <div className="absolute inset-0 pointer-events-none dot-bg dot-bg-fade opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[280px] rounded-full bg-brand-500/[0.07] dark:bg-brand-500/[0.09] blur-[100px] pointer-events-none animate-pulse-soft" />

      <div className="relative max-w-3xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 mb-7 text-[11px] font-mono text-ink-dim opacity-0 animate-fade-up">
          <span className="w-1 h-1 rounded-full bg-accent-green" />
          Redis-powered URL infrastructure
        </div>

        <h1
          className="text-[44px] sm:text-[56px] lg:text-[64px] font-semibold tracking-[-0.02em] leading-[1.05] opacity-0 animate-fade-up"
          style={{ animationDelay: '0.05s' }}
        >
          <span className="gradient-text">Fast redirects,</span>
          <br />
          <span className="text-ink-muted">shorter links, smarter insights.</span>
        </h1>

        <p
          className="mt-5 text-[15px] sm:text-base text-ink-muted max-w-xl leading-relaxed opacity-0 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          A scalable URL shortener with async analytics, queue-based processing,
          and Redis caching — built for engineers who care about latency.
        </p>

        <div
          className="mt-5 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 font-mono text-[11px] opacity-0 animate-fade-up"
          style={{ animationDelay: '0.15s' }}
        >
          <Feature label="Redis hot-path caching" dot="brand" />
          <Sep />
          <Feature label="Queue-backed analytics" dot="green" />
          <Sep />
          <Feature label="Edge validation" dot="amber" />
          <Sep />
          <Feature label="Stateless redirects" dot="cyan" />
        </div>

        <div
          className="w-full mt-10 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          <HeroShortener />
        </div>

        <div
          className="mt-8 flex flex-wrap justify-center items-center gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.28s' }}
        >
          <a href="#architecture" className="btn-primary">
            Explore Architecture →
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            <GitHubIcon />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

function Feature({ label, dot }) {
  const dotCls = { brand: 'bg-brand-400', green: 'bg-accent-green', amber: 'bg-accent-amber', cyan: 'bg-accent-cyan' };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-1 h-1 rounded-full ${dotCls[dot] || 'bg-brand-400'}`} />
      <span className="text-ink-dim">{label}</span>
    </span>
  );
}

function Sep() {
  return <span className="text-ink-faint">·</span>;
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 4px rgba(0,0,0,0.6)) drop-shadow(0 0 6px rgba(148,163,184,0.4))'}}>
      <defs>
        <linearGradient id="ghGrad" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0"/>
          <stop offset="100%" stopColor="#94A3B8"/>
        </linearGradient>
      </defs>
      <path fill="url(#ghGrad)" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.19.92-.26 1.91-.39 2.89-.4.98 0 1.97.13 2.89.39 2.21-1.5 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"/>
    </svg>
  );
}
