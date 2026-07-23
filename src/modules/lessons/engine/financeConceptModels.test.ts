import { describe, expect, it } from "vitest";
import {
  deriveFinanceConceptModel,
  financeConceptConfigs,
} from "./financeConceptModels";

describe("finance concept models", () => {
  it("derives a finite current-state challenge for every non-simple mode", () => {
    for (const [mode, config] of Object.entries(financeConceptConfigs)) {
      const result = deriveFinanceConceptModel(
        mode as keyof typeof financeConceptConfigs,
        config.defaults,
      );
      expect(Number.isFinite(result.value), mode).toBe(true);
      expect(result.prompt.length, mode).toBeGreaterThan(20);
      expect(result.expected, mode).toBe(result.value.toFixed(2));
      expect(result.points.length, mode).toBeGreaterThan(0);
      expect(result.rows.length, mode).toBeGreaterThan(0);
    }
  });

  it("uses the correct compound-interest formula", () => {
    const result = deriveFinanceConceptModel("compound-interest", {
      a: 10_000,
      b: 8,
      c: 4,
    });
    expect(result.value).toBeCloseTo(10_000 * 1.02 ** 20, 8);
  });

  it("distinguishes markup from margin", () => {
    const result = deriveFinanceConceptModel("profit-margin", {
      a: 80,
      b: 100,
      c: 10,
    });
    expect(result.value).toBe(200);
    expect(result.secondary).toContain("Markup 25.00%");
    expect(result.secondary).toContain("margin 20.00%");
  });

  it("rounds a break-even quantity up to whole units", () => {
    const result = deriveFinanceConceptModel("break-even", {
      a: 1_000,
      b: 30,
      c: 80,
    });
    expect(result.value).toBe(20);
  });

  it("finds a feasible optimum for linear programming", () => {
    const result = deriveFinanceConceptModel("linear-programming", {
      a: 30,
      b: 45,
      c: 20,
    });
    expect(result.value).toBeGreaterThan(0);
    expect(result.secondary).toMatch(/Optimal point \(\d+, \d+\)/);
  });
});
