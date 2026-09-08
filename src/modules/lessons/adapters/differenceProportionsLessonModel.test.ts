import { describe, expect, it } from "vitest";
import {
  differenceProportionsInterval,
  generateProportionSamples,
} from "./differenceProportionsLessonModel";
describe("difference proportions lesson model", () => {
  it("computes the unpooled interval from the target counts", () => {
    const r = differenceProportionsInterval(58, 200, 40, 200, 0.95);
    expect(r.p1).toBe(0.29);
    expect(r.p2).toBe(0.2);
    expect(r.difference).toBeCloseTo(0.09);
    expect(r.se).toBeCloseTo(0.04277, 4);
    expect(r.lower).toBeCloseTo(0.0062, 4);
    expect(r.upper).toBeCloseTo(0.1738, 4);
    expect(r.conditions.met).toBe(true);
  });
  it("generates reproducible count samples", () => {
    expect(generateProportionSamples(542)).toEqual(
      generateProportionSamples(542),
    );
    expect(generateProportionSamples(542).x1).toBeGreaterThan(0);
  });
});
