import { ArrowDownUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { useStressTest } from '../../contexts/StressTestContext';
import { formatCurrency } from '../../data/syntheticData';

export default function TornadoChart() {
  const { results } = useStressTest();
  if (!results) return null;

  const { riskFactorContributions } = results;

  // Tornado chart: horizontal bars sorted by absolute magnitude
  const chartData = riskFactorContributions.map(c => ({
    factor: c.factor,
    impact: c.impact,
    fill: c.impact < 0 ? '#ef4444' : '#10b981',
  }));

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowDownUp className="w-4.5 h-4.5 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">Risk Factor P&L Contribution</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-red-500 rounded-sm inline-block" /> Losses
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 bg-emerald-500 rounded-sm inline-block" /> Gains
          </span>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: '#64748b' }}
              tickFormatter={(v) => formatCurrency(v, true)}
            />
            <YAxis
              dataKey="factor"
              type="category"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              width={140}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
              formatter={(v) => [formatCurrency(v, true), 'P&L Impact']}
            />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1} />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={18}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
