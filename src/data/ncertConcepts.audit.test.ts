import { describe, expect, it } from "vitest";
import { supportedNCERTVisualTypes } from "../pages/NCERTConceptPage";
import { ncertConcepts } from "./ncertConcepts";

describe("NCERT concept audit", () => {
  it("has unique concept ids", () => {
    const ids = ncertConcepts.map((concept) => concept.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a supported visualization and complete learning copy for every concept", () => {
    for (const concept of ncertConcepts) {
      expect(supportedNCERTVisualTypes.has(concept.visual), concept.id).toBe(true);
      expect(concept.title.trim(), concept.id).not.toBe("");
      expect(concept.summary.trim(), concept.id).not.toBe("");
      expect(concept.formula.trim(), concept.id).not.toBe("");
      expect(concept.outcomes.length, concept.id).toBeGreaterThanOrEqual(3);
      expect(concept.tasks.length, concept.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps slider defaults inside their configured ranges", () => {
    for (const concept of ncertConcepts) {
      expect(concept.defaultA, `${concept.id}: slider A`).toBeGreaterThanOrEqual(concept.minA);
      expect(concept.defaultA, `${concept.id}: slider A`).toBeLessThanOrEqual(concept.maxA);
      expect(concept.defaultB, `${concept.id}: slider B`).toBeGreaterThanOrEqual(concept.minB);
      expect(concept.defaultB, `${concept.id}: slider B`).toBeLessThanOrEqual(concept.maxB);
      if (concept.sliderC) {
        expect(concept.defaultC, `${concept.id}: slider C`).toBeGreaterThanOrEqual(concept.minC ?? Number.NEGATIVE_INFINITY);
        expect(concept.defaultC, `${concept.id}: slider C`).toBeLessThanOrEqual(concept.maxC ?? Number.POSITIVE_INFINITY);
      }
    }
  });

  it("includes the Phase 2 Grade 7 NCERT alignment routes", () => {
    const ids = new Set(ncertConcepts.map((concept) => concept.id));
    expect(ids.has("class-7-large-numbers-around-us")).toBe(true);
    expect(ids.has("class-7-arithmetic-expressions")).toBe(true);
    expect(ids.has("class-7-decimal-operations")).toBe(true);
    expect(ids.has("class-7-fraction-operations")).toBe(true);
    expect(ids.has("class-7-constructions-and-tilings")).toBe(true);
    expect(ids.has("class-7-lines-and-triangles")).toBe(true);
  });

  it("includes the Phase 3 Class 12 NCERT guided visualization routes", () => {
    const ids = new Set(ncertConcepts.map((concept) => concept.id));
    expect(ids.has("class-12-relations-functions")).toBe(true);
    expect(ids.has("class-12-determinants")).toBe(true);
    expect(ids.has("class-12-continuity-differentiability")).toBe(true);
    expect(ids.has("class-12-integration-methods")).toBe(true);
    expect(ids.has("class-12-differential-equations")).toBe(true);
    expect(ids.has("class-12-vectors-3d-geometry")).toBe(true);
    expect(ids.has("class-12-bayes-theorem")).toBe(true);
    expect(ids.has("class-12-linear-programming")).toBe(true);
    expect(ids.has("class-12-inverse-trig")).toBe(true);
  });
});
