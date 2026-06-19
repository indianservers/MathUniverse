import { describe, expect, it } from "vitest";

import { visualDictionaryTerms } from "./mathVisualDictionary";

describe("mathVisualDictionary", () => {
  it("includes 300 enriched visual dictionary additions", () => {
    const enrichedTerms = visualDictionaryTerms.filter(
      (entry) => entry.description && entry.explanation && entry.representation,
    );

    expect(enrichedTerms).toHaveLength(300);
    expect(enrichedTerms.every((entry) => entry.description && entry.explanation && entry.representation)).toBe(true);
  });

  it("keeps term names unique", () => {
    const normalizedTerms = visualDictionaryTerms.map((entry) => entry.term.toLowerCase());

    expect(new Set(normalizedTerms).size).toBe(normalizedTerms.length);
  });
});
