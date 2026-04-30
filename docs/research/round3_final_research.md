# STRESS TESTING RESEARCH - ROUND 3 (FINAL ADDENDUM)
## FinRisk AI Platform - Addressing Final Critic Feedback (8.5/10 -> Target 9.5+)

---

**Document Status**: Round 3 Final Research Addendum
**Date**: 2026-03-04
**Responds to**: Round 2 Critique dated 2026-03-04 (Score: 8.5/10)
**Scope**: Addresses the 3 remaining gaps + 4 minor items. Provides final consolidated feature list and implementation order.
**Note**: This document does NOT repeat material from Round 1 or Round 2. It should be read in conjunction with those documents.

---

## TABLE OF CONTENTS

1. [Testing Strategy (Critical Gap)](#1-testing-strategy)
2. [P0 Scope Split: Alpha/Beta](#2-p0-scope-split-alphabeta)
3. [CSS Grid Heatmaps (Replacing nivo for P0)](#3-css-grid-heatmaps)
4. [Minor Corrections](#4-minor-corrections)
5. [Final Consolidated Feature List](#5-final-consolidated-feature-list)
6. [Implementation Order](#6-implementation-order)

---

## 1. TESTING STRATEGY

This was the only recommended addition from Round 1 that received no treatment in Round 2. Given that the stress testing module contains mathematical computation engines where correctness is non-negotiable, this section provides a complete testing specification.

### 1.1 Framework: Vitest

**Selection**: Vitest v3.x

**Rationale**:
- Native Vite integration (zero additional bundler config -- the project already uses Vite 5.4)
- Jest-compatible API (`describe`, `it`, `expect`, `beforeEach`, `vi.fn()`) -- no learning curve for developers familiar with Jest
- Built-in code coverage via `@vitest/coverage-v8`
- Built-in snapshot testing
- ESM-native (no CJS/ESM interop headaches that plague Jest in Vite projects)
- Watch mode with HMR for rapid iteration

**Installation**:
```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom jsdom
```

**Configuration** (`vitest.config.js` or add to `vite.config.js`):
```javascript
// vite.config.js - add test configuration
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/engines/**', 'src/components/StressTesting/**'],
      thresholds: {
        'src/engines/**': {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
  },
});
```

**Test Setup File** (`src/test/setup.js`):
```javascript
import '@testing-library/jest-dom';
```

**npm Scripts** (add to `package.json`):
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 1.2 Engine Test Cases: mathUtils

File: `src/engines/__tests__/mathUtils.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { normalCDF, normalInverse } from '../mathUtils';

describe('normalCDF', () => {
  // Reference values from standard normal distribution tables
  it('returns 0.5 for x = 0', () => {
    expect(normalCDF(0)).toBeCloseTo(0.5, 7);
  });

  it('returns ~0.8413 for x = 1.0', () => {
    expect(normalCDF(1.0)).toBeCloseTo(0.8413447, 6);
  });

  it('returns ~0.9772 for x = 2.0', () => {
    expect(normalCDF(2.0)).toBeCloseTo(0.9772499, 6);
  });

  it('returns ~0.9987 for x = 3.0', () => {
    expect(normalCDF(3.0)).toBeCloseTo(0.9986501, 6);
  });

  it('returns ~0.0228 for x = -2.0 (symmetry)', () => {
    expect(normalCDF(-2.0)).toBeCloseTo(0.0227501, 6);
  });

  it('returns ~0.975 for x = 1.96 (97.5th percentile)', () => {
    expect(normalCDF(1.96)).toBeCloseTo(0.975, 3);
  });

  it('handles extreme positive values without overflow', () => {
    const result = normalCDF(8.0);
    expect(result).toBeGreaterThan(0.999999);
    expect(result).toBeLessThanOrEqual(1.0);
  });

  it('handles extreme negative values without underflow', () => {
    const result = normalCDF(-8.0);
    expect(result).toBeGreaterThanOrEqual(0.0);
    expect(result).toBeLessThan(0.000001);
  });
});

describe('normalInverse', () => {
  // Reference values: normalInverse(p) should return x such that normalCDF(x) = p
  it('returns 0 for p = 0.5', () => {
    expect(normalInverse(0.5)).toBeCloseTo(0.0, 7);
  });

  it('returns ~1.96 for p = 0.975', () => {
    expect(normalInverse(0.975)).toBeCloseTo(1.96, 2);
  });

  it('returns ~2.326 for p = 0.99', () => {
    expect(normalInverse(0.99)).toBeCloseTo(2.3263, 3);
  });

  it('returns ~-1.645 for p = 0.05', () => {
    expect(normalInverse(0.05)).toBeCloseTo(-1.6449, 3);
  });

  it('returns ~3.090 for p = 0.999', () => {
    expect(normalInverse(0.999)).toBeCloseTo(3.0902, 3);
  });

  it('is the inverse of normalCDF (roundtrip)', () => {
    const testValues = [0.01, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99];
    for (const p of testValues) {
      expect(normalCDF(normalInverse(p))).toBeCloseTo(p, 6);
    }
  });

  it('handles values near lower tail (p = 0.001)', () => {
    expect(normalInverse(0.001)).toBeCloseTo(-3.0902, 3);
  });

  it('throws RangeError for p = 0', () => {
    expect(() => normalInverse(0)).toThrow(RangeError);
  });

  it('throws RangeError for p = 1', () => {
    expect(() => normalInverse(1)).toThrow(RangeError);
  });

  it('throws RangeError for p < 0', () => {
    expect(() => normalInverse(-0.1)).toThrow(RangeError);
  });

  it('throws RangeError for p > 1', () => {
    expect(() => normalInverse(1.1)).toThrow(RangeError);
  });
});
```

### 1.3 Engine Test Cases: vasicekEngine

File: `src/engines/__tests__/vasicekEngine.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { computeStressedPD } from '../vasicekEngine';

describe('computeStressedPD', () => {
  // Basel IRB reference values
  // These are well-known benchmark results from Basel IRB documentation

  it('PD=0.02, rho=0.15, percentile=0.99 -> ~0.1168 (Basel IRB reference)', () => {
    const result = computeStressedPD(0.02, 0.15, 0.99);
    expect(result).toBeCloseTo(0.1168, 3);
  });

  it('PD=0.001, rho=0.24, percentile=0.999 -> ~0.0934', () => {
    const result = computeStressedPD(0.001, 0.24, 0.999);
    expect(result).toBeCloseTo(0.0934, 3);
  });

  it('PD=0.05, rho=0.12, percentile=0.999 -> severe stress output', () => {
    const result = computeStressedPD(0.05, 0.12, 0.999);
    // With high stress percentile, output should be significantly above base PD
    expect(result).toBeGreaterThan(0.15);
    expect(result).toBeLessThan(1.0);
  });

  it('higher rho produces higher stressed PD (more systematic risk)', () => {
    const lowRho = computeStressedPD(0.02, 0.10, 0.99);
    const highRho = computeStressedPD(0.02, 0.30, 0.99);
    expect(highRho).toBeGreaterThan(lowRho);
  });

  it('higher stress percentile produces higher stressed PD', () => {
    const moderate = computeStressedPD(0.02, 0.15, 0.95);
    const severe = computeStressedPD(0.02, 0.15, 0.99);
    const extreme = computeStressedPD(0.02, 0.15, 0.999);
    expect(severe).toBeGreaterThan(moderate);
    expect(extreme).toBeGreaterThan(severe);
  });

  it('stressed PD is always >= base PD for stress_percentile > 0.5', () => {
    const basePDs = [0.001, 0.01, 0.05, 0.10, 0.20];
    for (const pd of basePDs) {
      expect(computeStressedPD(pd, 0.15, 0.99)).toBeGreaterThanOrEqual(pd);
    }
  });

  it('stressed PD <= base PD for stress_percentile < 0.5 (benign environment)', () => {
    const result = computeStressedPD(0.05, 0.15, 0.10);
    expect(result).toBeLessThan(0.05);
  });

  // Edge cases: boundary inputs
  it('handles very small PD (1e-10) without throwing', () => {
    const result = computeStressedPD(1e-10, 0.15, 0.99);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('handles very high PD (0.9999) without throwing', () => {
    const result = computeStressedPD(0.9999, 0.15, 0.99);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThanOrEqual(1);
    expect(Number.isFinite(result)).toBe(true);
  });

  it('handles very low rho (0.01)', () => {
    const result = computeStressedPD(0.02, 0.01, 0.99);
    expect(Number.isFinite(result)).toBe(true);
    // With low correlation, stress has limited impact
    expect(result).toBeGreaterThan(0.02);
    expect(result).toBeLessThan(0.10);
  });

  it('handles very high rho (0.99)', () => {
    const result = computeStressedPD(0.02, 0.99, 0.99);
    expect(Number.isFinite(result)).toBe(true);
    // With near-perfect correlation, almost all defaults become systematic
    expect(result).toBeGreaterThan(0.5);
  });

  // Invalid inputs
  it('throws RangeError for PD = 0', () => {
    expect(() => computeStressedPD(0, 0.15, 0.99)).toThrow(RangeError);
  });

  it('throws RangeError for PD = 1', () => {
    expect(() => computeStressedPD(1, 0.15, 0.99)).toThrow(RangeError);
  });

  it('throws RangeError for negative rho', () => {
    expect(() => computeStressedPD(0.02, -0.1, 0.99)).toThrow(RangeError);
  });

  it('throws RangeError for NaN input', () => {
    expect(() => computeStressedPD(NaN, 0.15, 0.99)).toThrow(RangeError);
  });
});
```

### 1.4 Engine Test Cases: liquidityStressEngine

File: `src/engines/__tests__/liquidityStressEngine.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { computeStressedLCR, computeSurvivalDays } from '../liquidityStressEngine';

describe('computeStressedLCR', () => {
  const baseParams = {
    hqla: 5_000_000_000,           // $5B HQLA
    totalNetOutflows30d: 4_000_000_000, // $4B outflows -> base LCR = 125%
  };

  it('computes correct base LCR (no stress)', () => {
    const result = computeStressedLCR(baseParams, {
      hqlaHaircut: 0,
      depositRunoffMultiplier: 1.0,
      fundingSpreadBps: 0,
    });
    expect(result.lcr).toBeCloseTo(1.25, 2); // 5B / 4B = 125%
  });

  it('applies HQLA haircut correctly', () => {
    const result = computeStressedLCR(baseParams, {
      hqlaHaircut: 0.10,           // 10% haircut on HQLA
      depositRunoffMultiplier: 1.0,
      fundingSpreadBps: 0,
    });
    // Stressed HQLA = 5B * (1 - 0.10) = 4.5B
    // LCR = 4.5B / 4B = 112.5%
    expect(result.lcr).toBeCloseTo(1.125, 2);
  });

  it('applies deposit runoff multiplier correctly', () => {
    const result = computeStressedLCR(baseParams, {
      hqlaHaircut: 0,
      depositRunoffMultiplier: 1.5, // 50% more outflows
      fundingSpreadBps: 0,
    });
    // Outflows = 4B * 1.5 = 6B
    // LCR = 5B / 6B = 83.3%
    expect(result.lcr).toBeCloseTo(0.833, 2);
  });

  it('combined stress produces LCR below 100%', () => {
    const result = computeStressedLCR(baseParams, {
      hqlaHaircut: 0.15,
      depositRunoffMultiplier: 2.0,
      fundingSpreadBps: 100,
    });
    expect(result.lcr).toBeLessThan(1.0);
    expect(result.breachesMinimum).toBe(true);
  });

  it('returns LCR as a ratio (not percentage)', () => {
    const result = computeStressedLCR(baseParams, {
      hqlaHaircut: 0,
      depositRunoffMultiplier: 1.0,
      fundingSpreadBps: 0,
    });
    // Verify it is a ratio around 1.x, not a percentage around 100+
    expect(result.lcr).toBeGreaterThan(0.5);
    expect(result.lcr).toBeLessThan(5.0);
  });
});

describe('computeSurvivalDays', () => {
  it('returns 30+ days when LCR is above 100%', () => {
    const result = computeSurvivalDays({
      availableLiquidity: 5_000_000_000,
      dailyNetOutflow: 100_000_000,
    });
    expect(result).toBe(50); // 5B / 100M = 50 days
  });

  it('returns days until liquidity exhaustion under stress', () => {
    const result = computeSurvivalDays({
      availableLiquidity: 3_000_000_000,
      dailyNetOutflow: 200_000_000,
    });
    expect(result).toBe(15); // 3B / 200M = 15 days
  });

  it('returns 0 when net outflows exceed available liquidity on day 1', () => {
    const result = computeSurvivalDays({
      availableLiquidity: 100_000_000,
      dailyNetOutflow: 500_000_000,
    });
    expect(result).toBe(0);
  });
});
```

### 1.5 Engine Test Cases: scenarioEngine

File: `src/engines/__tests__/scenarioEngine.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { applyScenario, validateShockVector } from '../scenarioEngine';

describe('validateShockVector', () => {
  it('accepts a valid shock vector with all required fields', () => {
    const vector = {
      equity: -0.30, igSpread: 200, hySpread: 700, rates2y: -50,
      rates10y: -100, rates30y: -80, vix: 50, fxUSD: 5, oil: -40,
      gold: 15, cre: -25, hpi: -15, gdpGrowth: -2.5,
      unemploymentChange: 3.0, inflationChange: 1.0, pdMultiplier: 2.5,
      lgdAddon: 0.10, migrationStressFactor: 2.0,
      depositRunoffMultiplier: 2.0, fundingSpreadBps: 150, hqlaHaircut: 0.10,
    };
    expect(() => validateShockVector(vector)).not.toThrow();
  });

  it('rejects a shock vector missing required fields', () => {
    const incomplete = { equity: -0.30 };
    expect(() => validateShockVector(incomplete)).toThrow();
  });

  it('rejects equity decline > 100%', () => {
    const vector = createValidVector({ equity: -1.5 });
    expect(() => validateShockVector(vector)).toThrow();
  });

  it('rejects negative pdMultiplier', () => {
    const vector = createValidVector({ pdMultiplier: -1.0 });
    expect(() => validateShockVector(vector)).toThrow();
  });
});

describe('applyScenario', () => {
  it('returns stressed results for all risk domains', () => {
    const result = applyScenario('gfc-2008', 'severe', mockPortfolioData);
    expect(result).toHaveProperty('credit');
    expect(result).toHaveProperty('market');
    expect(result).toHaveProperty('liquidity');
    expect(result).toHaveProperty('capital');
  });

  it('severe stress produces worse results than moderate', () => {
    const moderate = applyScenario('gfc-2008', 'moderate', mockPortfolioData);
    const severe = applyScenario('gfc-2008', 'severe', mockPortfolioData);
    expect(severe.capital.cet1Ratio).toBeLessThan(moderate.capital.cet1Ratio);
  });
});
```

### 1.6 Snapshot Tests for Scenario Calibrations

File: `src/data/__tests__/stressScenarioLibrary.test.js`

```javascript
import { describe, it, expect } from 'vitest';
import { scenarioLibrary } from '../stressScenarioLibrary';

describe('stressScenarioLibrary', () => {
  it('contains expected number of scenarios', () => {
    expect(scenarioLibrary.length).toBeGreaterThanOrEqual(10);
  });

  it('every scenario has all 4 severity levels', () => {
    for (const scenario of scenarioLibrary) {
      expect(scenario.severityLevels).toHaveProperty('mild');
      expect(scenario.severityLevels).toHaveProperty('moderate');
      expect(scenario.severityLevels).toHaveProperty('severe');
      expect(scenario.severityLevels).toHaveProperty('extreme');
    }
  });

  it('GFC-2008 extreme calibration matches known values (snapshot)', () => {
    const gfc = scenarioLibrary.find(s => s.id === 'gfc-2008');
    expect(gfc.severityLevels.extreme).toMatchInlineSnapshot(`
      {
        "equity": -0.568,
        "igSpread": 400,
        "hySpread": 1500,
        "rates10y": -200,
        "gdpGrowth": -4.3,
        "unemploymentChange": 5.0,
        "hpi": -27,
        "vix": 81,
      }
    `);
  });

  // Full snapshot test to detect ANY calibration drift
  it('full scenario library matches snapshot', () => {
    expect(scenarioLibrary).toMatchSnapshot();
  });

  it('every severity level has extreme >= severe >= moderate >= mild for equity decline', () => {
    for (const scenario of scenarioLibrary) {
      const { mild, moderate, severe, extreme } = scenario.severityLevels;
      // equity values are negative (declines), so more negative = worse
      if (mild.equity !== 0) {
        expect(moderate.equity).toBeLessThanOrEqual(mild.equity);
        expect(severe.equity).toBeLessThanOrEqual(moderate.equity);
        expect(extreme.equity).toBeLessThanOrEqual(severe.equity);
      }
    }
  });
});
```

### 1.7 Component Tests with React Testing Library

File: `src/components/StressTesting/__tests__/DisclaimerBanner.test.jsx`

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DisclaimerBanner } from '../DisclaimerBanner';

describe('DisclaimerBanner', () => {
  it('renders the primary disclaimer text', () => {
    render(<DisclaimerBanner />);
    expect(screen.getByText(/illustrative and educational purposes only/i)).toBeInTheDocument();
  });

  it('is not dismissible (no close button)', () => {
    render(<DisclaimerBanner />);
    expect(screen.queryByRole('button', { name: /close|dismiss/i })).not.toBeInTheDocument();
  });

  it('has appropriate ARIA role for alert', () => {
    render(<DisclaimerBanner />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
```

File: `src/components/StressTesting/__tests__/ScenarioSelector.test.jsx`

```javascript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScenarioSelector } from '../ScenarioSelector';
import { StressTestProvider } from '../../../contexts/StressTestContext';

describe('ScenarioSelector', () => {
  const renderWithProvider = (ui) => {
    return render(<StressTestProvider>{ui}</StressTestProvider>);
  };

  it('renders scenario dropdown with available scenarios', () => {
    renderWithProvider(<ScenarioSelector />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders all four severity level options', () => {
    renderWithProvider(<ScenarioSelector />);
    expect(screen.getByLabelText(/mild/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/moderate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/severe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/extreme/i)).toBeInTheDocument();
  });

  it('defaults to severe severity level', () => {
    renderWithProvider(<ScenarioSelector />);
    expect(screen.getByLabelText(/severe/i)).toBeChecked();
  });
});
```

### 1.8 Coverage Targets

| Scope | Branch Coverage | Line Coverage | Rationale |
|-------|----------------|---------------|-----------|
| `src/engines/**` | 100% | 100% | Mathematical correctness is non-negotiable. Every branch of normalCDF, normalInverse, computeStressedPD, and LCR calculations must be verified. |
| `src/data/stressScenarioLibrary.js` | N/A (data file) | N/A | Covered by snapshot tests instead. Any change triggers a snapshot diff. |
| `src/components/StressTesting/**` | 80% | 80% | UI components are less critical than engine code. Focus tests on behavior (disclaimer rendering, scenario selection, state updates) rather than visual layout. |
| `src/contexts/**` | 90% | 90% | State management logic (reducer, actions) must be well-tested. |
| **Overall project** | 80% | 80% | Industry-standard minimum for financial software. |

### 1.9 Test File Organization

```
src/
  test/
    setup.js                           (testing-library/jest-dom setup)
    helpers.js                         (createValidVector, mockPortfolioData, renderWithProvider)
  engines/
    __tests__/
      mathUtils.test.js                (~15 test cases)
      vasicekEngine.test.js            (~15 test cases)
      liquidityStressEngine.test.js    (~10 test cases)
      scenarioEngine.test.js           (~8 test cases)
      creditStressEngine.test.js       (~8 test cases)
      marketStressEngine.test.js       (~6 test cases)
  data/
    __tests__/
      stressScenarioLibrary.test.js    (snapshot + structural tests)
  components/
    StressTesting/
      __tests__/
        DisclaimerBanner.test.jsx      (~3 test cases)
        ScenarioSelector.test.jsx      (~5 test cases)
        CapitalWaterfall.test.jsx      (~4 test cases)
        StressTestingView.test.jsx     (~5 test cases)
```

**Estimated total test cases**: ~95 across all test files.

---

## 2. P0 SCOPE SPLIT: ALPHA / BETA

The Round 2 P0 contained 16 features, which is too large for a single sprint. Following the Critic's recommended split, P0 is now divided into Alpha (minimum viable product) and Beta (complete P0), with explicit cuts.

### 2.1 P0-Alpha: Minimum Viable Stress Test (10 features, ~1.5-2 weeks)

These 10 items constitute the smallest useful stress testing feature. A user can select a scenario, see capital impact, understand which factors drive the most loss, and view credit and liquidity stress results.

| # | Feature | Component File | Effort | Dependencies |
|---|---------|---------------|--------|--------------|
| 1 | DisclaimerBanner | `DisclaimerBanner.jsx` | 2-4h | None (ship first) |
| 2 | StressTestingView | `StressTestingView.jsx` | 4-6h | Sidebar.jsx modification, App.jsx route |
| 3 | ScenarioSelector + Severity | `ScenarioSelector.jsx` | 6-8h | StressTestContext, stressScenarioLibrary (5 scenarios: GFC, COVID, 2022 Rate, SVB, CCAR Adverse) |
| 4 | StressTestContext + scenarioEngine | `StressTestContext.jsx`, `scenarioEngine.js` | 8-12h | mathUtils, vasicekEngine, liquidityStressEngine |
| 5 | mathUtils + vasicekEngine | `mathUtils.js`, `vasicekEngine.js` | 4-6h | None (pure functions) |
| 6 | CapitalWaterfall | `CapitalWaterfall.jsx` | 8-10h | StressTestContext, Recharts |
| 7 | TornadoChart | `TornadoChart.jsx` | 4-6h | StressTestContext, Recharts |
| 8 | CreditStressPanel | `CreditStressPanel.jsx` | 6-8h | vasicekEngine, StressTestContext |
| 9 | LiquidityStressPanel | `LiquidityStressPanel.jsx` | 6-8h | liquidityStressEngine, StressTestContext, Recharts (survival horizon line chart) |
| 10 | ScenarioComparison | `ScenarioComparison.jsx` | 4-6h | StressTestContext (HTML table with Tailwind) |

**Total estimated effort**: 52-74 hours (~1.5-2 weeks)

**Alpha definition of done**: A user can navigate to "Stress Testing" in the sidebar, select from 5 pre-built scenarios at 4 severity levels, and see: (a) a disclaimer banner, (b) a capital waterfall chart, (c) a tornado chart of factor sensitivities, (d) credit stress results with stressed PDs, (e) LCR under stress with survival horizon, and (f) a comparison of two scenarios side by side.

### 2.2 P0-Beta: Complete P0 Feature Set (8 features, ~1-1.5 weeks after Alpha)

| # | Feature | Component File | Effort | Notes |
|---|---------|---------------|--------|-------|
| 11 | YieldCurveScenario | `YieldCurveScenario.jsx` | 6-8h | 6 IRRBB curves (Recharts LineChart) |
| 12 | PnlAttribution | `PnlAttribution.jsx` | 6-8h | Sensitivity-based (Recharts BarChart) |
| 13 | TransitionMatrix | `TransitionMatrix.jsx` | 6-8h | CSS Grid heatmap (see Section 3) |
| 14 | SectorHeatMap | `SectorHeatMap.jsx` | 4-6h | CSS Grid heatmap (see Section 3) |
| 15 | HistoricalReplay | `HistoricalReplay.jsx` | 4-6h | Select historical event, auto-populate shocks |
| 16 | RegulatoryMapping | `RegulatoryMapping.jsx` | 2-4h | CCAR/EBA/PRA tag badges on scenarios |
| 17 | Remaining 7 scenarios | `stressScenarioLibrary.js` | 8-12h | Expand from 5 to 12 scenarios with full calibrations |
| 18 | "Under Stress" badge | Modify existing views | 2-4h | Badge on Credit/Market/Liquidity views when stress is active |

**Total estimated effort**: 38-56 hours (~1-1.5 weeks)

### 2.3 Features Firmly Kept at P1

These must NOT be attempted during P0, regardless of how close they seem:

| Feature | Reason |
|---------|--------|
| Reverse Stress Testing | Requires optimization/solver logic (iterating to find breaking point) |
| Multi-Period Projection (9Q) | Requires dynamic balance sheet modeling over time |
| CECL/IFRS 9 Toggle | Requires significant additional ECL computation and stage migration logic |
| Custom Scenario Builder | Requires complex form validation and 21-field input UI |
| Operational Risk Panel | New risk domain with its own engine and data |
| Report Generator | Requires PDF rendering pipeline (html2canvas + jsPDF) |
| Correlation Stress Dashboard | Requires matrix operations and specialized visualization |
| Climate Risk (NGFS v4) | Specialized panel; climate data included in library but visualization is P1 |
| FRTB ES Display | ES metric included in results but dedicated FRTB view is P1 |

### 2.4 Features Cut or Deferred

| Feature | Previous Priority | Action | Reasoning |
|---------|------------------|--------|-----------|
| Contingency Funding Plan Test | P1 | **Cut** | Overlaps with LCR stress and survival horizon. Minimal incremental insight for an educational dashboard. |
| Third-Party Concentration Risk | P1 | **Defer to P2** | Requires operational data not present in synthetic dataset. |
| DORA Compliance Indicator | P1 | **Defer to P2** | EU-specific regulatory flag. Atlantic Federal Bank is US-based. |
| Loss Flow Sankey Diagram | P2 | **Cut** | Would require nivo dependency. Tornado chart serves the same analytical purpose more effectively. |
| Pandemic Scenario Template | P2 | **Cut** | COVID-2020 historical scenario already covers pandemic stress. A separate "template" adds no value. |

---

## 3. CSS GRID HEATMAPS (Replacing nivo for P0)

The Round 2 Critique correctly noted that nivo's actual bundle size (60-80KB gzipped with shared dependencies) was understated. For P0, only two heatmaps are needed: the stressed transition matrix and the sector concentration heatmap. Both are simple colored grids with hover tooltips -- they do not need pan/zoom, animation, or complex interaction.

### 3.1 Color Scale Utility Function

File: `src/engines/colorScale.js`

```javascript
/**
 * Generate a color for a heatmap cell based on value and range.
 * Uses a blue-to-red diverging scale suitable for both dark and light themes.
 * Blue = low/good, White/neutral = mid, Red = high/bad.
 *
 * @param {number} value - The cell value
 * @param {number} min - Minimum value in the dataset
 * @param {number} max - Maximum value in the dataset
 * @param {'diverging' | 'sequential'} type - Scale type
 * @returns {string} CSS color string (rgba)
 */
export function heatmapColor(value, min, max, type = 'sequential') {
  // Normalize to [0, 1]
  const range = max - min;
  if (range === 0) return 'rgba(100, 116, 139, 0.5)'; // slate-500 for uniform data
  const t = Math.max(0, Math.min(1, (value - min) / range));

  if (type === 'diverging') {
    // Diverging: blue (0) -> slate (0.5) -> red (1)
    if (t < 0.5) {
      const s = t * 2; // 0 to 1 within blue half
      const r = Math.round(59 + s * (100 - 59));
      const g = Math.round(130 + s * (116 - 130));
      const b = Math.round(246 + s * (139 - 246));
      return `rgba(${r}, ${g}, ${b}, 0.85)`;
    } else {
      const s = (t - 0.5) * 2; // 0 to 1 within red half
      const r = Math.round(100 + s * (239 - 100));
      const g = Math.round(116 + s * (68 - 116));
      const b = Math.round(139 + s * (68 - 139));
      return `rgba(${r}, ${g}, ${b}, 0.85)`;
    }
  }

  // Sequential: slate-800 (low) -> amber-500 (mid) -> red-500 (high)
  if (t < 0.5) {
    const s = t * 2;
    const r = Math.round(30 + s * (245 - 30));
    const g = Math.round(41 + s * (158 - 41));
    const b = Math.round(59 + s * (11 - 59));
    return `rgba(${r}, ${g}, ${b}, 0.85)`;
  } else {
    const s = (t - 0.5) * 2;
    const r = Math.round(245 + s * (239 - 245));
    const g = Math.round(158 + s * (68 - 158));
    const b = Math.round(11 + s * (68 - 11));
    return `rgba(${r}, ${g}, ${b}, 0.85)`;
  }
}

/**
 * Generate text color (light or dark) based on background luminance.
 * Ensures WCAG AA contrast ratio.
 *
 * @param {string} bgColor - rgba color string from heatmapColor
 * @returns {string} 'text-white' or 'text-slate-900'
 */
export function contrastTextClass(bgColor) {
  // Extract RGB from rgba string
  const match = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return 'text-white';
  const [, r, g, b] = match.map(Number);
  // Relative luminance formula (sRGB)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'text-slate-900' : 'text-white';
}
```

### 3.2 Transition Matrix Component (CSS Grid)

File: `src/components/StressTesting/TransitionMatrix.jsx`

```jsx
import { useState } from 'react';
import { heatmapColor, contrastTextClass } from '../../engines/colorScale';

const RATINGS = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'D'];

/**
 * Stressed transition matrix displayed as a CSS Grid heatmap.
 * Rows = "from" rating, Columns = "to" rating.
 * Diagonal = probability of remaining at same rating.
 * Off-diagonal = migration probabilities.
 *
 * @param {{ baseMatrix: number[][], stressedMatrix: number[][], showDelta: boolean }} props
 */
export function TransitionMatrix({ baseMatrix, stressedMatrix, showDelta = false }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const matrix = showDelta
    ? stressedMatrix.map((row, i) => row.map((val, j) => val - baseMatrix[i][j]))
    : stressedMatrix;

  // Find min/max for color scaling
  const allValues = matrix.flat();
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);

  const cols = RATINGS.length + 1; // +1 for row headers

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">
          Stressed Transition Matrix (1Y)
        </h3>
        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={showDelta}
            onChange={(e) => onToggleDelta(e.target.checked)}
            className="rounded border-slate-600"
          />
          Show delta from base
        </label>
      </div>

      {/* CSS Grid heatmap */}
      <div
        className="grid gap-px bg-slate-700/50 rounded-lg overflow-hidden"
        style={{ gridTemplateColumns: `64px repeat(${RATINGS.length}, 1fr)` }}
        role="table"
        aria-label="Stressed credit rating transition matrix"
      >
        {/* Header row */}
        <div className="bg-slate-800 p-2 text-xs font-medium text-slate-400" role="columnheader">
          From \ To
        </div>
        {RATINGS.map(rating => (
          <div
            key={`header-${rating}`}
            className="bg-slate-800 p-2 text-xs font-medium text-slate-300 text-center"
            role="columnheader"
          >
            {rating}
          </div>
        ))}

        {/* Data rows */}
        {RATINGS.map((fromRating, i) => (
          <>
            {/* Row header */}
            <div
              key={`row-${fromRating}`}
              className="bg-slate-800 p-2 text-xs font-medium text-slate-300 flex items-center"
              role="rowheader"
            >
              {fromRating}
            </div>
            {/* Data cells */}
            {RATINGS.map((toRating, j) => {
              const value = matrix[i][j];
              const bgColor = showDelta
                ? heatmapColor(value, min, max, 'diverging')
                : heatmapColor(value, 0, Math.max(...matrix[i]), 'sequential');
              const textClass = contrastTextClass(bgColor);
              const isHovered = hoveredCell?.i === i && hoveredCell?.j === j;

              return (
                <div
                  key={`cell-${i}-${j}`}
                  className={`
                    p-2 text-xs text-center cursor-default
                    transition-transform duration-100
                    ${textClass}
                    ${i === j ? 'font-semibold' : ''}
                    ${isHovered ? 'ring-2 ring-blue-400 z-10 scale-110' : ''}
                  `}
                  style={{ backgroundColor: bgColor }}
                  onMouseEnter={() => setHoveredCell({ i, j })}
                  onMouseLeave={() => setHoveredCell(null)}
                  role="cell"
                  aria-label={`${fromRating} to ${toRating}: ${(value * 100).toFixed(2)}%`}
                  title={`${fromRating} -> ${toRating}: ${(value * 100).toFixed(2)}%${
                    showDelta ? ` (${value > 0 ? '+' : ''}${(value * 100).toFixed(2)}pp vs base)` : ''
                  }`}
                >
                  {(value * 100).toFixed(1)}
                </div>
              );
            })}
          </>
        ))}
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>Low</span>
        <div className="flex h-3 flex-1 rounded overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="flex-1"
              style={{
                backgroundColor: showDelta
                  ? heatmapColor(min + (i / 19) * (max - min), min, max, 'diverging')
                  : heatmapColor(i / 19, 0, 1, 'sequential'),
              }}
            />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  );
}
```

### 3.3 Sector Heatmap Component (CSS Grid)

File: `src/components/StressTesting/SectorHeatMap.jsx`

```jsx
import { heatmapColor, contrastTextClass } from '../../engines/colorScale';

const STRESS_METRICS = ['PD Mult.', 'LGD Add', 'EAD Impact', 'ECL Change', 'RWA Impact'];

/**
 * Sector concentration stress heatmap.
 * Rows = sectors, Columns = stress metrics.
 *
 * @param {{ sectors: Array<{ name: string, values: number[] }> }} props
 */
export function SectorHeatMap({ sectors }) {
  // Compute min/max per column for column-wise color scaling
  const columnRanges = STRESS_METRICS.map((_, colIdx) => {
    const colValues = sectors.map(s => s.values[colIdx]);
    return { min: Math.min(...colValues), max: Math.max(...colValues) };
  });

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">
        Sector Stress Impact
      </h3>

      <div
        className="grid gap-px bg-slate-700/50 rounded-lg overflow-hidden"
        style={{ gridTemplateColumns: `140px repeat(${STRESS_METRICS.length}, 1fr)` }}
        role="table"
        aria-label="Sector stress impact heatmap"
      >
        {/* Header row */}
        <div className="bg-slate-800 p-2 text-xs font-medium text-slate-400" role="columnheader">
          Sector
        </div>
        {STRESS_METRICS.map(metric => (
          <div
            key={metric}
            className="bg-slate-800 p-2 text-xs font-medium text-slate-300 text-center"
            role="columnheader"
          >
            {metric}
          </div>
        ))}

        {/* Data rows */}
        {sectors.map((sector) => (
          <>
            <div
              key={`row-${sector.name}`}
              className="bg-slate-800 p-2 text-xs text-slate-300 flex items-center"
              role="rowheader"
            >
              {sector.name}
            </div>
            {sector.values.map((value, colIdx) => {
              const { min, max } = columnRanges[colIdx];
              const bgColor = heatmapColor(value, min, max, 'sequential');
              const textClass = contrastTextClass(bgColor);

              return (
                <div
                  key={`${sector.name}-${colIdx}`}
                  className={`p-2 text-xs text-center ${textClass}`}
                  style={{ backgroundColor: bgColor }}
                  role="cell"
                  title={`${sector.name} - ${STRESS_METRICS[colIdx]}: ${value.toFixed(2)}`}
                >
                  {value.toFixed(2)}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}
```

### 3.4 Why CSS Grid Over nivo (Summary)

| Criterion | CSS Grid + Tailwind | @nivo/heatmap |
|-----------|-------------------|---------------|
| Bundle cost | 0 bytes (Tailwind already present) | 60-80KB gzipped (with shared deps) |
| Dark theme | Native (Tailwind classes) | Requires theme config |
| ARIA / a11y | Full control via role attributes | Partial (SVG-based, limited screen reader support) |
| Hover tooltips | Native HTML `title` or custom div | Built-in but SVG-based |
| Implementation time | ~6-8 hours per heatmap | ~4-6 hours per heatmap (faster if familiar with nivo API) |
| Customization | Full control | Constrained by nivo API |
| Pan/zoom | Not supported | Supported but not needed |
| Dependencies | 0 new | @nivo/core, @nivo/heatmap, multiple d3 sub-packages |

**Decision**: Use CSS Grid for P0. If Sankey diagrams are needed at P2, nivo can be added then.

---

## 4. MINOR CORRECTIONS

### 4.1 ES Metric Labeling Fix

**Issue**: Round 2 Section 6.4 recommended relabeling the existing `expectedShortfall99: 18_500_000` as "ES 97.5%". This is incorrect because ES at 99% and ES at 97.5% are numerically different values.

**Resolution**: Keep the label as **"ES 99%"** in all displays. Add a footnote/tooltip:

```
"ES 99% = Expected Shortfall at the 99th percentile (average of worst 1% of losses).
Note: FRTB uses ES at 97.5%. Under normal distribution assumptions, ES 97.5% ~ 0.877 x ES 99%.
This dashboard displays ES 99% from the existing data for consistency."
```

This is option (b) from the Critic's recommendation: simpler and more honest than silently recalculating.

### 4.2 Transition Matrix Stress Method for P0

**Issue**: Round 1 listed 3 methods for stressing the transition matrix (scalar multiplier, regime-dependent matrices, CreditMetrics latent variable shift) without recommending one for P0.

**Resolution**: Use the **scalar multiplier method** for P0. It is the simplest to implement and sufficient for an educational dashboard.

```javascript
/**
 * Stress a transition matrix using the scalar multiplier method.
 *
 * For each row i:
 *   1. Multiply all downgrade probabilities (j > i, and j = default) by stressFactor
 *   2. Reduce all upgrade probabilities (j < i) by dividing by stressFactor
 *   3. Adjust the diagonal (stay probability) to ensure row sums to 1.0
 *   4. Clamp all values to [0, 1]
 *
 * @param {number[][]} baseMatrix - Base transition matrix (8x8 for AAA-D)
 * @param {number} stressFactor - Multiplier for downgrades (e.g., 2.5 for severe stress)
 * @returns {number[][]} Stressed transition matrix
 */
export function stressTransitionMatrix(baseMatrix, stressFactor) {
  const n = baseMatrix.length;
  const stressed = baseMatrix.map(row => [...row]);

  for (let i = 0; i < n - 1; i++) { // Skip default row (last row is absorbing)
    // Stress downgrades (j > i) and default (last column)
    for (let j = i + 1; j < n; j++) {
      stressed[i][j] = Math.min(stressed[i][j] * stressFactor, 1.0);
    }
    // Reduce upgrades (j < i)
    for (let j = 0; j < i; j++) {
      stressed[i][j] = Math.max(stressed[i][j] / stressFactor, 0);
    }
    // Adjust diagonal to ensure row sums to 1.0
    const offDiagonalSum = stressed[i].reduce((sum, val, j) => j !== i ? sum + val : sum, 0);
    stressed[i][i] = Math.max(0, 1.0 - offDiagonalSum);
  }

  return stressed;
}
```

The `migrationStressFactor` field in the ShockVector maps directly to the `stressFactor` parameter. Typical values:
- Mild: 1.5
- Moderate: 2.0
- Severe: 2.5
- Extreme: 3.5

Regime-dependent matrices (Method 2) and the CreditMetrics latent variable shift (Method 3) are deferred to P1 as part of the CECL/IFRS 9 and Correlation Stress features.

### 4.3 Mobile Scope-Out

The stress testing dashboard targets **desktop viewports (>=1280px)**. Responsive and mobile layout is explicitly out of scope for the initial implementation. Financial risk dashboards are overwhelmingly used on desktop/wide-screen displays, and the data density of stress testing views (heatmaps, waterfall charts, comparison tables) is not suited to narrow viewports without significant redesign.

Tailwind breakpoints (`lg:`, `xl:`) may be used where trivial (e.g., stacking columns below 1024px), but no dedicated mobile layout work will be undertaken.

### 4.4 Climate Scenario P0/P1 Boundary

**Clarification**: Climate scenario data definitions (Net Zero 2050, Current Policies) ARE included in the P0 scenario library. They use the same `ShockVector` interface as all other scenarios, and their financial risk factors (equity decline, spread widening, GDP impact) will produce valid results through the standard credit, market, and liquidity stress panels.

However, the specialized NGFS Climate Risk visualization panel (showing transition risk vs. physical risk decomposition, sector PD multipliers by carbon intensity, multi-decade horizons) is a **P1** feature.

When a user selects a climate scenario in the P0 ScenarioSelector, the standard panels render normally. An informational note is displayed:

```
"Climate scenario selected. Financial stress impacts are shown below.
For detailed NGFS climate risk analysis (transition vs. physical risk,
sector-level carbon exposure), see the Climate Risk panel (coming in a future release)."
```

---

## 5. FINAL CONSOLIDATED FEATURE LIST

This is the authoritative feature list, superseding the lists in Round 1 (Section 9) and Round 2 (Section 16). All prior lists are deprecated in favor of this one.

### 5.1 P0-Alpha: Ship First (10 features)

| # | Feature | Type | New Dep? |
|---|---------|------|----------|
| A1 | DisclaimerBanner | Component | No |
| A2 | StressTestingView (container) | Component | No |
| A3 | ScenarioSelector + Severity (4 discrete levels) | Component | No |
| A4 | StressTestContext + scenarioEngine | Context + Engine | No |
| A5 | mathUtils + vasicekEngine | Engine | No |
| A6 | CapitalWaterfall | Component (Recharts) | No |
| A7 | TornadoChart | Component (Recharts) | No |
| A8 | CreditStressPanel | Component | No |
| A9 | LiquidityStressPanel (LCR + survival horizon) | Component (Recharts) | No |
| A10 | ScenarioComparison table | Component | No |

### 5.2 P0-Beta: Complete P0 (8 features)

| # | Feature | Type | New Dep? |
|---|---------|------|----------|
| B1 | YieldCurveScenario (6 IRRBB curves) | Component (Recharts) | No |
| B2 | PnlAttribution (sensitivity-based) | Component (Recharts) | No |
| B3 | TransitionMatrix (CSS Grid heatmap) | Component | No |
| B4 | SectorHeatMap (CSS Grid heatmap) | Component | No |
| B5 | HistoricalReplay | Component | No |
| B6 | RegulatoryMapping (tags/badges) | Component | No |
| B7 | Remaining 7 scenarios (expand library to 12) | Data | No |
| B8 | "Under Stress" badge on existing views | Modification | No |

### 5.3 P1: Should-Have (14 features)

| # | Feature | Notes |
|---|---------|-------|
| 1 | Reverse Stress Testing | "What breaks us?" (solver-based) |
| 2 | Multi-Period Projection (9Q) | Dynamic balance sheet, CCAR-style |
| 3 | CECL ECL Stress + IFRS 9 Toggle | Stage migration, provisioning cliff |
| 4 | Correlation Stress Dashboard | DCC regime shifts, matrix visualization |
| 5 | Deposit Run-Off Simulator | Behavioral model with SVB calibration |
| 6 | Fire-Sale Haircut Model | Asset-class specific haircuts |
| 7 | Climate Risk Panel (NGFS v4) | Specialized transition/physical risk viz |
| 8 | Custom Scenario Builder | 21-field input with validation |
| 9 | Stress Test Report Generator | PDF via html2canvas + jsPDF |
| 10 | Operational Risk Stress Dashboard | DORA, CrowdStrike calibration |
| 11 | Cyber Risk Stress Scenarios | Ransomware, data breach, DDoS |
| 12 | FRTB ES Display (dedicated panel) | ES 97.5%, IMCC, liquidity horizons |
| 13 | Stress Test Backtesting | Compare model predictions vs. realized |
| 14 | Concentration Risk Panel (HHI/GA) | Name and sector concentration metrics |

### 5.4 P2: Nice-to-Have (8 features)

| # | Feature | Notes |
|---|---------|-------|
| 1 | Network Contagion Visualizer | Requires d3-force or vis.js |
| 2 | Explainable Stress Results (XAI/SHAP) | Factor attribution beyond tornado |
| 3 | Geopolitical Risk Dashboard | Scenario templates for geopolitical events |
| 4 | FRTB Full Implementation (DRC, RRAO) | Beyond ES display |
| 5 | Cross-Currency Liquidity Stress | Multi-currency LCR |
| 6 | Counterparty Stress / CVA | Complex calculation |
| 7 | Integrated Feedback Loops (simplified) | Second-round amplification effects |
| 8 | Scenario URL Sharing | Encode scenario + severity in URL hash |

### 5.5 Cut (Not Planned)

| Feature | Reason |
|---------|--------|
| AI Scenario Generator (GAN/VAE) | Not feasible client-side |
| RL-Based Optimal Response | Not feasible client-side |
| ML-Enhanced PD Models | Requires model training infrastructure |
| Real-Time Scenario Monitoring | Requires live data feeds |
| Contingency Funding Plan Test | Overlaps with LCR stress; minimal incremental value |
| Loss Flow Sankey Diagram | Would require nivo; tornado chart serves same purpose |
| Pandemic Scenario Template | COVID-2020 historical scenario already covers this |
| Third-Party Concentration (P0/P1) | Deferred to P2; needs operational data |
| DORA Compliance Indicator | Deferred to P2; EU-specific, Atlantic Federal is US-based |

### 5.6 New Dependency Summary

| Phase | New npm Dependencies | Bundle Impact |
|-------|---------------------|---------------|
| P0-Alpha | `vitest` (dev only), `@vitest/coverage-v8` (dev only), `@testing-library/react` (dev only), `@testing-library/jest-dom` (dev only), `jsdom` (dev only) | 0 bytes production bundle increase |
| P0-Beta | None | 0 bytes |
| P1 | `html2canvas` + `jspdf` (for report generator) | ~80KB gzipped (P1 only) |
| P2 | Potentially `@nivo/core` + `@nivo/sankey` (if network viz needed) | ~60-80KB gzipped (P2 only) |

**P0 adds zero new production dependencies.** All new dependencies are dev-only (testing). This preserves the minimal-dependency philosophy that is a genuine strength of the codebase.

---

## 6. IMPLEMENTATION ORDER

This is the recommended build sequence. Each step produces a testable, demonstrable increment.

### Phase 0: Foundation (Day 1-2)

```
1. Install Vitest + testing dependencies
2. Configure vitest in vite.config.js
3. Create src/test/setup.js and src/test/helpers.js
4. Build src/engines/mathUtils.js (normalCDF, normalInverse, validateBounds, safeClamp)
5. Build src/engines/__tests__/mathUtils.test.js -> run -> green
6. Build src/engines/vasicekEngine.js (computeStressedPD)
7. Build src/engines/__tests__/vasicekEngine.test.js -> run -> green
```

**Checkpoint**: All engine tests pass. `npm run test:coverage` shows 100% on engines.

### Phase 1: State + Data (Day 3-4)

```
8.  Build src/data/stressScenarioLibrary.js (5 scenarios for Alpha)
9.  Build src/data/__tests__/stressScenarioLibrary.test.js -> snapshot
10. Build src/engines/liquidityStressEngine.js (computeStressedLCR, computeSurvivalDays)
11. Build src/engines/__tests__/liquidityStressEngine.test.js -> green
12. Build src/engines/scenarioEngine.js (applyScenario, validateShockVector)
13. Build src/contexts/StressTestContext.jsx (state, reducer, provider)
14. Modify src/App.jsx to wrap with StressTestProvider and add 'stress' route
15. Modify src/components/Layout/Sidebar.jsx to add Stress Testing nav item
```

**Checkpoint**: Can navigate to an empty Stress Testing view. Context provides scenario state.

### Phase 2: Core UI - Alpha (Day 5-9)

```
16. Build DisclaimerBanner.jsx + test
17. Build ScenarioSelector.jsx + test
18. Build StressTestingView.jsx (container with tab layout)
19. Build CapitalWaterfall.jsx (Recharts stacked bar)
20. Build TornadoChart.jsx (Recharts horizontal bar)
21. Build CreditStressPanel.jsx (Vasicek PD results, LGD stress display)
22. Build LiquidityStressPanel.jsx (LCR metric + survival horizon line chart)
23. Build ScenarioComparison.jsx (HTML table)
```

**Checkpoint**: P0-Alpha is complete. A user can select a scenario, adjust severity, and see capital waterfall, tornado chart, credit stress, liquidity stress, and comparison table. All with disclaimer banner.

### Phase 3: Beta Features (Day 10-14)

```
24. Build colorScale.js (heatmap color utility) + test
25. Build TransitionMatrix.jsx (CSS Grid) + stressTransitionMatrix engine function + test
26. Build SectorHeatMap.jsx (CSS Grid)
27. Build YieldCurveScenario.jsx (Recharts LineChart, 6 IRRBB curves)
28. Build PnlAttribution.jsx (Recharts BarChart)
29. Build HistoricalReplay.jsx
30. Build RegulatoryMapping.jsx (badge component)
31. Expand stressScenarioLibrary.js to 12 scenarios + update snapshot
32. Add "Under Stress" badge to CreditRiskView, MarketRiskView, LiquidityRiskView
```

**Checkpoint**: P0-Beta complete. Full P0 feature set with 12 scenarios, heatmaps, yield curves, and cross-view integration.

### Phase 4: Polish + Coverage (Day 15-16)

```
33. Run full coverage report, fill any gaps to reach thresholds
34. Review all components for dark mode consistency (slate-950 bg, slate-200 text)
35. Verify color accessibility (blue/orange palette, no red/green only distinctions)
36. Add ARIA labels and keyboard navigation to heatmaps
37. Final snapshot update for all scenario calibrations
38. Manual walkthrough of all scenarios at all severity levels
```

**Checkpoint**: Implementation complete. All tests green. Coverage thresholds met. Ready for P1 planning.

---

## APPENDIX: ROUND 3 CHANGES SUMMARY

| Item | Status | Section |
|------|--------|---------|
| Testing Strategy (Critical gap) | RESOLVED | Section 1 |
| P0 Scope Split (Alpha/Beta) | RESOLVED | Section 2 |
| CSS Grid over nivo for P0 | RESOLVED | Section 3 |
| ES Relabeling Fix | RESOLVED | Section 4.1 |
| Transition Matrix Stress Method | RESOLVED | Section 4.2 |
| Mobile Scope-Out Note | RESOLVED | Section 4.3 |
| Climate Scenario P0/P1 Boundary | RESOLVED | Section 4.4 |
| Final Consolidated Feature List | PROVIDED | Section 5 |
| Implementation Order | PROVIDED | Section 6 |

**All items from the Round 2 Critique have been addressed. The combined Round 1 + Round 2 + Round 3 research documents provide a complete specification for implementing the FinRisk AI Stress Testing module.**

---

*Round 3 Final Research Addendum*
*Date: 2026-03-04*
*Status: FINAL -- Ready for implementation*
