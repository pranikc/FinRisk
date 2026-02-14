// ============================================================
// FinRisk AI - Synthetic Financial Data Generator
// Realistic but synthetic data for prototype demonstration
// ============================================================

// --- Utility Helpers ---
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const gaussian = () => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

// --- Date Helpers ---
const today = new Date('2026-02-12');
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
};
const formatDate = (d) => d.toISOString().split('T')[0];

// ============================================================
// INSTITUTION PROFILE
// ============================================================
export const institution = {
  name: 'Atlantic Federal Bank',
  type: 'Commercial Bank',
  totalAssets: 48_700_000_000, // $48.7B
  tier1Capital: 4_200_000_000,
  totalLoans: 31_200_000_000,
  totalDeposits: 38_500_000_000,
  regulatoryFramework: 'Basel III',
  lastUpdated: today.toISOString(),
};

// ============================================================
// COMPOSITE RISK SCORES (0-100, lower is better)
// ============================================================
export const riskScores = {
  overall: 34,
  credit: 38,
  market: 29,
  liquidity: 31,
  operational: 22,
  // Trend data (last 30 days)
  history: Array.from({ length: 30 }, (_, i) => ({
    date: formatDate(daysAgo(29 - i)),
    overall: Math.max(15, Math.min(60, 32 + gaussian() * 4 + (i > 20 ? (i - 20) * 0.3 : 0))),
    credit: Math.max(15, Math.min(65, 35 + gaussian() * 5 + (i > 22 ? (i - 22) * 0.4 : 0))),
    market: Math.max(10, Math.min(55, 28 + gaussian() * 6)),
    liquidity: Math.max(10, Math.min(50, 30 + gaussian() * 3)),
  })),
};

// ============================================================
// ALERTS & NOTIFICATIONS
// ============================================================
export const alerts = [
  {
    id: 1,
    severity: 'critical',
    category: 'Credit',
    title: 'Concentration Breach: Commercial Real Estate',
    message: 'CRE exposure has reached 312% of Tier 1 capital, exceeding the 300% regulatory guidance threshold. Immediate review recommended.',
    timestamp: new Date('2026-02-12T09:15:00').toISOString(),
    agent: 'Credit Sentinel',
    acknowledged: false,
  },
  {
    id: 2,
    severity: 'high',
    category: 'Market',
    title: 'VaR Limit Breach: Interest Rate Desk',
    message: '1-day 99% VaR for interest rate portfolio exceeded $12.4M limit at $13.8M. Driven by yield curve steepening.',
    timestamp: new Date('2026-02-12T08:42:00').toISOString(),
    agent: 'Market Watcher',
    acknowledged: false,
  },
  {
    id: 3,
    severity: 'high',
    category: 'Credit',
    title: 'Downgrade Watch: Meridian Holdings Corp',
    message: 'Internal model probability of downgrade to sub-investment grade increased to 34% (from 12% last month). $145M exposure at risk.',
    timestamp: new Date('2026-02-12T07:30:00').toISOString(),
    agent: 'Credit Sentinel',
    acknowledged: false,
  },
  {
    id: 4,
    severity: 'medium',
    category: 'Liquidity',
    title: 'Funding Gap Detected: 30-60 Day Bucket',
    message: 'Projected cumulative outflows exceed inflows by $280M in the 30-60 day maturity bucket. LCR remains above minimum at 118%.',
    timestamp: new Date('2026-02-11T16:20:00').toISOString(),
    agent: 'Liquidity Monitor',
    acknowledged: true,
  },
  {
    id: 5,
    severity: 'medium',
    category: 'Market',
    title: 'Correlation Shift Detected',
    message: 'Equity-credit correlation has increased from 0.35 to 0.62 over the past 5 trading days. Historical stress events preceded by similar regime changes.',
    timestamp: new Date('2026-02-11T14:55:00').toISOString(),
    agent: 'Correlation Tracker',
    acknowledged: true,
  },
  {
    id: 6,
    severity: 'low',
    category: 'Credit',
    title: 'Portfolio Migration: Slight Negative Drift',
    message: 'Weighted average rating migrated from BBB+ to BBB over Q4. Driven by downgrades in energy and retail sectors.',
    timestamp: new Date('2026-02-11T11:00:00').toISOString(),
    agent: 'Credit Sentinel',
    acknowledged: true,
  },
  {
    id: 7,
    severity: 'low',
    category: 'Liquidity',
    title: 'Deposit Concentration Update',
    message: 'Top 20 depositors now represent 18.3% of total deposits (up from 16.7%). Within policy limits but trending upward.',
    timestamp: new Date('2026-02-10T09:30:00').toISOString(),
    agent: 'Liquidity Monitor',
    acknowledged: true,
  },
];

