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

