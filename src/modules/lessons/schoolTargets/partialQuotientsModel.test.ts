import { describe, expect, it } from "vitest";
import { checkQuotientAnswer, continuedFractionTex, decimalFraction, partialQuotients, quotientNotation, reconstructQuotients } from "./partialQuotientsModel";
describe("partial quotient extraction", () => {
  it("computes the reference divisions and exact convergents", () => {
    const m = partialQuotients(43, 19);
    expect(m.terms).toEqual([2, 3, 1, 4]);
    expect(m.steps.map(s => s.r)).toEqual([5, 4, 1, 0]);
    expect(m.convergents.map(c => [c.p, c.q])).toEqual([[2, 1], [7, 3], [9, 4], [43, 19]]);
    expect(m.convergents.at(-1)?.error).toBe(0);
    expect(quotientNotation(m.terms)).toBe("[2; 3, 1, 4]");
  });
  it("preserves order below one and reduces non-coprime inputs", () => {
    expect(partialQuotients(5, 7).terms).toEqual([0, 1, 2, 2]);
    expect(partialQuotients(86, 38).terms).toEqual([2, 3, 1, 4]);
    expect(partialQuotients(86, 38).divisor).toBe(2);
    expect(partialQuotients(21, 7).terms).toEqual([3]);
    expect(partialQuotients(7, 7).terms).toEqual([1]);
  });
  it("reconstructs all 10,000 positive fractions with numerator and denominator up to 100", () => {
    for (let a = 1; a <= 100; a++) for (let b = 1; b <= 100; b++) {
      const m = partialQuotients(a, b), reconstructed = reconstructQuotients(m.terms);
      expect(reconstructed.numerator * BigInt(b)).toBe(reconstructed.denominator * BigInt(a));
      expect(m.steps.every(s => s.a === s.q * s.b + s.r && s.r >= 0 && s.r < s.b)).toBe(true);
      expect(m.convergents.at(-1)?.error).toBe(0);
      expect(m.steps.at(-1)?.r).toBe(0);
    }
  });
  it("handles large inputs and long Fibonacci expansions without losing the rational value", () => {
    for (const pair of [[999999, 1000000], [832040, 514229], [1000000, 1]]) {
      const m = partialQuotients(pair[0], pair[1]), reconstructed = reconstructQuotients(m.terms);
      expect(reconstructed.numerator * BigInt(pair[1])).toBe(reconstructed.denominator * BigInt(pair[0]));
      expect(m.convergents.at(-1)?.error).toBe(0);
    }
  });
  it("parses terminating decimals exactly and rejects unsupported input", () => {
    expect(decimalFraction("2.25")).toEqual([9, 4]);
    expect(decimalFraction("0.000001")).toEqual([1, 1000000]);
    expect(() => decimalFraction("2e3")).toThrow();
    expect(() => decimalFraction("0")).toThrow();
    expect(() => partialQuotients(43, 0)).toThrow();
    expect(() => partialQuotients(1.5, 3)).toThrow();
  });
  it("checks canonical and equivalent terminal-one answers, rejecting malformed answers", () => {
    expect(checkQuotientAnswer("[1; 2, 2]", 7, 5)).toBe(true);
    expect(checkQuotientAnswer("1; 2, 1, 1", 7, 5)).toBe(true);
    expect(checkQuotientAnswer("[3; 7]", 22, 7)).toBe(true);
    expect(checkQuotientAnswer("[1; 2]", 7, 5)).toBe(false);
    for (const input of ["", "[1;0]", "[1;2", "1;2]", "1.4", "[1; -2]", "[1;;2]"]) expect(checkQuotientAnswer(input, 7, 5)).toBe(false);
    expect(continuedFractionTex([2, 3, 1, 4])).toBe("2+\\cfrac{1}{3+\\cfrac{1}{1+\\cfrac{1}{4}}}");
  });
});
