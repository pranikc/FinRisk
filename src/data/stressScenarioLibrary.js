// ============================================================
// Stress Scenario Library
// 9 scenarios x 4 severity levels x 21 risk factors
// ============================================================

/**
 * Severity levels with return period descriptions
 */
export const SEVERITY_LEVELS = [
  { id: 'mild', label: 'Mild', returnPeriod: '~1-in-10 year', percentile: 0.90 },
  { id: 'moderate', label: 'Moderate', returnPeriod: '~1-in-25 year', percentile: 0.96 },
  { id: 'severe', label: 'Severe', returnPeriod: '~1-in-50 year', percentile: 0.98 },
  { id: 'extreme', label: 'Extreme', returnPeriod: '~1-in-100 year', percentile: 0.99 },
];

/**
 * Scenario categories
 */
export const SCENARIO_CATEGORIES = {
  HISTORICAL: 'Historical',
  REGULATORY: 'Regulatory',
  HYPOTHETICAL: 'Hypothetical',
};

/**
 * ShockVector structure (21 risk factors per severity level):
 *
 * Market factors:
 *   equityShock          - Equity market decline (e.g. -0.40 = -40%)
 *   rateShock10Y         - 10Y yield change in bp (e.g. +200)
 *   rateShock2Y          - 2Y yield change in bp
 *   creditSpreadIG       - IG spread widening in bp
 *   creditSpreadHY       - HY spread widening in bp
 *   fxShockUSD           - USD index change (e.g. +0.15 = +15%)
 *   vixLevel             - Absolute VIX level
 *   oilShock             - Oil price change (e.g. -0.50 = -50%)
 *
 * Macro factors:
 *   gdpShock             - GDP change (e.g. -0.04 = -4%)
 *   unemploymentShock    - Unemployment increase in pp (e.g. +5.5)
 *   inflationShock       - Inflation change in pp (e.g. +4)
 *   hpiShock             - House price change (e.g. -0.25 = -25%)
 *   creShock             - CRE price change (e.g. -0.35 = -35%)
 *
 * Credit factors:
 *   pdMultiplier         - PD multiplier for the scenario (e.g. 2.5 = 2.5x base PD)
 *   lgdAddon             - Additive LGD increase (e.g. 0.10 = +10pp)
 *   stressPercentile     - Vasicek stress percentile
 *
 * Liquidity factors:
 *   depositRunoffMult    - Deposit outflow multiplier
 *   hqlaHaircut          - HQLA value haircut
 *   fundingHaircut       - Stable funding reduction
 *   rsfIncrease          - Required stable funding increase
 *
 * Operational:
 *   opRiskMultiplier     - Operational risk loss multiplier
 */

function createShockVector(overrides) {
  return {
    // Market factors
    equityShock: 0,
    rateShock10Y: 0,
    rateShock2Y: 0,
    creditSpreadIG: 0,
    creditSpreadHY: 0,
    fxShockUSD: 0,
    vixLevel: 20,
    oilShock: 0,
    // Macro factors
    gdpShock: 0,
    unemploymentShock: 0,
    inflationShock: 0,
    hpiShock: 0,
    creShock: 0,
    // Credit factors
    pdMultiplier: 1,
    lgdAddon: 0,
    stressPercentile: 0.999,
    // Liquidity factors
    depositRunoffMult: 1,
    hqlaHaircut: 0,
    fundingHaircut: 0,
    rsfIncrease: 0,
    // Operational
    opRiskMultiplier: 1,
    ...overrides,
  };
}

/**
 * 9 Stress Scenarios
 */
