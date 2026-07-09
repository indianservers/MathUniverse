import { describe, expect, it } from "vitest";
import { mathLabTools } from "./mathLabTools";
import { ncertConcepts, ncertRoute } from "./ncertConcepts";
import { internalSiteLinks } from "./siteLinks";
import { theoremCategories } from "./theoremLibrary";
import { formulaCategories } from "./formulaLibrary";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";

function paths() {
  return new Set(internalSiteLinks.map((link) => link.path));
}

function linkFor(path: string) {
  return internalSiteLinks.find((link) => link.path === path);
}

describe("site links discoverability", () => {
  it("exposes NCERT dashboard and priority NCERT routes to search", () => {
    const routePaths = paths();
    expect(routePaths.has("/ncert")).toBe(true);
    expect(routePaths.has("/ncert/class-7-arithmetic-expressions")).toBe(true);
    expect(routePaths.has("/ncert/class-7-algebraic-expressions")).toBe(true);
    expect(routePaths.has("/ncert/class-7-data-handling")).toBe(true);
    expect(routePaths.has("/ncert/class-10-two-tangents")).toBe(true);
    [
      "/ncert/class-12-relations-functions",
      "/ncert/class-12-determinants",
      "/ncert/class-12-continuity-differentiability",
      "/ncert/class-12-integration-methods",
      "/ncert/class-12-differential-equations",
      "/ncert/class-12-vectors-3d-geometry",
      "/ncert/class-12-bayes-theorem",
      "/ncert/class-12-linear-programming",
      "/ncert/class-12-inverse-trig",
    ].forEach((path) => expect(routePaths.has(path)).toBe(true));
  });

  it("exposes every Class 7, Class 10, and Class 12 NCERT route to search", () => {
    const routePaths = paths();
    ncertConcepts
      .filter((concept) => ["Class 7", "Class 10", "Class 12"].includes(concept.classLevel))
      .forEach((concept) => {
        expect(routePaths.has(ncertRoute(concept.id))).toBe(true);
      });
  });

  it("makes AR/XR, formulas, theorems, visual proofs, and math lab tools searchable", () => {
    const routePaths = paths();
    expect(routePaths.has("/modules/ar-math-lab")).toBe(true);
    expect(routePaths.has("/formulas/algebra")).toBe(true);
    expect(routePaths.has("/theorems/geometry")).toBe(true);
    expect(routePaths.has("/visual-proofs/geometry/pythagorean-theorem-area-rearrangement")).toBe(true);
    expect(routePaths.has("/math-lab/graphing-calculator")).toBe(true);
  });

  it("keeps route indexes discoverable across generated tool, formula, theorem, and proof links", () => {
    const routePaths = paths();
    mathLabTools.forEach((tool) => expect(routePaths.has(tool.route)).toBe(true));
    formulaCategories.forEach((category) => expect(routePaths.has(`/formulas/${category.id}`)).toBe(true));
    theoremCategories.forEach((category) => {
      expect(routePaths.has(`/theorems/${category.id}`)).toBe(true);
      category.theorems.forEach((theorem) => expect(routePaths.has(`/theorems/${category.id}/${theorem.slug}`)).toBe(true));
    });
    visualProofsIndex.forEach((proof) => expect(routePaths.has(proof.route)).toBe(true));
  });

  it("includes student-friendly NCERT search keywords", () => {
    const determinant = linkFor("/ncert/class-12-determinants");
    const tangent = linkFor("/ncert/class-10-two-tangents");
    expect(determinant?.keywords.join(" ").toLowerCase()).toContain("determinant");
    expect(determinant?.keywords.join(" ").toLowerCase()).toContain("visual lab");
    expect(tangent?.keywords.join(" ").toLowerCase()).toContain("tangent");
    expect(tangent?.keywords.join(" ").toLowerCase()).toContain("theorem");
  });
});
