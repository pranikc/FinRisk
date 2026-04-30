# STRESS TESTING RESEARCH CRITIQUE - ROUND 1
## Stress Testing Critic Agent Evaluation

---

## OVERALL ASSESSMENT: 6.5 / 10

**Justification**: The Round 1 research report provides a solid foundational survey of stress testing methodologies, covering the major regulatory frameworks (Basel, CCAR/DFAST, EBA, BoE), the three core risk types (credit, market, liquidity), and emerging AI/ML approaches. The historical crisis calibrations are accurate and well-organized, and the feature prioritization (P0/P1/P2) is a reasonable starting point.

However, the report has significant gaps in several critical areas: it omits the most consequential regulatory development of 2024 (Basel 3.1 Endgame re-proposal), lacks any treatment of operational risk stress testing, provides insufficient mathematical rigor for implementation, does not address the practical constraints of the existing React/Recharts architecture, and is entirely missing disclaimers, accessibility considerations, and mobile responsiveness planning. The AI/ML section cites papers from 2020-2022 while omitting more recent approaches (transformers, diffusion models, foundation models). For a document intended to guide implementation, the disconnect between the expansive 38-feature wishlist and the reality of a frontend-only synthetic-data application is a material concern.

---

## 1. CRITICAL GAPS (Must-Fix Issues)

### 1.1 Missing: Basel 3.1 / Endgame Rule

The single most important regulatory development since 2023 is entirely absent. The US federal banking agencies re-proposed the Basel III Endgame rule in September 2024, significantly reducing proposed capital increases (from ~19% to ~9% for the largest banks) and modifying the stress testing framework. Implementation is expected no earlier than 2026. This directly affects:
- How stress capital buffers are computed
- The interaction between CCAR stress tests and minimum capital requirements
- The transition from VaR to Expected Shortfall for market risk capital

**Action required**: Add a dedicated subsection under Section 1 covering Basel 3.1 Endgame status, timeline, and implications for stress testing methodology.

### 1.2 Missing: Operational Risk Stress Testing

The report covers credit, market, and liquidity risk stress testing in depth but has zero treatment of operational risk stress testing, despite operational risk representing 15-25% of Risk-Weighted Assets for most banks. The only mention is "Cyber Risk Stress Scenarios" as a P2 feature.

What should be covered:
- Basel III Standardized Measurement Approach (SMA) for operational risk
- DORA (Digital Operational Resilience Act) requirements effective January 2025 in the EU, mandating ICT risk stress testing and threat-led penetration testing
- The CrowdStrike global IT outage (July 2024) as a calibration event for operational/IT disruption scenarios
- Conduct risk and legal risk stress scenarios
- Third-party/fourth-party dependency stress

**Action required**: Add a new Section (between current Sections 4 and 5) on operational risk stress testing, and elevate Cyber Risk from P2 to P1 in the feature list.

### 1.3 Missing: Regulatory Disclaimers and Compliance Warnings

This is a critical legal/reputational gap. The research makes no mention of the disclaimers that MUST be displayed on any financial risk dashboard:

- "For illustrative/educational purposes only -- not intended for regulatory reporting"
- "Results based on synthetic data and simplified models"
- "Stress test outputs are model-dependent and subject to significant uncertainty"
- "Does not constitute financial advice"

Any dashboard displaying stress test results without such disclaimers creates material legal exposure.

**Action required**: Add a dedicated section on required disclaimers and limitations messaging, and make "Disclaimer Banner/Footer" a P0 feature.

### 1.4 Missing: Architecture and File Structure Proposal

The report proposes 38 features but provides no guidance on how they should be organized within the existing codebase. Looking at the current architecture:

```
src/
  App.jsx                         (simple useState routing)
  components/
    CreditRisk/CreditRiskView.jsx (single monolithic component)
    MarketRisk/MarketRiskView.jsx
    LiquidityRisk/LiquidityRiskView.jsx
    Layout/Sidebar.jsx
  data/
    syntheticData.js              (single 495-line data file)
```

This architecture cannot accommodate 38 new features without significant restructuring. The research report must address:
- Proposed component hierarchy for the StressTesting module
- State management strategy (the current `useState` in App.jsx will not scale)
- A computation/utility layer for stress calculations (currently nonexistent)
- Data file organization (the monolithic syntheticData.js is already large)

**Action required**: Add a Section 11 "Implementation Architecture" with proposed file structure, state management approach, and computation layer design.

