import { useState } from 'react';

const FEATURES = [
  {
    title: 'Sub-10ms redirects',
    desc: 'Redis-first hot path. On cache miss, falls through to Postgres and re-warms the key. Median resolution stays under 4ms.',
    glyph: '> hot-path',
    code: 'redis.get(code) → 302',
    color: 'text-accent-amber',
    diagram: '[req] → [redis] → [302]',
    details: 'Uses GETEX for atomic read + TTL refresh. Postgres fallback on miss. Warm cache <1ms. Invalidation on mutation.',
  },
  {
    title: 'Async analytics',
    desc: 'Click events enqueue via BullMQ. The redirect path never blocks on writes.',
    glyph: '$ queue',
    code: 'queue.add("click", payload)',
    color: 'text-brand-400',
    diagram: '[click] → [queue] → [worker]',
    details: 'BullMQ ensures ordering and durability. Workers process in parallel. Redirect returns before analytics persist.',
  },
  {
    title: 'Stateless ownership',
    desc: 'Ownership is verified through one-time cryptographic tokens. No accounts, no sessions, no recovery flows needed.',
    glyph: '# token',
    code: 'bcrypt(token) ≡ owner',
    color: 'text-accent-green',
    diagram: '[owner] → [hash] → [verify]',
    details: 'Token is salted, hashed at creation. Verified on every mutation. No server-side state needed for ownership.',
  },
  {
    title: 'Smart caching',
    desc: 'TTL-aware Redis layer with explicit invalidation on mutation or expiry. Stale keys are never served.',
    glyph: '~ ttl',
    code: 'SET url:{code} EX 86400',
    color: 'text-accent-cyan',
    diagram: '[key] → [redis] ← [ttl]',
    details: 'Explicit DEL on mutation. Automatic expiry via TTL. Stale-while-revalidate strategy keeps hits high.',
  },
  {
    title: 'Abuse protection',
    desc: 'Per-IP rate limits, Cloudflare Turnstile, and SSRF-safe URL validation enforced at the boundary — before any downstream I/O.',
    glyph: '! guard',
    code: 'rl: 10 req/min',
    color: 'text-accent-rose',
    diagram: '[req] → [guard] → [db]',
    details: 'Rate limiter via Redis INCR. Turnstile token verified server-side. URL validation blocks private IPs and localhost.',
  },
  {
    title: 'Lean infrastructure',
    desc: 'Supabase, Upstash, Render, and Vercel. Production-grade stack, minimal operational overhead.',
    glyph: '$ lean',
    code: 'cost: $0/mo',
    color: 'text-violet-400',
    diagram: '[pg] ← [app] → [redis]',
    details: 'Supabase: managed Postgres. Upstash: serverless Redis. Render: free tier container. Vercel: free edge functions.',
  },
];

const WIDE_CARD = {
  title: 'Stateless Architecture',
  desc: 'Horizontally scalable API layer with Redis-backed coordination and isolated worker processing. Scale-out requires no shared state — add replicas without touching config.',
  glyph: '* scale',
  color: 'text-brand-400',
};

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-nav border-t border-black/[0.06] dark:border-white/[0.05]">
      <div className="section">
        <div className="mb-12 max-w-2xl">
          <span className="section-eyebrow">// features</span>
          <h2 className="section-title">Engineering primitives, not marketing fluff.</h2>
          <p className="section-subtitle">
            Every layer has a single responsibility, observable behavior, and a
            clear boundary. Nothing here is decorative.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04] rounded-lg overflow-hidden">
          {FEATURES.map((f) => (
            <FeatureCell key={f.title} {...f} />
          ))}
          <WideCell {...WIDE_CARD} />
        </div>
      </div>
    </section>
  );
}

function FeatureCell({ title, desc, glyph, code, color, diagram, details }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="group bg-surface-base p-6 hover:bg-surface-card transition-all duration-300 border border-black/[0.06] group-hover:border-black/[0.12] dark:border-white/[0.05] dark:group-hover:border-white/[0.1] cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className={`text-[11px] font-mono ${color} opacity-55 mb-4 transition-opacity duration-300 group-hover:opacity-75`}>{glyph}</div>
      <h3 className="font-semibold text-ink text-[14px] mb-1.5">{title}</h3>
      <p className="text-[13px] text-ink-muted leading-relaxed mb-3">{desc}</p>

      {/* Infra diagram - animates on hover and expand */}
      {diagram && (
        <div className={`text-[10px] font-mono mb-3 transition-all duration-300 ${
          expanded ? 'opacity-100 text-brand-400' : 'opacity-40 group-hover:opacity-60 text-ink-dim'
        }`}>
          {diagram}
        </div>
      )}

      <div className={`text-[11px] font-mono ${color} opacity-75 border-t border-black/[0.05] dark:border-white/[0.04] pt-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-[-2px]`}>
        {code}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[9px] font-mono text-ink-faint transition-all duration-300 opacity-0 group-hover:opacity-100">
        <span className="w-1 h-1 rounded-full bg-accent-green animate-pulse" />
        <span>{expanded ? 'collapse' : 'click details'}</span>
      </div>

      {/* Expandable technical details */}
      {expanded && details && (
        <div className="mt-4 pt-3 border-t border-black/[0.05] dark:border-white/[0.04] text-[10px] leading-relaxed text-ink-muted animate-fade-in">
          {details}
        </div>
      )}
    </div>
  );
}

function WideCell({ title, desc, glyph, color }) {
  return (
    <div className="group col-span-1 sm:col-span-2 lg:col-span-3 bg-surface-base p-6 hover:bg-surface-card transition-all duration-300 border border-black/[0.06] group-hover:border-black/[0.12] dark:border-white/[0.05] dark:group-hover:border-white/[0.1]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex-1 min-w-0">
          <div className={`text-[11px] font-mono ${color} opacity-55 mb-4 transition-opacity duration-300 group-hover:opacity-75`}>{glyph}</div>
          <h3 className="font-semibold text-ink text-[14px] mb-1.5">{title}</h3>
          <p className="text-[13px] text-ink-muted leading-relaxed">{desc}</p>
        </div>
        <div className="shrink-0 bg-surface-elevated border border-black/[0.06] dark:border-white/[0.04] rounded-lg px-4 py-3 font-mono min-w-[210px] transition-all duration-300 group-hover:bg-surface-card group-hover:border-black/[0.1] dark:group-hover:border-white/[0.08]">
          <div className="text-[10px] text-ink-faint uppercase tracking-wider mb-2">routing model</div>
          <div className={`text-[12px] ${color} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}>api-[n] → redis → workers</div>
          <div className="text-[11px] text-ink-dim mt-1.5">horizontal · no shared state</div>
        </div>
      </div>
    </div>
  );
}
