---
title: "FinRisk — Modeling Foundations"
subtitle: "Combined Modeling Report for Phase 1 Kickoff"
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
  - \fancyhead[L]{FinRisk Modeling Foundations}
  - \fancyhead[R]{\thepage}
  - \renewcommand{\headrulewidth}{0.4pt}
---

\newpage

# Preface

This document is a consolidated **modeling-only** extract from the FinRisk research corpus. It is intended for co-founder review ahead of the Phase 1 (Weeks 9–20) modeling build. It assembles, in order:

1. **Phase 1 modeling overview** — the six concrete deliverables for Week 20, the canonical model reference table, and the model-training infrastructure phasing (excerpted from the Round 4 master report).
2. **Round 1 modeling foundations** — full treatment of regulatory frameworks, credit / market / liquidity / integrated multi-risk stress methods, AI/ML-enhanced approaches, and historical crisis calibrations.
3. **Round 2 modeling addendum** — Basel 3.1 endgame, operational risk under SMA + DORA, Vasicek numerical stability, Expected Shortfall coverage, scenario propagation framework, 2022 bond-market calibration, NGFS V4 climate update, concentration risk metrics, and the full reference list.

**What this document deliberately omits** (available in the source files): UX/UI specifications, dashboard architecture, testing strategy, scope-prioritization, go-to-market, fundraising, organizational risks. Those live in the Round 2/3/4 originals and the Round 4 executive brief.

**Source files** (all in `docs/research/`):
- `round1_research.md`
- `round2_research.md`
- `round4_master_report.md`

\newpage

# Part I — Phase 1 Modeling Overview (Round 4)

## Phase 1 Deliverables (Week 20 = 2026-09-10)

### 3.2 What FinRisk will do by end of 20-week plan (Week 20 = 2026-09-10)

