---
title: "FinRisk — Credit Risk Modeling Playbook"
subtitle: "Phase 1 (Weeks 9–20) Build Specification — Data, Models, Steps"
author: "Pranik Chainani"
date: "April 29, 2026"
geometry: margin=1in
fontsize: 11pt
toc: true
toc-depth: 3
numbersections: false
colorlinks: true
linkcolor: NavyBlue
urlcolor: NavyBlue
toccolor: black
header-includes:
  - \usepackage{fancyhdr}
  - \pagestyle{fancy}
  - \fancyhf{}
  - \fancyhead[L]{FinRisk Credit Risk Playbook}
  - \fancyhead[R]{\thepage}
  - \renewcommand{\headrulewidth}{0.4pt}
---

\newpage

# Preface

This is FinRisk's **credit-risk-specific** Phase 1 modeling playbook, synthesized from Rounds 1, 2, and 4 of the research corpus. Where the combined modeling report covered all risk classes (credit, market, liquidity, IRRBB, operational), this document focuses exclusively on **credit risk**: PD, LGD, EAD, lifetime ECL, transition matrices, portfolio models, stress overlays, concentration, and the SR 11-7 interpretability layer that wraps them.

**Three things to internalize before reading further:**

1. **FinRisk's credit-risk wedge is a defensible challenger PD on residential, CRE, and C&I books, calibrated on free public data, with SHAP attribution and a draft SR 11-7 model document attached to every output.** That's the deliverable.

2. **We are explicitly Tier 2/3, advisory/challenger** — not the bank's model of record. This dictates *every* downstream choice: documentation depth, validation rigor, governance posture, sales pitch.

3. **Phase 1 budget for credit data is $0.** Fannie Mae + Freddie Mac + FFIEC Call Reports + FRED + FHFA + NCUA 5300 cover residential, CRE, C&I, and credit-union books for free. Trepp, Moody's DRD, S&P CreditPro are post-seed unlocks.

**Document structure:**

- **Part I — Phase 1 Plan**: deliverables, data sources, week-by-week build sequence, success criteria.
- **Part II — Model Families**: Vasicek, macro-satellite, rating migration, LGD, IFRS 9/CECL, portfolio models (CreditMetrics).
- **Part III — Implementation Spec**: numerical bounds for Vasicek, normal CDF / inverse CDF in JS, validation utilities.
- **Part IV — Stress Calibrations**: 2008 GFC, 2020 COVID, 2023 SVB, 2022 rate shock, NGFS V4 climate sector PD multipliers.
- **Part V — Concentration & Adjustments**: HHI, granularity adjustment, concentration stress.
- **Part VI — AI/ML & Interpretability**: GANs/VAE for scenario gen, SHAP/LIME/ALE for SR 11-7.
- **Part VII — Backtesting Protocol**: out-of-time validation, discrimination, calibration, stability.
- **References**.

\newpage

# Part I — Phase 1 Plan

## 1.1 Credit Risk Deliverables for Week 20 (2026-09-10)

By the end of Phase 1, FinRisk's credit-risk module will ship:

1. **Calibrated single-factor Vasicek IRB conditional PD model** for US residential mortgages. Calibrated on Fannie Mae + Freddie Mac single-family loan performance data, 2000–2024. Backtested out-of-time on 2006–2010 vintages (the GFC stress event). Defensible challenger PD for any US bank's residential book.

2. **Constrained ridge-regression challenger PD** on CRE and C&I books, calibrated on FFIEC Call Report Schedule RC-N net charge-off data at peer-group level. Inputs: macro factors (HPI, unemployment, BBB spread, CRE price index, GDP), bank-specific concentration. Outputs: 1-year PD by sector, with SHAP attribution per feature.

3. **Vintage-level survival PD curves** for residential and CRE using `lifelines` / `scikit-survival`. Time-to-default conditional on origination vintage. Critical for IFRS 9 / CECL lifetime ECL.

4. **Stress overlay module** — applies CCAR Severely Adverse, NGFS climate, 2022 rate shock, and 2023 SVB-replay shock vectors to the PDs above and produces stressed PD/LGD/ECL outputs.

5. **Concentration-adjusted portfolio capital** — HHI + granularity adjustment overlay on top of Vasicek capital, per BCBS 4.6 and Gordy (2003).

