# FinRisk AI

Intelligent risk management dashboard for financial institutions. Built with React, Recharts, and Tailwind CSS.

**Live Demo:** [pranikc.github.io/FinRisk](https://pranikc.github.io/FinRisk/)

## Overview

FinRisk AI is a comprehensive risk monitoring platform for a simulated commercial bank (Atlantic Federal Bank, $48.7B total assets). It provides real-time dashboards across credit, market, liquidity, and stress testing risk domains, powered by a multi-agent AI architecture.

## Features

- **Risk Dashboard** - Composite risk scores, 30-day trends, active alerts, and AI agent activity
- **Credit Risk** - Portfolio analysis by rating and sector, migration trends, top exposures, concentration monitoring
- **Market Risk** - VaR/ES analysis, P&L attribution, sensitivity analysis, position monitoring
- **Liquidity Risk** - LCR/NSFR regulatory ratios, cash flow ladder, HQLA composition, funding mix
- **Stress Testing** - 9 historical/hypothetical/regulatory scenarios with 4 severity levels, Vasicek PD stress (Basel IRB), capital waterfall, tornado charts, survival horizon analysis, and scenario comparison
- **AI Agents** - 6 specialized risk agents (Credit Sentinel, Market Watcher, Liquidity Monitor, Correlation Tracker, Stress Architect, Compliance Guardian)

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS v4** - Dark glass-morphism design
- **Recharts** - Financial charts and visualizations
- **Lucide React** - Icon library
- Zero backend dependencies - all computation runs client-side

## Running Locally

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/
    Dashboard/          # Main risk dashboard
    CreditRisk/         # Credit portfolio analysis
    MarketRisk/         # VaR, stress tests, sensitivities
    LiquidityRisk/      # LCR/NSFR, cash flows, funding
    StressTesting/      # 8 stress testing components
    Agents/             # AI agent monitoring
    Layout/             # Sidebar, TopBar
  contexts/             # React Context (StressTestContext)
  engines/              # Math & computation engines
    mathUtils.js        # Normal CDF/Inverse (Abramowitz & Stegun, Acklam)
    vasicekEngine.js    # Basel IRB Vasicek PD stress
    creditStressEngine.js
    liquidityStressEngine.js
    scenarioEngine.js   # Orchestrates all stress computations
  data/
    syntheticData.js    # Synthetic bank portfolio data
    stressScenarioLibrary.js  # 9 scenarios × 4 severities × 21 risk factors
```
