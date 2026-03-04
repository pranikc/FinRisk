import { CreditCard } from 'lucide-react';
import { useStressTest } from '../../contexts/StressTestContext';
import { formatCurrency, formatPercent } from '../../data/syntheticData';

export default function CreditStressPanel() {
  const { results } = useStressTest();
  if (!results) return null;

  const { credit } = results;

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <p className="text-xs text-slate-500 mb-1">Base ECL</p>
          <p className="text-xl font-bold text-white">{formatCurrency(credit.totalBaseECL, true)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-red-500/30 bg-red-500/5">
          <p className="text-xs text-slate-500 mb-1">Stressed ECL</p>
          <p className="text-xl font-bold text-red-400">{formatCurrency(credit.totalStressedECL, true)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-amber-500/30">
          <p className="text-xs text-slate-500 mb-1">ECL Increase</p>
          <p className="text-xl font-bold text-amber-400">{formatCurrency(credit.eclIncrease, true)}</p>
          <p className="text-xs mt-0.5 text-amber-400/70">+{formatPercent(credit.eclIncreasePercent)}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
          <p className="text-xs text-slate-500 mb-1">Wtd Avg Stressed PD</p>
          <p className="text-xl font-bold text-white">{formatPercent(credit.portfolioStressedPD, 2)}</p>
        </div>
      </div>

      {/* Stress Results by Rating */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4.5 h-4.5 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Stressed Credit Parameters by Rating</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Exposure</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Base PD</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stressed PD</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">PD Mult</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Base LGD</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stressed LGD</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stressed ECL</th>
              </tr>
            </thead>
            <tbody>
              {credit.byRating.map((row, i) => (
                <tr key={i} className="border-b border-slate-700/20 hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 text-slate-200 font-medium">{row.rating}</td>
                  <td className="py-3 px-3 text-right text-slate-300">{formatCurrency(row.exposure, true)}</td>
                  <td className="py-3 px-3 text-right text-slate-400">{formatPercent(row.pdBase, 2)}</td>
                  <td className="py-3 px-3 text-right text-red-400 font-medium">{formatPercent(row.pdStressed, 2)}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      row.pdMultiplier > 5 ? 'bg-red-500/15 text-red-400' :
                      row.pdMultiplier > 3 ? 'bg-orange-500/15 text-orange-400' :
                      row.pdMultiplier > 2 ? 'bg-amber-500/15 text-amber-400' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {row.pdMultiplier.toFixed(1)}x
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-400">{formatPercent(row.lgdBase)}</td>
                  <td className="py-3 px-3 text-right text-orange-400">{formatPercent(row.lgdStressed)}</td>
                  <td className="py-3 px-3 text-right text-red-400 font-medium">{formatCurrency(row.stressedECL, true)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-600/50">
                <td className="py-3 px-3 text-slate-200 font-semibold">Total</td>
                <td className="py-3 px-3 text-right text-slate-200 font-semibold">{formatCurrency(credit.totalExposure, true)}</td>
                <td colSpan={4}></td>
                <td className="py-3 px-3 text-right"></td>
                <td className="py-3 px-3 text-right text-red-400 font-bold">{formatCurrency(credit.totalStressedECL, true)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
