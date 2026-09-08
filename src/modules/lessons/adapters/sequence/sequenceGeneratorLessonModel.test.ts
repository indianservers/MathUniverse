import { describe, expect, it } from "vitest";
import {
  generateSequence,
  parseSequencePolynomial,
} from "./sequenceGeneratorLessonModel";
describe("sequence generator model", () => {
  it("parses and generates the target quadratic", () => {
    const coefficients = parseSequencePolynomial("3n² + 2n + 1")!;
    const r = generateSequence({ type: "explicit", coefficients }, 1, 10, 1);
    expect(r.terms).toEqual([6, 17, 34, 57, 86, 121, 162, 209, 262, 321]);
    expect(r.secondDifferences.slice(2)).toEqual(Array(8).fill(6));
    expect(r.classification).toBe("Quadratic sequence");
  });
  it("generates a recursive arithmetic sequence", () => {
    const r = generateSequence(
      { type: "recursive", start: 6, difference: 11 },
      1,
      5,
      1,
    );
    expect(r.terms).toEqual([6, 17, 28, 39, 50]);
    expect(r.constantFirst).toBe(true);
  });
  it("rejects unsupported expressions", () => {
    expect(parseSequencePolynomial("sin(n)")).toBeNull();
  });
});
