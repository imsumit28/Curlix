import { useState, useEffect } from 'react';

/* ─── 3D SVG Icons ─────────────────────────────────────────────── */
function IconFrontend() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fg-bg" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="26" height="26" rx="7" fill="url(#fg-bg)" filter="drop-shadow(0 3px 6px rgba(3,105,161,0.5))" />
      <rect x="1" y="1" width="26" height="9" rx="7" fill="white" opacity="0.12" />
      <circle cx="14" cy="14" r="3.2" fill="white" opacity="0.95" />
      <ellipse cx="14" cy="14" rx="10.5" ry="3.8" stroke="white" strokeWidth="1.4" fill="none" opacity="0.75" />
      <ellipse cx="14" cy="14" rx="10.5" ry="3.8" stroke="white" strokeWidth="1.4" fill="none" opacity="0.75" transform="rotate(60 14 14)" />
      <ellipse cx="14" cy="14" rx="10.5" ry="3.8" stroke="white" strokeWidth="1.4" fill="none" opacity="0.75" transform="rotate(120 14 14)" />
    </svg>
  );
}

function IconAPI() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="api-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="26" height="26" rx="7" fill="url(#api-bg)" filter="drop-shadow(0 3px 6px rgba(76,29,149,0.5))" />
      <rect x="1" y="1" width="26" height="9" rx="7" fill="white" opacity="0.12" />
      <rect x="6" y="8" width="16" height="3" rx="1.5" fill="white" opacity="0.9" />
      <rect x="6" y="13" width="10" height="2.5" rx="1.2" fill="white" opacity="0.65" />
      <rect x="6" y="17.5" width="13" height="2.5" rx="1.2" fill="white" opacity="0.65" />
      <circle cx="21" cy="19.5" r="3" fill="#c4b5fd" opacity="0.9" />
      <path d="M20 19.5 L22 19.5 M21 18.5 L21 20.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function IconRedis() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="redis-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="redis-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fecaca" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="26" height="26" rx="7" fill="url(#redis-bg)" filter="drop-shadow(0 3px 6px rgba(185,28,28,0.5))" />
      <rect x="1" y="1" width="26" height="9" rx="7" fill="white" opacity="0.12" />
      <ellipse cx="14" cy="10" rx="8" ry="3" fill="url(#redis-top)" />
      <rect x="6" y="10" width="16" height="8" fill="#dc2626" />
      <ellipse cx="14" cy="18" rx="8" ry="3" fill="#b91c1c" />
      <ellipse cx="14" cy="10" rx="8" ry="3" fill="url(#redis-top)" opacity="0.9" />
      <ellipse cx="14" cy="10" rx="5" ry="1.5" fill="white" opacity="0.2" />
    </svg>
  );
}

function IconPostgres() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pg-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="pg-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="26" height="26" rx="7" fill="url(#pg-bg)" filter="drop-shadow(0 3px 6px rgba(30,64,175,0.5))" />
      <rect x="1" y="1" width="26" height="9" rx="7" fill="white" opacity="0.12" />
      <ellipse cx="14" cy="8.5" rx="7.5" ry="2.5" fill="url(#pg-top)" />
      <rect x="6.5" y="8.5" width="15" height="4" fill="#2563eb" />
      <ellipse cx="14" cy="12.5" rx="7.5" ry="2.5" fill="url(#pg-top)" opacity="0.85" />
      <rect x="6.5" y="12.5" width="15" height="4" fill="#1d4ed8" />
      <ellipse cx="14" cy="16.5" rx="7.5" ry="2.5" fill="url(#pg-top)" opacity="0.7" />
      <ellipse cx="14" cy="8.5" rx="4" ry="1.2" fill="white" opacity="0.25" />
    </svg>
  );
}