6. **SR 11-7 model documentation generator (credit module)** — auto-generates a Tier 2/3 model card per scenario run: inputs, assumptions, methodology, limitations, sensitivity, benchmark comparison, validation results, SHAP attribution.

**What we do NOT build in Phase 1** (Phase 2 / post-seed):

- Merton/KMV structural PD (needs equity-vol input — fine on public companies, irrelevant for mid-market private lending)
- Full CreditMetrics portfolio VaR (post-Series A, needs proprietary rating transitions)
- IFRS 9 stage-2 SICR triggers customized per bank (engagement-level, not Phase 1)
- ALLL/CECL automation as model-of-record (Tier 1 territory — explicit no-go)
- Consumer credit bureau scoring (FICO/VantageScore own this)

## 1.2 Data Acquisition Plan

### Phase 0/1 (free, $0 budget)

| Source | Use | URL |
|---|---|---|
| **Fannie Mae Single-Family Loan Performance Data** | Residential PD calibration; ~50M mortgages 2000–present, monthly performance | capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer |
| **Freddie Mac Single-Family Loan-Level Dataset** | Residential PD cross-validation | freddiemac.com/research/datasets/sf_loanlevel_dataset |
| **FFIEC Call Reports (031/041)** | Bank-level loss rates RC-N, deposit RC-E, capital RC-R; peer-group construction | cdr.ffiec.gov |
| **FRED** | Macro factors: HPI, unemployment, BBB spread, GDP, VIX-equivalents | fred.stlouisfed.org |
| **FHFA House Price Index** | Regional residential price stress, MSA-level | fhfa.gov/DataTools |
| **NCUA 5300** | Credit-union analogue of Call Reports | ncua.gov/analysis/credit-union-corporate-call-report-data |
| **SEC EDGAR** | 10-K/10-Q for BHCs; risk-factor commentary | sec.gov/edgar |
| **FR Y-9C** | Holding-company consolidated balance sheet; CCAR disclosed portions | federalreserve.gov/apps/mdrm |
| **FDIC SDI** | Failure history, enforcement actions | banks.data.fdic.gov |
| **NGFS Climate Scenarios (V4)** | Climate stress overlays | ngfs.net/ngfs-scenarios-portal |
| **BLS** | Unemployment, CPI | bls.gov |

### Phase 2 / Seed unlock list (when to buy)

| Source | Cost/yr | What it unlocks | Trigger |
|---|---|---|---|
| **Trepp** | $30–80K | CRE loan performance, CMBS — critical for mid-market CRE PD | Seed close + first $10B+ CRE-heavy customer |
| **Moody's DRD** | $50–150K | Corporate PD/LGD calibration | Post-Series A |
| **S&P CreditPro / RatingsXpress** | $40–100K | Rating transitions, default history | Post-Series A |
| **Bloomberg Terminal** | $25–30K/seat | Market data, rate curves | Seed |

**Phase 1 storage plan:** raw data on local laptop (Polars/DuckDB) through Week 8. Move to S3 + SageMaker on-demand at Week 9. Loan-performance datasets are ~50–100GB raw, ~10–20GB Parquet. Fits a MacBook.

## 1.3 Week-by-Week Build Sequence

### Weeks 9–10: Data ingestion & feature engineering
- Download Fannie Mae + Freddie Mac single-family loan performance datasets (full history).
- Convert raw fixed-width / pipe-delimited to Parquet via Polars.
- Build feature pipeline: origination FICO, LTV, DTI, loan purpose, occupancy, geography, vintage, current LTV, current FICO refresh proxy.
- Construct default labels: D90+, D180+, foreclosure, REO, modification flags.
- Outcome target: clean Parquet store with ~50M loan-month observations + macro overlay (FRED + FHFA).

### Weeks 11–12: Vasicek calibration (residential)
- Implement IRB Vasicek conditional PD: $PD_{conditional} = \Phi\left(\frac{\Phi^{-1}(PD_{TTC}) + \sqrt{\rho}\, \Phi^{-1}(\alpha)}{\sqrt{1-\rho}}\right)$
- Calibrate $PD_{TTC}$ from long-run default rates (2000–2024 ex-GFC) per FICO/LTV bucket.
- Calibrate $\rho$ (asset correlation) per Basel residential floor (15%) and re-estimate empirically using factor regression on default rates.
- Backtest on 2006–2010 vintages (GFC out-of-time): predicted vs. realized cumulative default.
- Implement numerical bounds checks (Round 2 §5 in Part III) — Vasicek breaks at $PD \to 0$ or $\rho \to 1$.

