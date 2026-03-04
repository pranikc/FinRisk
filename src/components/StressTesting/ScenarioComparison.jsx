import { Columns3 } from 'lucide-react';
import { useStressTest } from '../../contexts/StressTestContext';
import { formatCurrency } from '../../data/syntheticData';

const categoryBadge = {
  Historical: 'bg-slate-700 text-slate-300',
  Regulatory: 'bg-blue-500/20 text-blue-400',
  Hypothetical: 'bg-indigo-500/20 text-indigo-400',
};

export default function ScenarioComparison() {
  const { comparisonResults, severity, selectedScenarioId } = useStressTest();
  if (!comparisonResults) return null;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Columns3 className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Scenario Comparison ({severity.charAt(0).toUpperCase() + severity.slice(1)} Severity)</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Scenario</th>
              <th className="text-center py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stressed CET1</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Total P&L</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">ECL Increase</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stressed LCR</th>
              <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Survival Days</th>
            </tr>
          </thead>
          <tbody>
            {comparisonResults.map((row, i) => {
              const isSelected = row.id === selectedScenarioId;
              const cet1Breach = row.stressedCET1 < 4.5;
              const cet1Buffer = row.stressedCET1 < 7.0;
              const lcrBreach = row.stressedLCR < 100;
              const survivalCritical = row.survivalDays < 30;

              return (
                <tr
                  key={i}
                  className={`border-b border-slate-700/20 transition-colors ${
                    isSelected ? 'bg-blue-500/10' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      <span className={`font-medium ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>{row.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${categoryBadge[row.category]}`}>
                      {row.category}
                    </span>
                  </td>
                  <td className={`py-3 px-3 text-right font-medium ${
                    cet1Breach ? 'text-red-400' : cet1Buffer ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {row.stressedCET1?.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right text-red-400 font-medium">
                    {formatCurrency(row.totalPnLImpact, true)}
                  </td>
                  <td className="py-3 px-3 text-right text-orange-400">
                    {formatCurrency(row.eclIncrease, true)}
                  </td>
                  <td className={`py-3 px-3 text-right font-medium ${lcrBreach ? 'text-red-400' : 'text-slate-300'}`}>
                    {row.stressedLCR?.toFixed(0)}%
                  </td>
                  <td className={`py-3 px-3 text-right font-medium ${survivalCritical ? 'text-red-400' : 'text-slate-300'}`}>
                    {row.survivalDays}d
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
