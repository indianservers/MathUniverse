import { describe, expect, it } from "vitest";
import type { VisualProofComponentKey } from "../data/proofTypes";
import { visualProofCategories } from "../data/visualProofCategories";
import { visualProofsIndex } from "../data/visualProofsIndex";
import {
  getVisualProofComponentLoader,
  loadVisualProofComponent,
  visualProofCategoryLoaderMap,
} from "./loadVisualProofComponent";

const phaseUpgradedProofs = visualProofsIndex.filter((proof) => proof.proofUpgradeStatus === "phase-upgraded");
const availableCategorySlugs = visualProofCategories.filter((category) => category.status === "available").map((category) => category.slug);

describe("Visual Proofs lazy component resolver", () => {
  it("keeps every phase-upgraded proof route covered by a lazy loader", () => {
    expect(phaseUpgradedProofs).toHaveLength(184);

    const missing = phaseUpgradedProofs.filter(
      (proof) => !getVisualProofComponentLoader(proof.categorySlug, proof.componentKey),
    );

    expect(missing.map((proof) => proof.route)).toEqual([]);
  });

  it("keeps loader categories aligned with available Visual Proofs categories", () => {
    expect(Object.keys(visualProofCategoryLoaderMap).sort()).toEqual(availableCategorySlugs.sort());

    for (const categorySlug of availableCategorySlugs) {
      const expectedKeys = phaseUpgradedProofs
        .filter((proof) => proof.categorySlug === categorySlug)
        .map((proof) => proof.componentKey)
        .sort();
      const loaderKeys = Object.keys(visualProofCategoryLoaderMap[categorySlug] ?? {}).sort();

      expect(loaderKeys).toEqual(expectedKeys);
    }
  });

  it("loads a real React component module for one representative proof per category", async () => {
    for (const categorySlug of availableCategorySlugs) {
      const proof = phaseUpgradedProofs.find((item) => item.categorySlug === categorySlug);
      expect(proof, categorySlug).toBeDefined();

      const componentModule = await loadVisualProofComponent(categorySlug, proof!.componentKey);

      expect(componentModule?.default).toEqual(expect.any(Function));
    }
  }, 20_000);

  it("returns no loader for unknown proof component keys", () => {
    expect(getVisualProofComponentLoader("geometry", "MissingProof" as VisualProofComponentKey)).toBeUndefined();
    expect(getVisualProofComponentLoader("missing-category", "PythagoreanAreaRearrangementProof")).toBeUndefined();
  });
});