1. **Real Vasicek calibration** on Fannie Mae / Freddie Mac single-family loan performance data (public, free). PD curve backtested on 2006–2023 vintage performance. Produces a defensible challenger PD for any US bank's residential mortgage book.
2. **IRRBB EVE / NII sensitivity engine** with the six Basel standardized shocks (parallel up, parallel down, short up, short down, steepener, flattener) plus custom shock definition. Outputs EVE duration gap, NII earnings-at-risk over 12m/24m horizons.
3. **Deposit behavioral model** — non-maturity deposit decay curves calibrated on FFIEC Call Report Schedule RC-E trends at peer-group level, with beta asymmetry and rate-cycle elasticity.
4. **ALCO pack generator** — one-click PDF output covering IRRBB position, EVE/NII under six shocks, LCR/NSFR forecast, deposit betas, stress-scenario comparison, peer benchmarking (contingent on design partner #1 being live). Saves a treasurer 40–60 hours/quarter.
5. **SR 11-7 model documentation generator** — for every scenario run, produce a draft model risk documentation package: inputs, assumptions, methodology, limitations, sensitivity, benchmark, validation. Bank's MRM team edits and signs off rather than writes from scratch.
6. **Challenger PD on CRE and C&I** — via FFIEC call report loss rate data at peer-group level, constrained ridge regression PD model with SHAP explanation.



## Model Training Infrastructure Phasing

### 8.4 Model training location

- **Phase 0 (Weeks 1–8):** MacBook. All Fannie/Freddie calibration fits on a laptop. Polars/DuckDB for the big dataset work.
- **Phase 1 (Weeks 9–20):** SageMaker on-demand, intermittent. Experiment tracking on Weights & Biases free tier.
- **Phase 2 (post-seed):** SageMaker Pipelines, MLflow, shadow-mode deployment into first customer account via BYOC.


\newpage

## Canonical Model Reference

This section is a condensed reference to the model families FinRisk will implement, with canonical papers and open-source starting points. Full treatment lives in Rounds 1–2 research docs.

### 6.1 Credit risk

| Model family | Canonical paper / reference | Open-source implementation | FinRisk use |
|---|---|---|---|
| **Single-factor Vasicek IRB conditional PD** | BCBS (2005), "An Explanatory Note on the Basel II IRB Risk Weight Functions." Vasicek (2002), "The Distribution of Loan Portfolio Value," *Risk*. | `src/engines/vasicekEngine.js` (already in repo) | Baseline IRB PD. Already shipped. |
| **Merton structural PD** | Merton (1974), JoF, "On the Pricing of Corporate Debt." | `pymerton` (sparse), homebrew in 200 LOC | Corporate credit challenger. |
| **KMV-style DD (Distance to Default)** | Crosbie & Bohn (2003), Moody's KMV. | Open-source reproductions on GitHub (ddcalc, creditR) | Public-company credit challenger. |
| **CreditMetrics** | JP Morgan (1997) technical document. | `creditR` (R), partial Python ports. | Portfolio-level VaR. |
| **Gradient-boosted PD/LGD** | Lessmann et al. (2015), EJOR, "Benchmarking state-of-the-art classification algorithms for credit scoring." | `xgboost`, `lightgbm`, `catboost` | Mid-market CRE/C&I challenger PD with SHAP attribution. |
| **Survival analysis for time-to-default** | Dirick et al. (2017), JORS. | `lifelines`, `scikit-survival` | Long-tail PD curves by vintage. |
| **IFRS 9 / CECL lifetime ECL** | IASB IFRS 9; FASB ASC 326. Academic: Skoglund (2017). | `openriskpython`, homebrew | Loss-forecasting module. |

### 6.2 Market risk

| Model family | Reference | Implementation | Use |
|---|---|---|---|
| **Historical simulation VaR** | BCBS (2019) FRTB. | Pandas + numpy. | Standard VaR. |
| **Filtered historical simulation** | Barone-Adesi, Giannopoulos, Vosper (1999). | Homebrew ~150 LOC. | Stressed VaR under time-varying volatility. |
| **GARCH(1,1) / EGARCH** | Bollerslev (1986); Nelson (1991). | `arch` Python package. | Volatility modeling. |
| **Extreme Value Theory (POT / GPD)** | McNeil & Frey (2000). | `pyextremes`, `scipy.stats.genpareto`. | Tail VaR / ES. |
| **Copula-based portfolio dependence** | Cherubini, Luciano, Vecchiato (2004). | `copulas` Python. | Cross-asset tail dependence. |

### 6.3 Liquidity & IRRBB

| Model family | Reference | Implementation | Use |
|---|---|---|---|
| **LCR/NSFR arithmetic** | BCBS 238 / BCBS 295. | `src/engines/liquidityStressEngine.js` (in repo) | Already shipped. |
| **EVE / NII sensitivity under Basel 6 shocks** | BCBS 368 (2016) IRRBB standards. | Homebrew duration/convexity + full repricing. | Core Week 3–6 build. |
| **Non-maturity deposit decay / behavioral** | OCC Bulletin 2012-5; FRB SR 96-13. Academic: Kalkbrener & Willing (2004). | Homebrew Cox-process or logistic decay. | Critical mid-market wedge. |
| **Contingent funding / survival days** | BCBS 144; Fed SR 10-6. | Arithmetic already in repo. | Extension. |

### 6.4 Operational risk & stress

| Model family | Reference | Implementation | Use |
|---|---|---|---|
| **SMA (Standardized Measurement Approach)** | BCBS 424 (2017). | Homebrew arithmetic. | OpRisk capital v1. |
| **Loss distribution approach (LDA)** | Frachot, Georges, Roncalli (2001). | `scipy.stats` + homebrew. | Phase 2. |
| **CCAR Severely Adverse scenario replication** | Fed annual scenarios at federalreserve.gov/supervisionreg/ccar.htm. | Scenario library `src/data/stressScenarioLibrary.js`. | Already shipped. |
| **NGFS climate scenarios** | ngfs.net. | Library. | Already shipped. |
| **Reverse stress testing** | EBA 2018 guidelines; PRA SS3/18. | Optimization-based root-finder. | Phase 2. |

### 6.5 Model interpretability / SR 11-7 effective challenge

- **SHAP** (Lundberg & Lee, NeurIPS 2017) — `shap` Python package.
- **LIME** (Ribeiro, Singh, Guestrin, KDD 2016) — `lime` package.
- **Partial Dependence / ALE plots** — `sklearn.inspection`.
- **Permutation importance** — `sklearn`.

Every FinRisk model output ships with SHAP by default. This is non-negotiable for SR 11-7 defensibility.


\newpage

# Part II — Modeling Foundations (Round 1)

## 1. REGULATORY FRAMEWORKS & STANDARDS

### 1.1 Basel Committee (BCBS)
- **BCBS 328 (2018)**: 9 principles for stress testing - proportionality, governance, scenario selection, model validation
- **Basel III/IV (BCBS d424)**: Minimum capital requirements including stressed capital buffers
- **BCBS d457 (FRTB)**: Fundamental Review of the Trading Book - standardized approach (SBA) with stress scenarios

### 1.2 US Federal Reserve (CCAR/DFAST)
- **CCAR**: Annual for banks >$100B assets. 9-quarter planning horizon.
- **DFAST**: Supervisory severely adverse scenario with prescribed macro variables:
  - GDP decline, unemployment rise, equity decline, HPI decline, rate changes, spread widening
- **Scenarios**: Baseline, Adverse, Severely Adverse
- **Key outputs**: Pre/post-provision net revenue, credit losses, CET1 ratio path

### 1.3 European Banking Authority (EBA)
- **Biennial EU-wide stress tests** since 2011
- **Constrained bottom-up** approach: banks use own models but EBA prescribes scenarios and methodology
- **Key metrics**: CET1 ratio, leverage ratio, liquidity ratios under stress

### 1.4 Bank of England / PRA
- **Annual Cyclical Scenario (ACS)**: Tailored to current economic risks
- **Biennial Exploratory Scenario (BES)**: Novel/emerging risks (e.g., climate)
- **Reverse stress testing** required under ICAAP/ILAAP

---

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

## 3. MARKET RISK STRESS TESTING

### 3.1 VaR Stress Approaches

**Historical Simulation (Filtered)**:
```
r_stressed(t) = r_historical(t) * (sigma_current / sigma_historical)
```
- Rescale historical returns by current volatility regime
- Adoption: Very high
- Complexity: Low-Medium

**Stressed VaR (sVaR)**:
- VaR calculated using 12-month stress window (e.g., 2008)
- Basel 2.5 requirement: Capital = max(VaR, 3*avgVaR) + max(sVaR, 3*avg_sVaR)
- Adoption: Universal (regulatory)

**Monte Carlo with Stressed Parameters**:
- Shift mean returns, inflate volatilities, stress correlations
- Adoption: High
- Complexity: Medium-High

### 3.2 Sensitivity/Greeks-Based Stress
```
Delta_P&L = DV01 * Delta_rates + CS01 * Delta_spreads + Delta * Delta_equity
           + Vega * Delta_vol + Gamma * (Delta_equity)^2 / 2 + ...
```
- Fast computation for large portfolios
- Adoption: Very high (standard for trading desks)
- Complexity: Low-Medium

### 3.3 Yield Curve Scenarios (IRRBB - BCBS 368)
Six prescribed scenarios:
1. **Parallel Up**: +200bp across all tenors
2. **Parallel Down**: -200bp (floored at 0 or -100bp)
3. **Steepener**: Short -100bp, Long +100bp
4. **Flattener**: Short +100bp, Long -100bp
5. **Short Rate Up**: Short +300bp, Long +75bp
6. **Short Rate Down**: Short -300bp, Long -75bp

### 3.4 Correlation Stress
- Under crisis: correlations converge toward 1 (loss of diversification)
- DCC-GARCH model for dynamic correlations
- Stressed correlation matrix via eigenvalue adjustment
- Adoption: Medium-High
- Complexity: High

### 3.5 FRTB Stress Scenarios
- Default Risk Charge (DRC): Jump-to-default for all issuers
- Residual Risk Add-On (RRAO): For exotic instruments
- SBA risk factor shocks prescribed by regulators

---

## 4. LIQUIDITY RISK STRESS TESTING

### 4.1 LCR Stress Framework (Basel III)
```
LCR = HQLA / Total_Net_Cash_Outflows_30days >= 100%
```
**Run-off rates under stress**:
- Retail stable deposits: 5% (insured), 10% (less stable)
- Unsecured wholesale (operational): 25%
- Unsecured wholesale (non-operational): 40-100%
- Secured funding (non-HQLA collateral): 25-100%
- Derivatives: Additional outflows from margin calls

### 4.2 Deposit Run-Off Modeling
- **Behavioral models**: Logistic regression on depositor characteristics
- **SVB-calibrated digital bank run**: 25% of uninsured deposits in 1 day
- **Factors**: Insurance coverage, relationship depth, digital access, social media contagion
- **Stressed run-off**: 3-10x base run-off rates depending on severity

### 4.3 Fire-Sale Haircut Model
```
Liquidation_Value = Market_Value * (1 - Haircut_stress)
```
**Stressed haircuts**:
| Asset Class | Normal | Moderate Stress | Severe Stress |
|-------------|--------|-----------------|---------------|
| Government bonds | 0-2% | 2-5% | 5-15% |
| IG Corporate | 2-5% | 5-15% | 15-30% |
| HY Corporate | 5-10% | 15-30% | 30-50% |
| Equities | 5-10% | 15-25% | 25-50% |
| CRE | 10-20% | 25-40% | 40-60% |
| Structured products | 10-25% | 30-50% | 50-80% |

### 4.4 Survival Horizon Analysis
- Time-series of cumulative net cash flows under stress
- Survival period = days until cumulative outflows exceed available liquidity
- Regulatory expectation: survive 30 days (LCR), ideally 90+ days

### 4.5 Contingency Funding Plan (CFP)
- Tiered response actions ranked by cost and availability
- Under stress: central bank facilities, asset sales, secured borrowing
- Model availability of each action under different stress severities

---

## 5. INTEGRATED/MULTI-RISK STRESS TESTING

### 5.1 Enterprise-Wide Stress
- Simultaneous stress across all risk types
- Capital adequacy = f(Credit_losses + Market_losses + Op_risk_losses - NII_impact)
- CET1 ratio path over stress horizon

### 5.2 Feedback Loops / Second-Round Effects
```
Round 1: Macro shock -> Credit losses + Market losses
Round 2: Losses -> Capital decline -> Rating downgrade -> Funding cost increase
Round 3: Higher funding costs -> More credit stress -> Additional losses
```
- Iterative amplification can increase losses by 20-50%
- Adoption: Emerging (regulators increasingly requiring)
- Complexity: Very High

### 5.3 Contagion Models
- **Eisenberg-Noe clearing model**: Network-based default cascades
- **DebtRank**: Centrality-based systemic risk measure
- **CoVaR**: VaR conditional on other institutions being stressed
- Adoption: Academic/central bank (less in commercial use)

### 5.4 Climate Risk (NGFS Scenarios)
Six scenarios across two dimensions:
- **Transition risk**: Policy changes, carbon pricing, technology shifts
- **Physical risk**: Acute (extreme weather) and chronic (sea level, temperature)
- Horizons: 2030, 2050, 2080
- Impact via PD multipliers by sector (high-carbon sectors most affected)

---

## 6. AI/ML-ENHANCED APPROACHES

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

## 7. HISTORICAL CRISIS CALIBRATIONS

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

# Part III — Modeling Addendum (Round 2)

## Basel 3.1 / Endgame Rule

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


\newpage

## Operational Risk Stress Testing

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


\newpage

## Vasicek Formula Bounds Checking

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

## Expected Shortfall Coverage

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

\newpage

## Scenario Propagation Framework

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


\newpage

## 2022 Bond Market / Rate Shock Calibration

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

## NGFS V4 Climate Scenario Update

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

## Concentration Risk Metrics

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

## Updated Reference List

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

