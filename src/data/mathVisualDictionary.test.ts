import { describe, expect, it } from "vitest";

import { visualDictionaryTerms } from "./mathVisualDictionary";

describe("mathVisualDictionary", () => {
  it("includes at least 300 enriched visual dictionary additions", () => {
    const enrichedTerms = visualDictionaryTerms.filter(
      (entry) => entry.description && entry.explanation && entry.representation,
    );

    expect(enrichedTerms.length).toBeGreaterThanOrEqual(300);
    expect(enrichedTerms.every((entry) => entry.description && entry.explanation && entry.representation)).toBe(true);
  });

  it("keeps every dictionary word connected to visual copy", () => {
    const missingVisualCopy = visualDictionaryTerms.filter(
      (entry) => !entry.description?.trim() || !entry.explanation?.trim() || !entry.representation?.trim() || !entry.example?.trim(),
    );

    expect(missingVisualCopy).toEqual([]);
  });

  it("uses real glossary wording for power and exponentiation terms", () => {
    const power = visualDictionaryTerms.find((entry) => entry.term === "Power");

    expect(power?.description).toContain("exponentiation");
    expect(power?.description).not.toContain("graph or algebra idea");
    expect(power?.example).toContain("2^4 = 16");
    expect(power?.representation).toContain("b^n");
  });

  it("keeps examples as examples rather than visualization instructions", () => {
    const drawingInstructions = visualDictionaryTerms.filter(
      (entry) => /^(draw|show|use|represent|highlight|shade|mark)\b/i.test(entry.example ?? ""),
    );

    expect(drawingInstructions).toEqual([]);
  });

  it("includes a broad math-symbol dictionary with searchable examples", () => {
    const symbolTerms = visualDictionaryTerms.filter((entry) => entry.kind === "text" && entry.term.includes("(") && entry.description && entry.representation);
    const termNames = new Set(visualDictionaryTerms.map((entry) => entry.term));

    expect(symbolTerms.length).toBeGreaterThanOrEqual(100);
    [
      "Integral symbol (∫)",
      "Derivative symbol (d/dx)",
      "Partial derivative symbol (∂)",
      "Pi symbol (π)",
      "Euler number symbol (e)",
      "Ceiling symbol (⌈x⌉)",
      "Floor symbol (⌊x⌋)",
    ].forEach((term) => expect(termNames.has(term)).toBe(true));
  });

  it("keeps term names unique", () => {
    const normalizedTerms = visualDictionaryTerms.map((entry) => entry.term.toLowerCase());

    expect(new Set(normalizedTerms).size).toBe(normalizedTerms.length);
  });
});
