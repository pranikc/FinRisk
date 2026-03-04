// ============================================================
// Scenario Engine
// Takes scenario + severity + portfolio data and computes all stress results
// ============================================================

import { computeCreditStressResults } from './creditStressEngine';
import {
  computeStressedLCR,
  computeStressedNSFR,
  computeSurvivalDays,
  generateSurvivalTimeSeries,
} from './liquidityStressEngine';
import {
  getShockVector,
  stressScenarioLibrary,
} from '../data/stressScenarioLibrary';
import {
  creditPortfolioByRating,
  institution,
  hqlaComposition,
  liquidityRatios,
  fundingSources,
  sensitivities,
} from '../data/syntheticData';

// Bank constants derived from synthetic data
const CET1_RATIO_BASE = 12.4; // From agentActivityLog: CET1 at 12.4%
const TIER1_CAPITAL = institution.tier1Capital;
const TOTAL_ASSETS = institution.totalAssets;
const TOTAL_HQLA = hqlaComposition.reduce((s, h) => s + h.amount, 0);
const TOTAL_DEPOSITS = institution.totalDeposits;
const TOTAL_OUTFLOWS_30D = 6_800_000_000; // Approximation from cash flow ladder
const TOTAL_INFLOWS_30D = 5_200_000_000;
const DAILY_OUTFLOWS = TOTAL_OUTFLOWS_30D / 30;
const DAILY_INFLOWS = TOTAL_INFLOWS_30D / 30;
const ASF = 35_000_000_000; // Available stable funding approximation
const RSF = 32_400_000_000; // Required stable funding approximation

/**
 * Compute P&L contribution from each risk factor (for tornado chart)
 */
function computeRiskFactorContributions(shockVector) {
  // Use existing sensitivities to scale P&L contributions
  const dv01 = sensitivities.find(s => s.unit === 'DV01')?.impact || -142_000;
  const cs01 = sensitivities.find(s => s.unit === 'CS01')?.impact || -89_000;
  const eqDelta = sensitivities.find(s => s.unit === 'Equity Delta')?.impact || 320_000;
  const fxDelta = sensitivities.find(s => s.unit === 'FX Delta')?.impact || -210_000;
  const vega = sensitivities.find(s => s.unit === 'Vega')?.impact || 180_000;

  const contributions = [
    {
      factor: 'Equity Markets',
      impact: (shockVector.equityShock * 100) * eqDelta * 10,
      color: shockVector.equityShock < 0 ? '#ef4444' : '#10b981',
    },
    {
      factor: 'Interest Rates (10Y)',
      impact: shockVector.rateShock10Y * dv01,
      color: shockVector.rateShock10Y * dv01 < 0 ? '#ef4444' : '#10b981',
    },
    {
      factor: 'IG Credit Spreads',
      impact: shockVector.creditSpreadIG * cs01 * 5,
      color: '#ef4444',
    },
    {
      factor: 'HY Credit Spreads',
      impact: shockVector.creditSpreadHY * cs01 * 2,
      color: '#ef4444',
    },
    {
      factor: 'FX (USD)',
      impact: (shockVector.fxShockUSD * 100) * fxDelta * 8,
      color: shockVector.fxShockUSD * fxDelta < 0 ? '#ef4444' : '#10b981',
    },
    {
      factor: 'Volatility (VIX)',
      impact: Math.max(0, shockVector.vixLevel - 20) * vega * 500,
      color: '#10b981',
    },
    {
      factor: 'GDP Impact',
      impact: shockVector.gdpShock * TOTAL_ASSETS * 0.001,
      color: '#ef4444',
    },
    {
      factor: 'CRE Valuations',
      impact: shockVector.creShock * 8_200_000_000 * 0.3, // 30% of CRE exposure
      color: '#ef4444',
    },
    {
      factor: 'Oil Prices',
      impact: shockVector.oilShock * 2_800_000_000 * 0.05, // Energy exposure impact
      color: shockVector.oilShock < 0 ? '#ef4444' : '#10b981',
    },
    {
      factor: 'Housing Prices',
      impact: shockVector.hpiShock * 2_700_000_000 * 0.2, // Resi mortgage impact
      color: '#ef4444',
    },
  ];

  return contributions
    .map(c => ({ ...c, absImpact: Math.abs(c.impact) }))
    .sort((a, b) => b.absImpact - a.absImpact);
}

/**
 * Compute capital waterfall components
 */
