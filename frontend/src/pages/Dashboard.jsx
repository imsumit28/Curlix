import { useLocalLinks } from '../hooks/useLocalLinks';
import LinkCard from '../components/LinkCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { links, removeLink } = useLocalLinks();

  return (
    <main className="relative min-h-[calc(100vh-64px)] pt-24 pb-16 px-4">
      <div className="absolute inset-0 dot-bg dot-bg-fade opacity-50 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <span className="section-eyebrow">// my links</span>
            <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.01em] dark:text-white text-gray-900 leading-tight">
              Saved links
            </h1>
            <p className="text-ink-muted text-[13px] mt-1">
              <span className="font-mono text-ink-dim">{links.length}</span>{' '}
              {links.length === 1 ? 'link' : 'links'} stored locally in this browser
            </p>
          </div>
          <Link to="/app" className="btn-primary shrink-0">
            + New link
          </Link>
        </div>

        {links.length === 0 ? (
          <div className="card text-center py-16 px-6">
            <p className="text-ink-muted text-[14px] mb-3">No links yet.</p>
            <Link to="/app" className="text-[13px] font-mono text-brand-400 hover:text-brand-300 transition-colors">
              create your first short link →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => (
              <LinkCard key={link.short_code} link={link} onDelete={removeLink} />
            ))}
          </div>
        )}

        <p className="mt-8 text-[11px] font-mono text-ink-dim">
          ⚠ links live only in localStorage — clearing browser data removes them
        </p>
      </div>
    </main>
  );
}
