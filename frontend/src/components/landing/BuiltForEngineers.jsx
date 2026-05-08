export default function BuiltForEngineers() {
  return (
    <section className="relative border-t border-black/[0.06] dark:border-white/[0.05]">
      <div className="section">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <span className="section-eyebrow">// philosophy</span>
            <h3 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.01em] text-ink leading-tight">
              Curlix is engineered around boring, well-understood backend patterns.
            </h3>
            <p className="mt-5 text-[14px] text-ink-muted leading-relaxed max-w-md">
              Redis caching for the hot path. A queue for everything that can wait.
              Stateless APIs you can scale horizontally. No magic, no hidden state —
              every component is observable, testable, and replaceable.
            </p>

            <ul className="mt-7 space-y-2.5 font-mono text-[12px]">
              <Bullet>writes never block reads</Bullet>
              <Bullet>cache invalidation is explicit, not eventual</Bullet>
              <Bullet>workers are stateless and horizontally scalable</Bullet>
              <Bullet>every error path returns a structured response</Bullet>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <CodeBlock />
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-2 text-ink-muted">
      <span className="text-ink-dim mt-px">›</span>
      <span>{children}</span>
    </li>
  );
}

function CodeBlock() {
  const lines = [
    { num: 1, indent: 0, content: <><Tok t="kw">async function</Tok> <Tok t="fn">redirect</Tok>(req, res) {'{'}</> },
    { num: 2, indent: 1, content: <><Tok t="kw">const</Tok> code = req.params.code;</> },
    { num: 3, indent: 0, content: <></> },
    { num: 4, indent: 1, content: <><Tok t="cmt">// hot path: redis</Tok></> },
    { num: 5, indent: 1, content: <><Tok t="kw">const</Tok> cached = <Tok t="kw">await</Tok> redis.<Tok t="fn">get</Tok>(<Tok t="str">`url:${'${'}code{'}'}`</Tok>);</> },
    { num: 6, indent: 1, content: <><Tok t="kw">if</Tok> (cached) {'{'}</> },
    { num: 7, indent: 2, content: <>queue.<Tok t="fn">enqueue</Tok>(<Tok t="str">'click'</Tok>, {'{'} code, ts: <Tok t="fn">Date.now</Tok>() {'}'});</> },
    { num: 8, indent: 2, content: <><Tok t="kw">return</Tok> res.<Tok t="fn">redirect</Tok>(<Tok t="num">302</Tok>, cached.url);</> },
    { num: 9, indent: 1, content: <>{'}'}</> },
    { num: 10, indent: 0, content: <></> },
    { num: 11, indent: 1, content: <><Tok t="cmt">// cold path: postgres + warm cache</Tok></> },
    { num: 12, indent: 1, content: <><Tok t="kw">const</Tok> row = <Tok t="kw">await</Tok> db.<Tok t="fn">resolve</Tok>(code);</> },
    { num: 13, indent: 1, content: <><Tok t="kw">if</Tok> (!row) <Tok t="kw">return</Tok> res.<Tok t="fn">status</Tok>(<Tok t="num">404</Tok>).<Tok t="fn">end</Tok>();</> },
    { num: 14, indent: 1, content: <>redis.<Tok t="fn">set</Tok>(<Tok t="str">`url:${'${'}code{'}'}`</Tok>, row, <Tok t="str">'EX'</Tok>, <Tok t="num">86400</Tok>);</> },
    { num: 15, indent: 1, content: <><Tok t="kw">return</Tok> res.<Tok t="fn">redirect</Tok>(<Tok t="num">302</Tok>, row.url);</> },
    { num: 16, indent: 0, content: <>{'}'}</> },
  ];

  return (
    <div className="card overflow-hidden">
      <style>{`
        @keyframes blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }
        .cursor {
          animation: blink 1s infinite;
        }
      `}</style>
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-2 text-[11px] font-mono text-ink-dim">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-rose/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent-amber/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent-green/70" />
          <span className="ml-2">routes/redirect.js</span>
        </div>
        <span className="text-[10px] font-mono text-ink-dim">ES2022</span>
      </div>
      <pre className="text-[12.5px] font-mono leading-[1.7] py-3 overflow-x-auto">
        {lines.map((l, idx) => (
          <div key={l.num} className="flex gap-3 px-4">
            <span className="select-none text-ink-faint w-5 text-right">{l.num}</span>
            <span style={{ paddingLeft: `${l.indent * 16}px` }} className="text-ink">
              {l.content}
              {idx === lines.length - 1 && <span className="cursor">|</span>}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function Tok({ t, children }) {
  const cls = {
    kw: 'text-brand-400',
    fn: 'text-ink',
    str: 'text-accent-green',
    num: 'text-accent-amber',
    cmt: 'text-ink-dim italic',
  }[t];
  return <span className={cls}>{children}</span>;
}