// ============================================================
// AI AGENT DATA
// ============================================================
export const agents = [
  {
    id: 'credit-sentinel',
    name: 'Credit Sentinel',
    type: 'Credit Risk Analysis',
    status: 'active',
    description: 'Continuously monitors credit portfolio for concentration risk, migration patterns, and early warning signals of borrower deterioration.',
    currentTask: 'Analyzing CRE sector exposure after Q4 appraisal updates',
    lastAction: '2 min ago',
    findingsToday: 3,
    accuracy: 94.2,
    model: 'Ensemble: XGBoost + LSTM',
    dataSourcesConnected: ['Loan Management System', 'Credit Bureau Feed', 'Financial Statements DB', 'Collateral Valuation System'],
    metrics: { alertsGenerated: 847, truePositiveRate: 0.942, avgResponseTime: '1.2s' },
  },
  {
    id: 'market-watcher',
    name: 'Market Watcher',
    type: 'Market Risk Analysis',
    status: 'active',
    description: 'Tracks market risk exposures across trading and banking books. Computes VaR, performs stress tests, and monitors limit utilization.',
    currentTask: 'Running Monte Carlo VaR with updated volatility surface',
    lastAction: '45 sec ago',
    findingsToday: 2,
    accuracy: 96.1,
    model: 'GAN-enhanced Monte Carlo',
    dataSourcesConnected: ['Trading System', 'Market Data Feed', 'Position Keeper', 'Derivatives Pricing Engine'],
    metrics: { alertsGenerated: 523, truePositiveRate: 0.961, avgResponseTime: '0.8s' },
  },
  {
    id: 'liquidity-monitor',
    name: 'Liquidity Monitor',
    type: 'Liquidity Risk Analysis',
    status: 'active',
    description: 'Forecasts cash flows, monitors regulatory ratios (LCR/NSFR), and identifies funding vulnerabilities across time horizons.',
    currentTask: 'Projecting 90-day cash flow ladder with updated deposit behavior model',
    lastAction: '1 min ago',
    findingsToday: 2,
    accuracy: 91.8,
    model: 'Transformer-based Flow Predictor',
    dataSourcesConnected: ['Core Banking System', 'Treasury Management', 'Wholesale Funding Platform', 'FTP Engine'],
    metrics: { alertsGenerated: 312, truePositiveRate: 0.918, avgResponseTime: '2.1s' },
  },
  {
    id: 'correlation-tracker',
    name: 'Correlation Tracker',
    type: 'Cross-Risk Analysis',
    status: 'active',
    description: 'Identifies cross-risk correlations and regime changes that may amplify losses across risk categories simultaneously.',
    currentTask: 'Evaluating equity-credit correlation regime shift implications',
    lastAction: '3 min ago',
    findingsToday: 1,
    accuracy: 89.5,
    model: 'Dynamic Copula Network',
    dataSourcesConnected: ['All Risk System Feeds', 'Macro Indicator Feed', 'Volatility Surface'],
    metrics: { alertsGenerated: 198, truePositiveRate: 0.895, avgResponseTime: '3.5s' },
  },
  {
    id: 'stress-architect',
    name: 'Stress Architect',
    type: 'Scenario Generation',
    status: 'idle',
    description: 'Generates and evaluates stress scenarios based on historical events, current conditions, and AI-generated tail risk scenarios.',
    currentTask: 'Awaiting next scheduled run (14:00 EST)',
    lastAction: '2 hrs ago',
    findingsToday: 0,
    accuracy: 92.3,
    model: 'Variational Autoencoder + Expert Rules',
    dataSourcesConnected: ['Historical Crisis Database', 'Macro Scenario Engine', 'Portfolio Snapshot'],
    metrics: { alertsGenerated: 156, truePositiveRate: 0.923, avgResponseTime: '45s' },
  },
  {
    id: 'compliance-guardian',
    name: 'Compliance Guardian',
    type: 'Regulatory Compliance',
    status: 'active',
    description: 'Monitors regulatory compliance across Basel III/IV requirements and flags potential breaches before they occur.',
    currentTask: 'Validating capital adequacy ratios against updated regulatory thresholds',
    lastAction: '5 min ago',
    findingsToday: 1,
    accuracy: 98.7,
    model: 'Rule Engine + NLP Regulatory Parser',
    dataSourcesConnected: ['Regulatory Reporting System', 'Capital Calculation Engine', 'Policy Database'],
    metrics: { alertsGenerated: 89, truePositiveRate: 0.987, avgResponseTime: '0.5s' },
  },
];

