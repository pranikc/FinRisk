---
name: project_constraints
description: FinRisk pre-seed constraints (runway, team, geo, cloud credits, data budget, product scope) as of 2026-04-23
type: project
---

FinRisk constraints confirmed by Pranik on 2026-04-23 (updated Round 3):

- **Geography v1:** US-only. Locked. Revisit post-$5M ARR or post-Series A.
- **Runway:** Pre-seed. ~$250K–$750K total available; 6–12 months before next raise.
- **Founding team composition:**
  - Pranik (founder, technical, runs outreach alongside co-founder)
  - Central banker co-founder — **Yale student (presumably MBA/MPP/PhD), all-hours availability**, no competing full-time job. Heavy load on research, regulator-adjacent outreach, whitepaper, model-risk docs.
- **Warm intros to banks: ZERO.** Biggest gap. Must run pure cold outreach from named lists. Both founders personally run outreach — not outsourced.
- **Data-licensing budget 2026:** $0 committed. Free sources only (FRED, FFIEC Call Reports, FHFA HPI, NCUA 5300, BLS, FDIC SDI, SEC EDGAR, FR Y-9C, FR Y-14 where public).
- **Skyrun.ai cloud credits:** **$25K total** — lean, ~5–8 months of modest AWS. No always-on GPU. No multi-AZ RDS until paid customer. Serverless + S3 + spot + on-demand. May need Hetzner / Cloudflare Workers for control plane until revenue.
- **Product scope v1:** Stress testing + ICAAP + Treasury/ALM (IRRBB, EVE, NII sensitivity, deposit-behavior modeling, LCR/NSFR). Competing with DCG, Empyrean, Abrigo on the ALM side; QRM/Moody's/OneSumX at upper end.
- **Benchmarking-data clause in DUAs:** Agreed — include it. Peer-benchmark product is part of the data-moat thesis.
- **Deployment model:** BYOC (Bring Your Own Cloud) into customer AWS account. Pranik confirmed.
- **Regulatory positioning:** Advisory-first. Not "model of record." Customer's own model governance signs off; FinRisk supplies challenger/scenario engine and documentation.

**Why:** These constraints tightly bound what's possible in the next 20 weeks. $25K cloud cap + zero warm intros + two founders doing outreach themselves = every week of dev time not spent on outreach-enabling material (whitepaper, demo, benchmark preview) is a wasted week.

**How to apply:**
- Any architecture recommendation must fit inside $25K Skyrun credits through Phase 0+1 (~20 weeks).
- Any go-to-market recommendation must assume cold outreach by 2 founders, no warm intros, no budget for BDR hires.
- Any product-scope recommendation must serve the combined CRO + Treasurer + Head of ALM buying committee at $10B–$50B US banks.
- Any competitive positioning must address DCG and Empyrean by name (not just "incumbents").
