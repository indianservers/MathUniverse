import { describe, expect, it } from "vitest";
import {
  cltCheckpoints,
  simulateCentralLimit,
} from "./centralLimitLessonModel";
describe("central limit lesson model", () => {
  it("models exponential sample means", () => {
    const r = simulateCentralLimit("exponential", 30, 10000, 538);
    expect(r.mean).toBe(1);
    expect(r.sd).toBe(1);
    expect(r.theoreticalSe).toBeCloseTo(1 / Math.sqrt(30), 8);
    expect(r.simulatedMean).toBeCloseTo(1, 1);
    expect(r.simulatedSd).toBeCloseTo(1 / Math.sqrt(30), 1);
    expect(r.qq).toHaveLength(31);
  });
  it("shows decreasing theoretical spread", () => {
    const rows = cltCheckpoints("exponential", 3);
    expect(rows).toHaveLength(5);
    expect(rows[4].se).toBeLessThan(rows[0].se);
    expect(rows[4].skewness).toBeLessThan(rows[0].skewness);
  });
});
