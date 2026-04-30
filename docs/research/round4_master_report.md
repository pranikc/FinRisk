# FinRisk — Master Reference Document

**Version:** Round 4 Consolidated | **Date:** 2026-04-23 | **Author:** AI/ML Technical Architect (a1f6c616bc1523fb6 thread)
**Audience:** Pranik Chainani (founder), incoming co-founder, pre-seed investors, prospective advisors
**Supersedes:** Rounds 1–3 (preserved at `/Users/pranikchainani/FinRisk/docs/research/round{1,2,3}_*.md`)

---

## TL;DR — WHAT TO DO MONDAY MORNING (Mon 2026-04-27 through Fri 2026-05-01)

**This is the single most important section of this document. Five actions, five days, in order. Nothing else starts until these are in motion.**

| Day | Owner | P0 Action | Success Criterion by EOD |
|---|---|---|---|
| **Mon 04-27** | Pranik | **File Delaware C-corp via Stripe Atlas** ($500). Captable: Pranik + central banker co-founder, 83(b) elections prepped. | Atlas filing submitted. EIN expected ~Wed; Mercury bank account expected ~Fri. **Cannot sign any DUA or LOI without entity.** |
| **Mon 04-27** | Central banker | **Ethics/compliance call to prior employer** (Fed / OCC / foreign CB / multilateral / private). Confirm post-employment restrictions on outreach to US banks. Get it in writing (email is fine). | Written confirmation of (a) which institutions are restricted, (b) cooling-off end date, (c) whether co-founder can co-sign outreach vs. stay off emails. **Gate for Day-3 outreach.** |
| **Tue 04-28** | Both | **Register for ABA Risk & Compliance Conference, Charlotte, May 5–7**. Attendee passes (~$2K each), flights, hotel. Budget $6–8K. Book tonight — 9 days out. | Confirmations in inbox, calendar blocked. |
| **Wed 04-29** | Both (4-hour timebox together) | **Warm-intro brainstorm + LinkedIn Sales Nav setup.** Enumerate: (a) Yale SOM alumni at the 40 named banks, (b) central banker's former regulator colleagues who moved to industry, (c) Skyrun LPs/advisors who can intro to any Tier-1 target. Send warm-intro asks BEFORE any cold email goes out. Provision 2 Sales Nav seats ($360/mo). | Named list of ≥15 warm-intro candidates with specific asks drafted. At least 5 asks sent. |
| **Thu 04-30** | Pranik | **Cloud control-plane bootstrap on $25K Skyrun credits:** AWS Organizations account skeleton, Terraform module scaffolding, Cloudflare Workers project for marketing-site + auth proxy, Sentry/PostHog free tiers. No data plane yet. | Empty but reproducible IaC. Cost through end of week <$50. |
| **Fri 05-01** | Central banker | **Whitepaper v0 outline:** "Mid-Market Bank Stress Testing Beyond DFAST — Why $10B–$50B Banks Need a New Playbook." Target 15–20 pages for publication Week 6. | Section headers + primary-source citation list locked. |

**IF the ethics call on Mon produces a restriction that blocks central banker from outreach to US supervised banks, the plan still works:** Pranik fronts outreach (his name on emails, his LinkedIn, Yale affiliation of co-founder disclosed as "my co-founder, a former {institution} central banker who for compliance reasons is not corresponding until {date}"). Central banker focuses on whitepaper, model work, and conference booth conversations (which are one-off and generally permitted). **Do not let this case paralyze Week 2 outreach.**

---

## 1. Executive Summary

**What FinRisk is.** A unified risk-analytics + advisory platform for US banks in the $10B–$50B asset tier, combining stress testing, credit-risk challenger models, and treasury/ALM (IRRBB, EVE, NII, LCR, NSFR, deposit behavior) in one BYOC-deployed product. Positioned as an **advisory/challenger system** — not the bank's "model of record" — which sidesteps SR 11-7 Tier-1 validation in year one while still producing regulator-grade documentation the bank can cite.

**Who it serves.** ~70 named US commercial and regional banks in the $10B–$50B range (Category IV under the tailored prudential framework, plus the threshold-crossers approaching $10B CFPB oversight or $50B EPS). Buying committee: **CRO (economic buyer), Treasurer (champion), Head of Model Risk (gatekeeper), CFO (approver)**. Secondary market: large credit unions ($5B+) that use NCUA 5300 filings.

**The wedge.** Three differentiators against DCG (Darling Consulting), Empyrean, Moody's/OneSumX, SAS, and Abrigo:
1. **Cross-risk unification** — stress + credit + liquidity + IRRBB in one model graph, not three siloed tools.
2. **SR 11-7 explainability + narrative automation** — every output ships with a challenger-model document, SHAP attribution, scenario lineage, and a draft ALCO/BoD memo. Cuts 40–100 hours of model-risk-team writing per quarter.
3. **Post-SVB real-time cross-risk alerting** — a $44B unrealized-HTM-loss-at-SVB style scenario triggers liquidity, capital, and IRRBB alerts together, not in three different dashboards.

**The 20-week plan.** Week 1: entity + ethics. Week 2: ABA Charlotte. Weeks 3–6: whitepaper, first 5 discovery calls, real Vasicek calibration on Fannie/Freddie public performance data, IRRBB EVE/NII engine, ALCO pack generator. Weeks 7–12: 10 more discovery calls, 3 LOI/design-partner targets, SOC 2 Type I self-attestation, SR 11-7 doc-generator v1. Weeks 13–20: 1–2 signed design partners, BYOC Terraform module shippable, pre-seed raise close. **Gates at Weeks 4 / 12 / 20.**

**3–5yr exit thesis.** Primary: strategic tuck-in to Moody's Analytics, Wolters Kluwer, S&P, or Abrigo at $10–40M ARR, **5–10× ARR** ($50–400M). Moonshot: PE roll-up à la Thoma Bravo → Nasdaq, **Adenza precedent: $10.5B sale to Nasdaq in 2023 at ~17.8× revenue**. The benchmarking-data clause in every customer DUA (see §5) is what unlocks the Moody's-style strategic value: FinRisk becomes a data business as well as a software business.

**Pre-seed ask.** **$1.25M on $7M post-money SAFE, 20% discount, MFN, ~17.8% dilution.** Target closers: QED (Fontes), Nyca Partners, Fin Capital, Better Tomorrow Ventures. Angel stack: former execs at nCino, Alloy, Verafin, Feedzai, Plaid, Green Dot. Runway target: 14 months to reach Series A inflection (≥2 signed design partners at $150–300K ACV, SOC 2 Type I complete, SOC 2 Type II in-process, whitepaper with ≥2K qualified CRO downloads, regulator advisory-desk ack).

**Pre-seed budget envelope.** $1.25M raise + $25K Skyrun credits + any existing founder runway. Allocation: ~55% founder comp (2 people × 14 months at $45K/mo blended), ~15% data & SaaS (LinkedIn Sales Nav $4.5K, Deel, Mercury, Stripe Atlas, Sentry paid tier when needed, SOC 2 auditor $20–30K), ~10% cloud (Skyrun credits absorb most of this), ~10% conferences/travel ($50K across 18 months, 8–10 events), ~10% contingency.

---

## 2. The Problem & Market

**Why $10B–$50B US banks need a new stress-testing + ALM platform.**

The $10B–$50B segment lives in a regulatory no-man's-land. They are:
- **Too big for spreadsheets.** Once a bank crosses $10B, CFPB oversight kicks in, Durbin hits debit interchange revenue, and the Fed expects formal model risk management under **SR 11-7**.
- **Too small for CCAR.** The 2019 tailored prudential framework exempts banks under $100B from DFAST submission, but they still run internal ICAAP and their Board Risk Committee demands stress-test output on a cadence that matches the CCAR majors.
- **Too constrained for enterprise software.** A $20B-asset bank's risk-tech budget is $2–5M/yr across all vendors. Moody's enterprise bundles start at $1M/yr for one module; OneSumX requires a $5M+ implementation. SAS is priced for Category III banks. FIS Ambit and Oracle OFSAA are aircraft carriers.
- **Over-served on one side, under-served on the other.** DCG and Empyrean dominate ALM (IRRBB / EVE / NII / liquidity). Moody's / S&P CreditPro dominate credit risk. **Nobody unifies them cost-effectively for the mid-market**, and nobody ships SR 11-7 documentation as a first-class product.

**Post-SVB / post-NYCB market pull.**

Silicon Valley Bank (March 2023) was the mid-market stress-testing wake-up call. The bank had a clean DFAST submission not required of it, ran treasury/ALM separately from its credit book, and missed a $17B HTM unrealized-loss liquidity-triggered-by-depositor-behavior cross-risk scenario that a unified engine would have flagged. New York Community Bank (Q1 2024) repeated the pattern with CRE concentration in a rising-rate environment. Silvergate, Signature, First Republic are parallel stories.