// ============================================================
// CREDIT RISK DATA
// ============================================================

// Portfolio by Rating
export const creditPortfolioByRating = [
  { rating: 'AAA', exposure: 1_200_000_000, percentage: 3.8, pd: 0.01, count: 12 },
  { rating: 'AA', exposure: 3_800_000_000, percentage: 12.2, pd: 0.02, count: 45 },
  { rating: 'A', exposure: 7_600_000_000, percentage: 24.4, pd: 0.05, count: 134 },
  { rating: 'BBB', exposure: 9_400_000_000, percentage: 30.1, pd: 0.18, count: 278 },
  { rating: 'BB', exposure: 5_200_000_000, percentage: 16.7, pd: 0.82, count: 189 },
  { rating: 'B', exposure: 2_800_000_000, percentage: 9.0, pd: 2.10, count: 156 },
  { rating: 'CCC+', exposure: 890_000_000, percentage: 2.9, pd: 5.80, count: 67 },
  { rating: 'CCC-', exposure: 310_000_000, percentage: 1.0, pd: 15.40, count: 23 },
];

// Portfolio by Sector
export const creditPortfolioBySector = [
  { sector: 'Commercial Real Estate', exposure: 8_200_000_000, percentage: 26.3, avgRating: 'BBB', npl: 2.1 },
  { sector: 'Financial Services', exposure: 5_400_000_000, percentage: 17.3, avgRating: 'A-', npl: 0.8 },
  { sector: 'Healthcare', exposure: 3_900_000_000, percentage: 12.5, avgRating: 'BBB+', npl: 1.2 },
  { sector: 'Technology', exposure: 3_200_000_000, percentage: 10.3, avgRating: 'BBB', npl: 1.5 },
  { sector: 'Energy', exposure: 2_800_000_000, percentage: 9.0, avgRating: 'BB+', npl: 3.4 },
  { sector: 'Consumer Retail', exposure: 2_600_000_000, percentage: 8.3, avgRating: 'BB+', npl: 2.8 },
  { sector: 'Manufacturing', exposure: 2_400_000_000, percentage: 7.7, avgRating: 'BBB-', npl: 1.9 },
  { sector: 'Residential Mortgage', exposure: 2_700_000_000, percentage: 8.7, avgRating: 'A', npl: 0.6 },
];

// Top Exposures (Concentration Risk)
export const topExposures = [
  { name: 'Meridian Holdings Corp', sector: 'CRE', exposure: 890_000_000, rating: 'BBB-', watchlist: true, pd: 3.2 },
  { name: 'Pacific Gateway REIT', sector: 'CRE', exposure: 720_000_000, rating: 'BBB', watchlist: false, pd: 0.9 },
  { name: 'NovaTech Solutions', sector: 'Technology', exposure: 650_000_000, rating: 'BBB+', watchlist: false, pd: 0.4 },
  { name: 'Apex Energy Partners', sector: 'Energy', exposure: 580_000_000, rating: 'BB', watchlist: true, pd: 4.1 },
  { name: 'HealthCore Systems', sector: 'Healthcare', exposure: 520_000_000, rating: 'A-', watchlist: false, pd: 0.2 },
  { name: 'Silverline Financial', sector: 'Financial', exposure: 490_000_000, rating: 'A', watchlist: false, pd: 0.15 },
  { name: 'Metro Developments LLC', sector: 'CRE', exposure: 460_000_000, rating: 'BB+', watchlist: true, pd: 2.7 },
  { name: 'Continental Retail Group', sector: 'Retail', exposure: 420_000_000, rating: 'BB-', watchlist: true, pd: 5.3 },
  { name: 'Riverside Manufacturing', sector: 'Manufacturing', exposure: 380_000_000, rating: 'BBB', watchlist: false, pd: 0.7 },
  { name: 'Eastern Seaboard Logistics', sector: 'Transport', exposure: 340_000_000, rating: 'BBB-', watchlist: false, pd: 1.1 },
];

