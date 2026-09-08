import { describe, expect, it } from "vitest";
import {
  arithmeticQuizChoices,
  arithmeticSequenceAnalysis,
} from "./arithmeticSequenceLessonModel";
describe("arithmetic sequence model", () => {
  it("computes the target sequence and formulas", () => {
    const r = arithmeticSequenceAnalysis(5, 3);
    expect(r.terms).toEqual([5, 8, 11, 14, 17, 20, 23, 26, 29, 32]);
    expect(r.differences).toEqual(Array(9).fill(3));
    expect(r.intercept).toBe(2);
    expect(r.term(40)).toBe(122);
    expect(r.term(12)).toBe(38);
    expect(r.indexOf(77)).toBe(25);
  });
  it("handles constant sequences and dynamic quiz choices", () => {
    const r = arithmeticSequenceAnalysis(5, 0);
    expect(r.indexOf(5)).toBe(1);
    expect(r.indexOf(7)).toBeNull();
    expect(arithmeticQuizChoices(100)).toContain(100);
  });
});
