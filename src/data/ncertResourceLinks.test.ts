import { describe, expect, it } from "vitest";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";
import { formulaCategories } from "./formulaLibrary";
import { mathLabTools } from "./mathLabTools";
import { ncertConcepts } from "./ncertConcepts";
import { internalSiteLinks } from "./siteLinks";
import { theoremCategories } from "./theoremLibrary";
import { getNCERTConceptResourceLinks } from "./ncertResourceLinks";

const knownDynamicRoutes = new Set([
  "/concept-map",
  "/linear-algebra",
  "/math/derivatives",
  "/math/functions",
  "/math/integration",
  "/math/slope-fields",
  "/trigonometry",
]);

function stripQuery(path: string) {
  return path.split("?")[0];
}

describe("NCERT resource links", () => {
  const knownRoutes = new Set([
    "/",
    "/formulas",
    "/math-lab",
    "/ncert",
    "/theorems",
    "/visual-proofs",
    "/workspace",
    "/workspace/3d",
    "/workspace/data",
    "/workspace/graph",
    ...internalSiteLinks.map((link) => link.path),
    ...formulaCategories.map((category) => `/formulas/${category.id}`),
    ...mathLabTools.map((tool) => tool.route),
    ...ncertConcepts.map((concept) => `/ncert/${concept.id}`),
    ...theoremCategories.flatMap((category) => [
      `/theorems/${category.id}`,
      ...category.theorems.map((theorem) => `/theorems/${category.id}/${theorem.slug}`),
    ]),
    ...visualProofsIndex.map((proof) => proof.route),
    ...Array.from(new Set(visualProofsIndex.map((proof) => `/visual-proofs/${proof.categorySlug}`))),
    ...knownDynamicRoutes,
  ]);

  it("provides resource links for every NCERT concept", () => {
    for (const concept of ncertConcepts) {
      const links = getNCERTConceptResourceLinks(concept);
      expect(links.length, concept.id).toBeGreaterThan(0);
      expect(new Set(links.map((link) => link.href)).size, concept.id).toBe(links.length);
    }
  });

  it("only points to existing internal app routes", () => {
    for (const concept of ncertConcepts) {
      for (const link of getNCERTConceptResourceLinks(concept)) {
        expect(link.href.startsWith("/"), `${concept.id}: ${link.href}`).toBe(true);
        expect(knownRoutes.has(stripQuery(link.href)), `${concept.id}: ${link.href}`).toBe(true);
      }
    }
  });

  it("marks priority NCERT routes with exact links when exact resources exist", () => {
    const priorityConcepts = ncertConcepts.filter((concept) => ["Class 10", "Class 12"].includes(concept.classLevel));
    const exactReady = priorityConcepts.filter((concept) => getNCERTConceptResourceLinks(concept).some((link) => link.exactness === "exact"));
    expect(exactReady.length).toBeGreaterThanOrEqual(30);
  });

  it("keeps unresolved tangent visual proof as a category fallback instead of a fake exact route", () => {
    const links = getNCERTConceptResourceLinks("class-10-circle-tangent-radius");
    expect(links.some((link) => link.href === "/visual-proofs/geometry/circle-tangent-radius-theorem")).toBe(false);
    expect(links).toContainEqual(expect.objectContaining({ href: "/visual-proofs/geometry", exactness: "category" }));
  });
});
