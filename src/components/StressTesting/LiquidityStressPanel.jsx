import { Droplets, TrendingDown } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { useStressTest } from '../../contexts/StressTestContext';
import { formatPercent } from '../../data/syntheticData';

function RatioGauge({ label, baseValue, stressedValue, minimum, unit = '%' }) {
  const pct = Math.min((stressedValue / 150) * 100, 100);
  const minPct = (minimum / 150) * 100;
  const isOk = stressedValue >= minimum;
  const color = isOk ? (stressedValue > minimum * 1.15 ? '#10b981' : '#f59e0b') : '#ef4444';

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-slate-300">{label}</h4>
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${isOk ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
          {isOk ? 'Compliant' : 'Breach'}
        </span>
      </div>
      <div className="flex items-end gap-3 mb-1">
        <span className="text-3xl font-bold" style={{ color }}>{stressedValue.toFixed(0)}{unit}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-500">Base: {baseValue}{unit}</span>
        <span className="text-xs text-slate-600">|</span>
        <span className="text-xs text-slate-500">Min: {minimum}{unit}</span>
        <span className="text-xs text-red-400">({(stressedValue - baseValue).toFixed(0)}pp)</span>
      </div>
      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }} />
        <div className="absolute top-0 h-full w-0.5 bg-white/40" style={{ left: `${minPct}%` }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-slate-600">0%</span>
        <span className="text-[10px] text-slate-600">150%</span>
      </div>
    </div>
  );
}

export default function LiquidityStressPanel() {
  const { results } = useStressTest();
  if (!results) return null;

  const { liquidity } = results;

  return (
    <div className="space-y-6">
      {/* Stressed Ratio Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RatioGauge
          label="Stressed LCR"
          baseValue={liquidity.baseLCR}
          stressedValue={liquidity.stressedLCR}
          minimum={100}
        />
        <RatioGauge
          label="Stressed NSFR"
          baseValue={liquidity.baseNSFR}
          stressedValue={liquidity.stressedNSFR}
          minimum={100}
        />
      </div>

      {/* Key Liquidity Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`bg-slate-800/50 rounded-lg p-4 border ${liquidity.survivalDays < 30 ? 'border-red-500/30 bg-red-500/5' : 'border-slate-700/30'}`}>
          <p className="text-xs text-slate-500 mb-1">Survival Horizon</p>
          <p className={`text-xl font-bold ${liquidity.survivalDays < 30 ? 'text-red-400' : liquidity.survivalDays < 60 ? 'text-amber-400' : 'text-white'}`}>
            {liquidity.survivalDays} days
          </p>
          <p className="text-xs mt-0.5 text-slate-400">Min: 30 days</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <p className="text-xs text-slate-500 mb-1">LCR Change</p>
          <p className="text-xl font-bold text-red-400">{(liquidity.stressedLCR - liquidity.baseLCR).toFixed(0)}pp</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <p className="text-xs text-slate-500 mb-1">NSFR Change</p>
          <p className="text-xl font-bold text-red-400">{(liquidity.stressedNSFR - liquidity.baseNSFR).toFixed(0)}pp</p>
        </div>
        <div className={`bg-slate-800/50 rounded-lg p-4 border ${
          liquidity.lcrBreached || liquidity.nsfrBreached ? 'border-red-500/30' : 'border-slate-700/30'
        }`}>
          <p className="text-xs text-slate-500 mb-1">Breaches</p>
          <p className={`text-xl font-bold ${
            liquidity.lcrBreached || liquidity.nsfrBreached ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {(liquidity.lcrBreached ? 1 : 0) + (liquidity.nsfrBreached ? 1 : 0)} of 2
          </p>
        </div>
      </div>

      {/* Survival Horizon Chart */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-4.5 h-4.5 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Survival Horizon (Liquidity Depletion)</h3>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liquidity.survivalTimeSeries}>
              <defs>
                <linearGradient id="gradSurvival" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#64748b' }}
                label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v) => [`${v.toFixed(1)}%`, 'Remaining Liquidity']}
                labelFormatter={(v) => `Day ${v}`}
              />
              <ReferenceLine
                y={10}
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                label={{ value: 'Critical (10%)', position: 'right', fill: '#ef4444', fontSize: 10 }}
              />
              <ReferenceLine
                x={30}
                stroke="#f59e0b"
                strokeWidth={1}
                strokeDasharray="4 4"
                label={{ value: '30d', position: 'top', fill: '#f59e0b', fontSize: 9 }}
              />
              <Area
                type="monotone"
                dataKey="liquidityPct"
                stroke="#06b6d4"
                fill="url(#gradSurvival)"
                strokeWidth={2}
                name="Liquidity"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