Regulators noticed. The OCC, Fed, and FDIC have since increased scrutiny on:
- **HTM/AFS classification and unrealized-loss stress** (new interagency guidance on AOCI impact)
- **Deposit behavioral modeling** (non-maturity deposit decay, flight risk, beta asymmetry)
- **CRE concentration stress** (office, multifamily, rate-shock interactions)
- **Interest-rate risk in the banking book (IRRBB)** — FRB SR 96-13 still governs but Basel EVE/NII standards are de facto expected

Every one of these is a FinRisk wedge.

**Incumbent weaknesses.**

| Incumbent | What they do well | Where they lose | FinRisk wedge |
|---|---|---|---|
| **DCG (Darling Consulting)** | ALM / IRRBB / liquidity / deposit studies. Deep mid-market relationships. | Excel- and consultant-heavy. No unified platform. Limited credit-risk coverage. Weak on AI/ML explainability. | Platform not consulting; unify ALM + credit + stress; SR 11-7 doc as software output. |
| **Empyrean** | Depository ALM, IRRBB, budget. Strong community/regional book. | Similar ALM silo; credit-risk integration weak; UX dated. | Modern cloud-native BYOC, cross-risk single model graph. |
| **Moody's Analytics (RiskCalc, CreditEdge, ImpairmentStudio, Scenario Studio)** | Credit risk depth, data moat, regulatory credibility. | Expensive, enterprise-first. Long implementations. Fragmented SKUs. | Mid-market price point; unified rather than SKU-per-risk; faster deployment. |
| **Wolters Kluwer OneSumX** | Regulatory reporting breadth. Compliance stack. | Heavy implementation. Enterprise-only. | Advisory-first, not a reporting engine. |
| **SAS Risk Management** | Statistical rigor, model-risk pedigree. | Licensing cost, SAS language lock-in, modernization slow. | Python-native, open-source stack, SHAP/LIME in every output. |
| **FIS Ambit / Oracle OFSAA** | Large-bank end-to-end. | Too heavy for $10–50B. Implementation > software cost. | Right-sized for mid-market. |
| **Abrigo (Sageworks + MainStreet + Bankers Toolbox)** | CECL/BSA/AML, community-bank distribution. | Credit-focused; limited stress-testing rigor; no cross-risk. | Complement at first, competitor at $20B+. |
| **Zest AI, Upstart, Scienaptic** | ML credit scoring. | Consumer credit origination, not bank-wide risk. | Different product — we're risk management, not origination. |

**Sizing.** ~70 US banks fit $10B–$50B as of 2026-04-23 (see §9 appendix for the named list). At a realistic $100–300K blended ACV and 10–15% penetration within 3 years, that's **$0.7–3.2M ARR from the primary segment.** Extension to $5B–$10B community banks (~200 institutions, $25–75K ACV) and $50B–$100B Category IV banks (~20 institutions, $400–800K ACV) gets to a credible **$5–20M ARR three-year trajectory**, which is the tuck-in exit envelope.

---

## 3. The Product

### 3.1 What FinRisk does today (as of 2026-04-23)

A React 18 + Vite + Tailwind v4 + Recharts single-page app at `/Users/pranikchainani/FinRisk/` running entirely client-side. Simulated institution "Atlantic Federal Bank" ($48.7B assets). **What is real math vs. what is mocked is documented in memory** — the key points:

**Real:**
- `src/engines/vasicekEngine.js` — single-factor Vasicek conditional-PD with the Basel IRB asset-correlation curve. This is the actual BCBS-approved formula, not a placeholder.
- `src/engines/mathUtils.js` — Acklam algorithm for the normal inverse CDF, Abramowitz & Stegun for the normal CDF. Numerically correct.
- `src/engines/liquidityStressEngine.js` — LCR / NSFR / survival-days arithmetic per Basel III definitions.
- `src/data/stressScenarioLibrary.js` — **9 scenarios × 4 severities × 21 risk factors**, hand-calibrated. Library covers GFC-2008, COVID-2020, 2022 rate-shock, CCAR Severely Adverse 2026, NGFS climate (orderly / disorderly / hot-house), SVB-2023 re-play, generic CRE stress.

**Mocked:** portfolio composition, rating distribution, sector exposures, P&L history, alerts, AI-agent activity logs. All from `src/data/syntheticData.js` using `Math.random()` and Box-Muller transforms. No fitted models. No backtests. No real loans. No market-data feeds.

The UI layer is **good enough to demo to a CRO and not embarrassing.** The models layer is the wedge to build.

### 3.2 What FinRisk will do by end of 20-week plan (Week 20 = 2026-09-10)

