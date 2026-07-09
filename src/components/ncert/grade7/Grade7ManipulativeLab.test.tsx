import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ncertConcepts } from "../../../data/ncertConcepts";
import Grade7ManipulativeLab, { grade7PriorityRouteIds, isGrade7PriorityRoute } from "./Grade7ManipulativeLab";

describe("Grade 7 manipulative lab routing", () => {
  it("covers every Phase 6 priority Grade 7 route", () => {
    const byId = new Map(ncertConcepts.map((concept) => [concept.id, concept]));
    for (const routeId of grade7PriorityRouteIds) {
      expect(byId.has(routeId)).toBe(true);
      expect(byId.get(routeId)?.classLevel).toBe("Class 7");
      expect(isGrade7PriorityRoute(routeId)).toBe(true);
    }
  });

  it("renders compact tabs, sub-tabs, and practice for a new route", () => {
    const concept = ncertConcepts.find((item) => item.id === "class-7-algebraic-expressions");
    expect(concept).toBeTruthy();
    const html = renderToStaticMarkup(<Grade7ManipulativeLab concept={concept!} />);

    expect(html).toContain("Class 7 NCERT manipulative lab");
    expect(html).toContain("Visual Model");
    expect(html).toContain("Practice");
    expect(html).toContain("like terms");
    expect(html).toContain("Live values");
    expect(html).toContain('role="tablist"');
  });
});
