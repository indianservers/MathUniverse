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