// Credit Loss Metrics
export const creditMetrics = {
  expectedLoss: 486_000_000,
  unexpectedLoss: 1_240_000_000,
  economicCapital: 1_726_000_000,
  provisionCoverage: 112,
  nplRatio: 1.82,
  watchlistLoans: 4_800_000_000,
  writeOffsYTD: 89_000_000,
  recoveryRate: 42.3,
};

// Credit Migration (30-day trend)
export const creditMigrationTrend = Array.from({ length: 30 }, (_, i) => ({
  date: formatDate(daysAgo(29 - i)),
  upgrades: randInt(2, 8),
  downgrades: randInt(3, 12 + (i > 20 ? 4 : 0)),
  defaults: i > 25 ? randInt(0, 2) : randInt(0, 1),
}));

// ============================================================
// MARKET RISK DATA
// ============================================================

// VaR Summary
export const varSummary = {
  var1d99: 13_800_000,
  var1d95: 9_200_000,
  var10d99: 43_600_000,
  limit1d99: 12_400_000,
  limitUtilization: 111.3,
  breachCount: 1,
  expectedShortfall99: 18_500_000,
};

// VaR Time Series (30 days)
export const varTimeSeries = Array.from({ length: 30 }, (_, i) => {
  const base = 9_000_000 + gaussian() * 2_000_000;
  const spike = i > 25 ? (i - 25) * 1_200_000 : 0;
  return {
    date: formatDate(daysAgo(29 - i)),
    var99: Math.max(5_000_000, base + 3_000_000 + spike),
    var95: Math.max(3_000_000, base + spike * 0.7),
    limit: 12_400_000,
    pnl: (gaussian() * 4_000_000),
  };
});

// Portfolio by Asset Class
export const marketPortfolio = [
  { assetClass: 'Government Bonds', notional: 12_400_000_000, var99: 3_200_000, delta: -450_000, pnlDaily: 280_000 },
  { assetClass: 'Corporate Bonds', notional: 8_700_000_000, var99: 4_100_000, delta: -320_000, pnlDaily: -510_000 },
  { assetClass: 'Interest Rate Swaps', notional: 15_200_000_000, var99: 2_800_000, delta: 180_000, pnlDaily: 120_000 },
  { assetClass: 'FX Forwards', notional: 3_600_000_000, var99: 1_900_000, delta: -89_000, pnlDaily: -230_000 },
  { assetClass: 'Equity Derivatives', notional: 2_100_000_000, var99: 1_400_000, delta: 210_000, pnlDaily: 340_000 },
  { assetClass: 'Credit Default Swaps', notional: 4_500_000_000, var99: 2_200_000, delta: -140_000, pnlDaily: -180_000 },
];

// Stress Test Scenarios
export const stressScenarios = [
  {
    name: '2008 Financial Crisis Replay',
    description: 'Equity -40%, credit spreads +300bp, rates -200bp, USD +15%',
    pnlImpact: -2_340_000_000,
    capitalImpact: -4.8,
    probability: 'Tail',
    category: 'Historical',
  },
  {
    name: 'COVID-19 Market Shock',
    description: 'Equity -30%, credit spreads +200bp, rates -150bp, oil -50%',
    pnlImpact: -1_870_000_000,
    capitalImpact: -3.9,
    probability: 'Tail',
    category: 'Historical',
  },
  {
    name: 'Rapid Rate Rise (+300bp)',
    description: 'Parallel shift +300bp across yield curve over 3 months',
    pnlImpact: -890_000_000,
    capitalImpact: -1.8,
    probability: 'Moderate',
    category: 'Hypothetical',
  },
  {
    name: 'Stagflation Scenario',
    description: 'GDP -2%, inflation +4%, rates +200bp, equity -20%',
    pnlImpact: -1_450_000_000,
    capitalImpact: -3.0,
    probability: 'Elevated',
    category: 'AI-Generated',
  },
  {
    name: 'CRE Market Correction',
    description: 'CRE values -25%, cap rates +150bp, vacancy +8%',
    pnlImpact: -1_680_000_000,
    capitalImpact: -3.5,
    probability: 'Elevated',
    category: 'AI-Generated',
  },
  {
    name: 'Sovereign Debt Crisis',
    description: 'EM sovereign spreads +500bp, DM spreads +100bp, flight to quality',
    pnlImpact: -720_000_000,
    capitalImpact: -1.5,
    probability: 'Low',
    category: 'Hypothetical',
  },
];

