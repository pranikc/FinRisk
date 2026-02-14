import {
  Droplets, TrendingUp, BarChart3, Shield, Wallet, Building,
  AlertTriangle, Layers, ArrowDown, ArrowUp
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine, PieChart, Pie, Legend, ComposedChart, Line
} from 'recharts';
import {
  liquidityRatios, cashFlowLadder, fundingSources, hqlaComposition,
  liquidityStressScenarios, riskScores,
  formatCurrency, formatPercent, getRiskColor
} from '../../data/syntheticData';

const HQLA_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a78bfa'];
const FUNDING_COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#3b82f6'];

function RatioGauge({ label, value, minimum, unit = '%' }) {
  const pct = Math.min((value / 150) * 100, 100);
  const minPct = (minimum / 150) * 100;
  const isOk = value >= minimum;
  const color = isOk ? (value > minimum * 1.15 ? '#10b981' : '#f59e0b') : '#ef4444';

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-slate-300">{label}</h4>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${isOk ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
          {isOk ? 'Compliant' : 'Breach'}
        </span>
      </div>
      <div className="flex items-end gap-3 mb-3">
        <span className="text-3xl font-bold" style={{ color }}>{value}{unit}</span>
        <span className="text-sm text-slate-500 mb-1">min: {minimum}{unit}</span>
      </div>
      {/* Progress Bar */}
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
        {/* Minimum line */}
        <div className="absolute top-0 h-full w-0.5 bg-white/40" style={{ left: `${minPct}%` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-600">0%</span>
        <span className="text-[10px] text-slate-600">150%</span>
      </div>
    </div>
  );
}

export default function LiquidityRiskView() {
  const { color: riskColor } = getRiskColor(riskScores.liquidity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Droplets className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Liquidity Risk</h2>
            <p className="text-sm text-slate-400">Cash flow analysis, regulatory ratios, and funding monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ borderColor: riskColor + '40', backgroundColor: riskColor + '15' }}>
          <span className="text-sm font-semibold" style={{ color: riskColor }}>Risk Score: {riskScores.liquidity}</span>
        </div>
      </div>

      {/* Regulatory Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RatioGauge label="Liquidity Coverage Ratio (LCR)" value={liquidityRatios.lcr} minimum={liquidityRatios.lcrMin} />
        <RatioGauge label="Net Stable Funding Ratio (NSFR)" value={liquidityRatios.nsfr} minimum={liquidityRatios.nsfrMin} />
      </div>

      {/* LCR Trend */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4.5 h-4.5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">LCR / NSFR Trend (30 Days)</h3>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liquidityRatios.lcrTrend}>
              <defs>
                <linearGradient id="gradLCR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[80, 140]} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <ReferenceLine y={100} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 3" label={{ value: 'Minimum (100%)', position: 'right', fill: '#ef4444', fontSize: 10 }} />
              <Area type="monotone" dataKey="lcr" stroke="#3b82f6" fill="url(#gradLCR)" strokeWidth={2} name="LCR" />
              <Area type="monotone" dataKey="nsfr" stroke="#8b5cf6" fill="none" strokeWidth={1.5} strokeDasharray="4 2" name="NSFR" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cash Flow Ladder */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4.5 h-4.5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Cash Flow Ladder</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-emerald-500 rounded-sm inline-block" /> Inflows</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 bg-rose-500 rounded-sm inline-block" /> Outflows</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-amber-400 rounded-full inline-block" /> Cumulative Net</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cashFlowLadder}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="bucket" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1e9).toFixed(1)}B`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v) => [formatCurrency(v, true), '']}
              />
              <Bar dataKey="inflows" fill="#10b981" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              <Bar dataKey="outflows" fill="#ef4444" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="cumulative" stroke="#fbbf24" strokeWidth={2.5} dot={{ r: 4, fill: '#fbbf24' }} />
              <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* HQLA Composition */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">HQLA Composition</h3>
          </div>
          <div className="h-48 flex items-center">
            <ResponsiveContainer width="45%" height="100%">
              <PieChart>
                <Pie data={hqlaComposition} dataKey="amount" nameKey="type" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>
                  {hqlaComposition.map((_, i) => (
                    <Cell key={i} fill={HQLA_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(v) => [formatCurrency(v, true), '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-[55%] space-y-2 pl-2">
              {hqlaComposition.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: HQLA_COLORS[i] }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300 truncate">{h.type}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(h.amount, true)} ({formatPercent(h.percentage)})</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-700/30">
                <p className="text-sm font-semibold text-white">Total HQLA: {formatCurrency(hqlaComposition.reduce((s, h) => s + h.amount, 0), true)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Funding Sources */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-4.5 h-4.5 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Funding Mix</h3>
          </div>
          <div className="space-y-2.5">
            {fundingSources.map((f, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-300">{f.source}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      f.stability === 'High' ? 'bg-emerald-500/15 text-emerald-400' :
                      f.stability === 'Medium' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>{f.stability}</span>
                  </div>
                  <span className="text-xs text-slate-400">{formatCurrency(f.amount, true)} ({formatPercent(f.percentage)})</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${f.percentage}%`, backgroundColor: FUNDING_COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Liquidity Stress Test */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4.5 h-4.5 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">Liquidity Stress Test Results</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {liquidityStressScenarios.map((s, i) => {
            const isBreached = s.lcrImpact < 100;
            return (
              <div key={i} className={`rounded-lg p-4 border ${isBreached ? 'bg-red-500/5 border-red-500/30' : 'bg-slate-800/40 border-slate-700/30'}`}>
                <h4 className="text-sm font-medium text-slate-200 mb-3">{s.scenario}</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500">LCR Impact</p>
                    <p className={`text-lg font-bold ${isBreached ? 'text-red-400' : 'text-white'}`}>{s.lcrImpact}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Survival Period</p>
                    <p className="text-lg font-bold text-white">{s.survivalDays}d</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">HQLA Drawdown</p>
                    <p className={`text-sm font-medium ${s.hqlaDrawdown > 40 ? 'text-red-400' : s.hqlaDrawdown > 20 ? 'text-amber-400' : 'text-slate-300'}`}>{s.hqlaDrawdown}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