### 1.5 Vasicek Formula Needs Bounds Checking

The Vasicek formula as presented:
```
PD_stressed = Phi((Phi^-1(PD_base) + sqrt(rho) * Phi^-1(stress_percentile)) / sqrt(1 - rho))
```

This is mathematically correct, but the implementation guidance must note:
- `Phi^-1(0)` and `Phi^-1(1)` are undefined (negative/positive infinity)
- PD_base must be bounded: `0 < PD_base < 1`
- stress_percentile must be bounded: `0 < stress_percentile < 1`
- rho must be bounded: `0 < rho < 1`
- JavaScript's floating-point precision can cause issues for very small PDs (e.g., 0.0001)
- Need to specify a JavaScript implementation of the Normal CDF inverse (e.g., Rational approximation by Peter Acklam, or use a library)

**Action required**: Add implementation notes with bounds checking, numerical stability warnings, and a specific JS library recommendation for the Normal CDF/inverse.

### 1.6 Missing: Expected Shortfall (ES) vs VaR Transition

The FRTB (Fundamental Review of the Trading Book) replaces VaR at 99% with Expected Shortfall at 97.5% as the primary market risk measure. This is arguably the most significant technical change in market risk stress testing in a decade. The report mentions FRTB in passing (Section 1.1, Section 3.5) but does not:
- Define Expected Shortfall mathematically
- Explain the VaR-to-ES transition and its implications
- Show how ES is computed under stressed conditions
- Note that the existing MarketRiskView displays VaR but should at minimum show ES alongside it

**Action required**: Expand Section 3 to include Expected Shortfall formulation, the regulatory transition from VaR to ES, and recommend ES as a key metric in the stress testing dashboard.

---

## 2. IMPORTANT SUGGESTIONS (Should-Address Improvements)

### 2.1 Recharts Visualization Constraints

