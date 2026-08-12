import { describe, expect, it } from "vitest";
import { visualDictionaryTerms } from "../data/mathVisualDictionary";
import { iconForDictionaryTerm, mathConceptIcons } from "./mathConceptIcons";

function term(name: string) {
  return visualDictionaryTerms.find((entry) => entry.term === name)!;
}

describe("math concept icon mapping", () => {
  it("uses specialist icons for distinctive concepts", () => {
    expect(iconForDictionaryTerm(term("Matrix"))).toContain("20-matrices.png");
    expect(iconForDictionaryTerm(term("Complex number"))).toContain("22-complex-numbers.png");
    expect(iconForDictionaryTerm(term("Regression line"))).toContain("17-regression.png");
  });

  it("falls back to the matching category or visual family", () => {
    expect(iconForDictionaryTerm(term("Abacus"))).toBe(mathConceptIcons.Arithmetic);
    expect(iconForDictionaryTerm(term("Derivative"))).toBe(mathConceptIcons.Calculus);
  });

  it("provides an icon for every dictionary record", () => {
    expect(visualDictionaryTerms.every((entry) => iconForDictionaryTerm(entry).startsWith("/assets/math-icons/"))).toBe(true);
  });
});