function IconQueue() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="q-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="26" height="26" rx="7" fill="url(#q-bg)" filter="drop-shadow(0 3px 6px rgba(180,83,9,0.5))" />
      <rect x="1" y="1" width="26" height="9" rx="7" fill="white" opacity="0.12" />
      {/* Back box */}
      <rect x="10" y="6" width="12" height="10" rx="2" fill="#d97706" opacity="0.7" />
      {/* Middle box */}
      <rect x="7" y="9" width="12" height="10" rx="2" fill="#f59e0b" opacity="0.85" />
      {/* Front box */}
      <rect x="5" y="12" width="12" height="10" rx="2" fill="#fbbf24" />
      <rect x="5" y="12" width="12" height="4" rx="2" fill="white" opacity="0.15" />
    </svg>
  );
}

function IconWorker() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="w-bg" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#065f46" />
        </radialGradient>
      </defs>
      <rect x="1" y="1" width="26" height="26" rx="7" fill="url(#w-bg)" filter="drop-shadow(0 3px 6px rgba(6,95,70,0.5))" />
      <rect x="1" y="1" width="26" height="9" rx="7" fill="white" opacity="0.12" />
      <circle cx="14" cy="14" r="4" fill="none" stroke="white" strokeWidth="2" opacity="0.9" />
      <circle cx="14" cy="14" r="2" fill="white" opacity="0.9" />
      {[0,60,120,180,240,300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 14 + Math.cos(rad) * 5.5;
        const y1 = 14 + Math.sin(rad) * 5.5;
        const x2 = 14 + Math.cos(rad) * 7.5;
        const y2 = 14 + Math.sin(rad) * 7.5;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />;
      })}
    </svg>
  );
}

function IconLightning() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <defs>
        <linearGradient id="bolt-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M9 1L3 9h5l-1 6 7-9H9l1-5z" fill="url(#bolt-g)" filter="drop-shadow(0 1px 3px rgba(245,158,11,0.6))" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <defs>
        <linearGradient id="chart-g" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a5b4fc" />
        </linearGradient>
      </defs>
      <rect x="1" y="9" width="3" height="6" rx="1" fill="url(#chart-g)" opacity="0.7" />
      <rect x="6" y="5" width="3" height="10" rx="1" fill="url(#chart-g)" opacity="0.85" />
      <rect x="11" y="2" width="3" height="13" rx="1" fill="url(#chart-g)" />
    </svg>
  );
}

