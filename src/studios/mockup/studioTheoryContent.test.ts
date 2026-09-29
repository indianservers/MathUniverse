import { describe, expect, it } from "vitest";
import { distributionSpecs } from "../../modules/probability-statistics/data/distributionAtlas";
import { geometryConcepts } from "../../data/geometryConcepts";
import { trigonometryConcepts } from "../../data/trigonometryConcepts";
import { studioMockups } from "./studioMockupCatalog";
import { studioSimpleWords } from "./studioSimpleWords";
import { studioTheoryContent } from "./studioTheoryContent";
import { standaloneStudioTheoryRoutes } from "./StandaloneStudioTheory";

describe("studio theory coverage", () => {
  it("provides a plain-language explanation of at most 150 words for every topic", () => {
    for (const [studioId, pages] of Object.entries(studioTheoryContent)) {
      for (const pageId of Object.keys(pages)) {
        const explanation = studioSimpleWords[studioId]?.[pageId];
        expect(explanation, `${studioId}/${pageId}`).toBeDefined();
        const words = explanation.trim().split(/\s+/);
        expect(words.length, `${studioId}/${pageId} word count`).toBeGreaterThanOrEqual(12);
        expect(words.length, `${studioId}/${pageId} word count`).toBeLessThanOrEqual(150);
      }
    }
    for (const spec of distributionSpecs) {
      const explanation = studioSimpleWords["distribution-detail"]?.[spec.id];
      expect(explanation, `distribution-detail/${spec.id}`).toBeDefined();
      expect(explanation.trim().split(/\s+/).length, spec.id).toBeLessThanOrEqual(150);
    }
    for (const [family, concepts] of [["geometry-concepts", geometryConcepts], ["trigonometry-concepts", trigonometryConcepts]] as const) {
      for (const concept of concepts) {
        const explanation = studioSimpleWords[family]?.[concept.id];
        expect(explanation, `${family}/${concept.id}`).toBeDefined();
        expect(explanation.trim().split(/\s+/).length, `${family}/${concept.id}`).toBeLessThanOrEqual(150);
      }
    }
  });
  it("provides three complete, topic-specific worked examples for every catalogued page", () => {
    for (const studio of Object.values(studioMockups)) {
      for (const page of studio.pages) {
        const theory = studioTheoryContent[studio.id]?.[page.id];
        expect(theory, `${studio.id}/${page.id}`).toBeDefined();
        expect(theory?.principle.length, `${studio.id}/${page.id} principle`).toBeGreaterThan(80);
        expect(theory?.method.length, `${studio.id}/${page.id} method`).toBeGreaterThan(60);
        expect(theory?.caution.length, `${studio.id}/${page.id} caution`).toBeGreaterThan(35);
        expect(theory?.examples, `${studio.id}/${page.id} examples`).toHaveLength(3);
        for (const example of theory?.examples ?? []) {
          expect(example.title.length, `${studio.id}/${page.id} example title`).toBeGreaterThan(2);
          expect(example.setup.trim().length, `${studio.id}/${page.id} example setup`).toBeGreaterThan(0);
          expect(example.result.trim().length, `${studio.id}/${page.id} example result`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("covers every standalone studio route with its own theory entry", () => {
    for (const [path, route] of Object.entries(standaloneStudioTheoryRoutes)) {
      expect(studioTheoryContent[route.studioId]?.[route.pageId], path).toBeDefined();
      expect(studioTheoryContent[route.studioId]?.[route.pageId].examples, path).toHaveLength(3);
      expect(studioSimpleWords[route.studioId]?.[route.pageId], `${path} simple words`).toBeDefined();
    }
  });

  it("exposes theory on custom studio routes that bypass the shared chrome", () => {
    expect(standaloneStudioTheoryRoutes["/shapes"]).toMatchObject({ studioId: "geometry", pageId: "shapes" });
    expect(studioTheoryContent.geometry.segment.examples).toHaveLength(3);
    for (const page of studioMockups["complex-numbers"].pages) {
      expect(standaloneStudioTheoryRoutes[page.route], page.route).toMatchObject({
        studioId: "complex-numbers",
        pageId: page.id,
      });
    }
  });
});
