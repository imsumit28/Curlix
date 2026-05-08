import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

export default function ShortUrlResult({ result, onDismiss }) {
  const [copied, setCopied] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showQr, setShowQr] = useState(false);

  function copy(text, setter) {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 1500);
    });
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Short URL */}
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-1.5">
          Short URL
        </label>
        <div className="flex items-center gap-2 bg-surface-base border border-black/[0.08] dark:border-white/[0.08] rounded-md px-3 py-2.5">
          <a
            href={result.short_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-[13px] font-mono text-ink truncate hover:text-brand-400 transition-colors"
          >
            {result.short_url}
          </a>
          <button
            type="button"
            onClick={() => copy(result.short_url, setCopied)}
            className="shrink-0 text-[11px] font-mono text-ink-muted hover:text-ink transition-colors"
          >
            {copied ? 'copied' : 'copy'}
          </button>
        </div>
      </div>

      {/* QR + token actions row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowQr((v) => !v)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-mono text-ink-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] rounded-md py-2 transition-colors"
        >
          {showQr ? '− qr code' : '+ qr code'}
        </button>
        <button
          type="button"
          onClick={() => setShowToken((v) => !v)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-mono text-ink-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] rounded-md py-2 transition-colors"
        >
          {showToken ? '− owner token' : '+ owner token'}
        </button>
      </div>

      {showQr && (
        <div className="flex justify-center p-4 bg-surface-base border border-black/[0.06] dark:border-white/[0.06] rounded-md">
          <div className="p-3 bg-white rounded-md inline-block">
            <QRCodeSVG value={result.short_url} size={132} />
          </div>
        </div>
      )}

      {showToken && (
        <div className="rounded-md bg-accent-amber/[0.05] border border-accent-amber/20 p-3.5 space-y-2">
          <p className="text-accent-amber text-[12px] font-mono">
            ⚠ owner_token shown once — store it securely
          </p>
          <p className="text-ink-muted text-[11px] font-mono leading-relaxed">
            Required to edit or delete this link. There is no recovery mechanism.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-[11px] bg-surface-base px-2.5 py-2 rounded border border-black/[0.06] dark:border-white/[0.06] text-ink truncate">
              {result.owner_token}
            </code>
            <button
              type="button"
              onClick={() => copy(result.owner_token, setTokenCopied)}
              className="shrink-0 text-[11px] font-mono text-ink-muted hover:text-ink px-2 py-2 transition-colors"
            >
              {tokenCopied ? 'copied' : 'copy'}
            </button>
          </div>
        </div>
      )}

      {/* Metadata trace */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-1.5">
          Request trace
        </div>
        <div className="bg-surface-base border border-black/[0.06] dark:border-white/[0.06] rounded-md font-mono text-[12px] leading-[1.7] py-2.5 px-3">
          <div className="flex items-center gap-3 text-ink">
            <span className="text-brand-400 font-semibold w-10">POST</span>
            <span className="flex-1 truncate">/api/shorten</span>
            <span className="text-accent-green tabular-nums">201</span>
          </div>
          <div className="pl-[3.25rem] text-accent-green whitespace-pre">short_code   {result.short_code}</div>
          <div className="pl-[3.25rem] text-ink-muted whitespace-pre">stored       postgres</div>
          <div className="pl-[3.25rem] text-ink-muted whitespace-pre">cached       redis  ttl=86400s</div>
          {result.expires_at && (
            <div className="pl-[3.25rem] text-accent-amber whitespace-pre">expires_at   {new Date(result.expires_at).toISOString()}</div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onDismiss}
          className="text-[12px] font-mono text-ink-muted hover:text-ink transition-colors"
        >
          ← shorten another
        </button>
        <Link
          to={`/analytics/${result.short_code}`}
          state={{ ownerToken: result.owner_token }}
          className="text-[12px] font-mono text-ink-muted hover:text-ink transition-colors"
        >
          view analytics →
        </Link>
      </div>
    </div>
  );
}
