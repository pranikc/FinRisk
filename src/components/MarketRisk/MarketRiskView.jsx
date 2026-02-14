import {
  TrendingDown, AlertTriangle, BarChart3, Activity, Zap, Target,
  ArrowDown, ArrowUp, Flame
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ComposedChart, Line, ReferenceLine, Legend
} from 'recharts';
import {
  varSummary, varTimeSeries, marketPortfolio, stressScenarios, sensitivities,
  riskScores, formatCurrency, formatPercent, getRiskColor
} from '../../data/syntheticData';

function MetricCard({ label, value, subtext, warning, breach }) {
  return (
    <div className={`bg-slate-800/50 rounded-lg p-4 border ${breach ? 'border-red-500/40 bg-red-500/5' : warning ? 'border-amber-500/30' : 'border-slate-700/30'}`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${breach ? 'text-red-400' : warning ? 'text-amber-400' : 'text-white'}`}>{value}</p>
      {subtext && <p className={`text-xs mt-0.5 ${breach ? 'text-red-400/70' : 'text-slate-400'}`}>{subtext}</p>}
    </div>
  );
}

export default function MarketRiskView() {
  const { color: riskColor } = getRiskColor(riskScores.market);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Market Risk</h2>
            <p className="text-sm text-slate-400">VaR analysis, stress testing, and position monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ borderColor: riskColor + '40', backgroundColor: riskColor + '15' }}>
          <span className="text-sm font-semibold" style={{ color: riskColor }}>Risk Score: {riskScores.market}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="1D VaR (99%)" value={formatCurrency(varSummary.var1d99, true)} breach={varSummary.limitUtilization > 100} subtext={`Limit: ${formatCurrency(varSummary.limit1d99, true)}`} />
        <MetricCard label="Limit Utilization" value={formatPercent(varSummary.limitUtilization)} breach={varSummary.limitUtilization > 100} subtext="1 active breach" />
        <MetricCard label="Expected Shortfall" value={formatCurrency(varSummary.expectedShortfall99, true)} subtext="99% confidence" />
        <MetricCard label="10D VaR (99%)" value={formatCurrency(varSummary.var10d99, true)} subtext="Regulatory horizon" />
      </div>

      {/* VaR Time Series */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">VaR vs. P&L (30 Days)</h3>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" /> VaR 99%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-400 rounded-full inline-block" /> VaR 95%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500/50 rounded-full inline-block" /> Limit</span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={varTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value) => [formatCurrency(value, true), '']}
              />
              <Bar dataKey="pnl" fill="#60a5fa" fillOpacity={0.3} radius={[2, 2, 0, 0]}>
                {varTimeSeries.map((entry, i) => (
                  <Cell key={i} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} fillOpacity={0.4} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="var99" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="var95" stroke="#22d3ee" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              <ReferenceLine y={varSummary.limit1d99} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="6 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Portfolio by Asset Class */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">VaR by Asset Class</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketPortfolio} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1e6).toFixed(0)}M`} />
                <YAxis dataKey="assetClass" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={130} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [formatCurrency(v, true), 'VaR 99%']}
                />
                <Bar dataKey="var99" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sensitivity Analysis */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Key Sensitivities</h3>
          </div>
          <div className="space-y-3">
            {sensitivities.map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-700/30 last:border-0">
                <div>
                  <p className="text-sm text-slate-200">{s.factor}</p>
                  <p className="text-xs text-slate-500">{s.unit}</p>
                </div>
                <div className={`flex items-center gap-1 font-mono text-sm font-medium ${s.impact >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {s.impact >= 0 ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                  {formatCurrency(Math.abs(s.impact), true)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stress Test Scenarios */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4.5 h-4.5 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Stress Test Scenarios</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300">Historical</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">Hypothetical</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">AI-Generated</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Scenario</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">P&L Impact</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Capital Impact</th>
                <th className="text-center py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody>
              {stressScenarios.map((scenario, i) => (
                <tr key={i} className="border-b border-slate-700/20 hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-200 font-medium">{scenario.name}</td>
                  <td className="py-3 px-3 text-slate-400 text-xs max-w-xs">{scenario.description}</td>
                  <td className="py-3 px-3 text-right text-red-400 font-medium">{formatCurrency(scenario.pnlImpact, true)}</td>
                  <td className="py-3 px-3 text-right text-red-400">{scenario.capitalImpact}%</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      scenario.category === 'Historical' ? 'bg-slate-700 text-slate-300' :
                      scenario.category === 'AI-Generated' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>{scenario.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
