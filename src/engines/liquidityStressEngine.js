// ============================================================
// Liquidity Stress Engine
// Computes stressed LCR, NSFR, and survival horizon
// ============================================================

import { clamp } from './mathUtils';

/**
 * Compute stressed LCR
 * LCR_stressed = HQLA * (1 - hqlaHaircut) / (outflows * depositRunoffMultiplier - inflows * inflowCap)
 *
 * @param {object} params
 * @returns {number} Stressed LCR as percentage
 */
export function computeStressedLCR({
  hqlaTotal,
  hqlaHaircut,
  totalOutflows30d,
  totalInflows30d,
  depositRunoffMultiplier,
  inflowCap = 0.75,
}) {
  const stressedHQLA = hqlaTotal * (1 - clamp(hqlaHaircut, 0, 0.8));
  const stressedOutflows = totalOutflows30d * clamp(depositRunoffMultiplier, 1, 10);
  const cappedInflows = totalInflows30d * inflowCap;
  const netOutflows = Math.max(stressedOutflows - cappedInflows, 1);

  return (stressedHQLA / netOutflows) * 100;
}

/**
 * Compute stressed NSFR
 * NSFR_stressed = ASF_stressed / RSF_stressed
 */
export function computeStressedNSFR({
  availableStableFunding,
  requiredStableFunding,
  fundingHaircut,
  rsfIncrease,
}) {
  const stressedASF = availableStableFunding * (1 - clamp(fundingHaircut, 0, 0.5));
  const stressedRSF = requiredStableFunding * (1 + clamp(rsfIncrease, 0, 1));

  return stressedRSF > 0 ? (stressedASF / stressedRSF) * 100 : 0;
}

/**
 * Compute survival horizon in days
 * Survival = availableLiquidity / dailyNetStressedOutflow
 *
 * @param {object} params
 * @returns {number} Survival days (capped at 365)
 */
export function computeSurvivalDays({
  hqlaTotal,
  hqlaHaircut,
  dailyOutflows,
  dailyInflows,
  outflowMultiplier,
}) {
  const availableLiquidity = hqlaTotal * (1 - clamp(hqlaHaircut, 0, 0.8));
  const dailyNetOutflow = (dailyOutflows * clamp(outflowMultiplier, 1, 10)) - (dailyInflows * 0.5);

  if (dailyNetOutflow <= 0) return 365;
  return clamp(Math.floor(availableLiquidity / dailyNetOutflow), 0, 365);
}

/**
 * Generate survival horizon time series for charting
 * Shows cumulative liquidity depletion over days
 */
export function generateSurvivalTimeSeries({
  hqlaTotal,
  hqlaHaircut,
  dailyOutflows,
  dailyInflows,
  outflowMultiplier,
  maxDays = 90,
}) {
  const availableLiquidity = hqlaTotal * (1 - clamp(hqlaHaircut, 0, 0.8));
  const dailyNetOutflow = (dailyOutflows * clamp(outflowMultiplier, 1, 10)) - (dailyInflows * 0.5);

  const series = [];
  let remaining = availableLiquidity;

  for (let day = 0; day <= maxDays; day++) {
    series.push({
      day,
      liquidity: Math.max(0, remaining),
      liquidityPct: (Math.max(0, remaining) / availableLiquidity) * 100,
      threshold: availableLiquidity * 0.1, // 10% critical threshold
    });
    remaining -= dailyNetOutflow;
    if (remaining <= 0 && day > 0) {
      // Fill rest with zeros
      for (let d = day + 1; d <= maxDays; d++) {
        series.push({ day: d, liquidity: 0, liquidityPct: 0, threshold: availableLiquidity * 0.1 });
      }
      break;
    }
  }

  return series;
}
