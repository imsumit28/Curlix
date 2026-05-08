import { useState } from 'react';
import { Link } from 'react-router-dom';
import ShortenForm from '../components/ShortenForm';
import ShortUrlResult from '../components/ShortUrlResult';
import { useLocalLinks } from '../hooks/useLocalLinks';

export default function Shorten() {
  const [result, setResult] = useState(null);
  const { saveLink } = useLocalLinks();

  function handleSuccess(data) {
    setResult(data);
    saveLink({
      short_code: data.short_code,
      short_url: data.short_url,
      long_url: data.long_url,
      owner_token: data.owner_token,
      created_at: data.created_at,
      expires_at: data.expires_at,
    });
  }

  return (
    <main className="relative min-h-[calc(100vh-64px)] pt-28 pb-16 px-4">
      <div className="absolute inset-0 dot-bg dot-bg-fade opacity-50 pointer-events-none" />

      <div className="relative max-w-lg mx-auto">
        <div className="mb-8">
          <span className="section-eyebrow">// shorten</span>
          <h1 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.01em] dark:text-white text-gray-900 mb-2 leading-tight">
            Create a short link.
          </h1>
          <p className="text-ink-muted text-[14px]">
            Paste a long URL — get a Redis-backed short link with optional analytics.
          </p>
        </div>

        <div className="card p-6">
          {result ? (
            <ShortUrlResult result={result} onDismiss={() => setResult(null)} />
          ) : (
            <ShortenForm onSuccess={handleSuccess} />
          )}
        </div>

        <div className="mt-5 text-[12px] font-mono text-ink-dim">
          <Link to="/dashboard" className="hover:text-ink transition-colors">
            view saved links →
          </Link>
        </div>
      </div>
    </main>
  );
}