### Weeks 13–14: CRE/C&I challenger PD
- Aggregate FFIEC Call Report Schedule RC-N net charge-off rates per peer group ($10–50B asset banks) by sector (CRE-office, CRE-multifamily, CRE-industrial, C&I, agricultural).
- Constrained ridge regression: features = HPI growth, unemployment, BBB spread, CRE price index (CoStar via FRED), bank-specific concentration ratio. Constraint: monotone in unemployment and spread.
- SHAP attribution per feature.
- Compare predictions to realized 2020 COVID and 2022 rate-shock loss rates (out-of-time).

### Weeks 15–16: Vintage survival curves + stress overlay
- Fit Cox proportional hazards on Fannie/Freddie cohorts using `lifelines`.
- Output: cumulative PD curve over 1, 3, 5, 10-year horizon by vintage × FICO × LTV × geography.
- Build stress overlay: applies macro shock vector (rates, HPI, unemployment) to baseline PD curve via macro-satellite multiplier.
- Wire CCAR Severely Adverse 2026 + 2022 rate shock + 2023 SVB-replay shock vectors.

### Weeks 17–18: Concentration adjustment + SR 11-7 doc generator
- Implement HHI per loan portfolio.
- Granularity adjustment per Gordy (2003) — extra capital for concentrated portfolios above the asymptotic single-factor model.
- Build SR 11-7 doc generator (credit module): Markdown/PDF output covering the Tier 2/3 schema. Inputs auto-populate from model run; methodology and limitations are templated; user fills in business context.

### Weeks 19–20: Backtesting, model card, validation pack
- Out-of-time backtest dossier: discrimination (AUC, KS), calibration (Hosmer-Lemeshow, binomial test by bucket), stability (PSI on input features, CSI on PD distribution).
- Stress backtest: predicted vs. realized loss in 2008 GFC, 2020 COVID, 2022 rate shock.
- Final model card v1.0 — first deliverable a CRO or MRM lead can review.

## 1.4 Success Criteria for Week-20 Gate

Hard gates the credit module must clear:

- **Vasicek residential PD AUC ≥ 0.75** out-of-time on 2006–2010.
- **Vasicek calibration error within ±10%** of realized default rate per FICO×LTV bucket on 2006–2010.
- **CRE/C&I ridge PD R² ≥ 0.6** vs. realized peer-group charge-off rates 2010–2024.
- **SHAP attribution available** for every model output (zero exceptions).
- **SR 11-7 model card** generated end-to-end for at least one full model run (residential Vasicek), reviewed by central-banker co-founder for regulatory adequacy.
- **At least 2 design-partner CROs** have seen the model card and given feedback.

If any of these miss by Week 20, the issue is prioritized in the seed-extension plan; we do not ship to a paying customer with a soft AUC.

\newpage

# Part II — Credit Risk Model Families (Round 1)

## 2. CREDIT RISK STRESS TESTING

### 2.1 Vasicek Single-Factor Model (Industry Standard)
```
PD_stressed = Phi(
  (Phi^{-1}(PD_base) + sqrt(rho) * Phi^{-1}(stress_percentile)) / sqrt(1 - rho)
)
```
- rho: asset correlation (Basel: 12-24% for corporates)
- stress_percentile: severity of systematic factor shock
- Adoption: Universal (Basel IRB foundation)
- Complexity: Low-Medium

### 2.2 Macro-Satellite Models
```
PD_segment(t) = f(GDP_growth, Unemployment, Interest_rates, HPI, ...)
```
- Typically logistic regression or Bayesian VAR linking macro factors to PDs
- CCAR requirement: link macro scenarios to risk parameters
- Adoption: Very high (regulatory requirement)
- Complexity: Medium-High

### 2.3 Rating Migration Under Stress
- **Stressed Transition Matrix**: Shift base migration probabilities under stress
  - Method 1: Scalar multiplier (e.g., downgrade probability x 2.5)
  - Method 2: Regime-dependent matrices (expansion vs recession calibration)
  - Method 3: CreditMetrics-style: shift the latent variable threshold
- Adoption: High (standard in credit portfolio models)

