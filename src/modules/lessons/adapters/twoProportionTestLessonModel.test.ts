import { describe, expect, it } from "vitest";
import {
  randomTwoProportionExample,
  twoProportionTest,
} from "./twoProportionTestLessonModel";
describe("two-proportion test lesson model", () => {
  it("uses a pooled null SE and unpooled interval SE", () => {
    const r = twoProportionTest(58, 200, 38, 200, 0.05, "two-sided");
    expect(r.p1).toBe(0.29);
    expect(r.p2).toBe(0.19);
    expect(r.pooled).toBe(0.24);
    expect(r.seNull).toBeCloseTo(0.04271, 4);
    expect(r.z).toBeCloseTo(2.3415, 4);
    expect(r.pValue).toBeCloseTo(0.0192, 4);
    expect(r.reject).toBe(true);
    expect(r.lower).toBeCloseTo(0.0169, 4);
    expect(r.upper).toBeCloseTo(0.1831, 4);
  });
  it("generates deterministic valid examples", () => {
    expect(randomTwoProportionExample(548)).toEqual(
      randomTwoProportionExample(548),
    );
    const r = randomTwoProportionExample(549);
    expect(r.x1).toBeLessThanOrEqual(r.n1);
    expect(r.x2).toBeLessThanOrEqual(r.n2);
  });
});
