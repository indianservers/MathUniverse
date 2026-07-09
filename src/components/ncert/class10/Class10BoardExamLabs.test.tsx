import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { ncertConcepts } from "../../../data/ncertConcepts";
import Class10BoardExamLab, { class10PriorityRouteIds, isClass10PriorityRoute } from "./Class10BoardExamLabs";

describe("Class 10 board exam lab routing", () => {
  it("covers every Phase 5 priority NCERT route", () => {
    const conceptIds = new Set(ncertConcepts.map((concept) => concept.id));
    for (const routeId of class10PriorityRouteIds) {
      expect(conceptIds.has(routeId)).toBe(true);
      expect(isClass10PriorityRoute(routeId)).toBe(true);
    }
  });

  it("keeps the Phase 5 scope to Class 10 concepts", () => {
    const byId = new Map(ncertConcepts.map((concept) => [concept.id, concept]));
    for (const routeId of class10PriorityRouteIds) {
      expect(byId.get(routeId)?.classLevel).toBe("Class 10");
    }
  });

  it("renders the Phase 5.5 tabbed board-exam workspace", () => {
    const concept = ncertConcepts.find((item) => item.id === "class-10-circle-tangent-radius");
    expect(concept).toBeTruthy();
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Class10BoardExamLab concept={concept!} />
      </MemoryRouter>,
    );

    expect(html).toContain("Visual Lab");
    expect(html).toContain("Stepper / Proof");
    expect(html).toContain("Practice");
    expect(html).toContain("Links");
    expect(html).toContain('role="tablist"');
  });
});
