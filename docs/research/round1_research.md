# STRESS TESTING RESEARCH REPORT - ROUND 1
## FinRisk AI Platform - Stress Testing Dashboard

---

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

## 8. UX DESIGN RECOMMENDATIONS

### 8.1 Severity Parameterization
**Recommended: Named scenario + severity slider + custom override**
- Primary: Dropdown (scenario name) + Slider (Mild 25% / Moderate 50% / Severe 75% / Extreme 100%)
- Advanced: Individual risk factor override panel
- Expert: Full macro-variable custom scenario builder

### 8.2 Key Visualizations
1. **Capital Waterfall**: Base CET1 -> losses by type -> Stressed CET1
2. **Heat Map**: Scenario x metric impact matrix
3. **Radar Chart**: Multi-dimensional risk comparison
4. **Time Series Projection**: Capital ratio over 9 quarters
5. **Sankey Diagram**: Loss flow attribution
6. **Scenario Comparison Table**: Side-by-side metrics

### 8.3 Leading Platform Patterns
- Bloomberg PORT: Factor-based with scenario library + custom builder
- MSCI BarraOne: Macro-factor linkages + climate scenarios
- Moody's: Credit-focused with ECL stress + migration matrices
- Common: Pre-built library + comparison view + drill-down capability

---

## 9. RECOMMENDED FEATURE LIST

### P0: MUST-HAVE (14 features)
1. Dedicated Stress Testing View (new nav item)
2. Scenario Library (9+ pre-built scenarios with full calibrations)
3. Scenario Selector with Severity Slider
4. Capital Impact Waterfall Chart
5. Scenario Comparison Table
6. Credit Stress Parameters (PD/LGD/EAD stress via Vasicek)
7. Yield Curve Scenario Builder (6 IRRBB scenarios)
8. LCR/NSFR Under Stress
9. Survival Horizon Chart
10. P&L Attribution Under Stress
11. Regulatory Scenario Mapping (CCAR/EBA/PRA tags)
12. Stressed Transition Matrix
13. Sector Concentration Stress Heat Map
14. Historical Scenario Replay

### P1: SHOULD-HAVE (12 features)
1. Reverse Stress Testing ("What breaks us?")
2. Multi-Period Stress Projection (9 quarters)
3. IFRS 9 / ECL Stress (Stage migration)
4. Correlation Stress Dashboard
5. Deposit Run-Off Simulator
6. Fire-Sale Haircut Model
7. Integrated Stress with Feedback Loops
8. Climate Risk Scenarios (NGFS)
9. Counterparty Stress / CVA
10. Custom Scenario Builder
11. Stress Test Report Generator
12. Contingency Funding Plan Test

### P2: NICE-TO-HAVE (12 features)
1. AI Scenario Generator (GAN/VAE)
2. Network Contagion Visualizer
3. Explainable Stress Results (XAI/SHAP)
4. Real-Time Scenario Monitoring
5. Cyber Risk Stress Scenarios
6. Geopolitical Risk Dashboard
7. FRTB-Aligned Stress
8. Cross-Currency Liquidity Stress
9. ML-Enhanced PD Models
10. Pandemic Scenario Template
11. RL-Based Optimal Response
12. Stress Test Backtesting

---

## 10. KEY REFERENCES
1. BCBS 328 - Stress testing principles (2018)
2. BCBS d424 - Basel III finalising reforms (2017)
3. BCBS 368 - IRRBB (2016)
4. 12 CFR Part 225 - US CCAR/DFAST
5. EBA GL/2018/04 - Stress testing guidelines
6. Vasicek (2002) - Distribution of Loan Portfolio Value
7. Gordy (2003) - Risk-Factor Model Foundation
8. CreditMetrics (1997) - J.P. Morgan
9. Merton (1974) - Corporate Debt Pricing
10. Brunnermeier & Pedersen (2009) - Market & Funding Liquidity
11. Eisenberg & Noe (2001) - Systemic Risk
12. NGFS Climate Scenarios (2020, updated 2023)
13. Wiese et al. (2020) - Quant GANs
14. Cont & Xu (2022) - Tail-GAN
15. Lundberg & Lee (2017) - SHAP
