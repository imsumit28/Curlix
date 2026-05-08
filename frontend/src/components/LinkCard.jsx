import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteLink } from '../services/api';

export default function LinkCard({ link, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Delete this link? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteLink(link.short_code, link.owner_token);
      onDelete(link.short_code);
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
      setDeleting(false);
    }
  }

  function copyShort() {
    navigator.clipboard.writeText(link.short_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const expired = link.expires_at && new Date(link.expires_at) < new Date();

  return (
    <div className="card p-4 hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <a
              href={link.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-mono text-ink hover:text-brand-400 transition-colors truncate"
            >
              {link.short_url}
            </a>
            <button
              type="button"
              onClick={copyShort}
              className="shrink-0 text-[10px] font-mono text-ink-dim hover:text-ink transition-colors"
            >
              {copied ? 'copied' : 'copy'}
            </button>
          </div>
          <p className="text-ink-muted text-[12px] truncate">{link.long_url}</p>
          <div className="mt-2 flex items-center gap-3 text-[10px] font-mono text-ink-dim">
            <span>created {new Date(link.created_at).toLocaleDateString()}</span>
            {link.expires_at && (
              <span className={expired ? 'text-accent-rose' : 'text-accent-amber'}>
                · {expired ? 'expired' : `expires ${new Date(link.expires_at).toLocaleDateString()}`}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <Link
            to={`/analytics/${link.short_code}`}
            state={{ ownerToken: link.owner_token }}
            className="px-2.5 py-1.5 rounded-md text-[11px] font-mono text-ink-muted hover:text-ink hover:bg-black/[0.04] dark:hover:bg-white/[0.04] border border-black/[0.07] dark:border-white/[0.06] transition-colors"
          >
            stats
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-2.5 py-1.5 rounded-md text-[11px] font-mono text-accent-rose/80 hover:text-accent-rose hover:bg-accent-rose/[0.08] border border-accent-rose/20 transition-colors disabled:opacity-50"
          >
            {deleting ? '…' : 'delete'}
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-[11px] font-mono text-accent-rose">{error}</p>
      )}
    </div>
  );
}
