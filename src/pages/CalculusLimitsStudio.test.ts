import { describe, expect, it } from "vitest";
import { compileFunctionExpression } from "../utils/functionParser";
import {
  analyzeLimit,
  limitModeSnapshot,
  type LimitMode,
} from "./CalculusLimitsStudio";

describe("Calculus Limits Studio analysis", () => {
  it("detects the removable hole in sin(x)/x", () => {
    const result = analyzeLimit(compileFunctionExpression("sin(x)/x"), 0);
    expect(result.left).toBeCloseTo(1, 3);
    expect(result.right).toBeCloseTo(1, 3);
    expect(result.limit).toBeCloseTo(1, 3);
    expect(result.defined).toBe(false);
    expect(result.classification).toBe("Removable discontinuity");
  });

  it("repairs a removable discontinuity with an assigned point value", () => {
    const fn = compileFunctionExpression("(x^2-1)/(x-1)");
    const before = analyzeLimit(fn, 1);
    const repaired = analyzeLimit(fn, 1, 2);
    expect(before.limit).toBeCloseTo(2, 3);
    expect(before.continuous).toBe(false);
    expect(repaired.continuous).toBe(true);
  });

  it("classifies 1/x at zero as an infinite discontinuity", () => {
    const result = analyzeLimit(compileFunctionExpression("1/x"), 0);
    expect(result.left).toBe(-Infinity);
    expect(result.right).toBe(Infinity);
    expect(result.limitExists).toBe(false);
    expect(result.classification).toBe("Infinite discontinuity");
  });

  it("provides distinct, analyzable content for every top tab", () => {
    const modes: LimitMode[] = ["limits", "continuity", "discontinuities", "asymptotes", "lhopital"];
    const snapshots = modes.map(limitModeSnapshot);
    expect(new Set(snapshots.map((item) => `${item.expression}@${item.point}`)).size).toBeGreaterThan(2);
    expect(snapshots.every((item) => item.analysis.classification !== "Invalid function")).toBe(true);
    expect(snapshots.find((item) => item.mode === "asymptotes")?.analysis.classification).toBe("Infinite discontinuity");
  });
});
