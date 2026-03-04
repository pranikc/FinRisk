// ============================================================
// Vasicek Single-Factor Model for PD Stress Testing
// Implements Basel IRB formula for conditional PD
// ============================================================

import { normalCDF, normalInverse, clamp } from './mathUtils';

/**
 * Basel IRB asset correlation formula
 * For corporate/bank exposures: rho = 0.12 * f(PD) + 0.24 * (1 - f(PD))
 * where f(PD) = (1 - exp(-50*PD)) / (1 - exp(-50))
 */
export function baselCorrelation(pd) {
  const pdClamped = clamp(pd, 0.0001, 0.9999);
  const expFactor = (1 - Math.exp(-50 * pdClamped)) / (1 - Math.exp(-50));
  return 0.12 * expFactor + 0.24 * (1 - expFactor);
}

/**
 * Compute stressed PD using the Vasicek single-factor model (Basel IRB formula):
 * PD_stressed = Phi((Phi^-1(PD_base) + sqrt(rho) * Phi^-1(stress_percentile)) / sqrt(1 - rho))
 *
 * @param {number} pdBase - Base (through-the-cycle) PD, e.g. 0.02 for 2%
 * @param {number} rho - Asset correlation (0, 1). If null, uses Basel IRB formula
 * @param {number} stressPercentile - Stress percentile (e.g. 0.999 for 99.9th percentile)
 * @returns {number} Stressed PD, clamped to [pdBase, 1]
 */
export function computeStressedPD(pdBase, rho, stressPercentile) {
  // Bounds checking
  const pd = clamp(pdBase, 0.0001, 0.9999);
  const correlation = rho != null ? clamp(rho, 0.001, 0.999) : baselCorrelation(pd);
  const percentile = clamp(stressPercentile, 0.001, 0.9999);

  const phiInvPD = normalInverse(pd);
  const phiInvStress = normalInverse(percentile);

  const numerator = phiInvPD + Math.sqrt(correlation) * phiInvStress;
  const denominator = Math.sqrt(1 - correlation);

  const stressedPD = normalCDF(numerator / denominator);

  // Stressed PD should be at least the base PD
  return clamp(stressedPD, pd, 1);
}

/**
 * Compute stressed PDs for an entire portfolio broken down by rating
 *
 * @param {Array} portfolio - Array of { rating, pd, exposure, ... }
 * @param {number} stressPercentile - Stress scenario percentile
 * @returns {Array} Portfolio with added stressedPD field
 */
export function stressPortfolioByRating(portfolio, stressPercentile) {
  return portfolio.map(item => {
    const pdBase = item.pd / 100; // Convert from percentage to decimal
    const stressedPD = computeStressedPD(pdBase, null, stressPercentile);
    return {
      ...item,
      pdBase: pdBase * 100,
      stressedPD: stressedPD * 100, // Back to percentage
      pdMultiplier: stressedPD / pdBase,
    };
  });
}