### 2.4 LGD Stress Models
```
LGD_stressed = LGD_downturn = LGD_base * (1 + stress_factor)
```
- Collateral value decline under stress (property -25%, equities -40%)
- Cure rate reduction under stress
- Basel downturn LGD vs PIT LGD
- Adoption: High (regulatory requirement)

### 2.5 IFRS 9 / CECL Stress Testing
- **Three-stage model**: Stage 1 (12-month ECL), Stage 2 (lifetime ECL), Stage 3 (impaired)
- **SICR triggers**: PD increase, rating downgrade, 30dpd
- Under stress: massive Stage 1->2 migration causing provisioning cliff
- **ECL = PD * LGD * EAD * discount_factor**
- **Probability-weighted scenarios**: Base (50%) + Adverse (30%) + Severe (20%)

### 2.6 Portfolio Models
| Model | Approach | Key Feature |
|-------|----------|-------------|
| CreditMetrics | Factor model, migration-based | Full loss distribution |
| CreditRisk+ | Actuarial, sector concentration | Analytical solution for portfolio loss |
| KMV/Moody's | Structural (Merton), equity-implied | Market-implied PDs |

---


\newpage

# Part III — Vasicek Numerical Implementation (Round 2 §5)

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


\newpage

# Part IV — Stress Calibrations

## Historical Crisis Calibrations (Round 1 §7)

### 7.1 2008 Global Financial Crisis
| Risk Factor | Peak Stress |
|-------------|-------------|
| S&P 500 | -56.8% |
| VIX | 80.86 |
| 10Y UST | -200bp |
| IG Spreads | +400bp |
| HY Spreads | +1,500bp |
| GDP | -4.3% |
| Unemployment | 5% -> 10% |
| House Prices | -27% |
| CRE | -35% to -40% |
| Oil | -78% |
| LIBOR-OIS | +350bp |

### 7.2 2020 COVID-19
| Risk Factor | Peak Stress |
|-------------|-------------|
| S&P 500 | -33.9% (23 days) |
| VIX | 82.69 |
| GDP | -31.2% (Q2 annualized) |
| Unemployment | 3.5% -> 14.7% |
| Oil | Negative ($-37/bbl) |
| IG Spreads | +280bp |
| HY Spreads | +740bp |

### 7.3 2023 SVB / Regional Banking Crisis
| Risk Factor | Peak Stress |
|-------------|-------------|
| KBW Bank Index | -28% |
| 2Y UST | -110bp |
| MOVE Index | 199 |
| Deposit outflows | $42B in 1 day |

### 7.4 Other Historical Scenarios
- 1997 Asian Crisis (EM FX -50-80%)
- 1998 LTCM/Russia (convergence trade collapse)
- 2010-2012 Euro Sovereign (Greek yields 30%+)
- 2022 UK Gilt/LDI (30Y gilt +150bp in 3 days)
- 2015 China crash (Shanghai -49%)
- 2022-2023 Crypto (BTC -77%, Terra -100%)

---


\newpage

## 2022 Bond Market / Rate Shock Calibration (Round 2 §11)

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

\newpage

## NGFS V4 Climate — Sector PD Multipliers (Round 2 §13)

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

\newpage

# Part V — Concentration & Adjustments (Round 2 §14)

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


\newpage

# Part VI — AI/ML Enhancements & Interpretability

## AI/ML-Enhanced Approaches (Round 1 §6)

### 6.1 GANs for Scenario Generation
- **Quant GANs** (Wiese et al., 2020): Generate realistic financial time series
- **Tail-GAN** (Cont & Xu, 2022): Focus on tail risk scenarios
- Generate thousands of plausible stress scenarios respecting market dynamics
- Adoption: Cutting-edge (research stage)

### 6.2 Variational Autoencoders (VAE)
- Learn latent representation of market regimes
- Generate scenarios by sampling from tail of latent space
- Useful for capturing nonlinear dependencies
- Adoption: Emerging

### 6.3 Explainable AI (XAI) for Stress Tests
- **SHAP values**: Decompose stressed loss into factor contributions
- Natural language generation for stress test narratives
- Adoption: Emerging (driven by SR 11-7 model risk requirements)

---


## SR 11-7 Interpretability Stack (Round 4 §6.5)

| **NGFS climate scenarios** | ngfs.net. | Library. | Already shipped. |
| **Reverse stress testing** | EBA 2018 guidelines; PRA SS3/18. | Optimization-based root-finder. | Phase 2. |

