import { describe, expect, it } from "vitest";
import { visualProofCategories } from "./visualProofCategories";
import { visualProofsIndex } from "./visualProofsIndex";

describe("Visual Proof category counts", () => {
  it("keeps displayed proof counts aligned with available proof routes", () => {
    for (const category of visualProofCategories) {
      const availableProofCount = visualProofsIndex.filter((proof) => proof.categorySlug === category.slug && proof.status === "available").length;

      expect(category.proofCount, category.slug).toBe(availableProofCount);
    }
  });
});