function computeCapitalWaterfall(creditResults, shockVector, riskFactorContributions) {
  const baseCET1 = CET1_RATIO_BASE;

  // Credit loss as % of RWA (simplified)
  const creditLossRatio = (creditResults.eclIncrease / TOTAL_ASSETS) * 100;

  // Market loss from risk factor contributions
  const totalMarketLoss = riskFactorContributions
    .filter(c => ['Equity Markets', 'Interest Rates (10Y)', 'FX (USD)', 'Oil Prices', 'Volatility (VIX)'].includes(c.factor))
    .reduce((sum, c) => sum + c.impact, 0);
  const marketLossRatio = Math.abs(totalMarketLoss / TOTAL_ASSETS) * 100;

  // Operational risk loss
  const baseOpRisk = 0.3; // 30bp base operational risk
  const opRiskLossRatio = baseOpRisk * shockVector.opRiskMultiplier;

  // NII impact (positive rates = positive NII for banks with positive duration gap)
  const niiImpact = (shockVector.rateShock10Y / 100) * 0.12; // 12bp per 100bp rate move

  const stressedCET1 = baseCET1 - creditLossRatio - marketLossRatio - opRiskLossRatio + niiImpact;

  return {
    baseCET1,
    creditLoss: creditLossRatio,
    marketLoss: marketLossRatio,
    opRiskLoss: opRiskLossRatio,
    niiImpact,
    stressedCET1: Math.max(0, stressedCET1),
    capitalSurplus: stressedCET1 - 4.5, // vs 4.5% regulatory minimum
    breachesMinimum: stressedCET1 < 4.5,
    breachesBuffer: stressedCET1 < 7.0, // Including capital conservation buffer
  };
}

/**
 * Apply a scenario at a given severity and compute all stress results
 *
 * @param {string} scenarioId - Scenario ID from library
 * @param {string} severity - 'mild' | 'moderate' | 'severe' | 'extreme'
 * @returns {object|null} Complete stress results or null if invalid
 */
export function applyScenario(scenarioId, severity) {
  const shockVector = getShockVector(scenarioId, severity);
  if (!shockVector) return null;

  // Credit stress results
  const creditResults = computeCreditStressResults(creditPortfolioByRating, shockVector);

  // Risk factor contributions (tornado chart)
  const riskFactorContributions = computeRiskFactorContributions(shockVector);

  // Capital waterfall
  const capitalWaterfall = computeCapitalWaterfall(creditResults, shockVector, riskFactorContributions);

  // Liquidity stress
  const stressedLCR = computeStressedLCR({
    hqlaTotal: TOTAL_HQLA,
    hqlaHaircut: shockVector.hqlaHaircut,
    totalOutflows30d: TOTAL_OUTFLOWS_30D,
    totalInflows30d: TOTAL_INFLOWS_30D,
    depositRunoffMultiplier: shockVector.depositRunoffMult,
  });

  const stressedNSFR = computeStressedNSFR({
    availableStableFunding: ASF,
    requiredStableFunding: RSF,
    fundingHaircut: shockVector.fundingHaircut,
    rsfIncrease: shockVector.rsfIncrease,
  });

  const survivalDays = computeSurvivalDays({
    hqlaTotal: TOTAL_HQLA,
    hqlaHaircut: shockVector.hqlaHaircut,
    dailyOutflows: DAILY_OUTFLOWS,
    dailyInflows: DAILY_INFLOWS,
    outflowMultiplier: shockVector.depositRunoffMult,
  });

  const survivalTimeSeries = generateSurvivalTimeSeries({
    hqlaTotal: TOTAL_HQLA,
    hqlaHaircut: shockVector.hqlaHaircut,
    dailyOutflows: DAILY_OUTFLOWS,
    dailyInflows: DAILY_INFLOWS,
    outflowMultiplier: shockVector.depositRunoffMult,
  });

  // Total P&L impact
  const totalPnLImpact = riskFactorContributions.reduce((sum, c) => sum + c.impact, 0) - creditResults.eclIncrease;

  return {
    scenarioId,
    severity,
    shockVector,
    credit: creditResults,
    capitalWaterfall,
    riskFactorContributions,
    liquidity: {
      stressedLCR,
      stressedNSFR,
      baseLCR: liquidityRatios.lcr,
      baseNSFR: liquidityRatios.nsfr,
      survivalDays,
      survivalTimeSeries,
      lcrBreached: stressedLCR < 100,
      nsfrBreached: stressedNSFR < 100,
    },
    summary: {
      totalPnLImpact,
      stressedCET1: capitalWaterfall.stressedCET1,
      eclIncrease: creditResults.eclIncrease,
      stressedLCR,
      survivalDays,
    },
  };
}

/**
 * Compute results for all scenarios at a given severity (for comparison table)
 */
export function computeAllStressResults(severity) {
  return stressScenarioLibrary.map(scenario => {
    const results = applyScenario(scenario.id, severity);
    return {
      id: scenario.id,
      name: scenario.name,
      category: scenario.category,
      keyShocks: scenario.keyShocks,
      ...results?.summary,
    };
  });
}