### 6.5 Model interpretability / SR 11-7 effective challenge

- **SHAP** (Lundberg & Lee, NeurIPS 2017) — `shap` Python package.
- **LIME** (Ribeiro, Singh, Guestrin, KDD 2016) — `lime` package.
- **Partial Dependence / ALE plots** — `sklearn.inspection`.
- **Permutation importance** — `sklearn`.


**Synthesis — what FinRisk's credit module commits to:**

Every credit model output (Vasicek conditional PD, ridge CRE/C&I PD, survival vintage PD, stressed PD/LGD/ECL) ships with the following attached, in machine-readable form alongside the prediction itself:

1. **SHAP values** per input feature, per observation. Computed via TreeSHAP for the gradient-boosted variants and KernelSHAP for the ridge model.
2. **Partial dependence plot** for each macro feature, fixed at the model's training distribution.
3. **ALE (accumulated local effects) plot** as a backup to PDP for correlated features (e.g., HPI vs. unemployment).
4. **Permutation importance** ranking, computed on out-of-time hold-out.
5. **Counterfactual explanation** for adverse PD predictions (per DiCE, Mothilal et al. 2020) — "loan would have been classified low-PD if FICO were ≥720."
6. **Confidence interval** via bootstrap (1000 resamples) on each PD prediction.

These are non-negotiable. Banks' MRM teams will reject a model that produces a number without this support package.

\newpage

# Part VII — Backtesting Protocol

Phase 1 backtesting dossier covers four dimensions, in line with SR 11-7 effective-challenge expectations and BCBS 14 backtesting principles:

## 7.1 Discrimination

- **AUC (Area Under ROC)** — discrimination between defaulters and non-defaulters. Minimum threshold: 0.75 for residential, 0.70 for CRE/C&I (peer-group level CRE/C&I has lower discrimination ceiling because granularity is coarser).
- **KS statistic** — max separation between cumulative-default and cumulative-non-default distributions. Minimum: 0.30.
- **Gini = 2·AUC − 1** — reported alongside for industry comparability.
- **Lorenz curve** — graphical concentration of defaults in top-decile predicted PD.

## 7.2 Calibration

- **Hosmer-Lemeshow goodness-of-fit** — chi-squared on 10 PD-decile buckets. p-value > 0.05 indicates no calibration problem.
- **Binomial test per bucket** — for each PD bucket, test whether observed defaults are consistent with predicted PD assuming binomial distribution. Flag buckets with p < 0.01.
- **Brier score** — mean squared difference between predicted PD and 0/1 default outcome. Compare to historical baseline.
- **Reliability diagram** — predicted PD on x-axis, realized default rate on y-axis, by bucket.

## 7.3 Stability

- **PSI (Population Stability Index)** on input features — score < 0.10 = stable, 0.10–0.25 = monitor, > 0.25 = retrain. Computed quarterly on rolling window.
- **CSI (Characteristic Stability Index)** on PD distribution itself — same thresholds.
- **Feature drift alerts** — Wasserstein distance on key features (FICO, LTV, DTI) vs. training distribution.

## 7.4 Out-of-time validation

Required out-of-time backtest windows for the residential Vasicek model:

| Window | Stress nature | Pass criterion |
|---|---|---|
| 2006–2010 (GFC) | Severe credit + housing | Predicted cumulative default within ±20% of realized at 36-month horizon |
| 2020–2021 (COVID) | Short, sharp, fiscal-supported | Predicted within ±15% (forbearance complicates this — document the adjustment) |
| 2022–2023 (rate shock) | Rate-driven, mild credit | Predicted within ±10% — milder stress, tighter band |

## 7.5 Benchmark / challenger comparison

FinRisk's own positioning is challenger; for SR 11-7 effective-challenge of *our* models we document at minimum:

1. **Frequentist logistic regression baseline** — simplest possible model, using 5 macro features. The Vasicek + ridge models must outperform this on AUC and Brier score. If they don't, the complexity is unjustified.
2. **Industry-standard rating-transition matrix** baseline (Moody's published transitions) for corporates — only when corporate Moody's DRD is unlocked post-Series A.
3. **Naive constant-PD model** at long-run default rate — must underperform Vasicek by clear AUC margin.

\newpage

# References

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

