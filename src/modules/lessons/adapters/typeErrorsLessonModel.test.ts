import { describe, expect, it } from "vitest";
import { typeErrorsAnalysis } from "./typeErrorsLessonModel";
describe("type I and type II error model", () => {
  it("computes the visible scenario from its parameters", () => {
    const r = typeErrorsAnalysis(50, 54, 10, 36, 1.645);
    expect(r.standardError).toBeCloseTo(1.6667, 4);
    expect(r.delta).toBeCloseTo(2.4);
    expect(r.alpha).toBeCloseTo(0.05, 3);
    expect(r.beta).toBeCloseTo(0.225, 3);
    expect(r.power).toBeCloseTo(0.775, 3);
  });
  it("increases power when the alternative moves farther right", () => {
    expect(typeErrorsAnalysis(50, 58, 10, 36, 1.645).power).toBeGreaterThan(
      typeErrorsAnalysis(50, 54, 10, 36, 1.645).power,
    );
  });
});