export const stressScenarioLibrary = [
  // ----------------------------------------------------------------
  // 1. 2008 Global Financial Crisis
  // ----------------------------------------------------------------
  {
    id: 'gfc-2008',
    name: '2008 Global Financial Crisis',
    category: SCENARIO_CATEGORIES.HISTORICAL,
    description: 'Subprime mortgage collapse leading to global banking crisis, equity crash, and credit freeze.',
    keyShocks: 'Equity -57%, Spreads +1500bp, GDP -4.3%',
    shocks: {
      mild: createShockVector({
        equityShock: -0.20, rateShock10Y: -50, rateShock2Y: -30, creditSpreadIG: 100, creditSpreadHY: 400,
        fxShockUSD: 0.05, vixLevel: 35, oilShock: -0.25,
        gdpShock: -0.015, unemploymentShock: 1.5, inflationShock: -0.5, hpiShock: -0.08, creShock: -0.10,
        pdMultiplier: 1.5, lgdAddon: 0.03, stressPercentile: 0.95,
        depositRunoffMult: 1.2, hqlaHaircut: 0.03, fundingHaircut: 0.05, rsfIncrease: 0.05,
        opRiskMultiplier: 1.2,
      }),
      moderate: createShockVector({
        equityShock: -0.35, rateShock10Y: -120, rateShock2Y: -80, creditSpreadIG: 250, creditSpreadHY: 800,
        fxShockUSD: 0.10, vixLevel: 50, oilShock: -0.45,
        gdpShock: -0.028, unemploymentShock: 3.0, inflationShock: -1.0, hpiShock: -0.15, creShock: -0.22,
        pdMultiplier: 2.0, lgdAddon: 0.06, stressPercentile: 0.975,
        depositRunoffMult: 1.5, hqlaHaircut: 0.06, fundingHaircut: 0.10, rsfIncrease: 0.10,
        opRiskMultiplier: 1.5,
      }),
      severe: createShockVector({
        equityShock: -0.47, rateShock10Y: -170, rateShock2Y: -130, creditSpreadIG: 350, creditSpreadHY: 1200,
        fxShockUSD: 0.13, vixLevel: 65, oilShock: -0.60,
        gdpShock: -0.038, unemploymentShock: 4.2, inflationShock: -1.5, hpiShock: -0.22, creShock: -0.32,
        pdMultiplier: 2.8, lgdAddon: 0.10, stressPercentile: 0.99,
        depositRunoffMult: 2.0, hqlaHaircut: 0.10, fundingHaircut: 0.18, rsfIncrease: 0.15,
        opRiskMultiplier: 1.8,
      }),
      extreme: createShockVector({
        equityShock: -0.57, rateShock10Y: -200, rateShock2Y: -180, creditSpreadIG: 400, creditSpreadHY: 1500,
        fxShockUSD: 0.15, vixLevel: 81, oilShock: -0.78,
        gdpShock: -0.043, unemploymentShock: 5.0, inflationShock: -2.0, hpiShock: -0.27, creShock: -0.40,
        pdMultiplier: 3.5, lgdAddon: 0.15, stressPercentile: 0.999,
        depositRunoffMult: 2.5, hqlaHaircut: 0.15, fundingHaircut: 0.25, rsfIncrease: 0.20,
        opRiskMultiplier: 2.0,
      }),
    },
  },

  // ----------------------------------------------------------------
  // 2. COVID-19 Market Shock
  // ----------------------------------------------------------------
  {
    id: 'covid-2020',
    name: 'COVID-19 Market Shock',
    category: SCENARIO_CATEGORIES.HISTORICAL,
    description: 'Pandemic-driven market crash with unprecedented speed, VIX spike, and sector-specific devastation.',
    keyShocks: 'Equity -34%, VIX 83, Unemployment +11.2pp',
    shocks: {
      mild: createShockVector({
        equityShock: -0.12, rateShock10Y: -40, rateShock2Y: -25, creditSpreadIG: 80, creditSpreadHY: 250,
        fxShockUSD: 0.03, vixLevel: 35, oilShock: -0.20,
        gdpShock: -0.010, unemploymentShock: 2.0, inflationShock: -0.5, hpiShock: -0.03, creShock: -0.05,
        pdMultiplier: 1.4, lgdAddon: 0.02, stressPercentile: 0.94,
        depositRunoffMult: 1.1, hqlaHaircut: 0.02, fundingHaircut: 0.04, rsfIncrease: 0.03,
        opRiskMultiplier: 1.3,
      }),
      moderate: createShockVector({
        equityShock: -0.22, rateShock10Y: -85, rateShock2Y: -55, creditSpreadIG: 170, creditSpreadHY: 480,
        fxShockUSD: 0.06, vixLevel: 50, oilShock: -0.40,
        gdpShock: -0.020, unemploymentShock: 5.0, inflationShock: -1.0, hpiShock: -0.06, creShock: -0.10,
        pdMultiplier: 2.0, lgdAddon: 0.05, stressPercentile: 0.97,
        depositRunoffMult: 1.3, hqlaHaircut: 0.05, fundingHaircut: 0.08, rsfIncrease: 0.06,
        opRiskMultiplier: 1.6,
      }),
      severe: createShockVector({
        equityShock: -0.30, rateShock10Y: -115, rateShock2Y: -80, creditSpreadIG: 240, creditSpreadHY: 650,
        fxShockUSD: 0.08, vixLevel: 68, oilShock: -0.60,
        gdpShock: -0.035, unemploymentShock: 8.0, inflationShock: -1.5, hpiShock: -0.10, creShock: -0.18,
        pdMultiplier: 2.8, lgdAddon: 0.08, stressPercentile: 0.985,
        depositRunoffMult: 1.5, hqlaHaircut: 0.08, fundingHaircut: 0.12, rsfIncrease: 0.10,
        opRiskMultiplier: 1.8,
      }),
      extreme: createShockVector({
        equityShock: -0.34, rateShock10Y: -130, rateShock2Y: -100, creditSpreadIG: 280, creditSpreadHY: 740,
        fxShockUSD: 0.10, vixLevel: 83, oilShock: -1.00,
        gdpShock: -0.050, unemploymentShock: 11.2, inflationShock: -2.0, hpiShock: -0.15, creShock: -0.25,
        pdMultiplier: 3.5, lgdAddon: 0.12, stressPercentile: 0.995,
        depositRunoffMult: 1.8, hqlaHaircut: 0.12, fundingHaircut: 0.18, rsfIncrease: 0.15,
        opRiskMultiplier: 2.2,
      }),
    },
  },

  // ----------------------------------------------------------------
  // 3. 2022 Rate Shock / Bond Bear
  // ----------------------------------------------------------------
  {
    id: 'rate-shock-2022',
    name: '2022 Rate Shock / Bond Bear',
    category: SCENARIO_CATEGORIES.HISTORICAL,
    description: 'Fastest rate hiking cycle in decades causing worst bond market losses in modern history.',
    keyShocks: '10Y +273bp, 2Y +400bp, Equity -25%',
    shocks: {
      mild: createShockVector({
        equityShock: -0.08, rateShock10Y: 80, rateShock2Y: 120, creditSpreadIG: 40, creditSpreadHY: 120,
        fxShockUSD: 0.04, vixLevel: 28, oilShock: 0.15,
        gdpShock: -0.005, unemploymentShock: 0.5, inflationShock: 2.0, hpiShock: -0.05, creShock: -0.08,
        pdMultiplier: 1.2, lgdAddon: 0.02, stressPercentile: 0.92,
        depositRunoffMult: 1.3, hqlaHaircut: 0.04, fundingHaircut: 0.06, rsfIncrease: 0.04,
        opRiskMultiplier: 1.1,
      }),
      moderate: createShockVector({
        equityShock: -0.15, rateShock10Y: 160, rateShock2Y: 250, creditSpreadIG: 80, creditSpreadHY: 250,
        fxShockUSD: 0.08, vixLevel: 32, oilShock: 0.25,
        gdpShock: -0.010, unemploymentShock: 1.0, inflationShock: 3.0, hpiShock: -0.10, creShock: -0.15,
        pdMultiplier: 1.5, lgdAddon: 0.04, stressPercentile: 0.96,
        depositRunoffMult: 1.8, hqlaHaircut: 0.08, fundingHaircut: 0.10, rsfIncrease: 0.08,
        opRiskMultiplier: 1.3,
      }),
      severe: createShockVector({
        equityShock: -0.22, rateShock10Y: 230, rateShock2Y: 340, creditSpreadIG: 120, creditSpreadHY: 380,
        fxShockUSD: 0.12, vixLevel: 36, oilShock: 0.30,
        gdpShock: -0.018, unemploymentShock: 2.0, inflationShock: 4.0, hpiShock: -0.15, creShock: -0.22,
        pdMultiplier: 1.8, lgdAddon: 0.06, stressPercentile: 0.98,
        depositRunoffMult: 2.5, hqlaHaircut: 0.12, fundingHaircut: 0.15, rsfIncrease: 0.12,
        opRiskMultiplier: 1.5,
      }),
      extreme: createShockVector({
        equityShock: -0.25, rateShock10Y: 273, rateShock2Y: 400, creditSpreadIG: 150, creditSpreadHY: 450,
        fxShockUSD: 0.15, vixLevel: 40, oilShock: 0.40,
        gdpShock: -0.025, unemploymentShock: 3.0, inflationShock: 5.0, hpiShock: -0.20, creShock: -0.30,
        pdMultiplier: 2.2, lgdAddon: 0.08, stressPercentile: 0.99,
        depositRunoffMult: 3.0, hqlaHaircut: 0.15, fundingHaircut: 0.20, rsfIncrease: 0.15,
        opRiskMultiplier: 1.8,
      }),
    },
  },

  // ----------------------------------------------------------------
  // 4. SVB / Regional Bank Crisis
  // ----------------------------------------------------------------
  {
    id: 'svb-2023',
    name: 'SVB / Regional Bank Crisis',
    category: SCENARIO_CATEGORIES.HISTORICAL,
    description: 'Digital bank run causing rapid deposit flight, regional bank equity crash, and bond market volatility.',
    keyShocks: 'Deposit runoff 10x, MOVE 199, Bank equity -28%',
    shocks: {
      mild: createShockVector({
        equityShock: -0.08, rateShock10Y: -30, rateShock2Y: -40, creditSpreadIG: 30, creditSpreadHY: 100,
        fxShockUSD: 0.02, vixLevel: 28, oilShock: -0.05,
        gdpShock: -0.005, unemploymentShock: 0.3, inflationShock: -0.3, hpiShock: -0.03, creShock: -0.05,
        pdMultiplier: 1.3, lgdAddon: 0.02, stressPercentile: 0.93,
        depositRunoffMult: 2.0, hqlaHaircut: 0.05, fundingHaircut: 0.08, rsfIncrease: 0.05,
        opRiskMultiplier: 1.3,
      }),
      moderate: createShockVector({
        equityShock: -0.15, rateShock10Y: -60, rateShock2Y: -70, creditSpreadIG: 60, creditSpreadHY: 200,
        fxShockUSD: 0.03, vixLevel: 32, oilShock: -0.08,
        gdpShock: -0.010, unemploymentShock: 0.8, inflationShock: -0.5, hpiShock: -0.05, creShock: -0.10,
        pdMultiplier: 1.6, lgdAddon: 0.04, stressPercentile: 0.96,
        depositRunoffMult: 4.0, hqlaHaircut: 0.10, fundingHaircut: 0.15, rsfIncrease: 0.10,
        opRiskMultiplier: 1.5,
      }),
      severe: createShockVector({
        equityShock: -0.22, rateShock10Y: -90, rateShock2Y: -100, creditSpreadIG: 100, creditSpreadHY: 320,
        fxShockUSD: 0.04, vixLevel: 38, oilShock: -0.12,
        gdpShock: -0.018, unemploymentShock: 1.5, inflationShock: -0.8, hpiShock: -0.08, creShock: -0.15,
        pdMultiplier: 2.0, lgdAddon: 0.06, stressPercentile: 0.985,
        depositRunoffMult: 7.0, hqlaHaircut: 0.15, fundingHaircut: 0.22, rsfIncrease: 0.15,
        opRiskMultiplier: 1.8,
      }),
      extreme: createShockVector({
        equityShock: -0.28, rateShock10Y: -110, rateShock2Y: -130, creditSpreadIG: 140, creditSpreadHY: 420,
        fxShockUSD: 0.05, vixLevel: 45, oilShock: -0.15,
        gdpShock: -0.025, unemploymentShock: 2.5, inflationShock: -1.0, hpiShock: -0.12, creShock: -0.20,
        pdMultiplier: 2.5, lgdAddon: 0.08, stressPercentile: 0.995,
        depositRunoffMult: 10.0, hqlaHaircut: 0.20, fundingHaircut: 0.30, rsfIncrease: 0.20,
        opRiskMultiplier: 2.0,
      }),
    },
  },

  // ----------------------------------------------------------------
  // 5. CCAR Severely Adverse
  // ----------------------------------------------------------------
  {
    id: 'ccar-sa-2026',
    name: 'CCAR Severely Adverse',
    category: SCENARIO_CATEGORIES.REGULATORY,
    description: 'Federal Reserve severely adverse scenario with deep recession, high unemployment, and market stress.',
    keyShocks: 'GDP -4%, Unemployment +5.5pp, Equity -40%',
    shocks: {
      mild: createShockVector({
        equityShock: -0.12, rateShock10Y: -40, rateShock2Y: -20, creditSpreadIG: 60, creditSpreadHY: 200,
        fxShockUSD: 0.04, vixLevel: 30, oilShock: -0.15,
        gdpShock: -0.012, unemploymentShock: 1.5, inflationShock: -0.5, hpiShock: -0.08, creShock: -0.10,
        pdMultiplier: 1.5, lgdAddon: 0.03, stressPercentile: 0.95,
        depositRunoffMult: 1.2, hqlaHaircut: 0.03, fundingHaircut: 0.05, rsfIncrease: 0.04,
        opRiskMultiplier: 1.3,
      }),
      moderate: createShockVector({
        equityShock: -0.25, rateShock10Y: -80, rateShock2Y: -50, creditSpreadIG: 130, creditSpreadHY: 420,
        fxShockUSD: 0.08, vixLevel: 42, oilShock: -0.30,
        gdpShock: -0.025, unemploymentShock: 3.0, inflationShock: -1.0, hpiShock: -0.16, creShock: -0.22,
        pdMultiplier: 2.0, lgdAddon: 0.06, stressPercentile: 0.975,
        depositRunoffMult: 1.5, hqlaHaircut: 0.06, fundingHaircut: 0.10, rsfIncrease: 0.08,
        opRiskMultiplier: 1.6,
      }),
      severe: createShockVector({
        equityShock: -0.35, rateShock10Y: -120, rateShock2Y: -80, creditSpreadIG: 200, creditSpreadHY: 600,
        fxShockUSD: 0.12, vixLevel: 55, oilShock: -0.45,
        gdpShock: -0.035, unemploymentShock: 4.5, inflationShock: -1.5, hpiShock: -0.22, creShock: -0.32,
        pdMultiplier: 2.8, lgdAddon: 0.10, stressPercentile: 0.99,
        depositRunoffMult: 1.8, hqlaHaircut: 0.10, fundingHaircut: 0.15, rsfIncrease: 0.12,
        opRiskMultiplier: 1.8,
      }),
      extreme: createShockVector({
        equityShock: -0.40, rateShock10Y: -150, rateShock2Y: -100, creditSpreadIG: 260, creditSpreadHY: 750,
        fxShockUSD: 0.15, vixLevel: 65, oilShock: -0.55,
        gdpShock: -0.040, unemploymentShock: 5.5, inflationShock: -2.0, hpiShock: -0.28, creShock: -0.40,
        pdMultiplier: 3.5, lgdAddon: 0.12, stressPercentile: 0.999,
        depositRunoffMult: 2.0, hqlaHaircut: 0.13, fundingHaircut: 0.20, rsfIncrease: 0.15,
        opRiskMultiplier: 2.0,
      }),
    },
  },

  // ----------------------------------------------------------------
  // 6. Stagflation
  // ----------------------------------------------------------------
  {
    id: 'stagflation',
    name: 'Stagflation',
    category: SCENARIO_CATEGORIES.HYPOTHETICAL,
    description: 'Persistent high inflation combined with economic contraction and rising rates.',
    keyShocks: 'GDP -2%, Inflation +4%, Rates +200bp',
    shocks: {
      mild: createShockVector({
        equityShock: -0.08, rateShock10Y: 60, rateShock2Y: 80, creditSpreadIG: 40, creditSpreadHY: 130,
        fxShockUSD: 0.03, vixLevel: 25, oilShock: 0.20,
        gdpShock: -0.008, unemploymentShock: 0.8, inflationShock: 1.5, hpiShock: -0.04, creShock: -0.06,
        pdMultiplier: 1.3, lgdAddon: 0.02, stressPercentile: 0.93,
        depositRunoffMult: 1.2, hqlaHaircut: 0.03, fundingHaircut: 0.04, rsfIncrease: 0.04,
        opRiskMultiplier: 1.1,
      }),
      moderate: createShockVector({
        equityShock: -0.14, rateShock10Y: 130, rateShock2Y: 170, creditSpreadIG: 80, creditSpreadHY: 280,
        fxShockUSD: 0.05, vixLevel: 30, oilShock: 0.35,
        gdpShock: -0.014, unemploymentShock: 1.8, inflationShock: 3.0, hpiShock: -0.08, creShock: -0.12,
        pdMultiplier: 1.7, lgdAddon: 0.04, stressPercentile: 0.96,
        depositRunoffMult: 1.4, hqlaHaircut: 0.06, fundingHaircut: 0.08, rsfIncrease: 0.07,
        opRiskMultiplier: 1.3,
      }),
      severe: createShockVector({
        equityShock: -0.18, rateShock10Y: 170, rateShock2Y: 230, creditSpreadIG: 120, creditSpreadHY: 400,
        fxShockUSD: 0.08, vixLevel: 35, oilShock: 0.50,
        gdpShock: -0.018, unemploymentShock: 2.5, inflationShock: 3.8, hpiShock: -0.12, creShock: -0.18,
        pdMultiplier: 2.2, lgdAddon: 0.06, stressPercentile: 0.98,
        depositRunoffMult: 1.6, hqlaHaircut: 0.08, fundingHaircut: 0.12, rsfIncrease: 0.10,
        opRiskMultiplier: 1.5,
      }),
      extreme: createShockVector({
        equityShock: -0.20, rateShock10Y: 200, rateShock2Y: 280, creditSpreadIG: 150, creditSpreadHY: 500,
        fxShockUSD: 0.10, vixLevel: 42, oilShock: 0.65,
        gdpShock: -0.020, unemploymentShock: 3.5, inflationShock: 4.0, hpiShock: -0.16, creShock: -0.25,
        pdMultiplier: 2.8, lgdAddon: 0.08, stressPercentile: 0.99,
        depositRunoffMult: 1.8, hqlaHaircut: 0.10, fundingHaircut: 0.15, rsfIncrease: 0.12,
        opRiskMultiplier: 1.8,
      }),
    },
  },

  // ----------------------------------------------------------------
  // 7. CRE Market Correction
  // ----------------------------------------------------------------
  {
    id: 'cre-correction',
    name: 'CRE Market Correction',
    category: SCENARIO_CATEGORIES.HYPOTHETICAL,
    description: 'Sharp correction in commercial real estate values with rising cap rates and vacancy.',
    keyShocks: 'CRE -40%, Cap rates +150bp, PD mult 3x',
    shocks: {
      mild: createShockVector({
        equityShock: -0.06, rateShock10Y: 30, rateShock2Y: 20, creditSpreadIG: 30, creditSpreadHY: 100,
        fxShockUSD: 0.01, vixLevel: 24, oilShock: 0,
        gdpShock: -0.005, unemploymentShock: 0.5, inflationShock: 0.3, hpiShock: -0.05, creShock: -0.12,
        pdMultiplier: 1.5, lgdAddon: 0.04, stressPercentile: 0.94,
        depositRunoffMult: 1.1, hqlaHaircut: 0.02, fundingHaircut: 0.04, rsfIncrease: 0.03,
        opRiskMultiplier: 1.1,
      }),
      moderate: createShockVector({
        equityShock: -0.12, rateShock10Y: 50, rateShock2Y: 40, creditSpreadIG: 60, creditSpreadHY: 200,
        fxShockUSD: 0.02, vixLevel: 28, oilShock: -0.05,
        gdpShock: -0.010, unemploymentShock: 1.0, inflationShock: 0.5, hpiShock: -0.10, creShock: -0.25,
        pdMultiplier: 2.0, lgdAddon: 0.08, stressPercentile: 0.97,
        depositRunoffMult: 1.3, hqlaHaircut: 0.04, fundingHaircut: 0.08, rsfIncrease: 0.06,
        opRiskMultiplier: 1.2,
      }),
      severe: createShockVector({
        equityShock: -0.16, rateShock10Y: 70, rateShock2Y: 50, creditSpreadIG: 90, creditSpreadHY: 320,
        fxShockUSD: 0.03, vixLevel: 32, oilShock: -0.10,
        gdpShock: -0.015, unemploymentShock: 1.5, inflationShock: 0.8, hpiShock: -0.15, creShock: -0.35,
        pdMultiplier: 2.5, lgdAddon: 0.12, stressPercentile: 0.985,
        depositRunoffMult: 1.5, hqlaHaircut: 0.06, fundingHaircut: 0.12, rsfIncrease: 0.08,
        opRiskMultiplier: 1.4,
      }),
      extreme: createShockVector({
        equityShock: -0.20, rateShock10Y: 90, rateShock2Y: 60, creditSpreadIG: 120, creditSpreadHY: 400,
        fxShockUSD: 0.04, vixLevel: 36, oilShock: -0.15,
        gdpShock: -0.020, unemploymentShock: 2.0, inflationShock: 1.0, hpiShock: -0.20, creShock: -0.40,
        pdMultiplier: 3.0, lgdAddon: 0.15, stressPercentile: 0.995,
        depositRunoffMult: 1.8, hqlaHaircut: 0.08, fundingHaircut: 0.15, rsfIncrease: 0.10,
        opRiskMultiplier: 1.6,
      }),
    },
  },

  // ----------------------------------------------------------------
  // 8. Sovereign Debt Crisis
  // ----------------------------------------------------------------
  {
    id: 'sovereign-crisis',
    name: 'Sovereign Debt Crisis',
    category: SCENARIO_CATEGORIES.HYPOTHETICAL,
    description: 'Emerging market sovereign default contagion with flight to quality and FX dislocation.',
    keyShocks: 'EM spreads +800bp, FX -15%, Flight to quality',
    shocks: {
      mild: createShockVector({
        equityShock: -0.08, rateShock10Y: -25, rateShock2Y: -15, creditSpreadIG: 40, creditSpreadHY: 150,
        fxShockUSD: 0.05, vixLevel: 28, oilShock: -0.10,
        gdpShock: -0.008, unemploymentShock: 0.5, inflationShock: 0.5, hpiShock: -0.03, creShock: -0.05,
        pdMultiplier: 1.3, lgdAddon: 0.02, stressPercentile: 0.93,
        depositRunoffMult: 1.1, hqlaHaircut: 0.02, fundingHaircut: 0.05, rsfIncrease: 0.03,
        opRiskMultiplier: 1.1,
      }),
      moderate: createShockVector({
        equityShock: -0.15, rateShock10Y: -50, rateShock2Y: -30, creditSpreadIG: 80, creditSpreadHY: 350,
        fxShockUSD: 0.08, vixLevel: 35, oilShock: -0.18,
        gdpShock: -0.014, unemploymentShock: 1.0, inflationShock: 1.0, hpiShock: -0.06, creShock: -0.10,
        pdMultiplier: 1.7, lgdAddon: 0.04, stressPercentile: 0.96,
        depositRunoffMult: 1.3, hqlaHaircut: 0.04, fundingHaircut: 0.10, rsfIncrease: 0.06,
        opRiskMultiplier: 1.3,
      }),
      severe: createShockVector({
        equityShock: -0.22, rateShock10Y: -75, rateShock2Y: -50, creditSpreadIG: 130, creditSpreadHY: 550,
        fxShockUSD: 0.12, vixLevel: 42, oilShock: -0.25,
        gdpShock: -0.020, unemploymentShock: 1.8, inflationShock: 1.5, hpiShock: -0.10, creShock: -0.15,
        pdMultiplier: 2.2, lgdAddon: 0.06, stressPercentile: 0.98,
        depositRunoffMult: 1.6, hqlaHaircut: 0.07, fundingHaircut: 0.15, rsfIncrease: 0.10,
        opRiskMultiplier: 1.5,
      }),
      extreme: createShockVector({
        equityShock: -0.28, rateShock10Y: -100, rateShock2Y: -70, creditSpreadIG: 180, creditSpreadHY: 800,
        fxShockUSD: 0.15, vixLevel: 52, oilShock: -0.35,
        gdpShock: -0.028, unemploymentShock: 2.5, inflationShock: 2.0, hpiShock: -0.15, creShock: -0.22,
        pdMultiplier: 2.8, lgdAddon: 0.08, stressPercentile: 0.99,
        depositRunoffMult: 2.0, hqlaHaircut: 0.10, fundingHaircut: 0.20, rsfIncrease: 0.15,
        opRiskMultiplier: 1.8,
      }),
    },
  },

  // ----------------------------------------------------------------
  // 9. Rapid Rate Rise (+300bp)
  // ----------------------------------------------------------------
  {
    id: 'rate-reversal',
    name: 'Rapid Rate Rise (+300bp)',
    category: SCENARIO_CATEGORIES.HYPOTHETICAL,
    description: 'Sudden parallel rate increase across the yield curve with mortgage market stress.',
    keyShocks: 'Parallel +300bp, Mortgages +250bp',
    shocks: {
      mild: createShockVector({
        equityShock: -0.06, rateShock10Y: 80, rateShock2Y: 90, creditSpreadIG: 25, creditSpreadHY: 80,
        fxShockUSD: 0.04, vixLevel: 24, oilShock: 0.05,
        gdpShock: -0.005, unemploymentShock: 0.3, inflationShock: 0.8, hpiShock: -0.05, creShock: -0.08,
        pdMultiplier: 1.2, lgdAddon: 0.02, stressPercentile: 0.92,
        depositRunoffMult: 1.3, hqlaHaircut: 0.04, fundingHaircut: 0.05, rsfIncrease: 0.04,
        opRiskMultiplier: 1.1,
      }),
      moderate: createShockVector({
        equityShock: -0.12, rateShock10Y: 160, rateShock2Y: 180, creditSpreadIG: 55, creditSpreadHY: 170,
        fxShockUSD: 0.07, vixLevel: 30, oilShock: 0.10,
        gdpShock: -0.010, unemploymentShock: 0.8, inflationShock: 1.5, hpiShock: -0.10, creShock: -0.15,
        pdMultiplier: 1.5, lgdAddon: 0.04, stressPercentile: 0.96,
        depositRunoffMult: 1.8, hqlaHaircut: 0.08, fundingHaircut: 0.10, rsfIncrease: 0.08,
        opRiskMultiplier: 1.2,
      }),
      severe: createShockVector({
        equityShock: -0.18, rateShock10Y: 240, rateShock2Y: 270, creditSpreadIG: 85, creditSpreadHY: 260,
        fxShockUSD: 0.10, vixLevel: 35, oilShock: 0.15,
        gdpShock: -0.018, unemploymentShock: 1.5, inflationShock: 2.5, hpiShock: -0.15, creShock: -0.22,
        pdMultiplier: 1.8, lgdAddon: 0.06, stressPercentile: 0.98,
        depositRunoffMult: 2.5, hqlaHaircut: 0.12, fundingHaircut: 0.15, rsfIncrease: 0.12,
        opRiskMultiplier: 1.4,
      }),
      extreme: createShockVector({
        equityShock: -0.22, rateShock10Y: 300, rateShock2Y: 340, creditSpreadIG: 110, creditSpreadHY: 350,
        fxShockUSD: 0.13, vixLevel: 40, oilShock: 0.20,
        gdpShock: -0.025, unemploymentShock: 2.5, inflationShock: 3.5, hpiShock: -0.20, creShock: -0.30,
        pdMultiplier: 2.2, lgdAddon: 0.08, stressPercentile: 0.99,
        depositRunoffMult: 3.0, hqlaHaircut: 0.15, fundingHaircut: 0.20, rsfIncrease: 0.15,
        opRiskMultiplier: 1.6,
      }),
    },
  },
];

/**
 * Get a scenario by ID
 */
export function getScenarioById(id) {
  return stressScenarioLibrary.find(s => s.id === id);
}

/**
 * Get shock vector for a scenario at a given severity
 */
export function getShockVector(scenarioId, severity) {
  const scenario = getScenarioById(scenarioId);
  if (!scenario) return null;
  return scenario.shocks[severity] || null;
}

/**
 * Get all scenarios grouped by category
 */
export function getScenariosByCategory() {
  const groups = {};
  for (const s of stressScenarioLibrary) {
    if (!groups[s.category]) groups[s.category] = [];
    groups[s.category].push(s);
  }
  return groups;
}
