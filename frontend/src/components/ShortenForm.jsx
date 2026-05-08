import { useState, useCallback } from 'react';
import { shortenUrl } from '../services/api';
import Turnstile from './Turnstile';

export default function ShortenForm({ onSuccess }) {
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  const handleCaptcha = useCallback((token) => {
    setCaptchaToken(token);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!longUrl.trim()) return setError('Please enter a URL');
    if (siteKey && !captchaToken) return setError('Please complete the CAPTCHA');

    setLoading(true);
    try {
      const data = await shortenUrl({
        longUrl: longUrl.trim(),
        alias: alias.trim() || undefined,
        expiresAt: expiresAt || undefined,
        captchaToken,
      });
      onSuccess(data);
      setLongUrl('');
      setAlias('');
      setExpiresAt('');
      setCaptchaToken(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-1.5">
          Long URL
        </label>
        <input
          type="url"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="https://example.com/very-long-url-here"
          className="w-full bg-surface-base border border-black/[0.08] dark:border-white/[0.08] rounded-md px-3 py-2.5 text-[13px] font-mono text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500/50 transition-colors"
          required
        />
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="text-[12px] font-mono text-ink-muted hover:text-ink transition-colors"
      >
        {showAdvanced ? '− advanced options' : '+ advanced options'}
      </button>

      {showAdvanced && (
        <div className="space-y-3 p-3.5 rounded-md bg-surface-base border border-black/[0.06] dark:border-white/[0.05]">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-1.5">
              Custom alias
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-mono text-ink-dim">curlix.io/</span>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-link"
                pattern="[a-zA-Z0-9_-]{2,50}"
                className="flex-1 bg-surface-elevated border border-black/[0.06] dark:border-white/[0.06] rounded-md px-2.5 py-2 text-[13px] font-mono text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-1.5">
              Expires at
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full bg-surface-elevated border border-black/[0.06] dark:border-white/[0.06] rounded-md px-2.5 py-2 text-[13px] font-mono text-ink focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>
        </div>
      )}

      {siteKey && (
        <div className="-my-1">
          <Turnstile onVerify={handleCaptcha} />
        </div>
      )}

      {error && (
        <div className="text-[12px] font-mono text-accent-rose bg-accent-rose/[0.05] border border-accent-rose/20 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-md bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:ring-offset-2 focus:ring-offset-surface-base"
      >
        {loading ? 'Shortening…' : 'Shorten URL'}
      </button>
    </form>
  );
}
