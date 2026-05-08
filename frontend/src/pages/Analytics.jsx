import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts';
import { fetchAnalytics } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const DEVICE_COLORS = {
  desktop: '#3B82F6',
  mobile: '#06B6D4',
  tablet: '#22C55E',
  unknown: '#6B7280',
};

export default function Analytics() {
  const { code } = useParams();
  const location = useLocation();
  const { theme } = useTheme();

  const [ownerToken, setOwnerToken] = useState(location.state?.ownerToken || '');
  const [tokenInput, setTokenInput] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDark = theme === 'dark';
  const chartGrid = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.07)';
  const chartAxis = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.10)';
  const tooltipBg = isDark ? '#111111' : '#FFFFFF';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)';
  const tooltipText = isDark ? '#E5E7EB' : '#111111';
  const axisTickColor = isDark ? '#6B7280' : '#71717A';

  useEffect(() => {
    if (ownerToken) loadAnalytics(ownerToken);
  }, [ownerToken]);

  async function loadAnalytics(token) {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAnalytics(code, token);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleTokenSubmit(e) {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    setOwnerToken(tokenInput.trim());
  }

  const devicePieData = data
    ? Object.entries(data.deviceBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <main className="relative min-h-[calc(100vh-64px)] pt-24 pb-16 px-4">
      <div className="absolute inset-0 dot-bg dot-bg-fade opacity-50 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-[12px] font-mono text-ink-muted hover:text-ink transition-colors mb-4">
          ← my links
        </Link>

        <div className="mb-8">
          <span className="section-eyebrow">// analytics</span>
          <h1 className="text-[26px] sm:text-[30px] font-semibold tracking-[-0.01em] dark:text-white text-gray-900 leading-tight">
            <span className="font-mono text-brand-400">/{code}</span>
          </h1>
          {data && (
            <p className="text-ink-muted text-[13px] mt-1 font-mono">
              {data.totalClicks} {data.totalClicks === 1 ? 'click' : 'clicks'} total
            </p>
          )}
        </div>

        {!ownerToken && (
          <div className="card p-5 mb-6">
            <p className="text-ink-muted text-[13px] mb-4">
              Enter your owner token to view analytics for this link.
            </p>
            <form onSubmit={handleTokenSubmit} className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="paste owner token…"
                className="flex-1 bg-surface-base border border-black/[0.08] dark:border-white/[0.08] rounded-md px-3 py-2 text-[13px] font-mono text-ink placeholder-ink-faint focus:outline-none focus:border-brand-500/50 transition-colors"
              />
              <button type="submit" className="btn-primary">
                view
              </button>
            </form>
          </div>
        )}

        {error && (
          <div className="card p-4 text-[12px] font-mono text-accent-rose mb-6">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-center py-16 text-ink-muted text-[13px] font-mono">
            loading analytics…
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Stat cells */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.04] rounded-md overflow-hidden">
              <Stat label="total clicks" value={data.totalClicks} />
              <Stat label="desktop" value={data.deviceBreakdown.desktop || 0} />
              <Stat label="mobile" value={data.deviceBreakdown.mobile || 0} />
              <Stat label="tablet" value={data.deviceBreakdown.tablet || 0} />
            </div>

            {/* Clicks over time */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim">
                  clicks · last 30 days
                </span>
              </div>
              {data.clicksByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.clicksByDay} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke={chartGrid} vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: axisTickColor, fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      tickLine={false}
                      axisLine={{ stroke: chartAxis }}
                      tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                      tick={{ fill: axisTickColor, fontSize: 10, fontFamily: 'JetBrains Mono' }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: tooltipBg,
                        border: `1px solid ${tooltipBorder}`,
                        borderRadius: 6,
                        fontSize: 12,
                        fontFamily: 'JetBrains Mono',
                        color: tooltipText,
                      }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString()}
                      formatter={(v) => [v, 'clicks']}
                      cursor={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#3B82F6"
                      strokeWidth={1.5}
                      dot={{ fill: '#3B82F6', strokeWidth: 0, r: 2 }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-ink-dim text-[12px] font-mono py-8 text-center">
                  no clicks yet
                </p>
              )}
            </div>

            {/* Device + Referrers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card p-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-4 block">
                  device breakdown
                </span>
                {devicePieData.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={devicePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={42}
                          outerRadius={62}
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {devicePieData.map((entry) => (
                            <Cell key={entry.name} fill={DEVICE_COLORS[entry.name] || '#6B7280'} stroke="none" />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-1.5 text-[12px] font-mono">
                      {devicePieData.map((d) => (
                        <div key={d.name} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-sm" style={{ background: DEVICE_COLORS[d.name] || '#6B7280' }} />
                          <span className="text-ink flex-1 capitalize">{d.name}</span>
                          <span className="text-ink-muted tabular-nums">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-ink-dim text-[12px] font-mono py-8 text-center">
                    no data
                  </p>
                )}
              </div>

              <div className="card p-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-ink-dim mb-4 block">
                  top referrers
                </span>
                {data.topReferrers.length > 0 ? (
                  <div className="space-y-2 font-mono text-[12px]">
                    {data.topReferrers.map((r) => (
                      <div key={r.referrer} className="flex items-center justify-between gap-3">
                        <span className="text-ink truncate">{r.referrer}</span>
                        <span className="text-ink-muted tabular-nums shrink-0">{r.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-ink-dim text-[12px] font-mono py-8 text-center">
                    no referrers yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-surface-base px-4 py-4">
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-dim">{label}</div>
      <div className="text-[24px] font-semibold tracking-tight text-ink mt-0.5 tabular-nums">
        {value.toLocaleString()}
      </div>
    </div>
  );
}