export default function Architecture() {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [simulationState, setSimulationState] = useState('idle'); // idle, request, cache-hit, cache-miss
  const [cacheHitMode, setCacheHitMode] = useState(null); // null, 'hit', 'miss'

  useEffect(() => {
    if (simulationState === 'idle') return;

    const timeouts = [];

    if (simulationState === 'request') {
      // Auto-switch between hit/miss every cycle
      timeouts.push(
        setTimeout(() => {
          const newMode = cacheHitMode === 'hit' ? 'miss' : 'hit';
          setCacheHitMode(newMode);
          setSimulationState(newMode === 'hit' ? 'cache-hit' : 'cache-miss');
        }, 1500)
      );
    }

    if (simulationState === 'cache-hit') {
      timeouts.push(
        setTimeout(() => {
          setSimulationState('request');
          setCacheHitMode('hit');
        }, 2500)
      );
    }

    if (simulationState === 'cache-miss') {
      timeouts.push(
        setTimeout(() => {
          setSimulationState('request');
          setCacheHitMode('miss');
        }, 3500)
      );
    }

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [simulationState, cacheHitMode]);

  return (
    <section id="architecture" className="relative scroll-mt-nav border-t border-black/[0.06] dark:border-white/[0.05]">
      <div className="section">
        <div className="mb-12 max-w-2xl">
          <span className="section-eyebrow">// architecture</span>
          <h2 className="section-title">A clear path through every request.</h2>
          <p className="section-subtitle">
            Stateless API in front, hot-path Redis cache, durable PostgreSQL,
            and a separate worker for analytics — so writes never block reads.
          </p>
        </div>

        <div className="card p-6 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <button
              onClick={() => {
                setSimulationState(simulationState === 'idle' ? 'request' : 'idle');
                setCacheHitMode('hit');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                simulationState === 'idle'
                  ? 'bg-brand-400/10 text-brand-400 hover:bg-brand-400/20'
                  : 'bg-ink/10 text-ink hover:bg-ink/20'
              }`}
            >
              {simulationState === 'idle' ? 'Run animation' : 'Stop'}
            </button>
          </div>
          <Diagram
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
            simulationState={simulationState}
            cacheHitMode={cacheHitMode}
          />

          <div className="mt-10 pt-6 border-t border-black/[0.06] dark:border-white/[0.05] grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[12px]">
            <RouteRow
              method="POST"
              path="/api/shorten"
              steps={['validate', 'pg.insert', 'redis.set']}
              latency="18ms"
            />
            <RouteRow
              method="GET"
              path="/:code"
              steps={['redis.get', 'queue.enqueue', '302']}
              latency="3.8ms"
              tone="green"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Diagram({ hoveredNode, setHoveredNode, simulationState, cacheHitMode }) {
  const nodes = {
    frontend: { id: 'frontend', label: 'React Frontend', icon: <IconFrontend /> },
    api:      { id: 'api',      label: 'Express API',      icon: <IconAPI /> },
    redis:    { id: 'redis',    label: 'Redis',             icon: <IconRedis /> },
    postgres: { id: 'postgres', label: 'PostgreSQL',        icon: <IconPostgres /> },
    queue:    { id: 'queue',    label: 'BullMQ Queue',      icon: <IconQueue /> },
    worker:   { id: 'worker',   label: 'Analytics Worker',  icon: <IconWorker /> },
  };

  const isPulseOnConnector = (from, to) => {
    if (simulationState === 'idle') return false;
    if (simulationState === 'request' && from === 'frontend' && to === 'api') return true;
    if (simulationState === 'cache-hit' && cacheHitMode === 'hit' && from === 'api' && to === 'redis') return true;
    if (simulationState === 'cache-miss' && cacheHitMode === 'miss' && from === 'api' && to === 'postgres') return true;
    return false;
  };

  return (
    <div className="grid grid-cols-1 gap-5 relative">
      {simulationState !== 'idle' && (
        <div className="flex justify-center items-center gap-2 mb-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold ${cacheHitMode === 'hit' ? 'bg-accent-rose/10 text-accent-rose' : 'bg-brand-500/10 text-brand-500'}`}>
            {cacheHitMode === 'hit' ? <IconLightning /> : <IconChart />}
            {cacheHitMode === 'hit' ? 'Cache Hit' : 'Cache Miss'}
          </div>
          <div className="text-xs text-ink-muted">
            {cacheHitMode === 'hit' ? 'Instant redirect from Redis' : 'Fetching from PostgreSQL...'}
          </div>
        </div>
      )}

      {/* Infrastructure header with throughput info */}
      <div className="flex items-center justify-between px-2 text-[11px] text-ink-dim mb-2">
        <span className="font-mono">request flow</span>
        <span className="font-mono">~45K req/s throughput avg</span>
      </div>

      <Row>
        <Node
          title="React Frontend"
          sub="Vite · Tailwind"
          accent="brand"
          tooltip="Client-side request origin"
          nodeId={nodes.frontend.id}
          isHovered={hoveredNode === nodes.frontend.id}
          setHoveredNode={setHoveredNode}
          info="UI Layer"
          icon={nodes.frontend.icon}
        />
      </Row>
      <ConnectorWithLatency
        latency="2ms"
        label="network"
        isHovered={hoveredNode === nodes.frontend.id || hoveredNode === nodes.api.id}
        isPulse={isPulseOnConnector('frontend', 'api')}
      />
      <Row>
        <Node
          title="Express API"
          sub="Stateless request layer"
          wide
          accent="ink"
          tooltip="Validates requests, routes to cache or database"
          nodeId={nodes.api.id}
          isHovered={hoveredNode === nodes.api.id}
          setHoveredNode={setHoveredNode}
          info="45K req/s"
          icon={nodes.api.icon}
        />
      </Row>
      <div className="flex justify-center items-center gap-8 mb-1">
        <span className="text-[10px] text-ink-dim font-mono">4ms</span>
        <Connector
          branch
          isHovered={hoveredNode === nodes.api.id || hoveredNode === nodes.redis.id || hoveredNode === nodes.postgres.id}
          isPulseLeft={isPulseOnConnector('api', 'redis') && cacheHitMode === 'hit'}
          isPulseRight={isPulseOnConnector('api', 'postgres') && cacheHitMode === 'miss'}
        />
        <span className="text-[10px] text-ink-dim font-mono">18ms</span>
      </div>
      <Row className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Node
          title="Redis"
          sub="Sub-ms redirect cache"
          tag="hot path"
          accent="rose"
          tooltip="Cache lookup: 4ms | TTL: 24h | Instant redirects on hit"
          nodeId={nodes.redis.id}
          isHovered={hoveredNode === nodes.redis.id}
          setHoveredNode={setHoveredNode}
          info="4ms lookup"
          icon={nodes.redis.icon}
        />
        <Node
          title="PostgreSQL"
          sub="Persistent storage"
          tag="source of truth"
          accent="blue"
          tooltip="Authoritative data store | Queried on cache miss | Writes block reads"
          nodeId={nodes.postgres.id}
          isHovered={hoveredNode === nodes.postgres.id}
          setHoveredNode={setHoveredNode}
          info="18ms query"
          icon={nodes.postgres.icon}
        />
      </Row>
      <ConnectorWithLatency
        latency={cacheHitMode === 'hit' ? '5ms' : '25ms'}
        label={cacheHitMode === 'hit' ? 'to queue' : 'to queue'}
        isHovered={hoveredNode === nodes.redis.id || hoveredNode === nodes.postgres.id || hoveredNode === nodes.queue.id}
        isPulse={simulationState === 'cache-hit' && cacheHitMode === 'hit'}
      />
      <Row>
        <Node
          title="BullMQ Queue"
          sub="Async analytics jobs"
          tag="non-blocking"
          accent="amber"
          tooltip="Async analytics ingestion | Non-blocking writes | Events queued and processed separately"
          nodeId={nodes.queue.id}
          isHovered={hoveredNode === nodes.queue.id}
          setHoveredNode={setHoveredNode}
          info="100ms enqueue"
          icon={nodes.queue.icon}
        />
      </Row>
      <ConnectorWithLatency
        latency="<1s"
        label="async"
        isHovered={hoveredNode === nodes.queue.id || hoveredNode === nodes.worker.id}
        isPulse={simulationState === 'cache-hit' && cacheHitMode === 'hit'}
      />
      <Row>
        <Node
          title="Analytics Worker"
          sub="Background event processing"
          tag="horizontally scalable"
          accent="green"
          tooltip="Processes events from queue | Updates analytics tables | Scales independently"
          nodeId={nodes.worker.id}
          isHovered={hoveredNode === nodes.worker.id}
          setHoveredNode={setHoveredNode}
          info="5 workers"
          icon={nodes.worker.icon}
        />
      </Row>
    </div>
  );
}