The report recommends several visualization types that Recharts (the project's charting library) does not natively support:

| Recommended Viz | Recharts Support | Alternative |
|----------------|-----------------|-------------|
| Capital Waterfall | Possible via stacked bars with workaround | OK with custom work |
| Heat Map | NOT supported natively | Need visx, nivo, or custom CSS grid |
| Radar Chart | Supported | OK but radar charts are poor for precise comparison |
| Sankey Diagram | NOT supported | Need separate library (d3-sankey, recharts-sankey) |
| Network Graph | NOT supported | Need d3-force or vis.js |
| Transition Matrix | NOT supported as heatmap | Need custom CSS grid or canvas |

**Recommendation**: Either (a) explicitly constrain visualizations to what Recharts supports, or (b) recommend adding a supplementary visualization library (visx or nivo) and justify the added dependency. The current `package.json` has minimal dependencies, which is a strength worth preserving.

### 2.2 Replace Radar Chart with Tornado Chart

The report recommends radar charts for "multi-dimensional risk comparison." Radar charts are well-known in data visualization research to be difficult for users to interpret accurately (Cleveland & McGill, 1984). For stress testing, a **tornado chart** (horizontal bar chart showing factor contributions ranked by magnitude) is:
- More precise for comparing individual factor impacts
- Standard in the stress testing industry (used by Bloomberg, MSCI, Moody's)
- Trivially implementable in Recharts (horizontal BarChart)
- Better for answering the key question: "Which risk factor drives the most loss?"

**Recommendation**: Replace radar chart recommendation with tornado/butterfly chart for sensitivity and factor attribution analysis.

### 2.3 Severity Slider Non-Linearity

The proposed severity slider (Mild 25% / Moderate 50% / Severe 75% / Extreme 100%) implies a linear relationship between "severity" and risk factor shocks. In reality:
- A "50% severity" GFC does not produce half the losses of a "100% severity" GFC
- The relationship between macro variable stress and portfolio losses is highly non-linear (due to default thresholds, concentration effects, correlation breakdowns)
- Users may draw false conclusions from interpolated results

**Recommendation**: Use discrete severity levels with separately calibrated shock vectors for each level, rather than continuous interpolation. The slider can snap to discrete positions. Advanced users can override individual factors through the custom panel.

### 2.4 Data Consistency Across Stress Models

The report does not address how stressed outputs from one model feed into another. For example:
- Vasicek produces stressed PDs -> These must flow into ECL calculations
- Stressed PDs must be consistent with the stressed transition matrix
- Market risk stress (spread widening) should be consistent with credit stress (PD increase)
- Liquidity stress (deposit runoff) should be consistent with the credit/market scenario

In integrated stress testing, this consistency is critical. Without it, users see contradictory results across different dashboard tabs.

**Recommendation**: Add a section on "Scenario Consistency Framework" that defines how risk factor shocks propagate across all models, ensuring a single source of truth for each scenario.

### 2.5 IFRS 9 / CECL Stage Migration Mechanics

Section 2.5 mentions IFRS 9 stage migration but lacks the specificity needed for implementation:
- What triggers Stage 1 -> Stage 2 migration? (PD doubling? Absolute PD threshold? Rating downgrade?)
- How is "lifetime" defined for Stage 2 ECL? (Maturity of instrument? Behavioral life?)
- How does the probability-weighting of scenarios (50/30/20) interact with the stress scenario selected by the user?
- Is the provisioning impact additive to capital impact, or is it already captured?

**Recommendation**: Expand Section 2.5 with implementable trigger definitions, ECL calculation mechanics, and clarify how the probability-weighted approach interacts with deterministic stress scenario selection.

### 2.6 Missing Historical Calibration: 2022 Bond Market Crash

The report includes 2008 GFC, 2020 COVID, 2023 SVB, and several others, but omits the **2022 global bond market drawdown**, which was:
- The worst bond market loss in modern history (Bloomberg Agg -13%, 10Y UST total return -17%)
- Directly caused by aggressive rate hikes (Fed funds 0% -> 5.25% in 18 months)
- The proximate cause of the SVB failure in 2023
- A critical calibration for interest rate stress scenarios

Key calibration data that should be added:
| Risk Factor | 2022 Peak Stress |
|-------------|-----------------|
| 10Y UST Yield | +250bp (1.5% -> 4.0%) |
| 2Y UST Yield | +370bp (0.7% -> 4.4%) |
| Bloomberg Agg | -13% total return |
| 30Y Mortgage Rate | 3.0% -> 7.0% |
| IG Spreads | +60bp |
| HY Spreads | +250bp |
| S&P 500 | -25.4% |
| NASDAQ | -33.1% |

**Recommendation**: Add "2022 Rate Shock / Bond Bear Market" as a dedicated historical calibration in Section 7.

### 2.7 Performance and Memoization Strategy

With 38 features and potentially complex recalculations on every severity slider change, the report should address:
- Use of `useMemo` for expensive computations (Vasicek, ECL, matrix operations)
- Use of `useCallback` for event handlers passed to child components
- Potential use of Web Workers for any computation exceeding ~16ms (to avoid blocking the main thread)
- Debouncing for slider input changes (do not recompute on every pixel of slider movement)
- Lazy loading of feature components (React.lazy + Suspense) given the large feature count

**Recommendation**: Add performance guidelines to the architecture section.

### 2.8 NGFS Climate Scenario Update

The report references "NGFS Climate Scenarios (2020, updated 2023)" in the references. NGFS Version 4 was released in November 2023 with significant updates:
- Six scenarios refined (Current Policies, NDCs, Below 2C, Net Zero 2050, Delayed Transition, Fragmented World)
- Updated macro-economic and energy system projections
- Greater geographic granularity
- Integration of short-term physical risk shocks

**Recommendation**: Update Section 5.4 to reference NGFS v4 specifically and ensure the scenario descriptions match the latest framework.

---

## 3. MINOR OBSERVATIONS (Nice-to-Have Refinements)

### 3.1 Reference Currency and Geography

The report implicitly assumes a US-centric perspective (CCAR/DFAST emphasis, USD denomination, S&P 500 as equity benchmark). However, the institution in the synthetic data ("Atlantic Federal Bank") could plausibly operate internationally. Consider noting which scenarios are US-specific vs. globally applicable.

### 3.2 Sensitivity Formula Completeness

The Greeks-based P&L formula in Section 3.2:
```
Delta_P&L = DV01 * Delta_rates + CS01 * Delta_spreads + Delta * Delta_equity
           + Vega * Delta_vol + Gamma * (Delta_equity)^2 / 2 + ...
```
Should explicitly note that this is a simplified (first/second-order Taylor) approximation. Missing terms include theta (time decay), rho (interest rate sensitivity for options), and cross-gamma. For an educational dashboard this is acceptable, but the simplification should be stated.

### 3.3 LGD Stress Formula Oversimplification

The formula `LGD_stressed = LGD_base * (1 + stress_factor)` is a first-order approximation. Industry practice decomposes LGD stress into:
- Collateral value decline (haircut approach)
- Recovery rate decline (time-in-default lengthening)
- Cure rate reduction under stress
- Recovery cost increase

While the simplified formula is fine for the dashboard, noting the decomposition would add rigor.

### 3.4 Fire-Sale Haircut Table Sources

The fire-sale haircut ranges in Section 4.3 appear reasonable but are unsourced. These should reference specific publications (e.g., Cifuentes, Ferrucci & Shin 2005 for fire-sale dynamics; BCBS/FSB papers on haircut floors; or actual observed haircuts during the 2008 crisis).

### 3.5 Historical Simulation Complexity Rating

The "Low-Medium" complexity rating for Filtered Historical Simulation seems too low. Proper FHS requires: (a) selecting an appropriate stress window, (b) volatility rescaling using GARCH or similar, (c) mapping current portfolio to historical risk factors, (d) handling missing data/structural changes. "Medium" would be more accurate.

### 3.6 Color Accessibility

The existing dashboard uses red/green extensively for positive/negative indicators. This is inaccessible to the ~8% of males with color vision deficiency. The research should recommend:
- Using a colorblind-safe palette (e.g., blue/orange instead of green/red)
- Adding icons or patterns in addition to color
- Testing with a color blindness simulator

### 3.7 Dark Mode Consistency

The existing application uses a dark theme (slate-950 background). New stress testing visualizations must maintain this theme consistently, including chart backgrounds, tooltip styles, and text colors. This should be noted as a design constraint.

### 3.8 Existing Stress Test Data Integration

The current `syntheticData.js` already contains basic stress test data (`stressScenarios` array with 6 scenarios and `liquidityStressScenarios`). The report should explicitly reference this existing data and describe how the new stress testing feature builds upon / replaces / extends it rather than starting from scratch.

---

## 4. SPECIFIC QUESTIONS FOR THE RESEARCH AGENT

### Q1: Computation Boundary
What is the intended computation boundary? Specifically, should all stress calculations happen in the browser (JavaScript), or should the architecture plan for a future backend? This fundamentally affects whether Monte Carlo simulation is feasible or if we must use analytical/closed-form approaches only.

### Q2: Scenario Granularity
For the 9+ pre-built scenarios in the Scenario Library (P0 feature #2), what exact risk factors should each scenario specify? The 2008 GFC calibration in Section 7.1 lists 11 risk factors. Should all scenarios have this same granularity, or can some scenarios focus on a subset (e.g., interest rate scenarios only specifying rate factors)?

### Q3: Multi-Period vs. Point-in-Time
Is the primary use case a point-in-time stress test (instantaneous shock) or a multi-period projection (e.g., 9 quarters for CCAR)? These require fundamentally different computation approaches. Point-in-time is much simpler to implement. Multi-period projection is P1 feature #2, but some P0 features (Capital Impact Waterfall, Survival Horizon) could be interpreted either way.

### Q4: Feature Interconnection
How should the new Stress Testing view interact with the existing Credit Risk, Market Risk, and Liquidity Risk views? Options:
- (a) Completely standalone view with its own visualizations
- (b) Stress Testing view sets scenario, then existing views show stressed results
- (c) Each existing view gets an inline "stress this view" toggle
The answer significantly affects architecture.

### Q5: Custom Scenario Limits
For the Custom Scenario Builder (P1 feature #10), what limits should be placed on user inputs? Can a user set a -99% equity decline? A +5000bp rate shock? Negative interest rates? Unconstrained inputs could produce nonsensical results or numerical errors.

### Q6: IFRS 9 vs. CECL
The report references "IFRS 9 / CECL" together. These are different frameworks (IFRS 9 is international, CECL/ASC 326 is US GAAP). The synthetic institution "Atlantic Federal Bank" appears US-based, suggesting CECL is the applicable standard. Should the implementation target CECL, IFRS 9, or both? This affects stage migration logic and ECL computation.

### Q7: Existing Agent Integration
The codebase already has a "Stress Architect" AI agent defined in the synthetic data. How should the stress testing dashboard integrate with or reference this agent? Should the agent appear to "generate" scenarios dynamically, or is it purely decorative?

---

## 5. RECOMMENDED ADDITIONS

### 5.1 Add: State Management Layer

**Priority**: P0 (required for implementation)

The stress testing feature requires shared state across components:
- Selected scenario and severity level
- Computed stress results (stressed PDs, stressed LCR, stressed VaR, etc.)
- User customizations and overrides

Recommended approach: Create a `StressTestContext` using React Context + useReducer, or adopt zustand (lightweight, ~1KB) for more complex state. This context should be provided at the App level so that stress results can optionally flow into other views.

```
src/
  contexts/
    StressTestContext.jsx    (scenario selection, severity, computed results)
```

### 5.2 Add: Computation Engine Layer

**Priority**: P0 (required for implementation)

Create a dedicated computation layer separate from UI components:

```
src/
  engines/
    vasicekEngine.js         (PD stress calculation, normal CDF/inverse)
    creditStressEngine.js    (transition matrix stress, ECL, LGD stress)
    marketStressEngine.js    (sensitivity P&L, VaR/ES stress, curve scenarios)
    liquidityStressEngine.js (LCR stress, deposit runoff, survival horizon)
    scenarioEngine.js        (scenario interpolation, consistency checks)
  utils/
    mathUtils.js             (normal CDF, inverse normal, matrix operations)
    validationUtils.js       (input bounds checking, numerical stability)
```

These should be pure functions with no React dependencies, making them testable and reusable.

### 5.3 Add: Scenario Data Structure Specification

**Priority**: P0

Define the exact TypeScript-style interface for a stress scenario:

```javascript
// Proposed scenario data structure
const scenario = {
  id: 'gfc-2008',
  name: '2008 Global Financial Crisis',
  category: 'historical',           // historical | hypothetical | regulatory | ai-generated
  regulatoryMapping: ['CCAR-SA'],   // which regulatory frameworks this maps to
  description: '...',

  // Severity-specific calibrations (not interpolated)
  severityLevels: {
    mild:     { equity: -0.15, igSpread: 100, hySpread: 300, rates10y: -50,  gdp: -1.0, unemployment: +1.5, hpi: -8,  vix: 35 },
    moderate: { equity: -0.30, igSpread: 200, hySpread: 700, rates10y: -100, gdp: -2.5, unemployment: +3.0, hpi: -15, vix: 50 },
    severe:   { equity: -0.45, igSpread: 350, hySpread: 1200, rates10y: -175, gdp: -3.5, unemployment: +4.5, hpi: -22, vix: 65 },
    extreme:  { equity: -0.568, igSpread: 400, hySpread: 1500, rates10y: -200, gdp: -4.3, unemployment: +5.0, hpi: -27, vix: 81 },
  },

  // Metadata
  historicalPeriod: '2007-09 to 2009-03',
  peakStressDate: '2009-03-09',
  source: 'Federal Reserve, Bloomberg',
};
```

### 5.4 Add: Operational Risk Stress Section

**Priority**: High

New section covering:
- Basel SMA for operational risk capital
- DORA ICT risk stress testing requirements
- Scenario types: cyber attack, IT outage, fraud, legal/conduct, third-party failure
- Calibration from CrowdStrike 2024 outage: estimated $5.4B in direct losses to Fortune 500 companies
- Key metrics: operational loss under stress, business continuity duration, recovery time objective

### 5.5 Add: Expected Shortfall Section

**Priority**: High

Add to Section 3 (Market Risk):
```
ES_alpha = E[X | X > VaR_alpha]
```
Where alpha = 97.5% under FRTB. Expected Shortfall captures tail risk beyond VaR and is the new regulatory standard. The dashboard should display ES alongside VaR for forward-compatibility with FRTB.

### 5.6 Add: Concentration Risk Metrics

**Priority**: Medium

Missing from the credit risk section:
- Herfindahl-Hirschman Index (HHI) for portfolio concentration
- Granularity Adjustment (GA) to the Vasicek model for name concentration
- Single-name and sector concentration stress tests
- These are directly relevant given the existing synthetic data shows CRE concentration at 312% of Tier 1 (already flagged as a critical alert)

### 5.7 Add: Export and Reporting Considerations

**Priority**: Medium

The Stress Test Report Generator is listed as P1 but has no specification:
- What format? PDF? CSV? Both?
- What content should be included? (Summary metrics, charts as images, detailed tables)
- Should reports be regulatory-formatted? (CCAR format, EBA common reporting)
- Client-side PDF generation libraries: jsPDF, react-pdf, html2canvas + jsPDF
- This should at minimum be specified so it does not become a blocked task during implementation

### 5.8 Add: Testing Strategy

**Priority**: Medium

Given the mathematical nature of stress calculations, the report should recommend:
- Unit tests for all computation engine functions (Vasicek PD matches known values, LCR calculations are correct)
- Snapshot tests for scenario calibrations (ensure calibration data does not drift)
- Visual regression tests for chart components
- The project currently has NO test dependencies in package.json, so this is a net-new capability

---

## 6. PRIORITIZATION CRITIQUE

### Features That Should Be Elevated

| Feature | Current Priority | Recommended Priority | Rationale |
|---------|-----------------|---------------------|-----------|
| Disclaimer/Limitations Banner | Not listed | P0 | Legal/compliance requirement |
| Cyber/Op Risk Scenarios | P2 | P1 | DORA effective Jan 2025, CrowdStrike precedent |
| FRTB-Aligned Stress (ES) | P2 | P1 | Regulatory transition already underway |
| Stress Test Backtesting | P2 | P1 | Essential for model credibility |

### Features That Should Be Demoted

| Feature | Current Priority | Recommended Priority | Rationale |
|---------|-----------------|---------------------|-----------|
| AI Scenario Generator | P2 | P3/Cut | Not feasible client-side, requires ML backend |
| RL-Based Optimal Response | P2 | P3/Cut | Not feasible client-side, research-stage only |
| ML-Enhanced PD Models | P2 | P3/Cut | Not feasible client-side |
| Real-Time Scenario Monitoring | P2 | P3/Cut | Not feasible without data feeds |
| Counterparty Stress / CVA | P1 | P2 | Complex calculation, limited synthetic data |
| Integrated Stress with Feedback Loops | P1 | P2 (simplified version at P1) | Very high complexity, risk of incorrect implementation |

### Quick Wins Not Listed

1. **Stress scenario indicator on existing views**: Add a small "Under Stress" badge to the existing Credit/Market/Liquidity views when a stress scenario is active. Low effort, high integration value.
2. **Tooltip glossary**: Add a hover tooltip on technical terms (VaR, LCR, PD, LGD) throughout all views. Improves usability immediately.
3. **Scenario URL sharing**: Encode the selected scenario + severity in the URL hash so users can share a specific stress view. Easy with `useSearchParams` or simple hash routing.
4. **Dark/light mode toggle**: The app is dark-only. Adding a light mode toggle (already standard in Tailwind) improves accessibility and user preference. This is a quick win that benefits all views.

---

## 7. SUMMARY OF REQUIRED ACTIONS (Priority Order)

1. **[CRITICAL]** Add regulatory disclaimers section and make disclaimer banner P0
2. **[CRITICAL]** Add Basel 3.1 Endgame coverage with current status and timeline
3. **[CRITICAL]** Add implementation architecture section (file structure, state management, computation layer)
4. **[HIGH]** Add operational risk stress testing section with DORA/CrowdStrike
5. **[HIGH]** Add Expected Shortfall formulation and VaR-to-ES transition
6. **[HIGH]** Add 2022 Bond Market / Rate Shock as historical calibration
7. **[HIGH]** Document Recharts visualization constraints and library limitations
8. **[HIGH]** Specify scenario data structure for implementation
9. **[MEDIUM]** Add data consistency / scenario propagation framework
10. **[MEDIUM]** Add numerical stability and bounds-checking notes for all formulas
11. **[MEDIUM]** Expand IFRS 9/CECL section with implementable trigger definitions
12. **[MEDIUM]** Update NGFS to Version 4 framework
13. **[MEDIUM]** Add performance/memoization guidelines
14. **[MEDIUM]** Address mobile responsiveness and accessibility
15. **[LOW]** Re-evaluate radar chart recommendation (prefer tornado chart)
16. **[LOW]** Add fire-sale haircut table sources
17. **[LOW]** Reference existing stressScenarios data in syntheticData.js
18. **[LOW]** Update AI/ML section with 2023-2025 approaches (transformers, diffusion models, GNNs)

---

*Critique prepared by Stress Testing Critic Agent*
*Date: 2026-03-04*
*Codebase analyzed: FinRisk AI v0.0.0 (React 18 + Vite + Tailwind CSS 4 + Recharts 3)*
*Note: Web search verification was unavailable during this evaluation. Regulatory updates are based on knowledge through early 2025 and should be independently verified for developments after that date.*
