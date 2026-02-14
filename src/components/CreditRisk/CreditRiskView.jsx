import {
  CreditCard, AlertTriangle, TrendingUp, TrendingDown, Building2,
  Eye, ShieldAlert, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import {
  creditPortfolioByRating, creditPortfolioBySector, topExposures,
  creditMetrics, creditMigrationTrend, riskScores,
  formatCurrency, formatPercent, getRiskColor
} from '../../data/syntheticData';

const RATING_COLORS = {
  'AAA': '#10b981', 'AA': '#34d399', 'A': '#60a5fa', 'BBB': '#818cf8',
  'BB': '#fbbf24', 'B': '#fb923c', 'CCC+': '#f87171', 'CCC-': '#ef4444',
};

const SECTOR_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

function MetricCard({ label, value, subtext, warning }) {
  return (
    <div className={`bg-slate-800/50 rounded-lg p-4 border ${warning ? 'border-amber-500/30' : 'border-slate-700/30'}`}>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${warning ? 'text-amber-400' : 'text-white'}`}>{value}</p>
      {subtext && <p className="text-xs text-slate-400 mt-0.5">{subtext}</p>}
    </div>
  );
}

export default function CreditRiskView() {
  const { color: riskColor } = getRiskColor(riskScores.credit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/15 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Credit Risk</h2>
            <p className="text-sm text-slate-400">Portfolio analysis and credit quality monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border" style={{ borderColor: riskColor + '40', backgroundColor: riskColor + '15' }}>
          <span className="text-sm font-semibold" style={{ color: riskColor }}>Risk Score: {riskScores.credit}</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Expected Loss" value={formatCurrency(creditMetrics.expectedLoss, true)} subtext="Annual estimate" />
        <MetricCard label="NPL Ratio" value={formatPercent(creditMetrics.nplRatio)} warning={creditMetrics.nplRatio > 1.5} subtext="Non-performing loans" />
        <MetricCard label="Provision Coverage" value={formatPercent(creditMetrics.provisionCoverage, 0)} subtext="of expected loss" />
        <MetricCard label="Watchlist Loans" value={formatCurrency(creditMetrics.watchlistLoans, true)} warning subtext={`${formatPercent(creditMetrics.watchlistLoans / 31_200_000_000 * 100)} of portfolio`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Portfolio by Rating */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4.5 h-4.5 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Portfolio by Credit Rating</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={creditPortfolioByRating}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="rating" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1e9).toFixed(0)}B`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [formatCurrency(v, true), 'Exposure']}
                />
                <Bar dataKey="exposure" radius={[4, 4, 0, 0]}>
                  {creditPortfolioByRating.map((entry, i) => (
                    <Cell key={i} fill={RATING_COLORS[entry.rating]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio by Sector */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-4.5 h-4.5 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Sector Concentration</h3>
          </div>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={creditPortfolioBySector} dataKey="exposure" nameKey="sector" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {creditPortfolioBySector.map((_, i) => (
                    <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [formatCurrency(v, true), 'Exposure']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-1.5 pl-2">
              {creditPortfolioBySector.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length] }} />
                  <span className="text-slate-400 truncate flex-1">{s.sector}</span>
                  <span className="text-slate-300 font-medium">{formatPercent(s.percentage, 1)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Migration Trend */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-4.5 h-4.5 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Rating Migration Activity (30 Days)</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={creditMigrationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="upgrades" stroke="#10b981" fill="#10b981" fillOpacity={0.15} stackId="1" />
              <Area type="monotone" dataKey="downgrades" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} stackId="2" />
              <Area type="monotone" dataKey="defaults" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} stackId="3" />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Exposures Table */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4.5 h-4.5 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Top 10 Exposures</h3>
          </div>
          <span className="text-xs text-slate-500">Sorted by exposure size</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Borrower</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Sector</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Exposure</th>
                <th className="text-center py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">PD (%)</th>
                <th className="text-center py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {topExposures.map((exp, i) => (
                <tr key={i} className="border-b border-slate-700/20 hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 text-slate-200 font-medium">{exp.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{exp.sector}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200">{formatCurrency(exp.exposure, true)}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      exp.rating.startsWith('A') ? 'bg-emerald-500/15 text-emerald-400' :
                      exp.rating.startsWith('BBB') ? 'bg-blue-500/15 text-blue-400' :
                      'bg-amber-500/15 text-amber-400'
                    }`}>{exp.rating}</span>
                  </td>
                  <td className={`py-2.5 px-3 text-right font-medium ${exp.pd > 3 ? 'text-red-400' : exp.pd > 1 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {formatPercent(exp.pd)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {exp.watchlist ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/15 text-red-400 text-xs font-medium">
                        <ShieldAlert className="w-3 h-3" /> Watch
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">Normal</span>
                    )}
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
