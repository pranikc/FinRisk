import { useState } from 'react';
import { ArrowDown, ArrowUp, Columns3 } from 'lucide-react';
import { useStressTest } from '../../contexts/StressTestContext';
import { formatCurrency } from '../../data/syntheticData';

const categoryBadge = {
  Historical: 'bg-slate-700 text-slate-300',
  Regulatory: 'bg-blue-500/20 text-blue-400',
  Hypothetical: 'bg-indigo-500/20 text-indigo-400',
};

const sortOptions = [
  { id: 'stressedCET1', label: 'Lowest CET1' },
  { id: 'totalPnLImpact', label: 'Largest P&L Loss' },
  { id: 'eclIncrease', label: 'Largest ECL Increase' },
  { id: 'stressedLCR', label: 'Lowest LCR' },
  { id: 'survivalDays', label: 'Shortest Survival' },
];

export default function ScenarioComparison() {
  const { comparisonResults, severity, selectedScenarioId } = useStressTest();
  const [sortBy, setSortBy] = useState('stressedCET1');
  if (!comparisonResults) return null;

  const sortedResults = [...comparisonResults].sort((left, right) => {
    if (sortBy === 'stressedCET1' || sortBy === 'stressedLCR' || sortBy === 'survivalDays') {
      return left[sortBy] - right[sortBy];
    }

    return right[sortBy] - left[sortBy];
  });

  const worstScenario = sortedResults[0];

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex flex-col gap-4 mb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Columns3 className="w-4.5 h-4.5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Scenario Comparison ({severity.charAt(0).toUpperCase() + severity.slice(1)} Severity)</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {worstScenario && (
            <div className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs">
              <ArrowDown className="w-3.5 h-3.5 text-red-400" />
              <span className="text-slate-300">Worst case:</span>
              <span className="font-semibold text-red-300">{worstScenario.name}</span>
            </div>
          )}
          <label className="inline-flex items-center gap-2 text-xs text-slate-400">
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none transition-colors focus:border-blue-400"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
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
            {sortedResults.map((row, i) => {
              const isSelected = row.id === selectedScenarioId;
              const isWorst = worstScenario?.id === row.id;
              const cet1Breach = row.stressedCET1 < 4.5;
              const cet1Buffer = row.stressedCET1 < 7.0;
              const lcrBreach = row.stressedLCR < 100;
              const survivalCritical = row.survivalDays < 30;

              return (
                <tr
                  key={i}
                  className={`border-b border-slate-700/20 transition-colors ${
                    isSelected
                      ? 'bg-blue-500/10'
                      : isWorst
                        ? 'bg-red-500/5'
                        : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      {!isSelected && isWorst && <ArrowUp className="w-3.5 h-3.5 text-red-400 rotate-45" />}
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
