import { describe, expect, it } from "vitest";
import { conceptEdges, conceptNodes } from "./conceptMapData";
import {
  filterConcepts,
  findLearningPath,
  getAvailableModuleCount,
  getConceptById,
  getConceptReadiness,
  getNextConcepts,
  getPrerequisites,
} from "./conceptMapUtils";

describe("concept map data and utilities", () => {
  it("ships a large enough Phase 1 knowledge graph", () => {
    expect(conceptNodes.length).toBeGreaterThanOrEqual(60);
    expect(conceptEdges.length).toBeGreaterThanOrEqual(100);
  });

  it("resolves core concept relationships", () => {
    const unitCircle = getConceptById("unit-circle");
    expect(unitCircle?.title).toBe("Unit Circle");
    expect(getPrerequisites("unit-circle").map((concept) => concept.id)).toContain("right-triangle-trigonometry");
    expect(getNextConcepts("unit-circle").map((concept) => concept.id)).toContain("trig-identities");
  });

  it("filters by search, category, difficulty, and module", () => {
    const results = filterConcepts({
      search: "pythagorean",
      categories: ["trigonometry"],
      difficulties: ["intermediate"],
      modules: ["visualProof"],
    });
    expect(results.some((concept) => concept.id === "trig-pythagorean-identity")).toBe(true);
  });

  it("finds a learning path across categories", () => {
    const path = findLearningPath("fractions", "trig-pythagorean-identity");
    expect(path.map((concept) => concept.id)).toEqual(
      expect.arrayContaining(["ratio-proportion", "right-triangle-trigonometry", "unit-circle", "trig-pythagorean-identity"]),
    );
  });

  it("reports readiness and module count", () => {
    const readiness = getConceptReadiness("unit-circle", ["coordinate-plane"]);
    expect(readiness.ready).toBe(false);
    expect(readiness.missingPrerequisites.map((concept) => concept.id)).toContain("right-triangle-trigonometry");

    const concept = getConceptById("pythagoras");
    expect(concept ? getAvailableModuleCount(concept) : 0).toBeGreaterThanOrEqual(4);
  });
});
