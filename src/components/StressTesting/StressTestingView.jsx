import { useState } from 'react';
import { Flame } from 'lucide-react';
import { useStressTest } from '../../contexts/StressTestContext';
import { getScenarioById } from '../../data/stressScenarioLibrary';
import { formatCurrency } from '../../data/syntheticData';
import DisclaimerBanner from './DisclaimerBanner';
import ScenarioSelector from './ScenarioSelector';
import CapitalWaterfall from './CapitalWaterfall';
import TornadoChart from './TornadoChart';
import CreditStressPanel from './CreditStressPanel';
import LiquidityStressPanel from './LiquidityStressPanel';
import ScenarioComparison from './ScenarioComparison';

const TABS = [
  { id: 'credit', label: 'Credit' },
  { id: 'market', label: 'Market' },
  { id: 'liquidity', label: 'Liquidity' },
  { id: 'comparison', label: 'Comparison' },
];

export default function StressTestingView() {
  const [activeTab, setActiveTab] = useState('credit');
  const { results, selectedScenarioId, severity } = useStressTest();

  const scenario = getScenarioById(selectedScenarioId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/15 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Stress Testing</h2>
            <p className="text-sm text-slate-400">
              Scenario analysis across credit, market, and liquidity risk
            </p>
          </div>
        </div>
        {scenario && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10">
            <span className="text-sm font-semibold text-orange-400">{scenario.name}</span>
            <span className="text-xs text-slate-400">({severity})</span>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <DisclaimerBanner />

      {/* Scenario Selector */}
      <ScenarioSelector />

      {/* Key Metrics Bar */}
      {results && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className={`bg-slate-800/50 rounded-lg p-4 border ${
            results.capitalWaterfall.breachesMinimum ? 'border-red-500/40 bg-red-500/5' :
            results.capitalWaterfall.breachesBuffer ? 'border-amber-500/30' :
            'border-slate-700/30'
          }`}>
            <p className="text-xs text-slate-500 mb-1">Stressed CET1</p>
            <p className={`text-xl font-bold ${
              results.capitalWaterfall.breachesMinimum ? 'text-red-400' :
              results.capitalWaterfall.breachesBuffer ? 'text-amber-400' :
              'text-emerald-400'
            }`}>
              {results.capitalWaterfall.stressedCET1.toFixed(1)}%
            </p>
            <p className="text-xs mt-0.5 text-slate-400">Base: {results.capitalWaterfall.baseCET1}%</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
            <p className="text-xs text-slate-500 mb-1">Total P&L Impact</p>
            <p className="text-xl font-bold text-red-400">{formatCurrency(results.summary.totalPnLImpact, true)}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
            <p className="text-xs text-slate-500 mb-1">ECL Increase</p>
            <p className="text-xl font-bold text-orange-400">{formatCurrency(results.summary.eclIncrease, true)}</p>
          </div>
          <div className={`bg-slate-800/50 rounded-lg p-4 border ${
            results.liquidity.lcrBreached ? 'border-red-500/40 bg-red-500/5' : 'border-slate-700/30'
          }`}>
            <p className="text-xs text-slate-500 mb-1">Stressed LCR</p>
            <p className={`text-xl font-bold ${results.liquidity.lcrBreached ? 'text-red-400' : 'text-white'}`}>
              {results.summary.stressedLCR.toFixed(0)}%
            </p>
          </div>
          <div className={`bg-slate-800/50 rounded-lg p-4 border ${
            results.summary.survivalDays < 30 ? 'border-red-500/40 bg-red-500/5' : 'border-slate-700/30'
          }`}>
            <p className="text-xs text-slate-500 mb-1">Survival Horizon</p>
            <p className={`text-xl font-bold ${results.summary.survivalDays < 30 ? 'text-red-400' : 'text-white'}`}>
              {results.summary.survivalDays} days
            </p>
          </div>
        </div>
      )}

      {/* Tabbed Panels */}
      <div>
        {/* Tab Bar */}
        <div className="flex gap-1 mb-6 border-b border-slate-700/50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-all cursor-pointer border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'credit' && (
          <div className="space-y-6">
            <CreditStressPanel />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CapitalWaterfall />
              <TornadoChart />
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CapitalWaterfall />
              <TornadoChart />
            </div>
            {/* Scenario shocks summary */}
            {results && (
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Market Shock Parameters</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Equity', value: `${(results.shockVector.equityShock * 100).toFixed(0)}%`, warn: results.shockVector.equityShock < -0.20 },
                    { label: '10Y Rate', value: `${results.shockVector.rateShock10Y > 0 ? '+' : ''}${results.shockVector.rateShock10Y}bp` },
                    { label: '2Y Rate', value: `${results.shockVector.rateShock2Y > 0 ? '+' : ''}${results.shockVector.rateShock2Y}bp` },
                    { label: 'IG Spreads', value: `+${results.shockVector.creditSpreadIG}bp`, warn: results.shockVector.creditSpreadIG > 200 },
                    { label: 'HY Spreads', value: `+${results.shockVector.creditSpreadHY}bp`, warn: results.shockVector.creditSpreadHY > 500 },
                    { label: 'VIX', value: results.shockVector.vixLevel, warn: results.shockVector.vixLevel > 40 },
                    { label: 'USD Index', value: `${results.shockVector.fxShockUSD > 0 ? '+' : ''}${(results.shockVector.fxShockUSD * 100).toFixed(0)}%` },
                    { label: 'Oil', value: `${(results.shockVector.oilShock * 100).toFixed(0)}%` },
                  ].map((item, i) => (
                    <div key={i} className={`rounded-lg p-3 border ${item.warn ? 'border-red-500/30 bg-red-500/5' : 'bg-slate-800/40 border-slate-700/30'}`}>
                      <p className="text-xs text-slate-500">{item.label}</p>
                      <p className={`text-lg font-bold ${item.warn ? 'text-red-400' : 'text-white'}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'liquidity' && (
          <LiquidityStressPanel />
        )}

        {activeTab === 'comparison' && (
          <ScenarioComparison />
        )}
      </div>
    </div>
  );
}
