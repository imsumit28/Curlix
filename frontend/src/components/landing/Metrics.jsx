import { useEffect, useRef, useState } from 'react';

const METRICS = [
  { label: 'Avg redirect', value: 10, prefix: '<', suffix: 'ms', color: 'text-brand-500 dark:text-brand-400' },
  { label: 'Cache hit ratio', value: 85, suffix: '%', color: 'text-accent-green' },
  { label: 'Optimized redirect', text: '302', color: 'text-accent-cyan' },
  { label: 'Queue mode', text: 'async', color: 'text-accent-amber' },
];

export default function Metrics() {
  return (
    <section className="relative border-t border-black/[0.06] dark:border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Cell key={m.label} {...m} index={i} color={m.color} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value, text, prefix = '', suffix = '', index, color = 'text-ink' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(text ? text : 0);
  const started = useRef(false);

  useEffect(() => {
    if (text) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 900;
            const start = performance.now();
            const animate = (now) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setDisplay(Math.round(eased * value));
              if (t < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, value]);

  const isLast = index === METRICS.length - 1;
  const lastInRow = (index + 1) % 2 === 0;

  return (
    <div
      ref={ref}
      className={`px-5 py-5 lg:py-3 ${
        lastInRow ? '' : 'border-r border-black/[0.05] dark:border-white/[0.05]'
      } lg:border-r ${isLast ? 'lg:border-r-0' : ''} ${
        index < 2 ? 'border-b lg:border-b-0 border-black/[0.05] dark:border-white/[0.05]' : ''
      }`}
    >
      <div className="text-[11px] font-mono uppercase tracking-wider text-ink-dim">
        {label}
      </div>
      <div className={`mt-1.5 text-[26px] font-semibold tracking-tight tabular-nums ${color}`}>
        {text ? text : `${prefix}${display}${suffix}`}
      </div>
    </div>
  );
}
