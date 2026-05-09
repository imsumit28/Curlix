import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { shortenUrl } from '../../services/api';
import Turnstile from '../Turnstile';

const RECENT_KEY = 'curlix_recent';
const MAX_RECENT = 3;

const FAKE_REDIRECTS = [
  { code: 'launch-2025', country: 'US', ms: 3 },
  { code: 'api-docs-v3', country: 'IN', ms: 4 },
  { code: 'summer-sale', country: 'DE', ms: 3 },
  { code: 'onboarding',  country: 'SG', ms: 5 },
  { code: 'pricing-v2',  country: 'BR', ms: 4 },
  { code: 'blog-redis',  country: 'JP', ms: 6 },
  { code: 'demo-live',   country: 'GB', ms: 3 },
];

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); }
  catch { return []; }
}

function saveRecent(entry, prev) {
  const next = [entry, ...prev.filter(l => l.short_code !== entry.short_code)].slice(0, MAX_RECENT);
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
  return next;
}

function formatAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function HeroShortener() {
  const [longUrl, setLongUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [showSlug, setShowSlug] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [createMs, setCreateMs] = useState(null);
  const [copied, setCopied] = useState(false);
  const [recentLinks, setRecentLinks] = useState(loadRecent);
  const [redirectCount, setRedirectCount] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const handleCaptcha = useCallback((token) => setCaptchaToken(token), []);

  useEffect(() => {
    if (!showQrModal) return;
    const onKey = (e) => { if (e.key === 'Escape') setShowQrModal(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showQrModal]);

  // Animate redirect count upward when result arrives
  useEffect(() => {
    if (!result) { setRedirectCount(0); return; }
    const target = 5 + Math.floor(Math.random() * 18);
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 1400);
      setRedirectCount(Math.round((1 - (1 - t) ** 3) * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result]);

  async function handleShorten() {
    setError('');
    if (!longUrl.trim()) return setError('Please enter a URL');
    if (siteKey && !captchaToken) return setError('Please complete the CAPTCHA');

    setLoading(true);
    const t0 = performance.now();
    try {
      const data = await shortenUrl({
        longUrl: longUrl.trim(),
        alias: customSlug.trim() || undefined,
        captchaToken,
      });
      const elapsed = Math.max(1, Math.round(performance.now() - t0));
      setResult(data);
      setCreateMs(elapsed);
      setRecentLinks(prev => saveRecent({
        short_url: data.short_url,
        short_code: data.short_code,
        long_url: longUrl.trim(),
        owner_token: data.owner_token,
        ts: Date.now(),
      }, prev));
    } catch (err) {
      setError(err.response?.data?.error || 'API unreachable. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  function copyShort() {
    if (!result) return;
    navigator.clipboard.writeText(result.short_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function reset() {
    setResult(null);
    setError('');
    setCreateMs(null);
    setCaptchaToken(null);
    setCopied(false);
    setCustomSlug('');
    setShowSlug(false);
  }

  function handleChange(e) {
    setLongUrl(e.target.value);
    if (result) reset();
  }

  const qrSrc = result
    ? `https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(result.short_url)}&bgcolor=ffffff&color=111111&qzone=1`
    : null;

  return (
    <div className="space-y-3 text-left">
      {/* Main input row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={longUrl}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && !loading && handleShorten()}
          disabled={loading}
          placeholder="https://github.com/vercel/next.js/pull/62506/files"
          className="flex-1 h-12 sm:h-[52px] bg-surface-elevated border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-4 text-[15px] font-mono text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 transition-all disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleShorten}
          disabled={loading}
          className={`h-12 sm:h-[52px] px-7 rounded-xl font-semibold text-[14px] transition-all duration-150 flex items-center justify-center gap-2 whitespace-nowrap active:scale-[0.97] ${
            result
              ? 'bg-accent-green/[0.1] border border-accent-green/25 text-accent-green'
              : 'bg-brand-500 hover:bg-brand-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white'
          }`}
        >
          {loading ? <><Spinner /> Shortening…</> : result ? <><CheckIcon /> Shortened</> : 'Shorten →'}
        </button>
      </div>

      {/* Custom slug toggle */}
      {!result && (
        <div className="min-h-[24px]">
          {!showSlug ? (
            <button
              type="button"
              onClick={() => setShowSlug(true)}
              className="text-[11px] font-mono text-ink-faint hover:text-ink-dim transition-colors flex items-center gap-1.5"
            >
              <span className="text-[13px] leading-none">+</span>
              Custom slug
            </button>
          ) : (
            <div className="flex items-center gap-2 animate-fade-in">
              <span className="text-[12px] font-mono text-ink-dim shrink-0 select-none">curlix.vercel.app/</span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) =>
                  setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                }
                placeholder="summer-sale"
                maxLength={32}
                autoFocus
                className="flex-1 h-8 bg-surface-elevated border border-black/[0.08] dark:border-white/[0.08] rounded-lg px-2.5 text-[12px] font-mono text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500/50 transition-colors"
              />
              {customSlug && (
                <span className="text-[11px] font-mono text-brand-400 truncate max-w-[130px] shrink-0">
                  ✓ curlix.vercel.app/{customSlug}
                </span>
              )}
              <button
                type="button"
                onClick={() => { setShowSlug(false); setCustomSlug(''); }}
                className="text-[11px] text-ink-faint hover:text-ink-dim transition-colors shrink-0"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {siteKey && !result && (
        <div className="flex justify-center sm:justify-start">
          <Turnstile onVerify={handleCaptcha} />
        </div>
      )}

      {error && (
        <div className="text-[12px] font-mono text-accent-rose bg-accent-rose/[0.05] border border-accent-rose/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className="card overflow-hidden animate-fade-in">
          <div className="px-4 pt-4 pb-3 space-y-4">

            {/* Short URL + QR */}
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-1.5">
                  Short URL
                </div>
                <div className="flex items-center gap-2 bg-surface-base border border-black/[0.08] dark:border-white/[0.08] rounded-md px-3 py-2.5">
                  <a
                    href={result.short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-[14px] font-mono text-ink truncate hover:text-brand-400 transition-colors"
                  >
                    {result.short_url}
                  </a>
                  {/* Polished copy button */}
                  <button
                    type="button"
                    onClick={copyShort}
                    className={`shrink-0 flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded border transition-all duration-200 ${
                      copied
                        ? 'text-accent-green bg-accent-green/[0.08] border-accent-green/25 scale-105'
                        : 'text-ink-muted hover:text-ink border-transparent hover:border-black/[0.08] dark:hover:border-white/[0.08]'
                    }`}
                  >
                    {copied ? <CheckIcon /> : <ClipboardIcon />}
                    <span className="ml-0.5">{copied ? 'copied!' : 'copy'}</span>
                  </button>
                </div>
              </div>

              {/* QR preview — click to expand */}
              <div className="shrink-0">
                <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-1.5">
                  QR
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  title="Click to enlarge QR code"
                  className="w-[54px] h-[54px] rounded-md border border-black/[0.08] dark:border-white/[0.08] overflow-hidden bg-white flex items-center justify-center hover:ring-2 hover:ring-brand-500/40 transition-all"
                >
                  <img
                    src={qrSrc}
                    alt="QR code"
                    width={54}
                    height={54}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              </div>
            </div>

            {/* Animated redirect flow */}
            <RedirectFlow shortCode={result.short_code} />

            {/* Request trace */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-1.5">
                Request trace
              </div>
              <div className="bg-surface-base border border-black/[0.06] dark:border-white/[0.06] rounded-md font-mono text-[12px] leading-[1.7] py-2.5 px-3">
                <Trace method="POST" path="/api/shorten" status="201" ms={createMs} tone="brand" />
                <TraceLine ok>short_code   {result.short_code}</TraceLine>
                <TraceLine>stored       postgres</TraceLine>
                <TraceLine>cached       redis  ttl=86400s</TraceLine>
                <div className="my-1.5 border-t border-black/[0.05] dark:border-white/[0.04]" />
                <Trace method="GET" path={`/${result.short_code}`} status="302" ms="3.8" tone="green" />
                <TraceLine ok>cache        HIT (redis)</TraceLine>
                <TraceLine>resolve      3.8ms</TraceLine>
                <TraceLine amber>queue        enqueued analytics:click</TraceLine>
              </div>
            </div>

            {/* Actions + redirect count */}
            <div className="flex items-center justify-between pt-0.5 gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={reset}
                  className="text-[12px] font-mono text-ink-muted hover:text-ink transition-colors"
                >
                  ← shorten another
                </button>
                <span className="text-ink-faint text-[10px]">·</span>
                <span className="text-[11px] font-mono text-ink-dim tabular-nums">
                  <span className="text-accent-amber">{redirectCount}</span> redirects today
                </span>
              </div>
              <Link
                to="/dashboard"
                className="text-[12px] font-mono text-ink-muted hover:text-ink transition-colors shrink-0"
              >
                view all →
              </Link>
            </div>
          </div>

          <StatusBar />
        </div>
      )}

      {/* QR modal */}
      {showQrModal && result && (
        <QrModal
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(result.short_url)}&bgcolor=ffffff&color=111111&qzone=2`}
          shortUrl={result.short_url}
          onClose={() => setShowQrModal(false)}
        />
      )}

      {/* Idle state: live preview + recent links */}
      {!result && (
        <>
          <LivePreview />
          {recentLinks.length > 0 && <RecentFeed links={recentLinks} />}
        </>
      )}
    </div>
  );
}

/* ─── Redirect Flow ────────────────────────────────────── */

function RedirectFlow({ shortCode }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-2">
        Redirect flow
      </div>
      <div className="flex items-center gap-1.5">
        <FlowNode label="Browser" icon={<BrowserIcon />} />
        <FlowConnector label="request" delay="0s" />
        <FlowNode label={`curlix/${shortCode}`} icon={<BoltIcon />} highlight />
        <FlowConnector label="302 found" delay="0.55s" green />
        <FlowNode label="Destination" icon={<GlobeIcon />} green />
      </div>
    </div>
  );
}

function FlowNode({ label, icon, highlight, green }) {
  const border = highlight
    ? 'border-brand-500/30 bg-brand-500/[0.06]'
    : green
    ? 'border-accent-green/30 bg-accent-green/[0.05]'
    : 'border-black/[0.08] dark:border-white/[0.08] bg-surface-base';
  const text = highlight ? 'text-brand-400' : green ? 'text-accent-green' : 'text-ink-muted';
  return (
    <div className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border ${border} shrink-0`}>
      <span className={text}>{icon}</span>
      <span className={`text-[9px] font-mono max-w-[68px] text-center truncate ${text}`}>{label}</span>
    </div>
  );
}

function FlowConnector({ label, delay, green }) {
  const stroke = green ? '#22C55E' : '#60A5FA';
  const bg = green ? 'rgba(34,197,94,0.08)' : 'rgba(96,165,250,0.08)';
  return (
    <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
      <svg width="100%" height="14" style={{ overflow: 'visible' }}>
        {/* Static base track */}
        <line
          x1="4" y1="7" x2="100%" y2="7"
          stroke="var(--surface-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Animated marching dashes */}
        <line
          x1="4" y1="7" x2="100%" y2="7"
          stroke={stroke}
          strokeWidth="1.5"
          strokeDasharray="5 5"
          strokeLinecap="round"
          className="animate-flow"
          style={{ animationDelay: delay }}
        />
        {/* Arrowhead glow dot at the right end */}
        <circle cx="100%" r="3" cy="7" fill={stroke} opacity="0.7">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1.2s"
            begin={delay}
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span className="text-[9px] font-mono text-ink-faint whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ─── Live Preview ─────────────────────────────────────── */

function LivePreview() {
  const [events, setEvents] = useState(() =>
    FAKE_REDIRECTS.slice(0, 3).map((e, i) => ({ ...e, key: i }))
  );
  const [count, setCount] = useState(1247);
  const idxRef = useRef(3);

  useEffect(() => {
    const id = setInterval(() => {
      const next = FAKE_REDIRECTS[idxRef.current % FAKE_REDIRECTS.length];
      idxRef.current++;
      setEvents(prev => [{ ...next, key: Date.now() }, ...prev.slice(0, 2)]);
      setCount(c => c + 1);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-black/[0.07] dark:border-white/[0.07] overflow-hidden bg-surface-elevated">
      <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.05] dark:border-white/[0.04]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-ink-dim">Live redirects</span>
        </div>
        <span className="text-[10px] font-mono text-ink-faint tabular-nums">{count.toLocaleString()} today</span>
      </div>
      <div>
        {events.map((ev) => (
          <div
            key={ev.key}
            className="flex items-center gap-2 px-3 py-1.5 border-b last:border-b-0 border-black/[0.04] dark:border-white/[0.03] animate-fade-in"
          >
            <span className="text-[10px] font-mono text-accent-green shrink-0">→</span>
            <span className="text-[11px] font-mono text-ink flex-1 truncate">curlix.vercel.app/{ev.code}</span>
            <span className="text-[10px] font-mono text-ink-faint shrink-0 w-6 text-right">{ev.country}</span>
            <span className="text-[10px] font-mono text-accent-amber shrink-0 tabular-nums w-8 text-right">{ev.ms}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Recent Links Feed ────────────────────────────────── */

function fakeStats(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) | 0;
  const clicks = 23 + Math.abs(h % 480);
  const pool = ['US', 'IN', 'DE', 'GB', 'SG', 'BR', 'JP', 'CA'];
  const raw = [pool[Math.abs(h) % 8], pool[Math.abs(h >> 3) % 8], pool[Math.abs(h >> 6) % 8]];
  return { clicks, countries: [...new Set(raw)].slice(0, 3) };
}

function RecentFeed({ links }) {
  return (
    <div className="space-y-1.5 animate-fade-in">
      <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-faint px-0.5">
        Recent
      </div>
      {links.map(link => (
        <RecentRow key={link.short_code} link={link} />
      ))}
    </div>
  );
}

function RecentRow({ link }) {
  const [copied, setCopied] = useState(false);
  const { clicks, countries } = fakeStats(link.short_code);

  function copy() {
    navigator.clipboard.writeText(link.short_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const display = link.short_url.replace(/^https?:\/\//, '');
  const origin = link.long_url.replace(/^https?:\/\//, '').split('/')[0];

  return (
    <div className="flex flex-col gap-1.5 px-3 py-2.5 rounded-lg bg-surface-elevated border border-black/[0.05] dark:border-white/[0.04] hover:bg-surface-card hover:border-black/[0.1] dark:hover:border-white/[0.08] hover:shadow-sm transition-all duration-150">
      {/* Short URL + time */}
      <div className="flex items-center justify-between gap-2">
        <a
          href={link.short_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-mono text-ink hover:text-brand-400 transition-colors truncate"
        >
          {display}
        </a>
        <span className="text-[10px] font-mono text-ink-faint shrink-0">{formatAgo(link.ts)}</span>
      </div>
      {/* Origin + fake analytics */}
      <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-dim">
        <span className="truncate max-w-[110px]">{origin}</span>
        <span className="text-ink-faint shrink-0">·</span>
        <span className="shrink-0">{clicks} clicks</span>
        <span className="text-ink-faint shrink-0">·</span>
        <span className="shrink-0">{countries.join(' · ')}</span>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border transition-all duration-150 ${
            copied
              ? 'text-accent-green bg-accent-green/[0.08] border-accent-green/25 scale-105'
              : 'text-ink-faint hover:text-ink-muted border-transparent hover:border-black/[0.08] dark:hover:border-white/[0.08]'
          }`}
        >
          {copied ? <CheckIcon /> : <ClipboardIcon />}
          <span className="ml-0.5">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
        <Link
          to={`/analytics/${link.short_code}`}
          state={{ ownerToken: link.owner_token }}
          className="flex items-center gap-1 text-[10px] font-mono text-ink-faint hover:text-brand-400 transition-colors"
        >
          <BarChartIcon />
          <span>Analytics</span>
        </Link>
      </div>
    </div>
  );
}

/* ─── Trace ────────────────────────────────────────────── */

function Trace({ method, path, status, ms, tone }) {
  const methodColor = { POST: 'text-brand-400', GET: 'text-accent-green' }[method] || 'text-ink';
  const statusColor = tone === 'green' ? 'text-accent-green' : 'text-ink';
  return (
    <div className="flex items-center gap-3 text-ink">
      <span className={`${methodColor} font-semibold w-10`}>{method}</span>
      <span className="flex-1 truncate">{path}</span>
      <span className={`${statusColor} tabular-nums`}>{status}</span>
      <span className="text-ink-muted tabular-nums w-12 text-right">{ms}ms</span>
    </div>
  );
}

function TraceLine({ children, ok, amber }) {
  const color = ok ? 'text-accent-green' : amber ? 'text-accent-amber' : 'text-ink-muted';
  return <div className={`pl-[3.25rem] ${color} whitespace-pre`}>{children}</div>;
}

/* ─── Status Bar ───────────────────────────────────────── */

function StatusBar() {
  return (
    <div className="grid grid-cols-4 border-t border-black/[0.06] dark:border-white/[0.06] divide-x divide-black/[0.06] dark:divide-white/[0.06]">
      <Stat label="p50" value="4ms" tone="brand" />
      <Stat label="cache" value="87%" tone="cyan" />
      <Stat label="queue" value="0" tone="amber" />
      <Stat label="uptime" value="99.97%" tone="green" />
    </div>
  );
}

function Stat({ label, value, tone }) {
  const valColor = {
    green: 'text-accent-green',
    brand: 'text-brand-400',
    cyan: 'text-accent-cyan',
    amber: 'text-accent-amber',
  }[tone] || 'text-ink';
  return (
    <div className="px-3 py-2.5">
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">{label}</div>
      <div className={`text-[13px] font-mono mt-0.5 ${valColor}`}>{value}</div>
    </div>
  );
}

/* ─── QR Modal ─────────────────────────────────────────── */

function QrModal({ src, shortUrl, onClose }) {
  const ref = useRef(null);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={ref}
        className="bg-surface-card border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5 flex flex-col items-center gap-3 animate-fade-up shadow-2xl"
        style={{ minWidth: 240 }}
      >
        <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim">
          Scan to open
        </div>
        <div className="rounded-xl overflow-hidden border border-black/[0.06] dark:border-white/[0.06] bg-white p-2">
          <img
            src={src}
            alt="QR code"
            width={200}
            height={200}
            className="block"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
        <p className="text-[12px] font-mono text-ink-muted text-center break-all max-w-[220px]">
          {shortUrl}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] font-mono text-ink-faint hover:text-ink-muted transition-colors mt-1"
        >
          esc to close
        </button>
      </div>
    </div>
  );
}

/* ─── Icons ────────────────────────────────────────────── */

function ClipboardIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 3px rgba(59,130,246,0.55))'}}>
      <rect x="5" y="3" width="14" height="18" rx="2" fill="#1D4ED8"/>
      <rect x="5" y="3" width="14" height="18" rx="2" fill="#3B82F6"/>
      <rect x="5" y="3" width="14" height="7" rx="2" fill="#60A5FA"/>
      <rect x="9" y="0.5" width="6" height="5.5" rx="2" fill="#93C5FD"/>
      <rect x="10.5" y="0" width="3" height="3.5" rx="1.5" fill="#DBEAFE"/>
      <rect x="7" y="12" width="10" height="1.5" rx="0.75" fill="white" opacity="0.35"/>
      <rect x="7" y="15.5" width="7" height="1.5" rx="0.75" fill="white" opacity="0.25"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 3px rgba(16,185,129,0.55))'}}>
      <circle cx="12" cy="12" r="11" fill="#047857"/>
      <circle cx="12" cy="12" r="11" fill="#10B981"/>
      <ellipse cx="10" cy="9" rx="7" ry="4" fill="#34D399" opacity="0.25"/>
      <polyline points="6 12 10.5 16.5 18 8" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BrowserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.35))'}}>
      <rect x="2" y="3" width="20" height="18" rx="2.5" fill="currentColor" opacity="0.8"/>
      <rect x="2" y="3" width="20" height="7" rx="2.5" fill="currentColor"/>
      <rect x="2" y="7" width="20" height="3" fill="currentColor"/>
      <circle cx="6" cy="6.5" r="1.3" fill="white" opacity="0.65"/>
      <circle cx="10" cy="6.5" r="1.3" fill="white" opacity="0.65"/>
      <rect x="14" y="5.5" width="6" height="2" rx="1" fill="white" opacity="0.25"/>
      <rect x="4" y="13" width="10" height="1.5" rx="0.75" fill="white" opacity="0.2"/>
      <rect x="4" y="16.5" width="16" height="1.5" rx="0.75" fill="white" opacity="0.15"/>
      <ellipse cx="9" cy="6" rx="7" ry="2" fill="white" opacity="0.1"/>
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.35))'}}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/>
      <polygon points="13 2 8.5 9 10 9 13 2" fill="white" opacity="0.4"/>
      <polygon points="13 2 3 14 5.5 14 13 2" fill="white" opacity="0.15"/>
      <polygon points="12 14 11 22 13.5 16.5 12 14" fill="white" opacity="0.2"/>
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 3px rgba(0,0,0,0.35))'}}>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" stroke="currentColor" strokeWidth="1.4" fill="none"/>
      <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" stroke="currentColor" strokeWidth="1.4" fill="none"/>
      <circle cx="9" cy="8.5" r="3.5" fill="white" opacity="0.12"/>
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'}}>
      <rect x="3" y="14" width="5" height="8" rx="1.5" fill="currentColor" opacity="0.7"/>
      <rect x="9.5" y="4" width="5" height="18" rx="1.5" fill="currentColor"/>
      <rect x="16" y="9" width="5" height="13" rx="1.5" fill="currentColor" opacity="0.85"/>
      <rect x="3" y="14" width="5" height="3" rx="1.5" fill="white" opacity="0.3"/>
      <rect x="9.5" y="4" width="5" height="3" rx="1.5" fill="white" opacity="0.3"/>
      <rect x="16" y="9" width="5" height="3" rx="1.5" fill="white" opacity="0.3"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" className="animate-spin" fill="none" style={{filter:'drop-shadow(0 0 4px rgba(59,130,246,0.6))'}}>
      <defs>
        <linearGradient id="spinGrad" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93C5FD"/>
          <stop offset="100%" stopColor="#3B82F6"/>
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.2"/>
      <path d="M21 12a9 9 0 0 0-9-9" stroke="url(#spinGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
