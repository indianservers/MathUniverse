import { describe, expect, it } from "vitest";
import {
  curatedFormulaLearningLinks,
  getCuratedFormulaLearningLinks,
  getProofLearningCertificationJourneys,
  getCuratedTheoremLearningLinks,
  getCuratedVisualProofLearningLinks,
  proofLearningCertificationSeeds,
  validateCuratedLearningLinks,
} from "./proofLearningLinks";

describe("curated proof learning links", () => {
  it("keeps all curated formula, theorem, and visual proof targets valid", () => {
    expect(curatedFormulaLearningLinks.length).toBeGreaterThanOrEqual(30);
    expect(validateCuratedLearningLinks()).toEqual([]);
  });

  it("links flagship formulas to theorem proofs and visual proofs", () => {
    const pythagorean = getCuratedFormulaLearningLinks("geometry", "Pythagorean theorem");
    const trigIdentity = getCuratedFormulaLearningLinks("trigonometry", "Pythagorean identities");
    const derivative = getCuratedFormulaLearningLinks("derivatives", "Definition");

    expect(pythagorean.theorems.map((theorem) => theorem.title)).toContain("Pythagorean theorem");
    expect(pythagorean.visualProofs.map((proof) => proof.route)).toContain(
      "/visual-proofs/geometry/pythagorean-theorem-area-rearrangement",
    );
    expect(trigIdentity.theorems.map((theorem) => theorem.title)).toContain("Pythagorean identity theorem");
    expect(trigIdentity.visualProofs.map((proof) => proof.route)).toContain("/visual-proofs/trigonometry/pythagorean-trig-identity");
    expect(derivative.visualProofs.map((proof) => proof.route)).toContain("/visual-proofs/calculus/derivative-slope-of-tangent");
  });

  it("resolves theorem pages back to related formulas and visual proofs", () => {
    const theoremLinks = getCuratedTheoremLearningLinks("geometry", "Pythagorean theorem");

    expect(theoremLinks.formulas.map((formula) => formula.route)).toContain("/formulas/geometry");
    expect(theoremLinks.visualProofs.map((proof) => proof.route)).toContain(
      "/visual-proofs/geometry/pythagorean-theorem-area-rearrangement",
    );
  });

  it("resolves visual proof pages back to related formulas and theorem proofs", () => {
    const visualProofLinks = getCuratedVisualProofLearningLinks("/visual-proofs/geometry/pythagorean-theorem-area-rearrangement");

    expect(visualProofLinks.formulas.map((formula) => formula.title)).toContain("Pythagorean theorem");
    expect(visualProofLinks.theorems.map((theorem) => theorem.title)).toContain("Pythagorean theorem");
    expect(visualProofLinks.visualProofs).toEqual([]);
  });

  it("keeps the Phase 6 browser certification matrix fully resolvable", () => {
    const journeys = getProofLearningCertificationJourneys();

    expect(journeys).toHaveLength(proofLearningCertificationSeeds.length);
    expect(journeys.length).toBeGreaterThanOrEqual(6);
    expect(journeys.map((journey) => journey.id)).toEqual([
      "geometry-pythagorean",
      "trigonometry-pythagorean-identity",
      "coordinate-distance",
      "calculus-fundamental-theorem",
      "probability-addition-rule",
      "vectors-dot-product",
    ]);

    journeys.forEach((journey) => {
      expect(journey.formulaRoute).toMatch(/^\/formulas\//);
      expect(journey.theoremRoute).toMatch(/^\/theorems\//);
      expect(journey.visualProofRoute).toMatch(/^\/visual-proofs\//);
      expect(journey.theoremTitle.length).toBeGreaterThan(4);
      expect(journey.visualProofTitle.length).toBeGreaterThan(4);
    });
  });
});