// Sensitivity Analysis
export const sensitivities = [
  { factor: 'Interest Rates (+1bp)', impact: -142_000, unit: 'DV01' },
  { factor: 'Credit Spreads (+1bp)', impact: -89_000, unit: 'CS01' },
  { factor: 'Equity Index (+1%)', impact: 320_000, unit: 'Equity Delta' },
  { factor: 'USD/EUR (+1%)', impact: -210_000, unit: 'FX Delta' },
  { factor: 'Implied Vol (+1%)', impact: 180_000, unit: 'Vega' },
  { factor: 'Yield Curve Twist (2s10s +1bp)', impact: -56_000, unit: 'Curve Risk' },
];

// ============================================================
// LIQUIDITY RISK DATA
// ============================================================

// Regulatory Ratios
export const liquidityRatios = {
  lcr: 118,
  lcrMin: 100,
  nsfr: 108,
  nsfrMin: 100,
  lcrTrend: Array.from({ length: 30 }, (_, i) => ({
    date: formatDate(daysAgo(29 - i)),
    lcr: Math.max(100, 125 - i * 0.3 + gaussian() * 3),
    nsfr: Math.max(100, 112 + gaussian() * 2),
    minimum: 100,
  })),
};

// Cash Flow Ladder (Maturity Buckets)
export const cashFlowLadder = [
  { bucket: 'Overnight', inflows: 2_100_000_000, outflows: 1_800_000_000, net: 300_000_000, cumulative: 300_000_000 },
  { bucket: '2-7 Days', inflows: 1_400_000_000, outflows: 1_600_000_000, net: -200_000_000, cumulative: 100_000_000 },
  { bucket: '8-14 Days', inflows: 980_000_000, outflows: 1_100_000_000, net: -120_000_000, cumulative: -20_000_000 },
  { bucket: '15-30 Days', inflows: 1_200_000_000, outflows: 1_340_000_000, net: -140_000_000, cumulative: -160_000_000 },
  { bucket: '31-60 Days', inflows: 1_800_000_000, outflows: 2_080_000_000, net: -280_000_000, cumulative: -440_000_000 },
  { bucket: '61-90 Days', inflows: 2_200_000_000, outflows: 1_900_000_000, net: 300_000_000, cumulative: -140_000_000 },
  { bucket: '91-180 Days', inflows: 3_400_000_000, outflows: 2_800_000_000, net: 600_000_000, cumulative: 460_000_000 },
  { bucket: '181-365 Days', inflows: 4_200_000_000, outflows: 3_600_000_000, net: 600_000_000, cumulative: 1_060_000_000 },
];

// Funding Sources
export const fundingSources = [
  { source: 'Retail Deposits', amount: 22_400_000_000, percentage: 46.2, stability: 'High', cost: 3.2 },
  { source: 'Commercial Deposits', amount: 10_800_000_000, percentage: 22.3, stability: 'Medium', cost: 3.8 },
  { source: 'Wholesale Funding', amount: 6_200_000_000, percentage: 12.8, stability: 'Low', cost: 4.5 },
  { source: 'Interbank Borrowing', amount: 3_800_000_000, percentage: 7.8, stability: 'Low', cost: 4.8 },
  { source: 'Senior Unsecured Bonds', amount: 3_200_000_000, percentage: 6.6, stability: 'High', cost: 4.2 },
  { source: 'Subordinated Debt', amount: 1_100_000_000, percentage: 2.3, stability: 'High', cost: 5.6 },
  { source: 'Central Bank Facility', amount: 1_000_000_000, percentage: 2.1, stability: 'High', cost: 4.0 },
];

