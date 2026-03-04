// ============================================================
// Credit Stress Engine
// Computes stressed LGD, ECL, and credit losses
// ============================================================

import { clamp } from './mathUtils';
import { computeStressedPD, baselCorrelation } from './vasicekEngine';

/**
 * Stress LGD based on scenario shocks
 * LGD_stressed = min(1, LGD_base + lgdAddon)
 *
 * @param {number} lgdBase - Base LGD (decimal, e.g. 0.45)
 * @param {number} lgdAddon - Additive LGD increase from scenario (decimal)
 * @returns {number} Stressed LGD (decimal)
 */
export function stressLGD(lgdBase, lgdAddon) {
  return clamp(lgdBase + lgdAddon, 0, 1);
}

/**
 * Compute stressed ECL for a portfolio segment
 * ECL_stressed = PD_stressed * LGD_stressed * EAD
 */
export function computeSegmentECL(pdStressed, lgdStressed, ead) {
  return pdStressed * lgdStressed * ead;
}

/**
 * Default LGD assumptions by rating bucket
 */
const BASE_LGD_BY_RATING = {
  'AAA': 0.30, 'AA': 0.32, 'A': 0.35, 'BBB': 0.40,
  'BB': 0.45, 'B': 0.50, 'CCC+': 0.55, 'CCC-': 0.60,
};

/**
 * Compute full credit stress results for the portfolio
 *
 * @param {Array} portfolio - creditPortfolioByRating data
 * @param {object} shockVector - Scenario shock parameters
 * @returns {object} Credit stress results
 */
export function computeCreditStressResults(portfolio, shockVector) {
  const stressPercentile = shockVector.stressPercentile || 0.999;
  const lgdAddon = shockVector.lgdAddon || 0;
  const pdMultiplier = shockVector.pdMultiplier || 1;

  let totalBaseECL = 0;
  let totalStressedECL = 0;
  let totalExposure = 0;

  const byRating = portfolio.map(item => {
    const pdBase = (item.pd / 100) * pdMultiplier;
    const pdClamped = clamp(pdBase, 0.0001, 0.9999);
    const rho = baselCorrelation(pdClamped);
    const pdStressed = computeStressedPD(pdClamped, rho, stressPercentile);

    const baseLGD = BASE_LGD_BY_RATING[item.rating] || 0.45;
    const stressedLGDVal = stressLGD(baseLGD, lgdAddon);

    const ead = item.exposure;
    const baseECL = pdClamped * baseLGD * ead;
    const stressedECL = pdStressed * stressedLGDVal * ead;

    totalBaseECL += baseECL;
    totalStressedECL += stressedECL;
    totalExposure += ead;

    return {
      rating: item.rating,
      exposure: ead,
      pdBase: pdClamped * 100,
      pdStressed: pdStressed * 100,
      pdMultiplier: pdStressed / pdClamped,
      lgdBase: baseLGD * 100,
      lgdStressed: stressedLGDVal * 100,
      baseECL,
      stressedECL,
      eclIncrease: stressedECL - baseECL,
    };
  });

  return {
    byRating,
    totalBaseECL,
    totalStressedECL,
    eclIncrease: totalStressedECL - totalBaseECL,
    eclIncreasePercent: totalBaseECL > 0
      ? ((totalStressedECL - totalBaseECL) / totalBaseECL) * 100
      : 0,
    totalExposure,
    portfolioStressedPD: totalExposure > 0
      ? byRating.reduce((sum, r) => sum + (r.pdStressed / 100) * r.exposure, 0) / totalExposure * 100
      : 0,
  };
}
