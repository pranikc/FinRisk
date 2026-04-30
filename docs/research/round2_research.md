# STRESS TESTING RESEARCH ADDENDUM - ROUND 2
## FinRisk AI Platform - Addressing Critic Agent Feedback (6.5/10 -> Target 9.0+)

---

**Document Status**: Round 2 Research Addendum
**Date**: 2026-03-04
**Responds to**: Round 1 Critique dated 2026-03-04
**Scope**: Addresses all 6 critical gaps, 8 important suggestions, 7 questions, and re-prioritization recommendations

---

## TABLE OF CONTENTS

1. [Basel 3.1 / Endgame Rule (Critical Gap #1)](#1-basel-31--endgame-rule)
2. [Operational Risk Stress Testing (Critical Gap #2)](#2-operational-risk-stress-testing)
3. [Regulatory Disclaimers (Critical Gap #3)](#3-regulatory-disclaimers)
4. [Implementation Architecture (Critical Gap #4)](#4-implementation-architecture)
5. [Vasicek Formula Bounds Checking (Critical Gap #5)](#5-vasicek-formula-bounds-checking)
6. [Expected Shortfall Coverage (Critical Gap #6)](#6-expected-shortfall-coverage)
7. [Recharts Visualization Constraints (Important #1)](#7-recharts-visualization-constraints)
8. [Tornado Chart Replacement (Important #2)](#8-tornado-chart-replacement)
9. [Severity Slider Non-Linearity (Important #3)](#9-severity-slider-non-linearity)
10. [Scenario Propagation Framework (Important #4)](#10-scenario-propagation-framework)
11. [2022 Bond Market / Rate Shock (Important #5)](#11-2022-bond-market--rate-shock-calibration)
12. [Performance Guidelines (Important #6)](#12-performance-guidelines)
13. [NGFS v4 Update (Important #7)](#13-ngfs-v4-climate-scenario-update)
14. [Concentration Risk Metrics (Important #8)](#14-concentration-risk-metrics)
15. [Answers to Critic's Questions (Q1-Q7)](#15-answers-to-critics-questions)
16. [Revised Feature Priority List](#16-revised-feature-priority-list)
17. [Additional Minor Corrections](#17-additional-minor-corrections)
18. [Updated References](#18-updated-references)

---

## 1. BASEL 3.1 / ENDGAME RULE

### 1.1 Regulatory Timeline and Status

The Basel III Endgame rule is the most consequential US prudential regulation since the original Basel III implementation. Key milestones:

| Date | Event | Significance |
|------|-------|-------------|
| July 2023 | Initial NPR (Notice of Proposed Rulemaking) | Fed/OCC/FDIC jointly proposed. ~19% capital increase for largest banks |
| Sep 2024 | Re-proposal (Revised NPR) | Significantly scaled back. ~9% aggregate capital increase for GSIBs |
| Q1-Q2 2025 | Comment period and finalization | Final rule expected |
| July 1, 2025 | Earliest effective date (if finalized on schedule) | Phase-in begins |
| July 1, 2028 | Full phase-in complete | 3-year transition with annual 25% step-in |

**Note**: The September 2024 re-proposal materially changed the scope. Banks with $100B-$250B in assets were substantially relieved from the expanded risk-based approach. The re-proposal focuses the most stringent requirements on Category I and II banks (GSIBs and banks >$700B).

### 1.2 Key Changes Relevant to Stress Testing

**1.2.1 Stressed Capital Buffer (SCB) Interaction**

The SCB is calculated from CCAR supervisory stress test results:
```
SCB = max(2.5%, Decline_in_CET1_under_stress + Sum_of_4Q_planned_dividends)
```

Under the Endgame re-proposal:
- The SCB continues to be derived from the Fed's annual supervisory stress test
- Banks must hold CET1 >= 4.5% (minimum) + SCB + G-SIB surcharge + CCyB
- The interaction between the Endgame's output floor (72.5% of standardized RWA) and the SCB is critical: a bank could have a higher SCB under standardized RWA than under modeled RWA
- **Dashboard implication**: The stress testing view must show CET1 ratio paths under both standardized and modeled RWA approaches, with the binding constraint highlighted

**1.2.2 VaR-to-Expected-Shortfall Transition (FRTB)**

The Endgame incorporates FRTB principles for market risk:
- **Replaces**: VaR at 99% confidence + Stressed VaR
- **With**: Expected Shortfall at 97.5% confidence, calibrated to a stress period
- **Formula**:
  ```
  IMCC = max(ES_current, rho * ES_current + (1 - rho) * ES_stressed)
  ```
  where rho = 0.5 (mixing parameter between current and stressed periods)
- **Liquidity horizons**: Risk factors assigned to 10, 20, 40, 60, or 120-day horizons (vs. flat 10-day under current VaR)
- **Non-modellable risk factors (NMRF)**: Stressed capital add-on for risk factors that fail modellability tests

**1.2.3 Credit Risk Standardized Approach (SA-CR) Changes**

The re-proposal revises risk weights for several exposure classes:
- Residential mortgages: Risk weight based on LTV ratio (20% for LTV <= 50%, scaling up to 70% for LTV > 100%)
- CRE: Differentiated treatment for income-producing vs. general CRE
- Retail: Granularity requirements; transactors vs. revolvers distinction
- **Dashboard implication**: Stressed RWA calculations must reflect both the current and Endgame risk weight schedules

**1.2.4 Output Floor**

The 72.5% output floor means:
```
RWA_binding = max(RWA_internal_models, 0.725 * RWA_standardized)
```
Under stress, the output floor could become binding if internal models underestimate stress losses relative to the standardized approach. The dashboard should flag when the output floor becomes the binding constraint.

### 1.3 Dashboard Feature Implications

| Endgame Feature | Dashboard Action | Priority |
|----------------|-----------------|----------|
| Dual RWA display (modeled vs. standardized) | Show both paths in capital waterfall | P0 |
| Output floor binding indicator | Highlight when floor binds under stress | P0 |
| ES replacing VaR | Add ES metric alongside VaR | P1 (elevated from P2) |
| SCB calculation | Show SCB derivation from stress results | P1 |
| FRTB liquidity horizons | Factor into market risk stress | P2 |

---

## 2. OPERATIONAL RISK STRESS TESTING

### 2.1 Basel III Standardized Measurement Approach (SMA)

The SMA replaced all prior approaches (BIA, TSA, AMA) for operational risk capital under Basel III finalization:

**Business Indicator Component (BIC)**:
```
BIC = ILM * BI_component

Where:
  BI = Interest_Lease_Dividend_Component + Services_Component + Financial_Component

  BI_component = {
    Bucket 1 (BI <= EUR 1B):   0.12 * BI
    Bucket 2 (1B < BI <= 30B): 0.12B + 0.15 * (BI - 1B)
    Bucket 3 (BI > 30B):       4.47B + 0.18 * (BI - 30B)
  }

  ILM = Internal Loss Multiplier = ln(exp(1) - 1 + (LC / BIC)^0.8)
  LC  = Loss Component = 15 * average_annual_operational_losses (10-year lookback)
```

**Dashboard implementation**: Since Atlantic Federal Bank ($48.7B assets) likely falls in Bucket 2, the BIC can be computed from the income statement components. Under stress, the ILM increases as loss history worsens.

### 2.2 DORA (Digital Operational Resilience Act)

DORA (Regulation EU 2022/2554) became fully applicable on **January 17, 2025**. While it is an EU regulation, it has global implications:

**Key Requirements Relevant to Stress Testing**:

| DORA Article | Requirement | Stress Testing Implication |
|-------------|-------------|---------------------------|
| Art. 24-25 | ICT-related incident classification and reporting | Scenario calibration for cyber/IT events |
| Art. 26-27 | Digital operational resilience testing program | Annual basic testing, TLPT every 3 years for significant institutions |
| Art. 28-44 | Third-party ICT risk management | Stress scenarios must include critical third-party provider failure |
| Art. 45-56 | ICT third-party oversight framework | Concentration risk in ICT service providers |

**DORA-Mandated Scenario Types**:
1. **ICT system outage**: Core banking system unavailable for 24-72 hours
2. **Cyber attack**: Ransomware encrypting critical databases
3. **Third-party failure**: Critical cloud provider outage (e.g., AWS/Azure region failure)
4. **Data breach**: Customer data exfiltration affecting >100K records
5. **Communication failure**: SWIFT/payment network disruption

**Threat-Led Penetration Testing (TLPT)**:
- Based on TIBER-EU framework
- At least every 3 years for significant financial entities
- Results inform operational risk stress calibrations

### 2.3 CrowdStrike Outage (July 19, 2024) - Calibration Event

The CrowdStrike Falcon content update failure on July 19, 2024 is now a primary calibration event for IT operational risk scenarios:

**Impact Summary**:
| Metric | Value |
|--------|-------|
| Systems affected globally | ~8.5 million Windows devices |
| Estimated Fortune 500 insured losses | ~$5.4 billion (Parametrix estimate) |
| Healthcare sector impact | ~$1.94 billion |
| Banking/financial services impact | ~$1.15 billion |
| Airlines impact | ~$860 million |
| Duration of acute disruption | 12-48 hours (full recovery took weeks for some) |
| Delta Air Lines claimed losses | ~$500 million |
| Largest single-day IT outage | Since the 2017 NotPetya attack |

**Stress Scenario Calibration from CrowdStrike**:
```javascript
const crowdStrikeCalibration = {
  id: 'crowdstrike-2024',
  name: 'Critical Vendor IT Outage (CrowdStrike-Type)',
  category: 'operational',
  severityLevels: {
    mild: {
      systemDowntimeHours: 4,
      directLossPctRevenue: 0.002,    // 0.2% of annual revenue
      customerImpactPct: 5,
      reputationalImpactScore: 15,
      regulatoryFineRisk: 0,
    },
    moderate: {
      systemDowntimeHours: 24,
      directLossPctRevenue: 0.01,     // 1% of annual revenue
      customerImpactPct: 30,
      reputationalImpactScore: 40,
      regulatoryFineRisk: 500_000,
    },
    severe: {
      systemDowntimeHours: 72,
      directLossPctRevenue: 0.03,     // 3% of annual revenue
      customerImpactPct: 65,
      reputationalImpactScore: 70,
      regulatoryFineRisk: 5_000_000,
    },
    extreme: {
      systemDowntimeHours: 168,       // 1 week
      directLossPctRevenue: 0.08,     // 8% of annual revenue
      customerImpactPct: 90,
      reputationalImpactScore: 95,
      regulatoryFineRisk: 50_000_000,
    },
  },
};
```

### 2.4 Operational Risk Scenario Taxonomy

| Scenario Category | Sub-Type | Example Event | Calibration Source |
|------------------|----------|---------------|-------------------|
| **Cyber Risk** | Ransomware | Colonial Pipeline (2021) | $4.4M ransom, multi-day shutdown |
| **Cyber Risk** | Data breach | Capital One (2019) | $80M OCC fine, 100M records |
| **Cyber Risk** | DDoS | Multi-bank attacks (2012-2013) | Hours of service disruption |
| **IT Disruption** | Vendor failure | CrowdStrike (2024) | See Section 2.3 |
| **IT Disruption** | Internal outage | TSB migration failure (2018) | 1.9M customers locked out, weeks |
| **Conduct Risk** | Market manipulation | LIBOR scandal (2012) | $9B+ in fines across banks |
| **Conduct Risk** | AML failure | Danske Bank Estonia (2018) | EUR 200B in suspicious transactions |
| **Legal Risk** | Regulatory action | Wells Fargo accounts (2016) | $3B+ in fines and settlements |
| **Third-Party** | Critical provider | AWS us-east-1 outage (2021) | Multi-hour disruption |
| **Third-Party** | Fourth-party cascade | SolarWinds (2020) | Supply chain compromise |
| **Process Failure** | Fat finger / rogue trading | Knight Capital (2012) | $440M loss in 45 minutes |
| **Physical** | Natural disaster on data center | Hurricane Sandy (2012) | NYSE closed 2 days |

### 2.5 Operational Risk Key Metrics for Dashboard

```
Operational_Loss_Under_Stress = Base_OpRisk_Loss * Scenario_Multiplier * Duration_Factor

Key Display Metrics:
1. Estimated operational loss ($)
2. System recovery time (hours)
3. Customer impact (% affected)
4. Regulatory fine probability and estimated amount
5. Business continuity score (0-100)
6. Third-party concentration index
```

### 2.6 Priority Elevation

Per the Critic's recommendation, **Cyber Risk Stress Scenarios moves from P2 to P1**. Additionally:
- **Operational Risk Stress Dashboard** is a new P1 feature
- **Third-Party Concentration Risk** is a new P1 feature
- **DORA Compliance Indicator** is a new P1 feature (for institutions with EU operations)

---

## 3. REGULATORY DISCLAIMERS

### 3.1 Required Disclaimers (P0 - MUST SHIP)

The following disclaimers MUST be displayed on the stress testing dashboard at all times. This is a **P0 requirement** that was missing from Round 1.

**Primary Disclaimer Banner** (always visible, top of stress testing view):
```
DISCLAIMER: This dashboard is for illustrative and educational purposes only.
It does not constitute financial, investment, or regulatory advice. Stress test
results are generated using simplified models and synthetic data, and are NOT
suitable for regulatory reporting, capital planning, or investment decisions.
```

**Model Limitations Footer** (bottom of every stress calculation panel):
```
MODEL LIMITATIONS: Results are based on the Vasicek single-factor model with
static correlations and do not capture tail dependencies, wrong-way risk, or
second-round effects. Actual portfolio losses may differ materially from these
estimates. All data shown is synthetic and does not represent any real institution.
```

**Scenario Disclaimer** (on every scenario result):
```
SCENARIO NOTICE: Historical scenario replays assume the same shock magnitudes
but applied to the current (synthetic) portfolio. Actual future crises may have
different dynamics. Hypothetical and AI-generated scenarios are illustrative
constructs and do not represent forecasts of actual events.
```

### 3.2 Implementation Specification

```jsx
// DisclaimerBanner.jsx - P0 Component
// Must be rendered at the top of StressTestingView
// Must NOT be dismissible (can be collapsed but not hidden)
// Must use accessible contrast ratios (WCAG AA minimum)

const DISCLAIMER_LEVELS = {
  primary: {
    text: 'For illustrative and educational purposes only...',
    style: 'bg-amber-900/30 border-amber-600/50 text-amber-200',
    icon: 'AlertTriangle', // from lucide-react (already in dependencies)
    dismissible: false,
    collapsible: true,
    defaultCollapsed: false,
  },
  model: {
    text: 'Results based on simplified models and synthetic data...',
    style: 'bg-slate-800/50 border-slate-600/30 text-slate-400',
    icon: 'Info',
    dismissible: false,
    collapsible: true,
    defaultCollapsed: true,  // collapsed by default, expandable
  },
  scenario: {
    text: 'Historical replays assume same shock magnitudes...',
    style: 'bg-slate-800/50 border-slate-600/30 text-slate-400',
    icon: 'FileWarning',
    dismissible: false,
    collapsible: true,
    defaultCollapsed: true,
  },
};
```

### 3.3 Additional Legal Safeguards

1. **No "regulatory compliant" language anywhere**: The dashboard must never claim or imply that outputs meet any regulatory standard
2. **Synthetic data watermark**: Every exported chart or table must include "SYNTHETIC DATA" watermark
3. **Version and timestamp**: Every result panel must display the model version and calculation timestamp
4. **No PII handling**: The dashboard processes no personally identifiable information; this should be stated

---

## 4. IMPLEMENTATION ARCHITECTURE

### 4.1 Current Codebase Analysis

From examining the existing codebase:

```
Current State:
  - React 18.3.1 + Vite 5.4 + Tailwind CSS 4.1 + Recharts 3.7
  - No state management beyond useState in App.jsx
  - Simple switch-based routing in App.jsx
  - Single monolithic syntheticData.js (495 lines)
  - No computation/utility layer
  - No test framework
  - Dependencies: react, react-dom, recharts, tailwindcss, lucide-react
  - Dark theme (slate-950 background) throughout
```

### 4.2 Proposed File Structure for Stress Testing Module

```
src/
  App.jsx                              (MODIFY: add 'stress' case to renderView)

  contexts/
    StressTestContext.jsx               (NEW: P0 - shared stress state)

  engines/                             (NEW: P0 - pure computation functions)
    mathUtils.js                        (Normal CDF, inverse normal, matrix ops)
    vasicekEngine.js                    (PD stress, asset correlation)
    creditStressEngine.js               (ECL, LGD stress, transition matrix)
    marketStressEngine.js               (ES, VaR stress, sensitivity P&L)
    liquidityStressEngine.js            (LCR stress, deposit runoff, survival)
    operationalStressEngine.js          (OpRisk loss estimation)
    scenarioEngine.js                   (Scenario propagation, consistency)
    validationUtils.js                  (Input bounds, numerical stability)

  components/
    StressTesting/                     (NEW: entire module)
      StressTestingView.jsx             (P0: main container, orchestrator)
      ScenarioSelector.jsx              (P0: dropdown + severity selector)
      DisclaimerBanner.jsx              (P0: regulatory disclaimers)
      CapitalWaterfall.jsx              (P0: capital impact waterfall chart)
      ScenarioComparison.jsx            (P0: side-by-side comparison table)
      CreditStressPanel.jsx             (P0: PD/LGD/EAD stress results)
      YieldCurveScenario.jsx            (P0: 6 IRRBB scenarios)
      LiquidityStressPanel.jsx          (P0: LCR/NSFR + survival horizon)
      PnlAttribution.jsx               (P0: P&L under stress)
      TornadoChart.jsx                  (P0: factor sensitivity ranking)
      TransitionMatrix.jsx              (P0: stressed migration heatmap)
      SectorHeatMap.jsx                 (P0: sector concentration stress)
      HistoricalReplay.jsx              (P0: historical scenario replay)
      RegulatoryMapping.jsx             (P0: CCAR/EBA/PRA tags)

      ReverseStressTest.jsx             (P1: what-breaks-us analysis)
      MultiPeriodProjection.jsx         (P1: 9-quarter projection)
      EclStressPanel.jsx                (P1: CECL stage migration)
      DepositRunoffSimulator.jsx        (P1: deposit behavior under stress)
      OperationalRiskPanel.jsx          (P1: op risk stress dashboard)
      CustomScenarioBuilder.jsx         (P1: advanced scenario input)
      ConcentrationRisk.jsx             (P1: HHI, granularity adjustment)
      CorrelationStress.jsx             (P1: correlation regime dashboard)

      shared/
        StressMetricCard.jsx            (Reusable metric display)
        StressTooltip.jsx               (Technical term glossary hover)
        ScenarioTag.jsx                 (Regulatory mapping badge)

  data/
    syntheticData.js                   (KEEP: existing data, add reference)
    stressScenarioLibrary.js           (NEW: P0 - scenario definitions)
    operationalRiskScenarios.js        (NEW: P1 - op risk scenarios)
```

### 4.3 State Management: React Context + useReducer

Given the current codebase uses only `useState` in App.jsx and has zero external state management, I recommend **React Context + useReducer** rather than introducing zustand. Rationale:
- Zero new dependencies (Context + useReducer are built into React 18)
- Consistent with the existing minimal-dependency philosophy (only 5 runtime deps)
- Sufficient for the stress testing use case (no need for middleware, devtools, or persistence)
- If state complexity grows significantly beyond stress testing, zustand (~1KB) can be added later

**StressTestContext.jsx Specification**:

```javascript
// State shape
const initialState = {
  // Scenario selection
  selectedScenarioId: null,        // string: scenario ID from library
  severityLevel: 'severe',         // 'mild' | 'moderate' | 'severe' | 'extreme'

  // User overrides (custom panel)
  customOverrides: {},             // { riskFactor: overrideValue }
  isCustomMode: false,

  // Computed results (populated by engines)
  results: {
    credit: null,                  // { stressedPDs, stressedLGDs, ecl, ... }
    market: null,                  // { stressedVaR, es, pnlImpact, ... }
    liquidity: null,               // { stressedLCR, survivalDays, ... }
    operational: null,             // { estimatedLoss, recoveryTime, ... }
    capital: null,                 // { cet1Path, scrBuffer, rwaImpact, ... }
  },

  // Computation state
  isComputing: false,
  lastComputedAt: null,
  errors: [],

  // UI state
  comparisonScenarios: [],         // array of scenario IDs for comparison
  activePanel: 'overview',         // which sub-panel is focused
};

// Action types
const ACTIONS = {
  SET_SCENARIO: 'SET_SCENARIO',
  SET_SEVERITY: 'SET_SEVERITY',
  SET_CUSTOM_OVERRIDE: 'SET_CUSTOM_OVERRIDE',
  TOGGLE_CUSTOM_MODE: 'TOGGLE_CUSTOM_MODE',
  SET_RESULTS: 'SET_RESULTS',
  SET_COMPUTING: 'SET_COMPUTING',
  ADD_COMPARISON: 'ADD_COMPARISON',
  REMOVE_COMPARISON: 'REMOVE_COMPARISON',
  CLEAR_RESULTS: 'CLEAR_RESULTS',
  SET_ERROR: 'SET_ERROR',
};
```

**Context Provider Placement**:
```jsx
// In App.jsx - wrap the entire app so stress state can optionally
// flow into existing Credit/Market/Liquidity views
<StressTestProvider>
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <Sidebar ... />
    <div ...>
      <TopBar />
      <main className="p-6">
        {renderView()}
      </main>
    </div>
  </div>
</StressTestProvider>
```

### 4.4 Computation Engine Layer

All computation functions MUST be:
- **Pure functions** (no side effects, no React hooks, no DOM access)
- **Synchronous** for sub-16ms computations (most stress calcs)
- **Documented with JSDoc** including parameter bounds
- **Unit-testable** without React rendering

Example engine function signature:

```javascript
// engines/vasicekEngine.js

/**
 * Compute stressed PD using the Vasicek single-factor model.
 *
 * @param {number} pdBase - Base probability of default (0 < pdBase < 1)
 * @param {number} rho - Asset correlation (0 < rho < 1)
 * @param {number} stressPercentile - Systematic factor stress (0 < stressPercentile < 1)
 * @returns {number} Stressed PD, bounded to [0, 1]
 * @throws {RangeError} If inputs are out of bounds
 */
export function computeStressedPD(pdBase, rho, stressPercentile) {
  // Bounds checking (see Section 5)
  validateBounds(pdBase, 1e-10, 1 - 1e-10, 'pdBase');
  validateBounds(rho, 1e-10, 1 - 1e-10, 'rho');
  validateBounds(stressPercentile, 1e-10, 1 - 1e-10, 'stressPercentile');

  const numerator = normalInverse(pdBase) + Math.sqrt(rho) * normalInverse(stressPercentile);
  const denominator = Math.sqrt(1 - rho);

  return normalCDF(numerator / denominator);
}
```

### 4.5 Scenario Data Structure (TypeScript-Style Interface)

```typescript
// Type definition for implementation reference
// (Project uses .js/.jsx but this provides the contract)

interface StressScenario {
  // Identity
  id: string;                          // e.g., 'gfc-2008'
  name: string;                        // e.g., '2008 Global Financial Crisis'
  category: 'historical' | 'hypothetical' | 'regulatory' | 'operational' | 'climate';
  subcategory?: string;                // e.g., 'rate-shock', 'pandemic', 'cyber'

  // Regulatory mapping
  regulatoryFrameworks: string[];      // ['CCAR-SA', 'EBA-2024', 'PRA-ACS']

  // Description
  description: string;
  narrative: string;                   // Human-readable story of the scenario

  // Severity-specific calibrations (NOT interpolated)
  severityLevels: {
    mild: ShockVector;
    moderate: ShockVector;
    severe: ShockVector;
    extreme: ShockVector;
  };

  // Metadata
  historicalPeriod?: string;           // '2007-09 to 2009-03'
  peakStressDate?: string;             // '2009-03-09'
  source: string;                      // 'Federal Reserve, Bloomberg'
  lastCalibrated: string;              // ISO date

  // Display
  color: string;                       // Tailwind color class for UI consistency
  icon: string;                        // lucide-react icon name
}

interface ShockVector {
  // Market risk factors (bps or percentage)
  equity: number;                      // e.g., -0.568 for -56.8%
  igSpread: number;                    // bps, e.g., 400
  hySpread: number;                    // bps, e.g., 1500
  rates2y: number;                     // bps change
  rates10y: number;                    // bps change
  rates30y: number;                    // bps change
  vix: number;                         // absolute level
  fxUSD: number;                       // % change (+ = USD strengthening)
  oil: number;                         // % change
  gold: number;                        // % change
  cre: number;                         // % change in values
  hpi: number;                         // % change in house price index

  // Macro factors
  gdpGrowth: number;                   // % change (e.g., -4.3)
  unemploymentChange: number;          // pp change (e.g., +5.0)
  inflationChange: number;             // pp change

  // Credit-specific
  pdMultiplier: number;                // Multiplier to base PDs (e.g., 3.0 = triple)
  lgdAddon: number;                    // Absolute addition to LGD (e.g., 0.10)
  migrationStressFactor: number;       // Scalar for transition matrix stress

  // Liquidity-specific
  depositRunoffMultiplier: number;     // Multiplier to base runoff rates
  fundingSpreadBps: number;            // Additional funding cost in bps
  hqlaHaircut: number;                 // Additional haircut on HQLA (%)

  // Operational (for operational scenarios)
  opLossMultiplier?: number;           // Multiplier to base op losses
  systemDowntimeHours?: number;
}
```

---

## 5. VASICEK FORMULA BOUNDS CHECKING

### 5.1 Numerical Stability Issues

The Vasicek formula:
```
PD_stressed = Phi( (Phi^-1(PD_base) + sqrt(rho) * Phi^-1(stress_percentile)) / sqrt(1 - rho) )
```

has the following numerical hazards in JavaScript:

| Input Condition | Problem | Mitigation |
|----------------|---------|------------|
| `PD_base = 0` | `Phi^-1(0) = -Infinity` | Clamp: `PD_base = max(PD_base, 1e-10)` |
| `PD_base = 1` | `Phi^-1(1) = +Infinity` | Clamp: `PD_base = min(PD_base, 1 - 1e-10)` |
| `stress_percentile = 0 or 1` | Same infinity issue | Clamp: `[1e-10, 1 - 1e-10]` |
| `rho = 0` | Division by `sqrt(0)` = division by zero | Clamp: `rho = max(rho, 1e-10)` |
| `rho = 1` | `sqrt(1 - 1) = 0`, division by zero | Clamp: `rho = min(rho, 1 - 1e-10)` |
| `PD_base < 1e-8` | Floating point precision loss in `Phi^-1` | Use higher-precision rational approximation |
| Result > 1 or < 0 | Floating point rounding at boundaries | Clamp output: `max(0, min(1, result))` |

### 5.2 JavaScript Normal CDF / Inverse Implementation

**Recommended Approach: Self-contained implementation (no external library)**

Given the project's minimal-dependency philosophy (5 runtime deps), I recommend implementing the Normal CDF and its inverse directly rather than adding a library dependency. The required functions are small and well-established.

**Normal CDF - Abramowitz and Stegun Approximation (error < 1.5e-7)**:
```javascript
/**
 * Standard normal cumulative distribution function.
 * Abramowitz and Stegun approximation 26.2.17.
 * Maximum error: 1.5e-7
 *
 * @param {number} x - Input value
 * @returns {number} Probability P(Z <= x) for standard normal Z
 */
export function normalCDF(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2);

  return 0.5 * (1.0 + sign * y);
}
```

**Inverse Normal CDF - Peter Acklam's Rational Approximation (error < 1.15e-9)**:
```javascript
/**
 * Inverse standard normal CDF (quantile function).
 * Peter Acklam's rational approximation.
 * Maximum relative error: 1.15e-9
 *
 * @param {number} p - Probability (0 < p < 1)
 * @returns {number} x such that P(Z <= x) = p for standard normal Z
 * @throws {RangeError} If p is not in (0, 1)
 */
export function normalInverse(p) {
  if (p <= 0 || p >= 1) {
    throw new RangeError(`normalInverse: p must be in (0, 1), got ${p}`);
  }

  // Coefficients for rational approximation
  const a = [-3.969683028665376e+01, 2.209460984245205e+02,
             -2.759285104469687e+02, 1.383577518672690e+02,
             -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02,
             -1.556989798598866e+02, 6.680131188771972e+01,
             -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01,
             -2.400758277161838e+00, -2.549732539343734e+00,
              4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01,
             2.445134137142996e+00, 3.754408661907416e+00];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;
  let q, r;

  if (p < pLow) {
    // Rational approximation for lower region
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
           ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= pHigh) {
    // Rational approximation for central region
    q = p - 0.5;
    r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q /
           (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    // Rational approximation for upper region
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) /
            ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}
```

**Alternative: Library Options** (if the team prefers external dependencies):

| Library | Size (min+gzip) | Normal CDF | Inverse Normal | Notes |
|---------|-----------------|------------|----------------|-------|
| `jstat` | ~35KB | Yes (`jStat.normal.cdf`) | Yes (`jStat.normal.inv`) | Full statistics library; overkill |
| `simple-statistics` | ~12KB | Yes (`cumulativeStdNormalProbability`) | Yes (`probit`) | Clean API, well-maintained |
| `@stdlib/stats` | Modular (2-5KB per fn) | Yes | Yes | Tree-shakable, highest precision |
| Custom (above) | ~1KB | Yes | Yes | **Recommended**: zero dependency, sufficient precision |

**Recommendation**: Use the self-contained implementations above. They provide precision to 9 decimal places, which far exceeds the needs of a dashboard application. Add `simple-statistics` only if the project later needs chi-squared, t-distribution, or other statistical functions.

### 5.3 Validation Utility

```javascript
// engines/validationUtils.js

/**
 * Validate that a numeric value is within bounds.
 * @param {number} value - Value to check
 * @param {number} min - Minimum (exclusive)
 * @param {number} max - Maximum (exclusive)
 * @param {string} name - Parameter name for error messages
 * @throws {RangeError} If value is out of bounds or not a finite number
 */
export function validateBounds(value, min, max, name) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} must be a finite number, got ${value}`);
  }
  if (value <= min || value >= max) {
    throw new RangeError(`${name} must be in (${min}, ${max}), got ${value}`);
  }
}

/**
 * Safe clamp for Vasicek inputs - clamps to valid range with warning.
 * Use this for UI-driven inputs where throwing would be hostile.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {{ value: number, clamped: boolean }}
 */
export function safeClamp(value, min, max) {
  if (value <= min) return { value: min, clamped: true };
  if (value >= max) return { value: max, clamped: true };
  return { value, clamped: false };
}
```

---

## 6. EXPECTED SHORTFALL COVERAGE

### 6.1 Mathematical Formulation

**Value at Risk (VaR)** at confidence level alpha:
```
VaR_alpha = inf{ x in R : P(L > x) <= 1 - alpha }
```

VaR answers: "What is the maximum loss at the alpha confidence level?"

**Expected Shortfall (ES)** at confidence level alpha:
```
ES_alpha = (1 / (1 - alpha)) * integral from alpha to 1 of VaR_u du

Equivalently:
ES_alpha = E[ L | L > VaR_alpha ]
```

ES answers: "Given that we are in the worst (1 - alpha) tail, what is the average loss?"

**Key Properties**:
| Property | VaR | ES |
|----------|-----|-----|
| Coherent risk measure | No (fails subadditivity) | Yes |
| Tail sensitivity | None (ignores shape beyond quantile) | Full (averages over entire tail) |
| Regulatory standard | Current (Basel 2.5) | Future (FRTB / Basel 3.1) |
| Confidence level | 99% (1-day) or 99% (10-day) | 97.5% (with variable liquidity horizons) |
| Backtestability | Easy (count exceedances) | Harder (Acerbi-Szekely test) |

### 6.2 ES Computation Methods for the Dashboard

**Method 1: Analytical (Parametric Normal)**
For a portfolio with normally distributed returns:
```
ES_alpha = mu + sigma * phi(Phi^-1(alpha)) / (1 - alpha)
```
where phi is the standard normal PDF and Phi^-1 is the quantile function.

For alpha = 97.5%:
```
ES_97.5% = mu + sigma * phi(1.96) / 0.025
         = mu + sigma * 0.0584 / 0.025
         = mu + 2.338 * sigma
```
Compare: VaR_99% = mu + 2.326 * sigma. So ES at 97.5% approximately equals VaR at 99% under normality.

**Method 2: Historical Simulation**
```javascript
/**
 * Compute Expected Shortfall from a loss distribution (historical simulation).
 * @param {number[]} losses - Array of loss values (positive = loss)
 * @param {number} alpha - Confidence level (e.g., 0.975)
 * @returns {number} Expected Shortfall
 */
export function computeES(losses, alpha) {
  const sorted = [...losses].sort((a, b) => b - a); // descending
  const tailCount = Math.ceil(sorted.length * (1 - alpha));
  const tailLosses = sorted.slice(0, tailCount);
  return tailLosses.reduce((sum, l) => sum + l, 0) / tailCount;
}
```

**Method 3: Stressed ES (FRTB Formula)**
```
IMCC = max(
  ES_reduced_set_current,
  rho * ES_reduced_set_current + (1 - rho) * ES_reduced_set_stressed
)

rho = 0.5 (regulatory mixing parameter)

IMCC_total = IMCC_reduced * sqrt(
  sum_over_risk_classes(
    (ES_full_i_current / ES_reduced_current)^2
  )
)
```

### 6.3 VaR-to-ES Transition: What Changes

| Aspect | Current (VaR-based) | FRTB (ES-based) |
|--------|---------------------|------------------|
| Risk measure | VaR 99%, 10-day | ES 97.5%, variable horizon |
| Stress calibration | Separate Stressed VaR | Single ES calibrated to worst 12-month window |
| Capital formula | max(VaR, 3*avgVaR) + max(sVaR, 3*avgsVaR) | max(IMCC, rho*IMCC_current + (1-rho)*IMCC_stressed) |
| Liquidity | Flat 10-day holding | 10/20/40/60/120-day by risk factor |
| Diversification | Implicit (within VaR model) | Constrained by risk class ES ratios |
| Default risk | Incremental Risk Charge (IRC) | Default Risk Charge (DRC) |

### 6.4 Dashboard Recommendation

**The existing `varSummary` data already includes `expectedShortfall99: 18_500_000`**. This should be:
1. Prominently displayed alongside VaR in the Market Risk view (currently it is not shown)
2. Relabeled to `ES 97.5%` to match FRTB convention (not `ES 99%`)
3. Included in every stress scenario result
4. Shown in the Capital Impact Waterfall for market risk contribution

**New metric card for stress view**:
```javascript
// Market risk stress result should include:
const marketStressResult = {
  var99_1d: /* number */,     // Legacy metric (still shown for continuity)
  es975_1d: /* number */,     // FRTB-aligned primary metric
  es975_10d: /* number */,    // 10-day ES (most common regulatory horizon)
  stressedES: /* number */,   // ES calibrated to stress period
  imcc: /* number */,         // Internal Models Capital Charge
  drc: /* number */,          // Default Risk Charge
  totalMarketRiskCapital: /* number */,
};
```

---

## 7. RECHARTS VISUALIZATION CONSTRAINTS

### 7.1 Recharts Capability Matrix

Based on Recharts 3.7 (the version in `package.json`):

| Visualization Type | Recharts 3.x Support | Workaround Quality | Recommendation |
|-------------------|----------------------|--------------------|--------------------|
| Line Chart | Native | N/A | Use directly |
| Bar Chart (vertical/horizontal) | Native | N/A | Use directly |
| Stacked Bar Chart | Native | N/A | Use for waterfall (with tricks) |
| Area Chart | Native | N/A | Use for time series projections |
| Composed Chart | Native | N/A | Use for overlay (VaR + P&L) |
| Scatter Plot | Native | N/A | Use for risk-return plots |
| Pie / Donut | Native | N/A | Use sparingly |
| Radar Chart | Native | N/A | **Do NOT use** (see Section 8) |
| Treemap | Native | N/A | Use for portfolio composition |
| Funnel | Native | N/A | Limited use |
| **Heat Map** | **NOT supported** | CSS Grid fallback | **Need alternative** |
| **Sankey Diagram** | **NOT supported** | None | **Need alternative** |
| **Network Graph** | **NOT supported** | None | **Need alternative** |
| **Waterfall Chart** | **NOT native** | Stacked bar hack | Acceptable with custom work |
| **Tornado/Butterfly** | **NOT native** | Horizontal bar with neg. values | **Good workaround** |
| **Transition Matrix** | **NOT supported** | CSS Grid fallback | **Need alternative** |

### 7.2 Supplementary Library Recommendation

For the 3 unsupported visualization types that are P0/P1 requirements, I recommend adding **one** supplementary library:

**Recommended: `@nivo/heatmap` + `@nivo/sankey`** (from the nivo ecosystem)

| Criteria | nivo | visx | d3 (direct) |
|----------|------|------|-------------|
| React-native | Yes (React components) | Yes (low-level primitives) | No (imperative DOM) |
| Dark theme support | Yes (built-in theming) | Manual | Manual |
| Bundle size (heatmap + sankey) | ~40KB gzipped | ~25KB gzipped | ~30KB gzipped |
| Learning curve | Low (declarative API) | Medium (need layout knowledge) | High |
| Accessibility | Built-in ARIA | Manual | Manual |
| Tailwind compatibility | Good (CSS overrides) | Good | Good |

**Decision**: Add `@nivo/heatmap` for heat maps and transition matrices, `@nivo/sankey` for loss flow attribution. This adds ~40KB gzipped but provides production-quality visualizations with dark theme support.

**Alternative for minimal dependency**: Use a pure CSS Grid + inline styles approach for heat maps and transition matrices. This adds zero dependencies but requires more custom code and may not support interactions (hover, click) as smoothly.

### 7.3 Waterfall Chart Implementation in Recharts

The Capital Impact Waterfall can be implemented using Recharts' `BarChart` with invisible base segments:

```jsx
// Pattern: Waterfall using stacked bars
// Each bar has an invisible "base" (transparent) and a visible "value" portion
const waterfallData = [
  { name: 'Base CET1', invisible: 0, value: 12.4, fill: '#3b82f6' },
  { name: 'Credit Loss', invisible: 12.4 - 4.8, value: -4.8, fill: '#ef4444' },
  { name: 'Market Loss', invisible: 7.6 - 1.2, value: -1.2, fill: '#f97316' },
  { name: 'Op Risk Loss', invisible: 6.4 - 0.6, value: -0.6, fill: '#eab308' },
  { name: 'NII Impact', invisible: 5.8, value: 0.3, fill: '#10b981' },
  { name: 'Stressed CET1', invisible: 0, value: 6.1, fill: '#8b5cf6' },
];
// Render invisible bar with fill="transparent" and visible bar stacked on top
```

---

## 8. TORNADO CHART REPLACEMENT

### 8.1 Rationale for Replacing Radar Chart

The Critic correctly identifies that radar charts are poor for precise value comparison (Cleveland & McGill, 1984). In stress testing specifically:

**Problems with radar charts**:
- Users cannot accurately compare the length of radial segments
- Filled area misleadingly suggests "total risk" when factors have different units
- Non-adjacent factors cannot be visually compared
- The enclosed area has no meaningful interpretation

**Advantages of tornado charts**:
- Direct, precise comparison of factor impacts
- Natural ranking from largest to smallest driver
- Standard in Bloomberg PORT, MSCI BarraOne, Moody's Analytics
- Answers the key question: "Which risk factor drives the most loss under this scenario?"

### 8.2 Tornado Chart Specification

```jsx
// Implementation using Recharts BarChart (horizontal)
// Each bar extends left (negative impact) or right (positive impact) from zero

const tornadoData = [
  { factor: 'CRE Value Decline', impact: -1680, unit: '$M' },
  { factor: 'Credit Spread Widening', impact: -890, unit: '$M' },
  { factor: 'Equity Decline', impact: -620, unit: '$M' },
  { factor: 'Unemployment Rise', impact: -450, unit: '$M' },
  { factor: 'Rate Shock (DV01)', impact: -340, unit: '$M' },
  { factor: 'Deposit Runoff', impact: -280, unit: '$M' },
  { factor: 'LGD Increase', impact: -210, unit: '$M' },
  { factor: 'FX Movement', impact: -85, unit: '$M' },
  { factor: 'NII Benefit', impact: 120, unit: '$M' },
].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)); // sort by magnitude

// Recharts implementation:
<BarChart layout="vertical" data={tornadoData}>
  <XAxis type="number" />
  <YAxis type="category" dataKey="factor" width={180} />
  <Bar dataKey="impact" fill={(entry) => entry.impact < 0 ? '#ef4444' : '#10b981'} />
  <ReferenceLine x={0} stroke="#94a3b8" />
</BarChart>
```

### 8.3 Butterfly Chart Variant

For scenario comparison, a butterfly chart (two tornado charts mirrored) shows factor impacts for two scenarios side by side:

```
Scenario A (left) | Factor Name | Scenario B (right)
   <----  -1680   | CRE Decline |   -920  ---->
   <----   -890   | Spreads     |   -450  ---->
```

This is trivially implementable with two `Bar` components in the same `BarChart`, one with negative values (left) and one with positive values (right).

---

## 9. SEVERITY SLIDER NON-LINEARITY

### 9.1 Problem Statement

The Round 1 proposal suggested a continuous slider (25% / 50% / 75% / 100%) implying linear interpolation between severity levels. This is problematic because:

1. **Non-linear loss functions**: Portfolio losses are highly convex in stress severity due to default thresholds, concentration cliffs, and correlation breakdowns
2. **Misleading interpolation**: "50% severity GFC" is not a meaningful concept and does not produce half the losses
3. **Model artifact risk**: Users may draw conclusions from interpolated values that have no empirical or theoretical basis

### 9.2 Revised Approach: Discrete Severity Levels

**Each severity level is independently calibrated with its own shock vector.** No interpolation between levels.

```javascript
// Severity levels with independently calibrated vectors
const SEVERITY_LEVELS = {
  mild: {
    label: 'Mild',
    description: '~1-in-10 year event',
    percentile: 0.90,
    color: '#eab308',       // amber
  },
  moderate: {
    label: 'Moderate',
    description: '~1-in-25 year event',
    percentile: 0.96,
    color: '#f97316',       // orange
  },
  severe: {
    label: 'Severe',
    description: '~1-in-50 year event (regulatory adverse)',
    percentile: 0.98,
    color: '#ef4444',       // red
  },
  extreme: {
    label: 'Extreme',
    description: '~1-in-100 year event (regulatory severely adverse)',
    percentile: 0.99,
    color: '#dc2626',       // deep red
  },
};
```

**UI Implementation**:
```jsx
// Radio button group or segmented control (NOT a continuous slider)
// Each option is a distinct, independently calibrated scenario
<div className="flex gap-2">
  {Object.entries(SEVERITY_LEVELS).map(([key, level]) => (
    <button
      key={key}
      onClick={() => dispatch({ type: 'SET_SEVERITY', payload: key })}
      className={`px-4 py-2 rounded-lg border ${
        selected === key
          ? `bg-${level.color}/20 border-${level.color}`
          : 'bg-slate-800 border-slate-700'
      }`}
    >
      {level.label}
      <span className="text-xs text-slate-400 block">{level.description}</span>
    </button>
  ))}
</div>
```

**Advanced override**: Users who want custom shocks should use the Custom Scenario Builder (P1), not attempt to interpolate between named levels.

---

## 10. SCENARIO PROPAGATION FRAMEWORK

### 10.1 Problem: Cross-Model Consistency

The Critic correctly identified that stressed outputs must be consistent across models. Without a propagation framework, the dashboard could show:
- A Vasicek-stressed PD of 5% alongside a transition matrix showing BBB->default probability of 0.5% (inconsistent)
- Credit spread widening of +400bp with no corresponding PD increase (inconsistent)
- Deposit runoff of 25% but unchanged funding costs (inconsistent)

### 10.2 Single Source of Truth: The Shock Vector

All models consume the same `ShockVector` object (defined in Section 4.5). The `scenarioEngine.js` is responsible for:

1. **Taking** the selected scenario + severity level
2. **Producing** a single `ShockVector`
3. **Distributing** that vector to all domain engines
4. **Collecting** results into a unified `StressResults` object

```
                    +-------------------+
                    | ScenarioEngine    |
                    | (shock vector)    |
                    +--------+----------+
                             |
           +-----------------+-----------------+------------------+
           |                 |                 |                  |
   +-------v-------+ +------v--------+ +------v--------+ +------v--------+
   | VasicekEngine  | | MarketEngine  | | LiquidEngine  | | OpRiskEngine  |
   | (stressed PDs) | | (ES, P&L)     | | (LCR, runoff) | | (losses)      |
   +-------+-------+ +------+--------+ +------+--------+ +------+--------+
           |                 |                 |                  |
           +-----------------+-----------------+------------------+
                             |
                    +--------v----------+
                    | ScenarioEngine    |
                    | (aggregate,       |
                    |  capital impact)  |
                    +-------------------+
```

### 10.3 Propagation Rules

| Source Shock | Derived Impacts | Propagation Logic |
|-------------|-----------------|-------------------|
| `equity` decline | Market P&L, equity VaR, Merton-based PD | Direct via delta/gamma, PD via structural model |
| `igSpread` / `hySpread` | Bond portfolio P&L, CVA, PD uplift | CS01 * spread change; PD ~ exp(spread / LGD_mkt) |
| `rates` change | DV01 impact, NII, mortgage prepayment, deposit repricing | Duration-based; NII via repricing gap |
| `gdpGrowth` + `unemploymentChange` | Satellite model PD, LGD stress | Macro-satellite coefficients |
| `cre` + `hpi` | Collateral values, LGD, CRE sector PD | LGD = f(collateral decline); PD via sector model |
| `pdMultiplier` | ECL (PD * LGD * EAD), transition matrix, stage migration | Vasicek or direct multiplier |
| `lgdAddon` | ECL, loss severity | Direct addition to base LGD |
| `depositRunoffMultiplier` | LCR, NSFR, survival horizon, funding cost | Direct application to runoff rates |
| `fundingSpreadBps` | NII impact, funding cost | Direct addition to funding cost curve |
| `vix` | Option pricing, correlation regime | Implied vol -> vega impact; VIX >40 triggers correlation stress |

### 10.4 Consistency Checks

The `scenarioEngine.js` should run these validation checks after propagation:

```javascript
function validateConsistency(shockVector, results) {
  const warnings = [];

  // Check: credit spread widening should correspond to PD increase
  if (shockVector.hySpread > 200 && results.credit.avgPdMultiplier < 1.5) {
    warnings.push('HY spread widening >200bp but PD multiplier <1.5x - check calibration');
  }

  // Check: severe equity decline should trigger correlation stress
  if (shockVector.equity < -0.30 && !results.market.correlationStressed) {
    warnings.push('Equity decline >30% but correlations not stressed');
  }

  // Check: deposit runoff should increase funding costs
  if (shockVector.depositRunoffMultiplier > 2.0 && shockVector.fundingSpreadBps < 50) {
    warnings.push('Deposit runoff >2x but funding spread increase <50bp');
  }

  // Check: stressed PD should be consistent with transition matrix
  // (stressed PD for BBB should be between TM cumulative default rate +/- 20%)

  return warnings;
}
```

---

## 11. 2022 BOND MARKET / RATE SHOCK CALIBRATION

### 11.1 Historical Context

The 2022 global bond market drawdown was the worst in modern fixed-income history, driven by the most aggressive Fed tightening cycle since the Volcker era. It is a critical calibration event because:
- It directly caused the SVB failure in March 2023
- It demonstrated that "safe" government bond portfolios can produce catastrophic losses
- It invalidated decades of "bonds as hedge" assumptions

### 11.2 Calibration Data

| Risk Factor | 2022 Peak Stress | Timing |
|-------------|-----------------|--------|
| Fed Funds Rate | 0.00% -> 4.50% (+450bp) | Mar-Dec 2022 |
| 2Y UST Yield | 0.73% -> 4.72% (+399bp) | Full year |
| 10Y UST Yield | 1.51% -> 4.24% (+273bp) | Full year |
| 30Y UST Yield | 1.90% -> 4.39% (+249bp) | Full year |
| 2s10s Spread | +78bp -> -84bp (162bp flattening) | Mar-Nov 2022 |
| Bloomberg US Agg | -13.0% total return | Full year |
| Bloomberg Global Agg | -16.3% total return (USD hedged) | Full year |
| 30Y Fixed Mortgage Rate | 3.11% -> 7.08% (+397bp) | Full year |
| S&P 500 | -25.4% | Jan-Oct 2022 |
| NASDAQ Composite | -33.1% | Jan-Dec 2022 |
| IG Spreads (OAS) | +60bp (115bp -> 175bp peak) | Jun-Oct 2022 |
| HY Spreads (OAS) | +250bp (300bp -> 550bp peak) | Jun-Oct 2022 |
| VIX (peak) | 36.5 | Sep 2022 |
| MOVE Index (peak) | 161 | Oct 2022 |
| Bitcoin | -64.2% | Full year |
| UK 30Y Gilt (LDI crisis) | +150bp in 3 days | Sep 2022 |
| GDP (US, FY2022) | +2.1% (no recession) | Full year |
| Unemployment (US) | 3.4% (no increase) | Dec 2022 |
| CPI (peak) | +9.1% YoY | Jun 2022 |

### 11.3 Scenario Definition

```javascript
const rateShock2022 = {
  id: 'rate-shock-2022',
  name: '2022 Rate Shock / Bond Bear Market',
  category: 'historical',
  subcategory: 'rate-shock',
  regulatoryFrameworks: ['CCAR-hypothetical', 'IRRBB'],
  description: 'Worst bond market drawdown in modern history. Fed funds 0% to 4.5% in 9 months. Bloomberg Agg -13%.',
  narrative: 'Central banks pivot to aggressive tightening to combat post-COVID inflation. Interest rates rise at fastest pace in 40 years, causing massive unrealized losses in bond portfolios and triggering bank failures.',

  severityLevels: {
    mild: {
      equity: -0.10, igSpread: 30, hySpread: 100, rates2y: 150, rates10y: 100, rates30y: 80,
      vix: 28, fxUSD: 3, oil: 10, gold: -5, cre: -5, hpi: -3,
      gdpGrowth: 1.5, unemploymentChange: 0.5, inflationChange: 3.0,
      pdMultiplier: 1.2, lgdAddon: 0.02, migrationStressFactor: 1.1,
      depositRunoffMultiplier: 1.2, fundingSpreadBps: 30, hqlaHaircut: 5,
    },
    moderate: {
      equity: -0.15, igSpread: 45, hySpread: 180, rates2y: 280, rates10y: 200, rates30y: 170,
      vix: 32, fxUSD: 8, oil: 15, gold: -3, cre: -10, hpi: -5,
      gdpGrowth: 0.5, unemploymentChange: 1.0, inflationChange: 5.0,
      pdMultiplier: 1.5, lgdAddon: 0.04, migrationStressFactor: 1.3,
      depositRunoffMultiplier: 1.5, fundingSpreadBps: 60, hqlaHaircut: 10,
    },
    severe: {
      equity: -0.22, igSpread: 55, hySpread: 230, rates2y: 370, rates10y: 250, rates30y: 230,
      vix: 35, fxUSD: 12, oil: -5, gold: 0, cre: -15, hpi: -8,
      gdpGrowth: -0.5, unemploymentChange: 1.5, inflationChange: 7.0,
      pdMultiplier: 1.8, lgdAddon: 0.06, migrationStressFactor: 1.5,
      depositRunoffMultiplier: 2.0, fundingSpreadBps: 100, hqlaHaircut: 15,
    },
    extreme: {
      equity: -0.254, igSpread: 60, hySpread: 250, rates2y: 400, rates10y: 273, rates30y: 249,
      vix: 37, fxUSD: 15, oil: -10, gold: 2, cre: -20, hpi: -10,
      gdpGrowth: -1.0, unemploymentChange: 2.5, inflationChange: 9.0,
      pdMultiplier: 2.2, lgdAddon: 0.08, migrationStressFactor: 1.8,
      depositRunoffMultiplier: 2.5, fundingSpreadBps: 150, hqlaHaircut: 20,
    },
  },

  historicalPeriod: '2022-01 to 2022-12',
  peakStressDate: '2022-10-21',
  source: 'Federal Reserve, Bloomberg, BLS',
  lastCalibrated: '2026-03-04',
  color: 'amber',
  icon: 'TrendingUp',

  // Special note: this scenario is unusual because GDP remained positive
  // and unemployment remained low - it was a "rate-only" stress
  specialCharacteristics: [
    'Rates rose while economy remained resilient (no recession)',
    'Primary impact was on unrealized losses in securities portfolios',
    'Triggered failures in institutions with high duration mismatch (SVB, Signature)',
    'Largest bond-stock positive correlation year since 1969',
  ],
};
```

### 11.4 Relevance to Atlantic Federal Bank

Given the institution profile ($48.7B assets, $31.2B loans, $38.5B deposits), and the existing alerts showing:
- VaR limit breach on the interest rate desk
- CRE concentration at 312% of Tier 1
- Declining LCR trend

The 2022 rate shock scenario is **highly relevant** and likely produces material losses through:
1. Unrealized losses on government/corporate bond holdings (DV01 impact)
2. CRE valuation declines amplifying the existing concentration breach
3. Deposit pricing pressure as rates rise, compressing NIM
4. Potential for uninsured deposit outflows if unrealized losses become public (SVB dynamic)

---

## 12. PERFORMANCE GUIDELINES

### 12.1 Computation Budget

At 60fps, each frame has ~16.67ms. Stress test recalculations must complete within this budget to avoid jank. Guidelines:

| Computation | Estimated Time | Strategy |
|------------|---------------|----------|
| Single Vasicek PD stress | <0.01ms | Direct, no optimization needed |
| 8 rating grades * Vasicek | <0.1ms | Direct |
| 8 sectors * 8 ratings matrix | <1ms | Direct |
| Full credit stress (PD + LGD + ECL) | ~2-5ms | `useMemo` with scenario dependency |
| Market stress (sensitivity P&L) | ~1-3ms | `useMemo` |
| Liquidity stress (LCR + survival) | ~1-2ms | `useMemo` |
| Capital waterfall aggregation | <1ms | `useMemo` |
| Transition matrix generation | ~2-5ms | `useMemo` |
| **Total per scenario change** | **~8-15ms** | Within 16ms budget |

### 12.2 React Optimization Patterns

```javascript
// 1. Memoize expensive computations
const stressResults = useMemo(() => {
  if (!selectedScenario || !severityLevel) return null;
  const shockVector = getShockVector(selectedScenario, severityLevel);
  return computeAllStress(shockVector, portfolioData);
}, [selectedScenario, severityLevel]); // Only recompute when scenario changes

// 2. Memoize callbacks passed to child components
const handleSeverityChange = useCallback((level) => {
  dispatch({ type: 'SET_SEVERITY', payload: level });
}, [dispatch]);

// 3. Debounce custom input changes (if user types custom shock values)
const debouncedCustomUpdate = useMemo(
  () => debounce((overrides) => {
    dispatch({ type: 'SET_CUSTOM_OVERRIDE', payload: overrides });
  }, 300), // 300ms debounce
  [dispatch]
);

// 4. React.memo for pure display components
const StressMetricCard = React.memo(({ label, value, change, format }) => {
  // Only re-renders if props actually change
  return (...);
});

// 5. Lazy load non-critical panels
const ReverseStressTest = React.lazy(() => import('./ReverseStressTest'));
const CustomScenarioBuilder = React.lazy(() => import('./CustomScenarioBuilder'));
const OperationalRiskPanel = React.lazy(() => import('./OperationalRiskPanel'));
```

### 12.3 Web Worker Consideration

For the current scope, Web Workers are **not needed** because:
- All computations are analytical/closed-form (no Monte Carlo)
- Total computation time is well within the 16ms frame budget
- Worker overhead (message serialization) would exceed the computation time

**When to add Web Workers**:
- If Monte Carlo simulation is added (P2+ feature)
- If full portfolio re-simulation (>1000 instruments) is required
- If computation time exceeds 50ms (noticeable by users)

### 12.4 Lazy Loading Strategy

Given 20+ components in the stress testing module, lazy loading is recommended:

```javascript
// P0 components: loaded eagerly (critical path)
import StressTestingView from './StressTesting/StressTestingView';
import ScenarioSelector from './StressTesting/ScenarioSelector';
import DisclaimerBanner from './StressTesting/DisclaimerBanner';
import CapitalWaterfall from './StressTesting/CapitalWaterfall';

// P1 components: lazy loaded on demand
const ReverseStressTest = React.lazy(() => import('./StressTesting/ReverseStressTest'));
const MultiPeriodProjection = React.lazy(() => import('./StressTesting/MultiPeriodProjection'));
const CustomScenarioBuilder = React.lazy(() => import('./StressTesting/CustomScenarioBuilder'));
// ... etc.

// Wrap lazy components in Suspense
<Suspense fallback={<LoadingSpinner />}>
  {activePanel === 'reverse' && <ReverseStressTest />}
</Suspense>
```

---

## 13. NGFS V4 CLIMATE SCENARIO UPDATE

### 13.1 NGFS Phase IV (November 2023) Key Changes

The Round 1 report referenced NGFS scenarios generally. NGFS Version 4 introduced significant updates:

**Revised Scenario Framework** (6 scenarios across 2 dimensions):

| Scenario | Transition Risk | Physical Risk | Temperature Outcome (2100) |
|----------|----------------|---------------|---------------------------|
| **Current Policies** | Low | Very High | ~3.0C |
| **Nationally Determined Contributions (NDCs)** | Moderate | High | ~2.5C |
| **Below 2C** | High | Moderate | ~1.7C |
| **Net Zero 2050** | Very High | Low-Moderate | ~1.5C |
| **Delayed Transition** | Very High (sudden) | Moderate-High | ~1.8C |
| **Fragmented World** | Moderate (uneven) | High | ~2.5C |

### 13.2 V4 Improvements Over V3

1. **Short-term physical risk shocks**: V4 adds acute physical risk events (heat waves, floods) in the near term (2025-2030), not just chronic long-term trends
2. **Macro-financial feedback**: GDP impacts from physical risk now feed back into financial asset valuations
3. **Greater geographic granularity**: Country-level carbon price paths, sector-level transition impacts
4. **Updated IPCC AR6 science**: Aligned with IPCC Sixth Assessment Report (2021-2023)
5. **Financial sector add-on**: Banking sector-specific modules for credit risk transmission

### 13.3 Climate Stress: Sector PD Multipliers (V4 Aligned)

For the dashboard, NGFS scenarios translate to sector-specific PD stress multipliers:

| Sector | Net Zero 2050 PD Multiplier | Delayed Transition PD Multiplier | Current Policies (Physical) |
|--------|----------------------------|--------------------------------|---------------------------|
| Oil & Gas | 3.5x - 5.0x | 2.0x (then 6.0x post-2035) | 1.0x - 1.5x |
| Coal Mining | 5.0x - 8.0x | 3.0x (then 10.0x) | 1.0x |
| Utilities (fossil) | 2.5x - 4.0x | 1.5x (then 5.0x) | 1.0x - 1.3x |
| Automotive (ICE) | 2.0x - 3.5x | 1.2x (then 4.0x) | 1.0x |
| Agriculture | 1.2x - 1.5x | 1.1x - 1.3x | 1.5x - 3.0x |
| Real Estate (coastal) | 1.0x - 1.2x | 1.0x - 1.2x | 2.0x - 4.0x |
| Technology | 0.8x - 1.0x | 0.8x - 1.0x | 0.9x - 1.1x |
| Healthcare | 1.0x - 1.1x | 1.0x - 1.1x | 1.1x - 1.5x |

### 13.4 Implementation Note

Climate scenarios operate on fundamentally different time horizons (2030/2050/2100) versus financial stress tests (1 day to 9 quarters). For the dashboard:
- **Short-term view (P1)**: Show sectoral PD multipliers under transition scenarios for the current portfolio
- **Long-term view (P2)**: Multi-decade capital path projections (requires significant additional modeling)
- **NGFS scenario selector**: Separate from financial stress scenarios, with its own severity axis

---

## 14. CONCENTRATION RISK METRICS

### 14.1 Herfindahl-Hirschman Index (HHI)

```
HHI = sum_over_i( (EAD_i / EAD_total)^2 )
```

Interpretation:
- HHI = 1/N for perfectly diversified portfolio (N equal exposures)
- HHI approaching 1.0 = single-name concentration
- For Atlantic Federal Bank with top 10 exposures ranging from $340M to $890M out of $31.2B total loans:

```javascript
// Example computation from existing synthetic data
const topExposureShares = topExposures.map(e => e.exposure / institution.totalLoans);
const hhi = topExposureShares.reduce((sum, s) => sum + s * s, 0);
// hhi ~ 0.0013 for top 10 names (low for name concentration)
// But sector HHI with CRE at 26.3% would be much higher
```

**Sector HHI for Atlantic Federal Bank**:
```
HHI_sector = 0.263^2 + 0.173^2 + 0.125^2 + 0.103^2 + ... = ~0.126
```
This indicates moderate sector concentration, driven primarily by the CRE overweight.

### 14.2 Granularity Adjustment (GA)

The Vasicek model assumes an infinitely granular portfolio. For finite portfolios, a Granularity Adjustment corrects for name concentration:

```
GA = (1/2) * sum_i( (EAD_i / EAD_total)^2 * (LGD_i^2 * C_i / K) )

Where:
  C_i = (d^2 / dPD^2)(UL_i) evaluated at the portfolio level
  K   = total portfolio capital requirement
```

Simplified approximation:
```
GA ~ HHI * VaR_systematic * correction_factor
```

For the dashboard, the GA is displayed as a percentage add-on to the Vasicek capital requirement. A higher GA means the portfolio is less diversified and needs more capital.

### 14.3 Concentration Stress Tests

| Concentration Type | Stress Test | Dashboard Metric |
|-------------------|-------------|-----------------|
| **Single-name** | Default of largest exposure | Loss = LGD * EAD_max (= 45% * $890M = $400M for Meridian) |
| **Sector** | Sector-wide PD multiplier | Loss by sector under 3x PD for CRE |
| **Geographic** | Regional economic shock | Loss by geography (if data available) |
| **Rating** | Mass downgrade of BBB to BB | Stage 1->2 migration, increased ECL |
| **Collateral** | CRE value decline | LGD increase, collateral shortfall |

### 14.4 Integration with Existing Alerts

The existing `alerts` data already flags:
- Alert #1: "CRE exposure has reached 312% of Tier 1 capital" (CRITICAL)
- Alert #7: "Top 20 depositors now represent 18.3% of total deposits" (LOW)

The concentration risk panel should cross-reference these alerts and show how concentration amplifies stress losses.

---

## 15. ANSWERS TO CRITIC'S QUESTIONS

### Q1: Computation Boundary (Browser-only vs. Future Backend)

**Answer**: All computations run in the browser (client-side JavaScript). There is no backend and no plan for one in the current scope.

**Implications**:
- Monte Carlo simulation is feasible for small sample sizes (~10,000 paths) using Web Workers, but NOT for production-grade simulations (>1M paths)
- All models must have analytical/closed-form solutions or simple numerical approximations
- The Vasicek model, sensitivity-based P&L, LCR calculations, and transition matrix stress are all achievable client-side
- GAN/VAE-based scenario generation (P2) is **not feasible** client-side and should be marked as requiring a future backend
- Data stays local to the browser session -- no persistence, no multi-user, no audit trail (these are future backend concerns)

**Architecture Decision**: Design the `engines/` layer as pure functions that could later be migrated to a serverless backend (AWS Lambda, Cloudflare Workers) without refactoring. Use the same function signatures and data contracts. This is a low-cost future-proofing measure.

### Q2: Scenario Granularity (Consistent Risk Factors Across Scenarios)

**Answer**: All scenarios MUST specify the same complete set of risk factors defined in the `ShockVector` interface (Section 4.5). This ensures:
- Cross-scenario comparison is valid (same axes for all scenarios)
- The propagation framework (Section 10) works consistently
- Missing factors are explicitly set to 0 (no stress), not left undefined

For scenarios that primarily affect a subset of factors (e.g., a pure rate shock), the non-primary factors are still specified but with minimal or zero stress values. This avoids the ambiguity of "this scenario does not specify equity stress" -- instead, it explicitly says "equity stress = 0% under this scenario."

**Minimum risk factor set (all scenarios must specify all of these)**:
```
equity, igSpread, hySpread, rates2y, rates10y, rates30y, vix,
fxUSD, oil, gold, cre, hpi, gdpGrowth, unemploymentChange,
inflationChange, pdMultiplier, lgdAddon, migrationStressFactor,
depositRunoffMultiplier, fundingSpreadBps, hqlaHaircut
```
Total: 21 risk factors per scenario per severity level.

### Q3: Point-in-Time vs. Multi-Period

**Answer**: The primary use case is **point-in-time (instantaneous shock)** for all P0 features. Multi-period projection is a P1 feature.

**Rationale**:
- Point-in-time is dramatically simpler to implement and validate
- The Capital Impact Waterfall (P0) shows the instantaneous impact on CET1
- The Survival Horizon Chart (P0) is inherently a multi-period concept but uses a simplified cash-flow depletion model (not a full 9-quarter projection)
- The CCAR-style 9-quarter projection (P1) requires: quarterly macro variable paths, dynamic balance sheet assumptions, pre-provision net revenue modeling, and capital distribution plans. This is a significant modeling effort and is appropriately P1.

**P0 Survival Horizon**: Uses static assumptions (constant cash flows, depleting HQLA) -- this is a "how long can we last?" metric, not a dynamic projection.

**P1 Multi-Period**: Full 9-quarter projection with dynamic balance sheet, rate path, and income modeling.

### Q4: Feature Interconnection with Existing Views

**Answer**: Option (b) with a lightweight version of (c).

**Primary mode (b)**: The Stress Testing view is a dedicated view (new nav item: "Stress Testing") with its own visualizations. When a scenario is active, the stress context is available to the entire app.

**Lightweight (c)**: The existing Credit Risk, Market Risk, and Liquidity Risk views show a small "Under Stress" indicator badge when a stress scenario is active. Clicking the badge navigates to the Stress Testing view. This is a Quick Win (see Section 16.3).

**Implementation**:
```jsx
// In CreditRiskView.jsx (and similarly for MarketRiskView, LiquidityRiskView)
const { selectedScenarioId, results } = useStressTestContext();

// If a stress scenario is active, show a small banner
{selectedScenarioId && (
  <div className="mb-4 px-4 py-2 bg-amber-900/20 border border-amber-600/30 rounded-lg flex items-center gap-2">
    <AlertTriangle className="w-4 h-4 text-amber-400" />
    <span className="text-sm text-amber-300">
      Stress scenario active: {selectedScenarioId}
    </span>
    <button onClick={() => onNavigate('stress')} className="text-amber-400 underline text-sm ml-auto">
      View Details
    </button>
  </div>
)}
```

**NOT doing full option (c)** because: re-rendering all existing charts with stressed data would require refactoring every existing view component, which is high effort and high regression risk for limited incremental value. The dedicated stress view provides all necessary information.

### Q5: Custom Scenario Input Limits

**Answer**: Custom inputs are bounded to physically plausible ranges with validation.

| Risk Factor | Min | Max | Rationale |
|-------------|-----|-----|-----------|
| Equity decline | -99% | +100% | -99% worst case (can't lose more than 100%); +100% = doubling |
| IG Spreads | -50bp | +1000bp | Negative means tightening; +1000bp > any historical |
| HY Spreads | -100bp | +3000bp | +3000bp exceeds 2008 peak of ~2100bp |
| Rate changes (any tenor) | -500bp | +500bp | -500bp includes deep negative rates; +500bp > Volcker |
| VIX | 10 | 120 | Historical range ~9 to ~83 |
| GDP growth | -15% | +15% | COVID Q2 was ~-31% annualized, but that was a quarterly figure |
| Unemployment change | -5pp | +15pp | +15pp would be 3.5% -> 18.5% (worse than Great Depression) |
| PD multiplier | 0.5x | 10x | 10x covers extreme tails; <1x = improvement |
| LGD addon | -0.10 | +0.40 | Can't exceed LGD > 1.0 (100%) |
| Deposit runoff multiplier | 0.5x | 15x | 15x = digital bank run (SVB-calibrated) |

**Validation behavior**: Inputs outside these ranges are clamped with a warning message, not rejected. The UI shows an amber indicator: "Value clamped to maximum plausible bound."

### Q6: IFRS 9 vs. CECL

**Answer**: Target **CECL (ASC 326)** as the primary standard, with IFRS 9 as a display option.

**Rationale**: Atlantic Federal Bank is described as a US commercial bank. US GAAP applies, meaning CECL (Current Expected Credit Losses under ASC 326) is the applicable accounting standard, not IFRS 9.

**Key CECL differences from IFRS 9**:

| Feature | CECL (ASC 326) | IFRS 9 |
|---------|---------------|--------|
| Scope | All financial assets at amortized cost | Financial assets at amortized cost + FVOCI |
| Expected loss horizon | **Lifetime ECL from Day 1** | 12-month ECL (Stage 1), Lifetime (Stage 2/3) |
| Stage model | **No stages** | 3 stages based on SICR |
| SICR trigger | N/A (always lifetime) | PD doubling, 30dpd, rating downgrade |
| Provisioning cliff | **No cliff** (always lifetime) | **Cliff at Stage 1->2 transition** |
| Probability weighting | Required (multiple scenarios) | Required (multiple scenarios) |

**Implementation for Dashboard**:
- Default: CECL approach (lifetime ECL for all exposures, no stage migration)
- Toggle: IFRS 9 approach (3-stage model with SICR triggers) -- this is more visual and shows the "provisioning cliff" effect that is pedagogically valuable
- **The IFRS 9 view is actually more interesting for stress testing visualization** because the stage migration under stress produces dramatic cliff effects. Recommend showing both.

**CECL ECL Formula**:
```
ECL_CECL = sum_over_i( PD_lifetime_i * LGD_i * EAD_i * DF_i )
```
Where `PD_lifetime` is the cumulative PD over the remaining life of the instrument.

**IFRS 9 ECL Formula (under stress)**:
```
Stage 1: ECL = PD_12m * LGD * EAD * DF
Stage 2: ECL = PD_lifetime * LGD * EAD * DF   (triggered when PD doubles or >30dpd)
Stage 3: ECL = LGD * EAD                       (impaired, PD = 100%)

Provisioning_cliff = ECL_stage2 - ECL_stage1
                   ~ (PD_lifetime - PD_12m) * LGD * EAD * DF
```

### Q7: Stress Architect Agent Integration

**Answer**: The Stress Architect agent should appear to "generate" AI-powered scenarios in a way that enhances the narrative without requiring actual AI inference.

**Implementation approach**:
1. The existing `stress-architect` agent (defined in `syntheticData.js`) has status `idle` and model `Variational Autoencoder + Expert Rules`
2. When a user selects an "AI-Generated" category scenario, the Stress Architect agent's status changes to `active` with a loading animation
3. After a brief simulated delay (1-2 seconds), the scenario results appear with an attribution: "Generated by Stress Architect"
4. The AI-generated scenarios are actually pre-calibrated (like all other scenarios), but the UX creates the impression of dynamic generation
5. In the Agent Activity Log, a new entry is added: `Stress Architect | GENERATE | Produced scenario: [name]`

**Future enhancement** (P2+, requires backend): Actually call an LLM API to generate novel scenario narratives and calibrations based on current market conditions.

---

## 16. REVISED FEATURE PRIORITY LIST

### 16.1 Updated P0: MUST-HAVE (16 features)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | **Disclaimer Banner/Footer** | NEW (from Critic) | Legal requirement. Non-dismissible. |
| 2 | Dedicated Stress Testing View | Unchanged | New nav item |
| 3 | Scenario Library (10+ pre-built) | Updated | Added 2022 Rate Shock, op risk scenarios |
| 4 | Scenario Selector with Discrete Severity | Updated | Discrete levels, not continuous slider |
| 5 | Capital Impact Waterfall Chart | Unchanged | Recharts stacked bar workaround |
| 6 | Scenario Comparison Table | Unchanged | Side-by-side metrics |
| 7 | Credit Stress Parameters (Vasicek) | Updated | With bounds checking per Section 5 |
| 8 | Yield Curve Scenario Builder (6 IRRBB) | Unchanged | |
| 9 | LCR/NSFR Under Stress | Unchanged | |
| 10 | Survival Horizon Chart | Updated | Point-in-time static model (not multi-period) |
| 11 | P&L Attribution Under Stress | Unchanged | |
| 12 | Regulatory Scenario Mapping | Unchanged | CCAR/EBA/PRA tags |
| 13 | Stressed Transition Matrix | Unchanged | Via nivo heatmap or CSS grid |
| 14 | **Tornado Chart** (replaces Radar) | NEW (from Critic) | Factor sensitivity ranking |
| 15 | Historical Scenario Replay | Unchanged | |
| 16 | **Sector Concentration Stress** | Unchanged | Heat map via nivo or CSS grid |

### 16.2 Updated P1: SHOULD-HAVE (16 features)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Reverse Stress Testing | Unchanged | "What breaks us?" |
| 2 | Multi-Period Stress Projection (9Q) | Unchanged | Full CCAR-style |
| 3 | CECL ECL Stress + IFRS 9 Toggle | Updated | CECL primary, IFRS 9 as display option |
| 4 | Correlation Stress Dashboard | Unchanged | |
| 5 | Deposit Run-Off Simulator | Unchanged | |
| 6 | Fire-Sale Haircut Model | Unchanged | |
| 7 | Climate Risk Scenarios (NGFS v4) | Updated | Aligned to V4 framework |
| 8 | Custom Scenario Builder | Unchanged | With input limits per Q5 |
| 9 | Stress Test Report Generator | Unchanged | PDF via html2canvas + jsPDF |
| 10 | **Operational Risk Stress Dashboard** | NEW (elevated from P2) | DORA, CrowdStrike calibration |
| 11 | **Cyber Risk Stress Scenarios** | ELEVATED (was P2) | Now P1 per Critic |
| 12 | **FRTB-Aligned ES Display** | ELEVATED (was P2) | Show ES alongside VaR |
| 13 | **Stress Test Backtesting** | ELEVATED (was P2) | Model credibility |
| 14 | **Concentration Risk Panel** (HHI/GA) | NEW | Section 14 metrics |
| 15 | Contingency Funding Plan Test | Unchanged | |
| 16 | **Third-Party Concentration Risk** | NEW | DORA-aligned |

### 16.3 Updated P2: NICE-TO-HAVE (10 features)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Network Contagion Visualizer | Unchanged | |
| 2 | Explainable Stress Results (XAI/SHAP) | Unchanged | |
| 3 | Geopolitical Risk Dashboard | Unchanged | |
| 4 | FRTB Full Implementation (DRC, RRAO) | Updated | Beyond ES display |
| 5 | Cross-Currency Liquidity Stress | Unchanged | |
| 6 | Pandemic Scenario Template | Unchanged | |
| 7 | Counterparty Stress / CVA | DEMOTED (was P1) | Per Critic recommendation |
| 8 | Integrated Feedback Loops (simplified) | DEMOTED (was P1) | Per Critic; full version too complex |
| 9 | Loss Flow Sankey Diagram | Updated | Requires nivo dependency |
| 10 | Scenario URL Sharing | NEW (Quick Win from Critic) | Encode in URL hash |

### 16.4 Removed / Deferred to P3+ (Requires Backend)

| Feature | Reason for Removal |
|---------|-------------------|
| AI Scenario Generator (GAN/VAE) | Not feasible client-side |
| RL-Based Optimal Response | Not feasible client-side |
| ML-Enhanced PD Models | Not feasible client-side; requires model training |
| Real-Time Scenario Monitoring | Requires live data feeds |

### 16.5 Quick Wins (Can Be Done in <1 Day Each)

| Quick Win | Effort | Impact | Section |
|-----------|--------|--------|---------|
| "Under Stress" badge on existing views | 2-4 hours | High integration value | Q4 answer |
| Tooltip glossary on technical terms | 4-6 hours | Improved usability | Critic 3.6 |
| Scenario URL sharing (hash params) | 2-3 hours | Shareability | Critic QW #3 |
| Dark mode consistency audit | 2-3 hours | Visual polish | Critic 3.7 |
| Color accessibility (blue/orange palette) | 3-4 hours | WCAG compliance | Critic 3.6 |

---

## 17. ADDITIONAL MINOR CORRECTIONS

### 17.1 Sensitivity Formula Completeness (Critic 3.2)

The Round 1 Greeks-based P&L formula is a second-order Taylor expansion approximation. Missing terms:
- **Theta** (time decay): Relevant for options but not material for instantaneous shock scenarios
- **Rho** (interest rate sensitivity for options): Captured indirectly through DV01 but not explicitly for options
- **Cross-gamma**: Second-order cross-terms between different risk factors

**Correction**: Add a note that this is a "first/second-order Taylor expansion approximation suitable for instantaneous shock analysis. Higher-order terms and cross-effects are omitted."

### 17.2 LGD Stress Formula Decomposition (Critic 3.3)

The simplified `LGD_stressed = LGD_base * (1 + stress_factor)` should be expanded for documentation purposes:

```
LGD_stressed = 1 - Recovery_Rate_stressed

Recovery_Rate_stressed = Recovery_Rate_base
  * (1 - Collateral_Value_Decline)
  * (1 - Cure_Rate_Reduction)
  * (1 + Recovery_Cost_Increase)^-1
  * Time_in_Default_Factor
```

For the dashboard, the simplified formula is used with the `lgdAddon` from the shock vector, but the decomposition is shown as tooltip documentation.

### 17.3 Fire-Sale Haircut Sources (Critic 3.4)

The Round 1 haircut table should cite:
- Cifuentes, Ferrucci & Shin (2005) - "Liquidity Risk and Contagion" (fire-sale dynamics)
- BCBS (2013) - "Margin requirements for non-centrally cleared derivatives" (haircut floors)
- Greenwood, Landier & Thesmar (2015) - "Vulnerable Banks" (empirical fire-sale estimates)
- Actual observed haircuts during the 2008 crisis (various Fed publications)

### 17.4 Historical Simulation Complexity Rating (Critic 3.5)

Correct: Filtered Historical Simulation complexity should be rated **Medium**, not "Low-Medium." Proper FHS requires:
1. Selecting an appropriate stress window
2. Volatility rescaling using GARCH or exponentially weighted moving average
3. Mapping current portfolio to historical risk factors
4. Handling missing data and structural breaks (e.g., LIBOR to SOFR transition)

### 17.5 Color Accessibility (Critic 3.6)

**Recommended accessible palette**:

| Meaning | Current (Inaccessible) | Recommended (Accessible) |
|---------|----------------------|--------------------------|
| Positive / Good | Green (#10b981) | Blue (#3b82f6) |
| Negative / Bad | Red (#ef4444) | Orange (#f97316) |
| Warning | Amber (#f59e0b) | Amber (#f59e0b) - keep |
| Neutral | Slate (#94a3b8) | Slate (#94a3b8) - keep |

Additionally:
- Add directional arrows (up/down) alongside color indicators
- Use pattern fills in charts (stripes, dots) for additional differentiation
- Test with the Chromatic Vision Simulator or similar tool

### 17.6 Dark Mode Consistency (Critic 3.7)

All new stress testing components MUST use the existing dark theme tokens:
- Background: `bg-slate-950` (page), `bg-slate-900` (cards), `bg-slate-800` (inputs/panels)
- Text: `text-slate-100` (primary), `text-slate-400` (secondary), `text-slate-500` (muted)
- Borders: `border-slate-700` (card borders), `border-slate-800` (subtle dividers)
- Chart background: transparent (inherit card background)
- Recharts tooltip: Must use dark theme (`contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}`)
- nivo themes: Must configure dark theme wrapper

### 17.7 Existing Stress Test Data Integration (Critic 3.8)

The current `syntheticData.js` already contains:
- `stressScenarios` array (6 scenarios with name, description, pnlImpact, capitalImpact)
- `liquidityStressScenarios` array (4 scenarios with LCR impact, survival days)

**Integration approach**:
1. The existing `stressScenarios` data in `syntheticData.js` will be referenced as the "legacy" scenario display
2. The new `stressScenarioLibrary.js` will contain the full-featured scenario definitions (with ShockVector, severity levels, etc.)
3. A mapping function will connect legacy scenario names to new scenario IDs
4. The existing Market Risk view's stress table will link to the detailed Stress Testing view

### 17.8 AI/ML Section Update (Critic 3.18)

The Round 1 AI/ML section cited papers from 2020-2022. Recent developments (2023-2025):

| Approach | Description | Relevance | Feasibility (Client-Side) |
|----------|-------------|-----------|--------------------------|
| **Foundation Models for Finance** | Large language models fine-tuned on financial data (BloombergGPT, FinGPT) | Scenario narrative generation, regulatory interpretation | No (requires API) |
| **Diffusion Models** | Score-based generative models producing realistic financial time series | Alternative to GANs for scenario generation | No (compute intensive) |
| **Graph Neural Networks (GNNs)** | Model financial network topology for contagion/systemic risk | Contagion modeling, counterparty risk | Partial (small networks) |
| **Transformer-Based Time Series** | Temporal Fusion Transformers, PatchTST for forecasting | Multi-period stress projections | No (requires training) |
| **Conformal Prediction** | Distribution-free uncertainty quantification for any model | Confidence intervals on stress results | Yes (lightweight) |
| **Federated Learning** | Train models across institutions without sharing data | Cross-bank stress calibration | No (requires infrastructure) |

**Recommendation**: Conformal prediction is the most feasible AI/ML addition for a client-side application. It can provide statistically valid confidence intervals around stress test results without requiring model training. All other AI/ML features require a backend.

---

## 18. UPDATED REFERENCES

### New References Added in Round 2

16. Basel Committee (2024) - Basel III Endgame Re-Proposal (Federal Register 2024-21344)
17. Regulation (EU) 2022/2554 - Digital Operational Resilience Act (DORA)
18. NGFS (2023) - NGFS Climate Scenarios for Central Banks and Supervisors, Phase IV
19. Parametrix Insurance (2024) - CrowdStrike Outage Impact Report
20. Acklam, P. (2002) - "An algorithm for computing the inverse normal cumulative distribution function"
21. Abramowitz & Stegun (1964) - Handbook of Mathematical Functions (Normal CDF approximation)
22. Cleveland & McGill (1984) - "Graphical Perception" (against radar charts)
23. Cifuentes, Ferrucci & Shin (2005) - "Liquidity Risk and Contagion"
24. Greenwood, Landier & Thesmar (2015) - "Vulnerable Banks"
25. BCBS d457 (2019) - "Minimum capital requirements for market risk" (FRTB final)
26. BCBS d424 (2017) - "Basel III: Finalising post-crisis reforms" (Output floor)
27. Acerbi & Szekely (2014) - "Backtesting Expected Shortfall"
28. ASC 326 (FASB) - "Financial Instruments - Credit Losses" (CECL)
29. IFRS 9 (IASB, 2014) - "Financial Instruments"
30. Gordy & Lutkebohmert (2013) - "Granularity Adjustment for Regulatory Capital Assessment"

---

## APPENDIX A: COMPLETE SCENARIO LIBRARY (10 Scenarios)

All scenarios follow the `StressScenario` interface from Section 4.5. Below is the complete list with extreme-severity ShockVectors:

| # | ID | Name | Category | Key Driver |
|---|-----|------|----------|-----------|
| 1 | `gfc-2008` | 2008 Global Financial Crisis | Historical | Credit, equity, liquidity |
| 2 | `covid-2020` | COVID-19 Market Shock | Historical | Equity, oil, unemployment |
| 3 | `rate-shock-2022` | 2022 Rate Shock / Bond Bear | Historical | Interest rates, bonds |
| 4 | `svb-2023` | 2023 SVB / Regional Bank Crisis | Historical | Deposits, rates, confidence |
| 5 | `ccar-sa-2026` | CCAR Severely Adverse 2026 | Regulatory | GDP, unemployment, equity |
| 6 | `stagflation` | Stagflation Scenario | Hypothetical | Inflation, rates, GDP |
| 7 | `cre-correction` | CRE Market Correction | Hypothetical | CRE values, cap rates |
| 8 | `sovereign-crisis` | Sovereign Debt Crisis (EM) | Hypothetical | EM spreads, FX, flight to quality |
| 9 | `cyber-attack` | Major Cyber Attack on Financial System | Operational | IT systems, operational loss |
| 10 | `rate-reversal` | Rapid Rate Rise (+300bp Parallel) | Hypothetical | Interest rates, mortgages |
| 11 | `net-zero-2050` | NGFS Net Zero 2050 (Transition) | Climate | Carbon sectors, transition |
| 12 | `current-policies` | NGFS Current Policies (Physical) | Climate | Physical risk, agriculture, coastal RE |

---

## APPENDIX B: RISK FACTOR CROSS-REFERENCE MATRIX

Shows which risk factors are primarily stressed in each scenario (Extreme severity):

```
Risk Factor          | GFC  | COVID | Rate22 | SVB  | CCAR | Stag | CRE  | Sov  | Cyber | Rate+ |
---------------------|------|-------|--------|------|------|------|------|------|-------|-------|
Equity               | -57% | -34%  | -25%   | -15% | -40% | -20% | -10% | -25% | -5%   | -15%  |
IG Spreads (bp)      | +400 | +280  | +60    | +100 | +300 | +150 | +120 | +200 | +50   | +100  |
HY Spreads (bp)      |+1500 | +740  | +250   | +300 |+1000 | +500 | +400 | +800 | +100  | +300  |
2Y Rate (bp)         | -150 | -150  | +400   | -110 | -150 | +200 | +50  | -100 | 0     | +300  |
10Y Rate (bp)        | -200 | -120  | +273   | -80  | -175 | +150 | +25  | -50  | 0     | +300  |
VIX                  |  81  |  83   |  37    |  35  |  65  |  45  |  30  |  50  |  25   |  40   |
GDP Growth (%)       | -4.3 | -6.0  | -1.0   | -1.5 | -4.0 | -2.0 | -1.5 | -2.5 | -0.5  | -1.5  |
Unemployment (pp)    | +5.0 | +11.2 | +2.5   | +1.5 | +5.5 | +3.0 | +2.0 | +3.0 | +0.5  | +1.5  |
CRE (%)              | -35  | -15   | -20    | -20  | -30  | -15  | -40  | -10  | -2    | -10   |
HPI (%)              | -27  | -5    | -10    | -8   | -25  | -10  | -20  | -5   | 0     | -8    |
PD Multiplier        | 4.0  | 3.0   | 2.2    | 2.0  | 3.5  | 2.5  | 3.0  | 2.5  | 1.3   | 1.8   |
Deposit Runoff Mult  | 3.0  | 2.0   | 2.5    | 10.0 | 3.0  | 2.0  | 2.0  | 2.5  | 5.0   | 1.5   |
```

---

## APPENDIX C: STRESS TESTING VIEW WIREFRAME (Text-Based)

```
+------------------------------------------------------------------+
| DISCLAIMER BANNER (amber, non-dismissible, collapsible)     [v]  |
+------------------------------------------------------------------+
|                                                                    |
| STRESS TESTING                                    [Export] [Help]  |
|                                                                    |
| +--Scenario Selector-----+ +--Severity Selector-----------------+ |
| | [v] 2008 Financial      | | [Mild] [Moderate] [*Severe*] [Ext]| |
| |     Crisis              | |  ~1/10   ~1/25     ~1/50    ~1/100 | |
| +-------------------------+ +------------------------------------+ |
|                                                                    |
| +--Capital Impact Waterfall (P0)--+ +--Tornado Chart (P0)-------+ |
| |                                  | |                            | |
| | Base ====                        | | CRE Decline  ====----     | |
| | Credit   ====-                   | | Spreads      ===---       | |
| | Market   ==-                     | | Equity       ==--         | |
| | OpRisk   =-                      | | Unemploy     ==-          | |
| | NII      =+                      | | DV01         =-           | |
| | Stressed ===                     | | Deposit      =-           | |
| |                                  | | NII Benefit  =+           | |
| +----------------------------------+ +----------------------------+ |
|                                                                    |
| +--Key Metrics Bar-------------------------------------------+    |
| | CET1: 12.4% -> 6.1% | LCR: 118% -> 72% | ES97.5: $28.4M |    |
| | ECL: $486M -> $1.9B  | Survival: 21 days  | OpLoss: $180M  |    |
| +------------------------------------------------------------+    |
|                                                                    |
| [Credit] [Market] [Liquidity] [OpRisk] [Comparison] [Advanced]   |
|                                                                    |
| +--Active Tab Content (varies)-----------------------------------+ |
| |                                                                  | |
| | (Credit tab: Vasicek results, transition matrix, ECL breakdown)| |
| | (Market tab: ES, VaR, sensitivity P&L, yield curve)           | |
| | (Liquidity tab: LCR, survival horizon, deposit runoff)        | |
| | (OpRisk tab: operational loss, cyber risk, DORA compliance)   | |
| | (Comparison tab: side-by-side scenario table)                 | |
| | (Advanced tab: custom builder, reverse stress test)           | |
| |                                                                  | |
| +----------------------------------------------------------------+ |
|                                                                    |
| MODEL LIMITATIONS FOOTER (collapsed by default)             [v]  |
+------------------------------------------------------------------+
```

---

*Round 2 Research Addendum prepared by Stress Testing Research Agent*
*Date: 2026-03-04*
*Addresses all 6 critical gaps, 8 important suggestions, 7 questions, and priority re-alignment from Round 1 Critique*
*Target score: 9.0+/10*