// HQLA Composition
export const hqlaComposition = [
  { type: 'Level 1: Cash & Central Bank Reserves', amount: 3_200_000_000, percentage: 42.1 },
  { type: 'Level 1: Government Securities', amount: 2_800_000_000, percentage: 36.8 },
  { type: 'Level 2A: Agency MBS', amount: 1_100_000_000, percentage: 14.5 },
  { type: 'Level 2B: Corporate Bonds (A-)', amount: 500_000_000, percentage: 6.6 },
];

// Liquidity Stress Test
export const liquidityStressScenarios = [
  { scenario: 'Baseline', lcrImpact: 118, survivalDays: 90, hqlaDrawdown: 0 },
  { scenario: 'Moderate Stress', lcrImpact: 105, survivalDays: 62, hqlaDrawdown: 22 },
  { scenario: 'Severe Stress', lcrImpact: 87, survivalDays: 34, hqlaDrawdown: 48 },
  { scenario: 'Combined Crisis', lcrImpact: 72, survivalDays: 21, hqlaDrawdown: 65 },
];

// ============================================================
// AGENT ACTIVITY LOG
// ============================================================
export const agentActivityLog = [
  { timestamp: '09:15:22', agent: 'Credit Sentinel', action: 'ALERT', detail: 'CRE concentration breach detected - 312% of T1 capital', severity: 'critical' },
  { timestamp: '09:12:45', agent: 'Compliance Guardian', action: 'CHECK', detail: 'Capital adequacy ratios validated - CET1 at 12.4%', severity: 'info' },
  { timestamp: '09:10:03', agent: 'Market Watcher', action: 'COMPUTE', detail: 'Monte Carlo VaR updated: 1D 99% = $13.8M (limit: $12.4M)', severity: 'high' },
  { timestamp: '09:08:17', agent: 'Liquidity Monitor', action: 'FORECAST', detail: 'Cash flow projection updated for next 90 days', severity: 'info' },
  { timestamp: '09:05:30', agent: 'Correlation Tracker', action: 'DETECT', detail: 'Equity-credit correlation regime shift: 0.35 → 0.62', severity: 'medium' },
  { timestamp: '08:58:44', agent: 'Stress Architect', action: 'GENERATE', detail: 'New AI scenario: CRE correction combined with rate shock', severity: 'info' },
  { timestamp: '08:55:12', agent: 'Credit Sentinel', action: 'SCAN', detail: 'Completed daily borrower financial health scan (904 entities)', severity: 'info' },
  { timestamp: '08:42:00', agent: 'Market Watcher', action: 'ALERT', detail: 'VaR limit breach: IR desk 1D 99% VaR = $13.8M > $12.4M limit', severity: 'high' },
  { timestamp: '08:30:15', agent: 'Liquidity Monitor', action: 'MONITOR', detail: 'Early morning deposit flow analysis complete - net inflow $42M', severity: 'info' },
  { timestamp: '08:15:00', agent: 'All Agents', action: 'SYNC', detail: 'Daily data refresh and model recalibration complete', severity: 'info' },
];

// ============================================================
// FORMATTING HELPERS
// ============================================================
export const formatCurrency = (value, compact = false) => {
  if (compact) {
    const abs = Math.abs(value);
    if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (abs >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
};

export const formatPercent = (value, decimals = 1) => `${value.toFixed(decimals)}%`;

export const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

export const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', dot: 'bg-red-500' };
    case 'high': return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30', dot: 'bg-orange-500' };
    case 'medium': return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', dot: 'bg-amber-500' };
    case 'low': return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', dot: 'bg-blue-400' };
    default: return { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', dot: 'bg-slate-400' };
  }
};

export const getRiskColor = (score) => {
  if (score <= 20) return { color: '#10b981', label: 'Low', bg: 'bg-emerald-500/15', text: 'text-emerald-400' };
  if (score <= 40) return { color: '#3b82f6', label: 'Moderate', bg: 'bg-blue-500/15', text: 'text-blue-400' };
  if (score <= 60) return { color: '#f59e0b', label: 'Elevated', bg: 'bg-amber-500/15', text: 'text-amber-400' };
  if (score <= 80) return { color: '#ef4444', label: 'High', bg: 'bg-red-500/15', text: 'text-red-400' };
  return { color: '#dc2626', label: 'Critical', bg: 'bg-red-600/15', text: 'text-red-500' };
};
