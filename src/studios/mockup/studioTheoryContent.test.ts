import { describe, expect, it } from "vitest";
import { studioMockups } from "./studioMockupCatalog";
import { studioTheoryContent } from "./studioTheoryContent";
import { standaloneStudioTheoryRoutes } from "./StandaloneStudioTheory";

describe("studio theory coverage", () => {
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
    }
  });
});
