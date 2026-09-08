import { describe, expect, it } from "vitest";
import {
  differenceMeansInterval,
  differenceMeansSampleA,
  differenceMeansSampleB,
  generateDifferenceSamples,
} from "./differenceMeansLessonModel";
describe("difference means lesson model", () => {
  it("computes the target pooled interval", () => {
    const r = differenceMeansInterval(
      differenceMeansSampleA,
      differenceMeansSampleB,
      0.95,
      "pooled",
    );
    expect(r.first.mean).toBeCloseTo(15.35, 2);
    expect(r.second.mean).toBeCloseTo(8.75, 2);
    expect(r.difference).toBeCloseTo(6.6, 4);
    expect(r.df).toBe(38);
    expect(r.critical).toBeCloseTo(2.024, 3);
    expect(r.lower).toBeCloseTo(5.791, 3);
    expect(r.upper).toBeCloseTo(7.409, 3);
  });
  it("supports Welch, paired, and regenerated data", () => {
    expect(
      differenceMeansInterval(
        differenceMeansSampleA,
        differenceMeansSampleB,
        0.95,
        "welch",
      ).df,
    ).toBeLessThan(38);
    expect(
      differenceMeansInterval(
        differenceMeansSampleA,
        differenceMeansSampleB,
        0.95,
        "paired",
      ).df,
    ).toBe(19);
    expect(generateDifferenceSamples(541).a).toHaveLength(20);
  });
});
