---
name: project_demo_state
description: FinRisk demo is client-side React/Vite with real Vasicek IRB math + synthetic portfolio; models layer is the wedge to build next
type: project
---

FinRisk demo (as of 2026-04-23) is a React 18 + Vite + Tailwind v4 + Recharts SPA with zero backend. Simulated institution: "Atlantic Federal Bank" ($48.7B assets).

What is REAL in the demo:
- `src/engines/vasicekEngine.js` — correct Basel IRB single-factor Vasicek conditional-PD formula with Basel asset-correlation curve
- `src/engines/mathUtils.js` — Acklam normal inverse + Abramowitz/Stegun normal CDF
- `src/engines/liquidityStressEngine.js` — LCR/NSFR/survival-days arithmetic
- `src/data/stressScenarioLibrary.js` — 9 scenarios x 4 severities x 21 risk factors, hand-calibrated (GFC-2008, COVID-2020, 2022 rate shock, CCAR Severely Adverse, NGFS climate etc.)

What is MOCKED:
- Portfolio composition, rating distribution, sector exposures, P&L history, alerts, AI-agent activity logs — all from `syntheticData.js` using `Math.random()` / Box-Muller
- No training data, no fitted models, no backtests, no actual loans, no market data feeds

Three prior research rounds (`docs/research/round{1,2,3}_*.md`) scored the stress-testing module spec at 9.5/10 for implementation-readiness — those cover only the stress module, not the broader model/data strategy.

Prior competitive-landscape doc (`docs/competitive-landscape-report.md`) already covers Moody's, SAS, Bloomberg, MSCI, FIS, Oracle, Murex, Zest AI, Upstart in depth — reference rather than duplicate when advising.

**Why this matters:** The gap from "demo" to "defensible" is the models-and-data layer, not the UI. That's where advice should focus.

**How to apply:** When recommending next steps, preserve the existing demo narrative (Atlantic Federal Bank, 9 scenarios, Vasicek IRB) so upgrades are additive rather than rewrites. Propose real models that can plug into the existing ShockVector interface.
