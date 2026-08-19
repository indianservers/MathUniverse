import { describe, expect, it } from "vitest";
import { visualDictionaryTerms } from "../data/mathVisualDictionary";
import { dictionaryRangeForLetter, dictionarySlug, filterDictionaryTerms, findDictionaryTerm, relatedDictionaryTerms } from "./visualDictionaryWorkspace";

describe("visual dictionary workspace", () => {
  it("creates stable slugs and resolves direct URL selections", () => {
    expect(dictionarySlug("Pythagorean theorem")).toBe("pythagorean-theorem");
    expect(findDictionaryTerm(visualDictionaryTerms, "pythagorean-theorem")?.term).toBe("Pythagorean theorem");
  });

  it("maps selected letters to their visible dictionary range", () => {
    expect(dictionaryRangeForLetter("A")).toBe("A-K");
    expect(dictionaryRangeForLetter("K")).toBe("A-K");
    expect(dictionaryRangeForLetter("L")).toBe("L-T");
    expect(dictionaryRangeForLetter("P")).toBe("L-T");
    expect(dictionaryRangeForLetter("U")).toBe("U-Z");
    expect(dictionaryRangeForLetter("1")).toBe("All");
  });

  it("ranks exact and partial term searches before keyword matches", () => {
    expect(filterDictionaryTerms(visualDictionaryTerms, { query: "matrix" })[0].term).toBe("Matrix");
    expect(filterDictionaryTerms(visualDictionaryTerms, { query: "pythag" })[0].term).toBe("Pythagorean theorem");
  });

  it("searches formula and example content", () => {
    const matches = filterDictionaryTerms(visualDictionaryTerms, { query: "det(A - lambda I)" });
    expect(matches.some((entry) => entry.term === "Characteristic equation")).toBe(true);
  });

  it("combines letter, category, and visual filters", () => {
    const matches = filterDictionaryTerms(visualDictionaryTerms, { letter: "C", category: "Geometry", kind: "circle" });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((entry) => entry.term.startsWith("C") && entry.category === "Geometry" && entry.kind === "circle")).toBe(true);
  });

  it("returns contextual related terms without the selected term", () => {
    const selected = visualDictionaryTerms.find((entry) => entry.term === "Abacus")!;
    const related = relatedDictionaryTerms(visualDictionaryTerms, selected);
    expect(related).toHaveLength(5);
    expect(related.every((entry) => entry.term !== selected.term)).toBe(true);
    expect(related.some((entry) => entry.category === selected.category)).toBe(true);
  });
});
