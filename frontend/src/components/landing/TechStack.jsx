import { useState } from 'react';

const STACK = [
  { name: 'React', kind: 'frontend', desc: 'UI component library for reactive interfaces' },
  { name: 'Vite', kind: 'frontend', desc: 'Next-generation build tool for instant HMR' },
  { name: 'Tailwind', kind: 'frontend', desc: 'Utility-first CSS framework for styling' },
  { name: 'Node.js', kind: 'runtime', desc: 'JavaScript runtime for server execution' },
  { name: 'Express', kind: 'runtime', desc: 'Lightweight HTTP framework for routing' },
  { name: 'PostgreSQL', kind: 'storage', desc: 'Authoritative data store, source of truth' },
  { name: 'Redis', kind: 'storage', desc: 'Sub-ms hot-path caching layer' },
  { name: 'BullMQ', kind: 'queue', desc: 'Async analytics ingestion, non-blocking' },
  { name: 'Supabase', kind: 'platform', desc: 'Managed PostgreSQL with real-time APIs' },
  { name: 'Upstash', kind: 'platform', desc: 'Serverless Redis for global caching' },
  { name: 'Vercel', kind: 'platform', desc: 'Optimized frontend deployment' },
  { name: 'Render', kind: 'platform', desc: 'API server and worker hosting' },
];

const RELATIONSHIPS = [
  { from: 'Express', to: 'Redis', label: 'reads hot path' },
  { from: 'Redis', to: 'PostgreSQL', label: 'warm on miss' },
  { from: 'Express', to: 'BullMQ', label: 'async tasks' },
  { from: 'BullMQ', to: 'PostgreSQL', label: 'persist events' },
];

const KIND_STYLE = {
  frontend: { label: 'frontend', dot: 'bg-brand-400', text: 'text-brand-400' },
  runtime:  { label: 'runtime',  dot: 'bg-accent-green', text: 'text-accent-green' },
  storage:  { label: 'storage',  dot: 'bg-accent-amber', text: 'text-accent-amber' },
  queue:    { label: 'queue',    dot: 'bg-accent-rose', text: 'text-accent-rose' },
  platform: { label: 'platform', dot: 'bg-accent-cyan', text: 'text-accent-cyan' },
};

export default function TechStack() {
  const [hoveredChip, setHoveredChip] = useState(null);

  return (
    <section className="relative border-t border-black/[0.06] dark:border-white/[0.05]">
      <div className="section">
        <div className="mb-10 max-w-2xl">
          <span className="section-eyebrow">// stack</span>
          <h2 className="section-title">The infrastructure under the hood.</h2>
          <p className="section-subtitle">
            Boring, well-understood components — assembled in a way that's easy to
            reason about and replace.
          </p>
        </div>

        <div className="relative">
          {/* Relationship connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="var(--connector-stroke)" opacity="0.3" />
              </marker>
            </defs>
            {/* Connections will be drawn dynamically - for now they're just defined */}
          </svg>

          <div className="flex flex-wrap gap-1.5 relative z-10">
            {STACK.map((tech) => {
              const style = KIND_STYLE[tech.kind];
              const isHovered = hoveredChip === tech.name;
              const isConnected = RELATIONSHIPS.some(r =>
                (r.from === tech.name && hoveredChip === r.to) ||
                (r.to === tech.name && hoveredChip === r.from)
              );

              return (
                <Chip
                  key={tech.name}
                  tech={tech}
                  style={style}
                  isHovered={isHovered}
                  isConnected={isConnected}
                  onHover={setHoveredChip}
                />
              );
            })}
          </div>

          {/* Relationship labels */}
          {hoveredChip && (
            <div className="mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.05]">
              {RELATIONSHIPS.filter(r => r.from === hoveredChip || r.to === hoveredChip).map((rel, idx) => (
                <div key={idx} className="text-[12px] text-ink-muted font-mono mb-2">
                  <span className="text-ink">{rel.from}</span>
                  <span className="mx-2">→</span>
                  <span className="text-ink">{rel.to}</span>
                  <span className="mx-2 text-ink-dim">•</span>
                  <span className="text-ink-dim">{rel.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Chip({ tech, style, isHovered, isConnected, onHover }) {
  const getColorVars = () => {
    const colorMap = {
      'bg-brand-400': '#3b82f6',
      'bg-accent-green': '#10b981',
      'bg-accent-amber': '#f59e0b',
      'bg-accent-rose': '#f43f5e',
      'bg-accent-cyan': '#06b6d4',
    };
    return colorMap[style.dot] || '#6b7280';
  };

  const glowColor = getColorVars();

  return (
    <div className="relative group">
      <style>{`
        .chip-glow-${tech.name} {
          animation: glow-${tech.name} 2s ease-in-out infinite;
        }
        @keyframes glow-${tech.name} {
          0%, 100% { box-shadow: 0 0 8px ${glowColor}40; }
          50% { box-shadow: 0 0 16px ${glowColor}60; }
        }
      `}</style>
      <button
        onMouseEnter={() => onHover(tech.name)}
        onMouseLeave={() => onHover(null)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-card border text-[12px] text-ink transition-all duration-200 cursor-pointer ${
          isHovered
            ? `${style.text} shadow-md chip-glow-${tech.name}`
            : isConnected
            ? `border-black/[0.12] dark:border-white/[0.10] opacity-70`
            : 'border-black/[0.07] dark:border-white/[0.06] hover:border-black/[0.14] dark:hover:border-white/[0.12]'
        }`}
        style={isHovered ? { borderColor: glowColor } : {}}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${isHovered ? 'animate-pulse' : ''}`} />
        <span className={`text-[10px] font-mono ${style.text}`}>{style.label}</span>
        <span className="w-px h-3 bg-black/[0.10] dark:bg-white/[0.08]" />
        <span>{tech.name}</span>
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-[11px] rounded-md whitespace-nowrap z-20 pointer-events-none shadow-lg border border-white/10">
          {tech.desc}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
}
