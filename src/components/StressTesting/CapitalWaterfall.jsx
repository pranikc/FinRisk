import { BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Cell, LabelList
} from 'recharts';
import { useStressTest } from '../../contexts/StressTestContext';

export default function CapitalWaterfall() {
  const { results } = useStressTest();
  if (!results) return null;

  const { capitalWaterfall: cw } = results;

  // Build waterfall data: each bar shows cumulative position
  const waterfallData = [
    {
      name: 'Base CET1',
      value: cw.baseCET1,
      fill: '#3b82f6',
      base: 0,
    },
    {
      name: 'Credit Loss',
      value: -cw.creditLoss,
      fill: '#ef4444',
      base: cw.baseCET1 - cw.creditLoss,
    },
    {
      name: 'Market Loss',
      value: -cw.marketLoss,
      fill: '#f97316',
      base: cw.baseCET1 - cw.creditLoss - cw.marketLoss,
    },
    {
      name: 'Op Risk Loss',
      value: -cw.opRiskLoss,
      fill: '#a855f7',
      base: cw.baseCET1 - cw.creditLoss - cw.marketLoss - cw.opRiskLoss,
    },
    {
      name: 'NII Impact',
      value: cw.niiImpact,
      fill: cw.niiImpact >= 0 ? '#10b981' : '#ef4444',
      base: cw.baseCET1 - cw.creditLoss - cw.marketLoss - cw.opRiskLoss + (cw.niiImpact < 0 ? cw.niiImpact : 0),
    },
    {
      name: 'Stressed CET1',
      value: cw.stressedCET1,
      fill: cw.breachesMinimum ? '#ef4444' : cw.breachesBuffer ? '#f59e0b' : '#10b981',
      base: 0,
    },
  ];

  // Convert to stacked format for Recharts
  const chartData = waterfallData.map(d => ({
    name: d.name,
    invisible: d.name === 'Base CET1' || d.name === 'Stressed CET1' ? 0 : Math.max(0, d.base),
    value: d.name === 'Base CET1' || d.name === 'Stressed CET1' ? d.value : Math.abs(d.value),
    fill: d.fill,
    displayValue: d.name === 'Base CET1' || d.name === 'Stressed CET1'
      ? `${d.value.toFixed(1)}%`
      : `${d.value >= 0 ? '+' : ''}${d.value.toFixed(2)}%`,
  }));

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4.5 h-4.5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Capital Waterfall (CET1 %)</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className={`px-2 py-0.5 rounded font-medium ${
            cw.breachesMinimum ? 'bg-red-500/15 text-red-400' :
            cw.breachesBuffer ? 'bg-amber-500/15 text-amber-400' :
            'bg-emerald-500/15 text-emerald-400'
          }`}>
            {cw.breachesMinimum ? 'Below Minimum' : cw.breachesBuffer ? 'Buffer Breach' : 'Above Buffer'}
          </span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b' }}
              domain={[0, 'auto']}
              tickFormatter={(v) => `${v.toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              formatter={(value, name) => {
                if (name === 'invisible') return [null, null];
                return [`${value.toFixed(2)}%`, 'CET1 Impact'];
              }}
            />
            <ReferenceLine
              y={4.5}
              stroke="#ef4444"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              label={{ value: 'Min CET1 (4.5%)', position: 'right', fill: '#ef4444', fontSize: 10 }}
            />
            <ReferenceLine
              y={7.0}
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="4 4"
              label={{ value: 'Buffer (7.0%)', position: 'right', fill: '#f59e0b', fontSize: 9 }}
            />
            <Bar dataKey="invisible" stackId="a" fill="transparent" />
            <Bar dataKey="value" stackId="a" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="displayValue"
                position="top"
                style={{ fontSize: 10, fill: '#cbd5e1', fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