1. **Real Vasicek calibration** on Fannie Mae / Freddie Mac single-family loan performance data (public, free). PD curve backtested on 2006–2023 vintage performance. Produces a defensible challenger PD for any US bank's residential mortgage book.
2. **IRRBB EVE / NII sensitivity engine** with the six Basel standardized shocks (parallel up, parallel down, short up, short down, steepener, flattener) plus custom shock definition. Outputs EVE duration gap, NII earnings-at-risk over 12m/24m horizons.
3. **Deposit behavioral model** — non-maturity deposit decay curves calibrated on FFIEC Call Report Schedule RC-E trends at peer-group level, with beta asymmetry and rate-cycle elasticity.
4. **ALCO pack generator** — one-click PDF output covering IRRBB position, EVE/NII under six shocks, LCR/NSFR forecast, deposit betas, stress-scenario comparison, peer benchmarking (contingent on design partner #1 being live). Saves a treasurer 40–60 hours/quarter.
5. **SR 11-7 model documentation generator** — for every scenario run, produce a draft model risk documentation package: inputs, assumptions, methodology, limitations, sensitivity, benchmark, validation. Bank's MRM team edits and signs off rather than writes from scratch.
6. **Challenger PD on CRE and C&I** — via FFIEC call report loss rate data at peer-group level, constrained ridge regression PD model with SHAP explanation.

### 3.3 What FinRisk deliberately does NOT do (v1)

- **No funds transfer pricing (FTP).** Empyrean and DCG own this. Adjacent, not core.
- **No "decision of record."** FinRisk is advisory/challenger. Bank's existing governance signs off.
- **No FRTB internal models approach (IMA).** Standardized approach (SA) only. IMA is a 24-month build and a Category I/II conversation.
- **No consumer credit bureau scoring.** FICO and VantageScore own this. Bank-of-record data, not ours.
- **No BSA/AML/KYC.** Abrigo, NICE Actimize, Verafin, ComplyAdvantage own this. Separate market.
- **No balance-sheet budgeting/planning software.** Kaufman Hall and Syntellis own this.
- **No non-US banks.** Geography locked US-only until post-Series-A or post-$5M ARR.

**Why the no-list matters.** Every "no" is 6 months of engineering saved and 6 conversations with CROs that end in "that's not what we're buying." Discipline on scope is the pre-seed founder's only superpower.

---

## 4. Competitive Landscape & Positioning

The full incumbent map lives in `/Users/pranikchainani/FinRisk/docs/competitive-landscape-report.md` and is summarized in §2. The positioning question is: **in which "lane" does FinRisk sell?**

### 4.1 The three lanes

| Lane | Who owns it | FinRisk fit |
|---|---|---|
| **Decision-of-record** | Moody's RiskCalc, SAS, SS&C Algorithmics, Numerix. Model bank books the bank's official PD / VaR / EVE from. Requires full SR 11-7 Tier-1 validation. 18–36 month implementations. | **No. Pre-seed cannot carry Tier-1 validation.** |
| **Co-pilot / workbench** | Python notebook vendors (Anaconda Enterprise, Deepnote), risk-notebook players. Model quant team works in FinRisk but outputs still flow through bank's own model-of-record. | **Maybe Phase 2.** Requires deep SDK and notebook integration. |
| **Advisory / challenger** | DCG on consulting side. Moody's Scenario Studio partially. No pure-play software vendor. | **YES. This is FinRisk's v1 lane.** |

**Advisory/challenger** means: FinRisk produces scenario runs, challenger PDs, challenger EVE/NII, peer benchmarks, and regulator-grade model documentation. The bank's MRM team uses FinRisk output as a challenger to its internal models, as required by SR 11-7 §V.A ("effective challenge"). FinRisk is cited in the bank's model inventory as a challenger/benchmark system, not as a model of record. This requires **Tier-2 or Tier-3 SR 11-7 documentation** (lighter than Tier-1), which is achievable in the 20-week plan.

### 4.2 The three wedges (restated for crispness)

1. **Mid-market unified cross-risk.** No incumbent ships stress + credit + liquidity + IRRBB in one model graph at mid-market pricing.
2. **SR 11-7 explainability + narrative automation.** Every run produces a model documentation package. SHAP attribution on every PD. Scenario lineage graph. Draft ALCO/BoD memo. This is where FinRisk saves a customer 40–100 hours/quarter.
3. **Post-SVB real-time cross-risk alerting.** A scenario that moves AFS prices by X also moves deposit beta and LCR — FinRisk alerts on the triad together. Incumbents alert on each in isolation.

---

## 5. Data Strategy

### 5.1 Phase 0/1 — free-tier sources (first 20 weeks)

| Source | URL | What we use it for | License/terms |
|---|---|---|---|
| **FFIEC Call Reports (FFIEC 031/041)** | ffiec.gov/npw/ , cdr.ffiec.gov | Bank-level balance sheet, loss rates, deposits, capital. Quarterly. Peer-group construction. | Public domain. |
| **FRED** | fred.stlouisfed.org | Macro factors, rates, HPI, unemployment, BBB spread, VIX-equivalents. | CC-BY. |
| **FHFA House Price Index** | fhfa.gov/DataTools | Regional residential real estate stress. Quarterly, MSA-level. | Public. |
| **NCUA 5300** | ncua.gov/analysis/credit-union-corporate-call-report-data | Credit union analogue of Call Reports. Enables CU outreach. | Public. |
| **SEC EDGAR** | sec.gov/edgar | 10-K/10-Q for public bank holding companies. Management commentary on risk. | Public. |
| **FR Y-9C / FR Y-14** | federalreserve.gov/apps/mdrm , nic.org | Holding company reports; Y-14 schedules partially public (CCAR disclosures). | Public for disclosed portions. |
| **Fannie Mae Single-Family Loan Performance Data** | capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/fannie-mae-single-family-loan-performance-data | Origination + monthly performance on ~50M mortgages 2000–present. **Gold standard free dataset for PD calibration.** | Free. Registration required. |
| **Freddie Mac Single-Family Loan-Level Dataset** | freddiemac.com/research/datasets/sf_loanlevel_dataset | Same as above for Freddie. | Free. Registration required. |
| **FDIC SDI (Statistics on Depository Institutions)** | banks.data.fdic.gov | Bank-level time series, enforcement actions, failures. | Public. |
| **BLS** | bls.gov | Unemployment, CPI — macro overlay. | Public. |
| **NGFS Climate Scenarios** | ngfs.net/ngfs-scenarios-portal | Climate scenario data for climate-risk module. | Free for non-commercial research; commercial use check. |

**Phase 0/1 data budget: $0.** Everything above is free. This is viable through Week 20 and into first paying customer.

### 5.2 Seed / Series-A unlock list

| Source | Estimated annual cost | What it unlocks | When to buy |
|---|---|---|---|
| **Moody's DRD (Default and Recovery Database)** | $50–150K/yr | Best-in-class PD/LGD calibration on corporate credit. | Post-Series A. |
| **S&P CreditPro / RatingsXpress** | $40–100K/yr | Rating transitions, default history. | Post-Series A. |
| **Trepp** | $30–80K/yr | CRE loan performance, CMBS. Critical for mid-market CRE books. | Seed ($10B+ bank CRE is where pain lives). |
| **Bloomberg Terminal / BQuant** | $25–30K/yr/seat | Market data, rate curves, FX. 2 seats = $60K. | Seed. |
| **Refinitiv / LSEG** | comparable to Bloomberg | Alternative to Bloomberg. | Pick one. |
| **ICE BondPoint / MarketAxess** | $20–50K/yr | Fixed income pricing. | Series A. |
| **Intex** | $60–120K/yr | Structured finance cashflow models. | Only if structured-finance focus. |

**Total seed data unlock target: $100–150K/yr.** Fits into seed raise. Pre-seed stays $0.

### 5.3 Synthetic data — use and limits

**Use for:** demo environments, UI walkthroughs, sandbox QA, scenario-library calibration cross-checks. **The existing `syntheticData.js` is fine for a demo.**

**Do NOT use for:** anything that ships to a customer as a model output. Never. A CRO who discovers our PD was trained on Box-Muller noise is a lost customer and a reputational loss that cascades. Synthetic data is a demo tool only.

**Narrow acceptable exception:** **synthetic-data augmentation** in tail regimes where real data is thin (e.g., simulating stress scenarios that haven't occurred historically), clearly documented in the model documentation package as "simulated tail augmentation" with methodology disclosed.

### 5.4 The benchmarking-data clause (this is the moat)

Every customer DUA and MSA includes a clause permitting FinRisk to:
1. Aggregate the customer's model outputs, PDs, EVE/NII sensitivities, and stress results **at minimum-N peer-group level** (never single-institution disclosable),
2. Retain anonymized derived statistics in perpetuity, even after contract termination,
3. Use aggregated data for peer benchmarking products offered to other customers,
4. Never disclose individual customer identity in peer products.

**Contract language (model):**

> **Section X. Benchmarking Data Rights.** Customer hereby grants FinRisk a perpetual, irrevocable, worldwide, royalty-free license to aggregate Customer's Outputs (defined as model results, sensitivities, scenario outcomes, and derived statistics, but excluding underlying Customer Confidential Data, loan-level records, or Personally Identifiable Information) into peer-group benchmarks. Peer benchmarks will (i) include outputs from no fewer than **five (5)** institutions per peer group, (ii) apply **k-anonymity with k ≥ 5** across all disclosed dimensions, (iii) suppress any peer-group where a single institution contributes more than **40%** of the aggregated measure, and (iv) never identify Customer or any other institution by name. This license survives termination of this Agreement. Customer's raw data, loans, and PII remain Customer's property at all times and are not licensed to FinRisk for any purpose other than providing the Service.

**Why this is the moat.** After 20 customers, FinRisk has a proprietary mid-market peer benchmark on EVE duration gap, deposit beta, CRE concentration PD, IRRBB positioning. **That benchmark is the product Moody's cannot build without acquiring us.** It is the tuck-in unlock.

**Legal implications to spell out to bank GCs:**
- **GLBA Safeguards Rule / FTC / federal banking agencies:** aggregated non-PII statistics at k≥5 minimum-N are commonly permitted. Bank GC will want to confirm. Prior art: Verafin aggregated SAR filings; Greenlight aggregated payments; Plaid aggregated account stats. **Provide references to incumbent vendors doing this.**
- **FCRA:** does not apply because we are not creating consumer reports.
- **State privacy (CCPA, NYDFS 500, Massachusetts 201 CMR 17):** non-PII aggregates with k≥5 typically out of scope; confirm per state.
- **SR 11-7:** no implication — benchmarking is not modeling-of-record.
- **Customer IP:** we license *derived statistics*, not raw data. Bank retains all IP in its loans, customers, and transactions.

**Sell the clause as a benefit, not a concession.** Peer benchmarks appear in the customer's ALCO pack. They get value from the aggregation. First-mover partners get preferred access.

### 5.5 Cold-start problem — three ways out

The obvious chicken-and-egg: peer benchmarks need multiple customers; customers want peer benchmarks before signing.

1. **Design partners.** First 3 customers get equity warrants (0.1–0.25% each, vesting on data-sharing cooperation) and discounted ACV. They get exclusive access to preview benchmark features. Recruit by pitching the benchmark as *their* proprietary peer view — they become charter members, not vendor customers.
2. **Federated/peer-contributed benchmark (Phase 2).** When customer N+1 runs a scenario, they contribute their anonymized output to a federated benchmark maintained in FinRisk's control plane; benchmarks become richer with each customer. Publish a public methodology whitepaper.
3. **BYOC bootstrapping with public data.** Before any customer onboards, build seed peer benchmarks from public Call Report / Y-9C / NCUA 5300 data. Not as rich as customer-contributed but gives Day 1 value.

---

## 6. Models & Research Foundations

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

---

## 7. Regulatory & Compliance Gate

### 7.1 SR 11-7 (US) / PRA SS1/23 (UK — not yet applicable but similar framework)

**SR 11-7** (Federal Reserve, 2011) is the US model risk management governing document. Three pillars:
1. **Model development, implementation, and use** — documentation, testing, assumptions, limitations
2. **Model validation** — independent effective challenge, ongoing monitoring, outcomes analysis
3. **Governance, policies, controls** — inventory, roles, escalation, committee oversight

**Tiering** (per bank's MRM policy, typical):
- **Tier 1:** decision-of-record, high-impact (e.g., loan origination PD, capital allocation VaR, ALLL/CECL model). Requires annual independent validation, comprehensive documentation (100+ pages), benchmark model, outcomes analysis.
- **Tier 2:** material-impact challenger or supplementary (e.g., stress-test models, EVE/NII sensitivity). Biennial validation, ~40–60 pages documentation.
- **Tier 3:** informational / monitoring (e.g., peer benchmarks, ad-hoc analytics). Lighter touch, ~10–20 page model card.

**FinRisk Year 1 target: Tier 2/3 positioning.** Advisory/challenger framing maps directly. Documentation generator outputs Tier 2/3 compliant packages out of the box.

### 7.2 SOC 2 Type II timeline

- **Week 17–18 (late August 2026):** gap assessment with a SOC 2 auditor partner (Vanta, Drata, Secureframe). $15–25K.
- **Week 20 (Sept 2026):** SOC 2 Type I self-attestation + policies-in-place. $0 incremental.
- **Week 20 + 10 months (July 2027):** SOC 2 Type II audit period closes. First-year audit fee $20–30K. 
- **~Q3 2027:** SOC 2 Type II attested. Required for most $10B+ bank procurement.

**Tradeoff:** Type I in Week 20 is what gets the LOI signed; Type II is what gets the PO cut. Pricing conversations can proceed on Type I; go-live gets delayed to Type II for the most conservative buyers.

### 7.3 ECOA / Regulation B

**Applies only if FinRisk makes or influences credit decisions on consumers.** Advisory/challenger positioning keeps us out of scope for v1. **If** a customer uses FinRisk's PD as an input to an individual-consumer credit decision, ECOA adverse-action-notice obligations and the June 2023 CFPB guidance on algorithmic decisioning apply. **Contract language must prohibit this use for v1** until legal review.

### 7.4 GLBA Safeguards Rule

Applies to financial-institution customers. FinRisk, as a service provider processing customer data, must:
- Encrypt customer data in transit and at rest (BYOC satisfies this by default — customer KMS).
- Implement an information security program commensurate with risk (SOC 2 covers this).
- Conduct vendor-risk assessments annually (part of SOC 2 evidence).

**GLBA safeguards addendum** rides on every MSA. Template exists — customize to BYOC posture.

### 7.5 Vendor risk management questionnaires

Expect to fill out, per customer:
- **SIG (Standardized Information Gathering) questionnaire** — Shared Assessments consortium; ~300 questions.
- **SIG Lite** — ~100 questions, common for mid-market.
- **Bank-specific supplements** — often 50–200 bank-specific questions.

Prep work: pre-fill SIG Lite now. Reuse 80% across customers. **Budget 20–40 hours per new prospect** for VRM response in Year 1.

---

## 8. Architecture

### 8.1 BYOC topology

```
CONTROL PLANE (FinRisk-owned)                    DATA PLANE (Customer AWS, customer KMS)
─────────────────────────────                    ──────────────────────────────────────────
Cloudflare Workers (marketing, auth proxy)       S3 (customer-side, customer KMS key)
Hetzner / Fly.io (app + API)              ←→     Fargate Spot (Monte Carlo batch)
Postgres (control, Neon/Supabase)                Athena (analytics SQL)
Sentry / PostHog (ops)                           EventBridge + Step Functions (orchestration)
                                                 Glue / Lambda (ETL)
                                                 CloudWatch (customer-side observability)
                                                 Customer VPC, customer IAM, customer KMS
```

**Why BYOC.** (a) No customer data ever leaves the bank's AWS perimeter — massive procurement shortcut. (b) Bank's KMS key — they can revoke. (c) Bank's audit trail — CloudTrail already flows to their SIEM. (d) Latency proximity to customer data. (e) Cost pass-through — customer's AWS bill, not ours.

**Deployment.** Terraform module (`finrisk-byoc-aws`) + one-page install runbook. Bank security team reviews HCL, plans the apply, executes in their account. FinRisk never touches customer AWS credentials.

**Cross-plane boundary.** Customer data plane reports telemetry to control plane only as (a) aggregated metrics (no PII, k≥5 benchmarks per §5.4), (b) health/heartbeat, (c) software version. Everything else stays in customer account.

### 8.2 $25K Skyrun credit budget breakdown (20-week plan)

| Category | Estimated cost | Notes |
|---|---|---|
| Control-plane AWS (Workers, Neon free tier, minimal EC2) | ~$2K | Mostly free tier / Cloudflare free. |
| Model training (SageMaker on-demand spot, intermittent) | ~$6K | Vasicek calibration + IRRBB model fitting. MacBook for Phase 0. |
| S3 storage (Fannie/Freddie data ~200GB, Call Reports, scenarios) | ~$1K | One-time load + monthly retention. |
| Demo-environment running costs | ~$2K | Always-on for prospect demos. |
| Security tooling (Vanta trial, Drata) | ~$3K | SOC 2 gap assessment tooling. |
| LinkedIn Sales Nav (2 seats + InMail) | ~$2.5K (5 months) | Outreach. |
| Reserved for pilot customer BYOC bootstrapping | ~$4K | Cross-account role deploy costs, per-customer overhead. |
| Contingency | ~$4.5K | |
| **Total** | **~$25K** | |

Running this tight. After Week 20 we either have paying customers (who absorb their own AWS bill under BYOC) or we've raised seed and can relax.

### 8.3 Per-customer cost estimate (steady state, BYOC)

Customer pays their own AWS bill. FinRisk marginal cost per customer:
- Control-plane traffic: $50–100/mo
- Customer-support / dedicated Slack channel: $0 variable cost, $X staff cost
- Benchmark contribution aggregation: $10/mo
- **Total FinRisk-side: ~$500–1,500/mo per customer.** Gross margin 85–95% on $10–25K MRR customer.

### 8.4 Model training location

- **Phase 0 (Weeks 1–8):** MacBook. All Fannie/Freddie calibration fits on a laptop. Polars/DuckDB for the big dataset work.
- **Phase 1 (Weeks 9–20):** SageMaker on-demand, intermittent. Experiment tracking on Weights & Biases free tier.
- **Phase 2 (post-seed):** SageMaker Pipelines, MLflow, shadow-mode deployment into first customer account via BYOC.

---

## 9. Go-to-Market

### 9.1 Target segment

**Primary:** ~70 US banks, $10B–$50B in assets, Category IV under the tailored prudential framework, with a named CRO.

**Secondary (Year 2+):** large credit unions ($5B+, NCUA 5300 filers), threshold-crossers approaching $10B (CFPB oversight trigger), Category IV banks $50B–$100B (enhanced prudential standards).

**De-prioritize (Year 1):** banks in mid-merger (12 months post-close can't evaluate new vendors — **Pinnacle+Synovus is the current case**), banks with DCG deep contracts >3 years remaining.

### 9.2 Buying committee

| Role | Function | Sell-to approach |
|---|---|---|
| **CRO (Chief Risk Officer)** | Economic buyer. Owns the budget. Signs the MSA. | Whitepaper + ABA conference + cold email. Pitch: risk of missing SR 11-7 effective-challenge expectations, mid-market cross-risk gap. |
| **Treasurer** | Champion. Daily user of ALCO pack. Signs up first. | Product demo focused on EVE/NII, LCR/NSFR, deposit behavior, ALCO pack automation. Pitch: get back 40 hrs/quarter. |
| **Head of Model Risk Management (MRM)** | Gatekeeper. Blocks purchases that don't meet SR 11-7. | Documentation samples, challenger framing, SHAP-by-default demo. Pitch: FinRisk makes YOUR job easier, not harder. Don't go around them. |
| **CFO** | Approver. Signs the PO. | ROI model: hours saved + avoided consulting spend. Pitch: replace $200K/yr of DCG consulting with $150K/yr software + peer benchmark. |

### 9.3 Tier-1 target list (15 named banks — priority 1 outreach Week 2–6)

**Assumption:** list reflects public asset-size data and recent threshold-crossing or new-CRO signals. Verify before each outreach. Exclude any in active merger integration.

| # | Bank | ~Assets | HQ | Signal / hook |
|---|---|---|---|---|
| 1 | Zions Bancorporation | $90B | Salt Lake City, UT | Category IV; active post-SVB risk-tech review. |
| 2 | Western Alliance Bancorporation | $80B | Phoenix, AZ | Post-SVB "regional with HTM exposure" narrative; CRE-heavy. |
| 3 | Webster Financial | $79B | Stamford, CT | Post-Sterling merger well past integration. |
| 4 | Valley National Bancorp | $62B | Wayne, NJ | CRE concentration, northeast. |
| 5 | Cullen/Frost Bankers | $52B | San Antonio, TX | Texas Bankers Association connection, conservative operator. |
| 6 | Wintrust Financial | $65B | Rosemont, IL | Mid-west, diversified. |
| 7 | Pinnacle Financial Partners (combined w/ Synovus, Q1 2026 close) | combined ~$170B | Nashville, TN / Columbus, GA | **Defer 12 months post-close**. Watch list 2027. |
| 8 | BOK Financial | $50B | Tulsa, OK | Oil & gas concentration, rate-sensitive book. |
| 9 | Commerce Bancshares | $32B | Kansas City, MO | Conservative, Category IV. |
| 10 | Prosperity Bancshares | $40B | Houston, TX | Post-Southwest merger integrated; Texas. |
| 11 | FNB Corp (First National Bank of PA) | $48B | Pittsburgh, PA | Regional scale. |
| 12 | Old National Bancorp | $50B | Evansville, IN | Recent M&A digested. |
| 13 | UMB Financial | $44B | Kansas City, MO | Trust/wealth + commercial. |
| 14 | Associated Banc-Corp | $43B | Green Bay, WI | Wisconsin, mid-west. |
| 15 | Glacier Bancorp | $28B | Kalispell, MT | Multi-state western community bank. |

### 9.4 Tier-2 target list (25 additional banks — Week 7–16 outreach)

Atlantic Union Bankshares (Richmond, VA), Bank of Hawaii (Honolulu, HI), BankUnited (Miami Lakes, FL), Cadence Bank (Tupelo, MS), Columbia Banking System (Tacoma, WA), Customers Bancorp (West Reading, PA), Eastern Bankshares (Boston, MA), First BanCorp (San Juan, PR), First Busey (Champaign, IL), First Horizon (Memphis, TN), First Interstate BancSystem (Billings, MT), Fulton Financial (Lancaster, PA), Hancock Whitney (Gulfport, MS), Heartland Financial (Denver, CO), Home BancShares (Conway, AR), Independent Bank Group (McKinney, TX), International Bancshares (Laredo, TX), Pacific Premier Bancorp (Irvine, CA), Renasant (Tupelo, MS), Simmons First National (Pine Bluff, AR), SouthState (Winter Haven, FL), Stifel Bancorp (St. Louis, MO), TowneBank (Portsmouth, VA), Trustmark (Jackson, MS), Washington Federal (Seattle, WA).

**Full list vetted + Yale SOM / central-bank-alumni crosscheck in Week 1 warm-intro brainstorm.**

### 9.5 ABA Risk & Compliance Conference Charlotte May 5–7 2026 (Week 2)

- **Register now** — 2 attendee passes at ~$2K each. Budget $6–8K total including flights, hotel, food, incidentals.
- **Pre-conference outreach (Thu–Fri pre-conference):** 30 LinkedIn messages to registered attendees ("saw you're going to ABA Charlotte — I'm showing FinRisk, an SR 11-7 advisory platform for mid-market banks; 15 min coffee Tuesday?").
- **At-conference tactics:** attend every CRO panel; work the registration line Monday morning; carry a 1-page FinRisk leave-behind (not a brochure — a one-page technical summary: unified cross-risk model graph, SR 11-7 doc automation, post-SVB scenario); book coffee meetings in 30-min slots.
- **Post-conference follow-up:** within 48 hours, personalized emails to every business-card swap referencing specific conversation points.
- **Success criterion:** 10+ discovery calls scheduled from the conference.

### 9.6 Cold-email 3-email sequence (copy-paste-ready)

**Email 1 — Day 0, Subject: "SR 11-7 challenger model gap at $10–50B banks"**

> {Name},
>
> Your 10-K risk section describes {specific-risk-they-flag — CRE concentration / HTM/AFS unrealized loss / deposit migration}. Mid-market banks ({your-size-peer-set}) carry this exposure but don't have the Category I/II stress-testing infrastructure to run cross-risk scenarios natively.
>
> I'm building FinRisk — a unified stress-testing and treasury/ALM advisory platform for banks your size. Former {central-bank / regulator} colleague as co-founder. We ship SR 11-7 challenger-model documentation with every output — it cuts 40–100 hours per quarter from your MRM team.
>
> Would you have 20 minutes in the next two weeks to look at a demo? I can come to {HQ-city} or we can do it over Zoom.
>
> {Pranik}, Yale {program} '{year} co-founder
> linkedin.com/in/pranikchainani
>
> PS — we're at ABA Risk & Compliance May 5–7 in Charlotte; happy to meet there if easier.

**Email 2 — Day 5 (if no reply)**

> {Name},
>
> Following up on SR 11-7 challenger gap. One concrete example of what we do: a 200bp parallel-up rate shock on your reported AFS book would move EVE by {computed from their 10-Q} while simultaneously moving non-maturity deposit beta by {computed peer median}. We score these together rather than in three dashboards. Happy to show you in 15 minutes.

**Email 3 — Day 12 (last)**

> {Name},
>
> Last note from me. If stress-testing/ALM modernization isn't a priority right now, understood — could you point me to the right person at {bank} or suggest a better time to check back? I'd rather stay out of your inbox than keep nudging.

### 9.7 LinkedIn InMail template

> {Name} — your post on {specific-post-topic} resonated. I'm building FinRisk, unified stress-testing + ALM for mid-market banks, with a former {CB} colleague. We ship SR 11-7 docs alongside every output. 15 min in the next two weeks? Happy to meet at ABA Charlotte May 5–7 if easier.

### 9.8 30-min pitch-call framework

| Minutes | Topic | Deliverable |
|---|---|---|
| 0–3 | Intros, their priorities for 2026 | Listen for: regulator exam feedback, M&A threshold-crossing, new CRO mandate, DCG contract pain. |
| 3–8 | FinRisk overview (unified cross-risk, SR 11-7 docs, peer benchmark, BYOC) | 3-slide deck, no demo yet. |
| 8–22 | Live demo — stress scenario + ALCO pack + SR 11-7 doc generation | Show the 9-scenario library, run 2008 GFC replay, show generated doc package. |
| 22–27 | Pricing range, deployment (BYOC), timeline | $150–300K ACV range, 60-day BYOC deploy, SOC 2 Type I ready / Type II Q3 2027. |
| 27–30 | Next steps | Ask: "what would need to be true for you to evaluate this in Q3?" Book follow-up with Treasurer + Head of MRM. |

### 9.9 Discovery-call "good signals" checklist

- [ ] CRO mentions SR 11-7 exam findings or MRM resource constraint.
- [ ] Uses phrase "DCG" or "Darling" in the first 10 minutes (active contract pain).
- [ ] Asks about peer benchmark before we bring it up.
- [ ] Says "post-SVB" or "HTM losses" unprompted.
- [ ] Offers to loop in Treasurer or Head of MRM on next call.
- [ ] Mentions recent M&A or threshold-crossing.
- [ ] Asks about SOC 2 status (qualified buyer) rather than dismissing (not a real pipeline).
- [ ] Acknowledges Yale / central-bank credentials matter (cultural fit).

**4+ checks = qualified pipeline. 2–3 = nurture. 0–1 = drop.**

---

## 10. 20-Week Execution Plan

**Week 0 = 2026-04-23 (today).** Week 1 starts Mon 2026-04-27.

| Week | Dates | Owner | Deliverables | Success criteria |
|---|---|---|---|---|
| **1** | 04-27 – 05-01 | Both | Delaware C-corp (Pranik), ethics check (CB), ABA register (both), warm-intro brainstorm (both, 4hr), LinkedIn Sales Nav setup (Pranik), cloud bootstrap (Pranik), whitepaper outline (CB) | Entity filed; ethics confirmed; ABA booked; ≥15 warm-intro candidates; IaC skeleton |
| **2** | 05-04 – 05-08 | Both | **ABA Risk & Compliance Charlotte May 5–7** — attend both. 30 pre-conf LinkedIn msgs. 10+ discovery calls scheduled. | 10 booked discovery calls in pipeline |
| **3** | 05-11 – 05-15 | Pranik / CB | Fannie/Freddie performance data ingested (Pranik); whitepaper draft §1–3 (CB); first 3 discovery calls executed (both) | Data pipeline working; whitepaper 50% draft; 3 calls complete |
| **4** | 05-18 – 05-22 | **GATE WEEK** | Vasicek re-calibrated on real Fannie data (Pranik); whitepaper draft complete (CB); 5 cumulative discovery calls (both). **Gate review:** pipeline quality, any LOI signal? If no, adjust targeting. | Real PD curve backtested; whitepaper in peer review; gate review complete |
| **5** | 05-25 – 05-29 | Pranik | IRRBB EVE/NII engine v1; first prospect follow-up calls (Treasurer round) | EVE/NII engine shipping Basel 6 shocks |
| **6** | 06-01 – 06-05 | Both | Whitepaper published (blog + LinkedIn + emailed to all 40 Tier-1/2); 3 follow-up Treasurer demos | Whitepaper published; 2K+ downloads initial |
| **7** | 06-08 – 06-12 | Pranik | Deposit behavioral model v1 (non-maturity decay, beta asymmetry); cold email batch 2 (Tier-2 list) | Deposit model fitted on Call Report trends |
| **8** | 06-15 – 06-19 | Both | ALCO pack generator v1; 10 cumulative discovery calls; first LOI conversation (Head of MRM loop-in) | ALCO PDF generator working end-to-end; 1 LOI conversation live |
| **9** | 06-22 – 06-26 | Pranik | SR 11-7 doc generator v1 (template + auto-populate from run metadata) | Doc gen produces a Tier-2 compliant draft |
| **10** | 06-29 – 07-03 | CB | Challenger PD CRE + C&I v1; second LOI conversation | CRE/C&I PD with SHAP attribution |
| **11** | 07-06 – 07-10 | Both | BYOC Terraform module v1 (sandbox-ready) | Terraform module applies cleanly in test AWS account |
| **12** | 07-13 – 07-17 | **GATE WEEK** | **Gate review:** pipeline, LOIs, whitepaper traction, product completeness. Go/no-go on pre-seed raise start. | ≥2 live LOI conversations; ≥3 Treasurers demoed; raise-ready decision |
| **13** | 07-20 – 07-24 | Pranik | Peer benchmark v0 from Call Report public data; investor deck v1 | Benchmark visible in demo |
| **14** | 07-27 – 07-31 | Both | Pre-seed investor outreach batch 1 (QED, Nyca, Fin Capital, Better Tomorrow); first LOI signed target | ≥1 LOI signed |
| **15** | 08-03 – 08-07 | Both | Investor meetings; design partner #1 Terraform deploy kickoff | Deploy in progress |
| **16** | 08-10 – 08-14 | Pranik | Shadow-mode deployment at design partner #1 | Real data flowing into FinRisk in customer account |
| **17** | 08-17 – 08-21 | CB | SOC 2 gap assessment (Vanta / Drata partner); angel outreach | Gap assessment report in hand |
| **18** | 08-24 – 08-28 | Both | Close first pre-seed commitments; SOC 2 policies drafted | ≥$500K committed |
| **19** | 08-31 – 09-04 | Pranik | SOC 2 Type I self-attestation complete; design partner #2 LOI target | Type I complete |
| **20** | 09-07 – 09-11 | **GATE WEEK** | **Gate review:** final pre-seed close ($1.25M target); ≥1 signed design partner; ≥1 live customer-side deploy; SOC 2 Type I done; whitepaper-driven pipeline. | Full gate: raise closed, customer live, compliance gate cleared, Series-A roadmap drafted |

### 10.1 Four riskiest dependencies and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Central banker ethics restrictions kill outreach plan** | Medium | High | Ethics call Day 1; fallback plan has Pranik solo-front outreach to restricted banks. |
| **No LOI by Week 12** | Medium | High | Pivot pricing model (e.g., offer free Phase 0 pilot in exchange for design-partner equity warrants); extend outreach to $50B+ Category IV. |
| **Skyrun credits exhaust before Week 20** | Low | Medium | Aggressive use of free tiers (Neon, Supabase, Cloudflare, Hetzner); MacBook training; delay always-on demo env to Week 8. |
| **SOC 2 gap assessment reveals 3+ month remediation** | Low | Medium | Start Week 14 instead of Week 17; prioritize policies over tooling. |

### 10.2 Explicit gates

- **Week 4 gate:** ≥3 discovery calls executed, Vasicek recalibrated on real data, whitepaper draft ≥75%. **If miss: re-examine targeting, not plan.**
- **Week 12 gate:** ≥2 active LOI conversations, ALCO pack + SR 11-7 doc gen working, ≥10 discovery calls cumulative. **If miss: extend pre-LOI phase by 4 weeks, delay raise to Week 24.**
- **Week 20 gate:** ≥1 signed design partner, ≥1 live customer-side deployment in shadow, SOC 2 Type I complete, pre-seed ≥$750K committed. **If miss: bridge funding conversation with Skyrun and angels, reassess raise timing.**

---

## 11. Organizational Assumptions & Open Risks

### 11.1 The six open questions — defaults (restated crisply so they can be corrected)

| # | Question | Default assumed | Effect on plan if overridden |
|---|---|---|---|
| 1 | Yale affiliation disclosable in cold emails? | **YES.** Signature + LinkedIn in every email. | If NO: drop from signature; pitch falls back to central-bank credential only. |
| 2 | ABA Charlotte May 5–7 attendance? | **YES, both founders, $6–8K.** | If NO: Week 2 substituted with state bankers' association or Texas Bankers Spring Convention; lose ~10 discovery calls. |
| 3 | Delaware C-corp registration? | **NOT YET; Week 1 P0.** | If already filed: skip the Stripe Atlas step, remaining Week 1 work unchanged. |
| 4 | LinkedIn Sales Nav + InMail? | **YES, 2 seats $360/mo.** | If NO: slower outreach throughput but plan still works. |
| 5 | Warm intros? | **Assumed ZERO; 4hr Week 1 timebox on three latent sources.** | If warm intros exist: 3x acceleration through Week 4. |
| 6 | Central banker post-employment restrictions? | **UNKNOWN — treat as risk, ethics call Mon.** | Decision matrix below. |

### 11.2 Central banker post-employment restriction decision matrix

| Prior institution | Typical restriction | FinRisk plan impact |
|---|---|---|
| **Fed / OCC / FDIC** | **1-year "cooling off"** on banks they supervised; personal contact with non-supervised banks generally OK. **Always consult ethics counsel.** | Pranik fronts outreach to institutions they supervised for first 12 months; CB fronts outreach to non-supervised (community banks, credit unions). |
| **Foreign central bank** (RBI, BoE, ECB, BoJ, MAS) | Less restrictive on *US* bank outreach but may have home-country rules. | Verify with prior HR; usually permissible for US commercial outreach. |
| **Multilateral** (IMF, BIS, World Bank) | Fewer formal restrictions but **confidentiality obligations** apply — may not cite specific country programs, must not use non-public data. | Usually permissible; central banker handles all outreach. |
| **Private-sector prior** (commercial bank CRO, Big-4 consulting at Fed) | Minimal; typical non-compete and non-solicit of specific customers, not industry-wide. | No change to plan. |

**The plan is designed to work under any of these cases.** Pranik's name on outreach is the fallback; central banker contributes whitepaper, product, conference-booth conversations, and ALCO-level technical credibility regardless.

### 11.3 What-breaks-the-plan list

1. Central banker leaves or reduces availability below full-time.
2. Skyrun $25K credits revoked or materially reduced.
3. SR 11-7 effective-challenge guidance tightens such that challenger models require Tier-1 validation (low probability, high impact).
4. FFIEC Call Report public dataset becomes paywalled or restricted (very low probability).
5. Major competitive launch (Moody's mid-market stress-test product, DCG platform pivot).
6. Customer data breach at a design partner that implicates BYOC provider — reputational.
7. Central banker ethics restriction is **broader than assumed** (e.g., blanket non-US-bank contact for 2 years). In that case, CB becomes whitepaper + model author only; Pranik fronts 100% of outreach; raise narrative weakens but doesn't break.

### 11.4 Budget reality check

$1.25M pre-seed + $25K credits / 14 months = ~$91K/mo average burn. At 55% founder comp ($50K/mo blended for 2), 15% SaaS + data, 10% cloud (mostly absorbed by Skyrun), 10% travel, 10% contingency, that's tight but workable. **If Yale student co-founder takes a below-market $80K salary, burn drops to $75K/mo and runway extends to 16 months.** Flag for raise conversations.

---

## 12. Exit Hypothesis & Fundraise

### 12.1 3–7 year exit paths

**Primary (base case): strategic tuck-in at $10–40M ARR.**

| Acquirer | Strategic fit | Precedent | ARR multiple |
|---|---|---|---|
| **Moody's Analytics** | Mid-market gap in RiskCalc coverage; benchmark data extension; SR 11-7 doc capability. | RiskCalc, Acquired Bureau van Dijk $3.3B 2017; smaller risk-tech tucks $20–200M. | 6–10× ARR |
| **Wolters Kluwer (OneSumX)** | Mid-market regulatory + risk extension. | Recurring acquisitions in the $10–50M range. | 5–8× ARR |
| **S&P Global (Market Intelligence / RiskGauge)** | Benchmark data + credit analytics. | IHS Markit $44B 2022. | 6–10× ARR |
| **Abrigo** | Mid-market bank distribution fit. | Sageworks + MainStreet + Bankers Toolbox roll-up by Accel-KKR. | 5–8× ARR |
| **Fiserv / FIS / Jack Henry** | Core-banking extension. Slower buyers. | Occasional niche tucks. | 4–7× ARR |

At $20M ARR × 7× = **$140M exit.** Founder stake post-seed + Series A (20% SAFE + 18% Series A + 15% option pool) ≈ 45–50% founder equity → **$60–70M founder take** in the base case.

**Moonshot: PE roll-up to Nasdaq. Adenza precedent: $10.5B to Nasdaq in 2023 at ~17.8× revenue.** Requires reaching ~$100M ARR (5–7 years), PE sponsor (Thoma Bravo, Vista, Accel-KKR), bolt-on acquisitions (Abrigo-style), then IPO or strategic. Low probability, asymmetric upside.

**Downside: IP acquihire.** $5–20M if ARR stalls at $1–3M. Founders make $1–5M each. Still tolerable.

### 12.2 How exit thesis shapes the build

- **Benchmarking-data clause is the Moody's/S&P unlock** — without it, FinRisk is a software company at 5× ARR. With it, we're a data company at 8–10× ARR. §5.4 is not optional.
- **US-only focus protects tuck-in value** — Moody's/S&P prefer clean US regulatory alignment over half-built multi-jurisdiction.
- **SR 11-7 doc generation is the "pain we own"** — repeatable customer-side ROI that shows up in acquirer due diligence.
- **BYOC is an enterprise-procurement moat** — slower to build than SaaS but harder for a new entrant to replicate inside an enterprise customer base.

### 12.3 Pre-seed round structure

**Primary instrument:** post-money SAFE.
- **Amount:** $1.25M
- **Post-money cap:** $7M
- **Discount:** 20%
- **MFN:** yes
- **Dilution at cap:** ~17.8% ($1.25M / $7M)
- **Pro-rata rights:** offer to lead angel / first check of $250K+
- **Investor docs:** Y Combinator post-money SAFE template, zero negotiation on structure.

**Structure rationale:** Pre-seed at $7M post is aggressive for no-ARR, but the whitepaper + design partner LOI + Yale + central-bank credentials + a working demo justify it. If investors push back, the fallback is $5M post (22.7% dilution at cap) with 15% discount.

### 12.4 Target investors

**VCs (priority for lead check $500K–$1M):**
- **QED Investors (Fontes or fintech partner)** — fintech specialist, bank-adjacent portfolio.
- **Nyca Partners (Hans Morris)** — payments / banktech focus, deep bank GTM network.
- **Fin Capital (Logan Allin)** — fintech specialist, mid-stage and pre-seed.
- **Better Tomorrow Ventures (Sheel Mohnot / Jake Gibson)** — pre-seed fintech focus.
- **Lux Capital (deeptech adjacency)** — if SR 11-7 / AI angle resonates.
- **Pillar VC (Boston)** — enterprise SaaS pre-seed.

**Angels / operator-investors (targets for $25–100K checks):**
- **Former nCino executives** — bank-tech GTM credibility.
- **Former Alloy executives** — bank identity/risk infrastructure.
- **Former Verafin / NICE Actimize executives** — bank-compliance SaaS exit credibility.
- **Former Feedzai / ComplyAdvantage executives** — risk-software enterprise sales.
- **Former Plaid / Green Dot / Marqeta executives** — banking infra.
- **Former Moody's / S&P / Wolters Kluwer / Abrigo executives** — acquirer-adjacent strategic value (diligence-risk, handle with care but valuable).
- **Bank CROs who are personal investors** — reference strength during sales cycle.

### 12.5 Fundraise gates tied to 20-week plan

- **Week 4 gate met → start investor warm-intro conversations** (not pitch yet).
- **Week 12 gate met → open round, send decks**.
- **Week 20 gate met → target close by Week 24 (2026-10-09)**.

If any gate misses: don't force the raise, extend the plan. Forcing a raise on a half-baked gate sets a cap too low and signals weakness.

---

## 13. Appendices

### 13.1 Data source URLs (single copy-paste list)

```
https://ffiec.gov/npw/
https://cdr.ffiec.gov
https://fred.stlouisfed.org
https://fhfa.gov/DataTools
https://ncua.gov/analysis/credit-union-corporate-call-report-data
https://sec.gov/edgar
https://federalreserve.gov/apps/mdrm
https://capitalmarkets.fanniemae.com/credit-risk-transfer/single-family-credit-risk-transfer/fannie-mae-single-family-loan-performance-data
https://freddiemac.com/research/datasets/sf_loanlevel_dataset
https://banks.data.fdic.gov
https://bls.gov
https://ngfs.net/ngfs-scenarios-portal
https://federalreserve.gov/supervisionreg/ccar.htm
https://federalreserve.gov/supervisionreg/srletters/sr1107.htm
https://bis.org/bcbs
```

### 13.2 Named-bank outreach table (copy-paste-ready)

Format: `Rank | Bank | Assets | HQ | Signal`

```
T1-01 | Zions Bancorporation | $90B | Salt Lake City UT | Category IV post-SVB review
T1-02 | Western Alliance | $80B | Phoenix AZ | HTM/AFS + CRE narrative
T1-03 | Webster Financial | $79B | Stamford CT | Post-Sterling integrated
T1-04 | Valley National | $62B | Wayne NJ | CRE concentration
T1-05 | Cullen/Frost | $52B | San Antonio TX | Texas network
T1-06 | Wintrust | $65B | Rosemont IL | Diversified midwest
T1-07 | Pinnacle+Synovus | ~$170B | Nashville TN / Columbus GA | DEFER 12mo post-close
T1-08 | BOK Financial | $50B | Tulsa OK | Oil/gas + rate-sensitive
T1-09 | Commerce Bancshares | $32B | Kansas City MO | Conservative operator
T1-10 | Prosperity Bancshares | $40B | Houston TX | Post-merger integrated
T1-11 | FNB Corp | $48B | Pittsburgh PA | Regional scale
T1-12 | Old National | $50B | Evansville IN | M&A digested
T1-13 | UMB Financial | $44B | Kansas City MO | Trust + commercial
T1-14 | Associated Banc-Corp | $43B | Green Bay WI | Wisconsin/midwest
T1-15 | Glacier Bancorp | $28B | Kalispell MT | Multi-state community
T2-01 | Atlantic Union Bankshares | ~$25B | Richmond VA | Mid-Atlantic
T2-02 | Bank of Hawaii | ~$24B | Honolulu HI | Island concentration
T2-03 | BankUnited | ~$35B | Miami Lakes FL | FL growth
T2-04 | Cadence Bank | ~$48B | Tupelo MS | Southeast
T2-05 | Columbia Banking System | ~$52B | Tacoma WA | PNW
T2-06 | Customers Bancorp | ~$22B | West Reading PA | Mid-Atlantic
T2-07 | Eastern Bankshares | ~$22B | Boston MA | New England
T2-08 | First BanCorp | ~$19B | San Juan PR | Puerto Rico
T2-09 | First Busey | ~$12B | Champaign IL | Midwest
T2-10 | First Horizon | ~$82B | Memphis TN | Southeast
T2-11 | First Interstate | ~$30B | Billings MT | Multi-state western
T2-12 | Fulton Financial | ~$27B | Lancaster PA | Mid-Atlantic
T2-13 | Hancock Whitney | ~$37B | Gulfport MS | Gulf Coast
T2-14 | Heartland Financial | ~$20B | Denver CO | Multi-state
T2-15 | Home BancShares | ~$23B | Conway AR | Southeast
T2-16 | Independent Bank Group | ~$19B | McKinney TX | Texas
T2-17 | International Bancshares | ~$15B | Laredo TX | Texas border
T2-18 | Pacific Premier | ~$20B | Irvine CA | SoCal
T2-19 | Renasant | ~$18B | Tupelo MS | Southeast
T2-20 | Simmons First | ~$28B | Pine Bluff AR | Southeast
T2-21 | SouthState | ~$46B | Winter Haven FL | Southeast
T2-22 | Stifel Bancorp | ~$32B | St Louis MO | Wealth+commercial
T2-23 | TowneBank | ~$17B | Portsmouth VA | Mid-Atlantic
T2-24 | Trustmark | ~$18B | Jackson MS | Southeast
T2-25 | Washington Federal | ~$23B | Seattle WA | PNW
```

**Assets are approximate; re-verify against most recent Call Report before each outreach.**

### 13.3 Email templates — copy-paste-ready

Fully inlined in §9.6 above. Consolidated here for convenience:

```
[SUBJECT E1] SR 11-7 challenger model gap at $10–50B banks

{Name},

Your 10-K risk section describes {SPECIFIC-RISK}. Mid-market banks
carry this exposure but don't have Category I/II stress-testing
infrastructure to run cross-risk scenarios natively.

I'm building FinRisk — a unified stress-testing and treasury/ALM
advisory platform for banks your size. Former {CB} colleague as
co-founder. We ship SR 11-7 challenger-model documentation with
every output — it cuts 40–100 hours per quarter from your MRM team.

Would you have 20 minutes in the next two weeks to look at a demo?
I can come to {HQ} or we can do it over Zoom.

{Pranik}, Yale {program} '{year} co-founder
linkedin.com/in/pranikchainani

PS — we're at ABA Risk & Compliance May 5–7 in Charlotte; happy
to meet there if easier.

---

[SUBJECT E2 — Day 5] Following up — SR 11-7

{Name},

Following up. One concrete example: a 200bp parallel-up rate shock
on your reported AFS book would move EVE by {COMPUTED} while
simultaneously moving non-maturity deposit beta by {PEER-MEDIAN}.
We score these together rather than in three dashboards. 15
minutes this week?

---

[SUBJECT E3 — Day 12] Last note from me

{Name},

Last note. If stress-testing/ALM modernization isn't a priority
right now, understood — could you point me to the right person at
{bank} or suggest a better time to check back? I'd rather stay
out of your inbox than keep nudging.
```

### 13.4 Terraform module resource list (`finrisk-byoc-aws`)

```
aws_s3_bucket.customer_data          # KMS-encrypted, customer key
aws_kms_key.customer_primary         # (created by customer, referenced)
aws_iam_role.finrisk_data_plane      # limited scope
aws_iam_policy.finrisk_read_only     # read-only to their tables
aws_ecs_cluster.finrisk_fargate_spot
aws_ecs_task_definition.monte_carlo
aws_glue_catalog_database.finrisk
aws_athena_workgroup.finrisk
aws_lambda_function.etl_call_report
aws_lambda_function.etl_fannie
aws_eventbridge_rule.scenario_trigger
aws_sfn_state_machine.scenario_run
aws_cloudwatch_log_group.finrisk
aws_vpc_endpoint.s3                  # private connectivity
aws_vpc_endpoint.sts
aws_security_group.finrisk_fargate
aws_secretsmanager_secret.control_plane_token  # rotatable
```

No VPC creation — module uses customer's existing VPC. No new public IPs. No outbound internet egress except to FinRisk control plane endpoint over mTLS.

### 13.5 Primary-source citations (non-exhaustive)

- **Basel Committee on Banking Supervision (BCBS):** papers 128 (2006), 238 (LCR, 2013), 295 (NSFR, 2014), 368 (IRRBB, 2016), 424 (OpRisk SMA, 2017), 457 (Market Risk FRTB, 2019). bis.org/bcbs.
- **Federal Reserve:** SR 11-7 (Model Risk Management, 2011); SR 15-18 (Capital Planning); SR 96-13 (IRRBB). federalreserve.gov/supervisionreg/srletters.
- **OCC:** Bulletin 2011-12 (Model Risk Management, companion to SR 11-7). occ.treas.gov.
- **FDIC:** Statistics on Depository Institutions (SDI); Directors' College curriculum. fdic.gov.
- **FFIEC:** Call Report forms 031/041, Y-9C instructions. ffiec.gov.
- **Vasicek, O.A. (2002).** "The Distribution of Loan Portfolio Value." *Risk*, 15(12).
- **Merton, R.C. (1974).** "On the Pricing of Corporate Debt: The Risk Structure of Interest Rates." *Journal of Finance*, 29(2).
- **Lessmann, S. et al. (2015).** "Benchmarking state-of-the-art classification algorithms for credit scoring." *European Journal of Operational Research*, 247(1).
- **Lundberg, S.M. & Lee, S. (2017).** "A Unified Approach to Interpreting Model Predictions." *NeurIPS 2017* (SHAP).
- **Ribeiro, M.T., Singh, S. & Guestrin, C. (2016).** "Why Should I Trust You?: Explaining the Predictions of Any Classifier." *KDD 2016* (LIME).
- **NGFS.** "Scenarios for Central Banks and Supervisors" (multiple editions). ngfs.net.
- **CFPB:** Circular 2023-03 on adverse-action notices and complex algorithms.
- **FTC:** Safeguards Rule (16 CFR 314).

### 13.6 Glossary of acronyms

| Acronym | Full | Plain-English |
|---|---|---|
| **ACV** | Annual Contract Value | What a customer pays per year. |
| **AFS** | Available For Sale | Securities marked to market through OCI. |
| **AOCI** | Accumulated Other Comprehensive Income | Holding line for unrealized gains/losses on AFS. |
| **ALCO** | Asset-Liability Committee | Bank's treasury/risk governance body, usually monthly. |
| **ALLL** | Allowance for Loan and Lease Losses | Pre-CECL reserve for loan losses. |
| **ALM** | Asset-Liability Management | Managing balance-sheet rate + liquidity risk together. |
| **BCBS** | Basel Committee on Banking Supervision | Global banking regulatory standard-setter. |
| **BSA/AML** | Bank Secrecy Act / Anti-Money-Laundering | Regulatory obligations for suspicious-activity monitoring. |
| **BYOC** | Bring Your Own Cloud | Deploy vendor software in customer's cloud account. |
| **CCAR** | Comprehensive Capital Analysis and Review | Fed's annual stress test for large banks ($100B+). |
| **CECL** | Current Expected Credit Loss | US GAAP lifetime loss accounting, FASB ASC 326. |
| **CFPB** | Consumer Financial Protection Bureau | US consumer finance regulator. Oversees banks >$10B. |
| **CRE** | Commercial Real Estate | Non-residential property lending. |
| **CRO** | Chief Risk Officer | Executive owner of enterprise risk. |
| **DFAST** | Dodd-Frank Act Stress Testing | Stress test regime under Dodd-Frank. |
| **DORA** | Digital Operational Resilience Act | EU regulation; not directly US-relevant. |
| **DUA** | Data Use Agreement | Contract governing how vendor may use customer data. |
| **ECL** | Expected Credit Loss | IFRS 9 equivalent of CECL. |
| **ECOA** | Equal Credit Opportunity Act | US fair-lending statute. Reg B implements. |
| **EPS** | Enhanced Prudential Standards | Fed's rules for larger banks under Dodd-Frank 165. |
| **EVE** | Economic Value of Equity | Present-value-of-equity IRRBB measure. |
| **FRTB** | Fundamental Review of the Trading Book | Basel market-risk capital framework. IMA = Internal Models Approach, SA = Standardized Approach. |
| **FTP** | Funds Transfer Pricing | Internal pricing of funds across business units. |
| **GLBA** | Gramm-Leach-Bliley Act | US financial privacy law. Safeguards Rule. |
| **HQLA** | High Quality Liquid Assets | LCR numerator. |
| **HTM** | Held To Maturity | Securities not marked to market — SVB's problem. |
| **ICAAP** | Internal Capital Adequacy Assessment Process | Bank's internal capital assessment, Basel Pillar 2. |
| **IFRS 9** | International Financial Reporting Standard 9 | Non-US impairment standard; parallel to CECL. |
| **IRB** | Internal Ratings-Based | Basel advanced credit-risk capital approach. |
| **IRRBB** | Interest Rate Risk in the Banking Book | Basel 368 framework; non-trading rate risk. |
| **KYC** | Know Your Customer | Onboarding identity/ownership verification. |
| **LCR** | Liquidity Coverage Ratio | 30-day stressed liquidity measure, Basel III. |
| **LGD** | Loss Given Default | Proportion of exposure lost when borrower defaults. |
| **LOI** | Letter of Intent | Pre-contract commitment to purchase. |
| **MDR** | Model Development and Review | Internal bank MRM lifecycle terminology. |
| **MRM** | Model Risk Management | Bank function that governs models, per SR 11-7. |
| **MSA** | Master Services Agreement | Top-level vendor contract. |
| **NII** | Net Interest Income | Rate-sensitivity earnings measure. |
| **NSFR** | Net Stable Funding Ratio | 1-year structural liquidity measure, Basel III. |
| **OCI** | Other Comprehensive Income | Balance-sheet parallel to P&L for certain items. |
| **PD** | Probability of Default | Likelihood a borrower defaults in a given horizon. |
| **SHAP** | SHapley Additive exPlanations | Model-interpretability method from cooperative game theory. |
| **SMA** | Standardized Measurement Approach | Basel operational-risk capital, BCBS 424. |
| **SR 11-7** | Supervisory Letter 11-7 | Fed's model risk management governing document. |
| **SS1/23** | Supervisory Statement 1/23 | PRA (UK) model risk equivalent. |
| **VRM** | Vendor Risk Management | Bank's third-party risk due-diligence function. |

---

**END OF MASTER REPORT**

---

## Coherence check (one thing that broke under the defaults)

Under the assumption **(6) central banker restrictions unknown**, the Week 2 plan ("both founders at ABA Charlotte working the floor") has a theoretical failure mode: if the ethics call reveals blanket restrictions on in-person contact with US banks, the central banker's ABA presence becomes a liability rather than an asset. **Mitigation baked in:** even under blanket restriction, attending ABA as a general attendee (not working the floor explicitly as a FinRisk founder) is nearly always permissible as continuing-education, and the central banker's booth conversations can be framed as academic/research rather than sales. **Practical rule:** if the ethics call produces any "yellow light" signal, the central banker attends Charlotte but does NOT carry business cards or pitch; Pranik does 100% of the selling. Plan still works.

---

## Files relevant to this report (absolute paths)

- `/Users/pranikchainani/FinRisk/docs/research/round1_research.md`
- `/Users/pranikchainani/FinRisk/docs/research/round1_critique.md`
- `/Users/pranikchainani/FinRisk/docs/research/round2_research.md`
- `/Users/pranikchainani/FinRisk/docs/research/round2_critique.md`
- `/Users/pranikchainani/FinRisk/docs/research/round3_final_research.md`
- `/Users/pranikchainani/FinRisk/docs/research/round3_final_critique.md`
- `/Users/pranikchainani/FinRisk/docs/competitive-landscape-report.md`
- `/Users/pranikchainani/FinRisk/src/engines/vasicekEngine.js`
- `/Users/pranikchainani/FinRisk/src/engines/liquidityStressEngine.js`
- `/Users/pranikchainani/FinRisk/src/engines/mathUtils.js`
- `/Users/pranikchainani/FinRisk/src/data/stressScenarioLibrary.js`
- `/Users/pranikchainani/FinRisk/src/data/syntheticData.js`
- `/Users/pranikchainani/FinRisk/.claude/agent-memory/finrisk-ai-architect/MEMORY.md`
- `/Users/pranikchainani/FinRisk/.claude/agent-memory/finrisk-ai-architect/project_round4_consolidated.md` (new this round)