function Row({ children, className = '' }) {
  return <div className={`flex justify-center ${className}`}>{children}</div>;
}

function ConnectorWithLatency({ latency, label, isHovered, isPulse }) {
  return (
    <div className="flex justify-center items-center gap-2 mb-1">
      <span className="text-[10px] text-ink-dim font-mono">{latency}</span>
      <Connector isHovered={isHovered} isPulse={isPulse} />
      <span className="text-[10px] text-ink-dim font-mono">{label}</span>
    </div>
  );
}

function Connector({ branch = false, isHovered = false, isPulse = false, isPulseLeft = false, isPulseRight = false }) {
  const pulseId = Math.random().toString(36).substr(2, 9);

  return (
    <div className={`flex justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
      <style>{`
        @keyframes pulseDown {
          0% { cy: -4px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { cy: 40px; opacity: 0; }
        }
        @keyframes pulseLeft {
          0% { cy: 22px; cx: 160px; opacity: 0; }
          10% { opacity: 1; }
          45% { cy: 22px; cx: 160px; opacity: 1; }
          50% { cx: 100px; opacity: 1; }
          90% { cx: 40px; opacity: 1; }
          100% { cx: 40px; opacity: 0; }
        }
        @keyframes pulseRight {
          0% { cy: 22px; cx: 160px; opacity: 0; }
          10% { opacity: 1; }
          45% { cy: 22px; cx: 160px; opacity: 1; }
          50% { cx: 220px; opacity: 1; }
          90% { cx: 280px; opacity: 1; }
          100% { cx: 280px; opacity: 0; }
        }
        .pulse-dot { fill: var(--connector-stroke); filter: drop-shadow(0 0 4px rgba(255,255,255,0.8)); }
        .pulse-dot.down { animation: pulseDown 1.5s ease-in-out infinite; }
        .pulse-dot.left { animation: pulseLeft 1.8s ease-in-out infinite; }
        .pulse-dot.right { animation: pulseRight 1.8s ease-in-out infinite; }
      `}</style>
      <svg
        width={branch ? '320' : '32'}
        height="36"
        viewBox={branch ? '0 0 320 36' : '0 0 32 36'}
        fill="none"
        className={`overflow-visible`}
        style={{
          filter: isHovered ? 'brightness(1.15)' : 'brightness(1)',
          transition: 'filter 200ms ease-out',
        }}
      >
        {branch ? (
          <>
            <path
              d="M160 0 V14 M40 36 V22 H280 V36 M160 14 V22"
              stroke="var(--connector-stroke)"
              strokeWidth={isHovered ? '1.5' : '1'}
              strokeDasharray="3 3"
            />
            {isPulseLeft && <circle r="2" cx="160" cy="22" className="pulse-dot left" />}
            {isPulseRight && <circle r="2" cx="160" cy="22" className="pulse-dot right" />}
          </>
        ) : (
          <>
            <path
              d="M16 0 V36"
              stroke="var(--connector-stroke)"
              strokeWidth={isHovered ? '1.5' : '1'}
              strokeDasharray="3 3"
            />
            {isPulse && <circle r="2" cx="16" cy="0" className="pulse-dot down" />}
          </>
        )}
      </svg>
    </div>
  );
}

const ACCENT_BORDER = {
  brand: 'border-l-brand-400',
  rose:  'border-l-accent-rose',
  blue:  'border-l-brand-500',
  amber: 'border-l-accent-amber',
  green: 'border-l-accent-green',
  ink:   'border-l-black/20 dark:border-l-white/20',
};

function Node({ title, sub, tag, wide = false, accent = 'ink', tooltip, nodeId, isHovered, setHoveredNode, info, icon }) {
  return (
    <div
      className={`relative w-full ${wide ? 'max-w-md' : 'max-w-xs'} mx-auto rounded-lg border border-black/[0.08] dark:border-white/[0.07] border-l-2 ${ACCENT_BORDER[accent]} bg-surface-elevated px-4 py-3 cursor-pointer transition-all duration-200 ${
        isHovered ? 'shadow-md border-black/[0.15] dark:border-white/[0.15] scale-105' : ''
      }`}
      onMouseEnter={() => setHoveredNode(nodeId)}
      onMouseLeave={() => setHoveredNode(null)}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="font-semibold text-ink text-[13px]">{title}</span>
        </div>
        {tag && (
          <span className="text-[10px] font-mono text-ink-dim">{tag}</span>
        )}
      </div>
      <div className="text-[12px] text-ink-muted mt-0.5">{sub}</div>
      {info && (
        <div className="text-[10px] text-ink-dim font-mono mt-1.5 pt-1.5 border-t border-black/[0.05] dark:border-white/[0.05]">
          {info}
        </div>
      )}

      {tooltip && isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-[11px] rounded-md max-w-xs z-10 pointer-events-none shadow-lg whitespace-normal border border-white/10">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
}

function RouteRow({ method, path, steps, latency, tone }) {
  const methodColor = {
    GET: 'text-accent-green',
    POST: 'text-brand-400',
  }[method] || 'text-ink';
  const latencyColor = tone === 'green' ? 'text-accent-green' : 'text-ink';
  return (
    <div className="flex items-center gap-3 text-ink-muted">
      <span className={`${methodColor} font-semibold w-12`}>{method}</span>
      <span className="text-ink">{path}</span>
      <span className="text-ink-faint">→</span>
      <span className="flex-1 truncate">{steps.join(' · ')}</span>
      <span className={`${latencyColor} tabular-nums`}>{latency}</span>
    </div>
  );
}
