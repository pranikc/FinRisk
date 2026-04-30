# FinRisk — Executive Brief (Companion to Master Report)

**Version:** Round 4 Executive Brief | **Date:** 2026-04-23
**Companion to:** `round4_master_report.md` (full 70KB master reference)
**Audience:** co-founder, advisor, or pre-seed investor — what to read before opening the full report

---

The consolidated reference document is on disk. This is what you can hand to a co-founder, advisor, or pre-seed investor.

## Structure (13 sections + appendices)

| § | Section | Core content |
|---|---|---|
| TL;DR | Monday-morning action box | 5 actions, 5 days, 5 owners — Mon 04-27 through Fri 05-01 |
| 1 | Executive Summary | Product, wedge, plan, exit thesis, pre-seed ask all in one page |
| 2 | Problem & Market | Why $10B–$50B mid-market needs this; incumbent weakness map; post-SVB/NYCB pull; ~70 institutions = $5–20M ARR trajectory |
| 3 | The Product | What's real today (Vasicek IRB, 9 scenarios, LCR/NSFR), what ships by Week 20, explicit **no-list** (no FTP, no decision-of-record, no FRTB IMA, no consumer scoring, no BSA/AML, no non-US) |
| 4 | Competitive Positioning | Three lanes (decision-of-record / co-pilot / advisory) — FinRisk is **advisory/challenger** in v1 |
| 5 | Data Strategy | Free sources (FFIEC, FRED, Fannie/Freddie, NCUA, SEC EDGAR), seed unlock list ($100–150K/yr), full benchmarking-clause contract language with k≥5 / 40% concentration caps, GLBA implications |
| 6 | Models & Papers | Condensed reference: credit (Vasicek, Merton, KMV, CreditMetrics, GBM, survival, IFRS9/CECL), market (HS VaR, GARCH, EVT, copulas), liquidity/IRRBB (LCR, EVE/NII, NMD), op/stress (SMA, LDA, CCAR, NGFS, reverse stress), interpretability (SHAP, LIME, ALE) |
| 7 | Regulatory & Compliance Gate | SR 11-7 tiering (FinRisk = Tier 2/3), SOC 2 timeline (Type I Wk 20, Type II Q3 2027), ECOA/GLBA, VRM questionnaire prep |
| 8 | Architecture | BYOC topology diagram, $25K Skyrun credit line-by-line budget, per-customer cost ($500–1,500/mo FinRisk side, 85–95% gross margin) |
| 9 | Go-to-Market | Buying committee (CRO/Treasurer/MRM/CFO), **15 Tier-1 named banks + 25 Tier-2**, ABA Charlotte Week-2 playbook, copy-paste 3-email sequence, LinkedIn InMail, 30-min pitch framework, 8-point discovery qualification checklist |
| 10 | 20-Week Execution Plan | Week-by-week with owner + success criterion; **3 hard gates at Weeks 4, 12, 20**; 4-risk-and-mitigation table |
| 11 | Org Assumptions & Risks | The 6 open-question defaults (so you can correct them), the central-banker-restriction decision matrix (Fed/OCC/FDIC → 1-yr cooling-off fallback: Pranik fronts restricted banks), what-breaks-the-plan list, budget sanity check |
| 12 | Exit & Fundraise | Base case: Moody's/Wolters/Abrigo tuck-in at $20M ARR × 7× = ~$140M exit / $60–70M founder take. Moonshot: Adenza-style at $10.5B/17.8× rev. Round: **$1.25M / $7M post / 20% discount / MFN / ~17.8% dilution**. Target list: QED, Nyca, Fin Capital, Better Tomorrow + angels from nCino/Alloy/Verafin/Plaid/Moody's |
| 13 | Appendices | Data source URLs, copy-paste bank outreach table, email templates, Terraform resource list, primary-source citations, 40-term acronym glossary |

## The Monday-morning action box — 5 people, 5 days

| Day | Owner | P0 |
|---|---|---|
| **Mon 04-27** | Pranik | File Delaware C-corp via Stripe Atlas ($500) — **blocker for all LOI signings** |
| **Mon 04-27** | Central banker | Ethics call to prior employer. Get post-employment restrictions in writing. **Gate for Day-3 outreach.** |
| **Tue 04-28** | Both | Register ABA Risk & Compliance Charlotte May 5–7 ($6–8K) — **9 days out** |
| **Wed 04-29** | Both (4-hr timebox) | Warm-intro brainstorm (Yale SOM + CB's regulator alumni + Skyrun LPs) + LinkedIn Sales Nav setup. Send warm asks **before** any cold email. |
| **Thu 04-30** | Pranik | Cloud control-plane bootstrap on Skyrun $25K credits (Cloudflare Workers, Terraform skeleton, no data plane) |
| **Fri 05-01** | Central banker | Whitepaper v0 outline: "Mid-Market Bank Stress Testing Beyond DFAST" |

## The key financial/strategic decisions locked

- **Target:** ~70 US banks, $10B–$50B assets (Category IV tailored prudential)
- **Wedge:** advisory/challenger (SR 11-7 Tier 2/3), not decision-of-record
- **Deployment:** BYOC (customer AWS + customer KMS), not multi-tenant SaaS
- **Geography:** US-only until $5M ARR / Series A
- **Product scope:** stress + credit challenger + IRRBB/ALM unified; no FTP, no IMA, no consumer scoring
- **Moat:** benchmarking-data clause in every DUA (k≥5 minimum-N aggregation) → unlocks 8–10× ARR exit vs 5× tool-vendor exit
- **Pre-seed ask:** $1.25M / $7M post / 17.8% dilution; lead target QED Fontes or Nyca Partners
- **14-month runway target:** 2 signed design partners @ $150–300K ACV + SOC 2 Type I complete + whitepaper with 2K qualified downloads = Series A inflection

## Coherence check the agent flagged

Under the "central banker ethics restrictions unknown" default, the Week-2 "both at ABA Charlotte" plan has one failure mode: if the ethics call reveals blanket US-bank contact restrictions, the central banker becomes a liability on the conference floor. **Mitigation baked in:** central banker attends as "academic/research" attendee (almost always permissible), does not carry cards or pitch; Pranik does 100% of selling. Plan still works.

---

**For the full detail behind any row in this brief — including the 15 named Tier-1 banks, the benchmarking-clause contract language, the copy-paste email templates, the week-by-week execution plan, and the investor target list — see `round4_master_report.md`.**
