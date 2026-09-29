import { describe, expect, it } from "vitest";
import { matchStudioPage, studioMockups, studioNavPages, studioRouteTable } from "./studioMockupCatalog";

describe("studio mockup catalog", () => {
  it("covers nine mockup studios with home plus labs", () => {
    expect(Object.keys(studioMockups)).toEqual([
      "geometry",
      "trigonometry",
      "linear-algebra",
      "complex-numbers",
      "modelling",
      "discrete",
      "statistics",
      "differential-equations",
    ]);
    expect(studioRouteTable.length).toBeGreaterThan(70);
  });

  it("resolves nested lab paths and legacy mode query", () => {
    const geo = studioMockups.geometry;
    expect(matchStudioPage(geo, "/geometry").id).toBe("home");
    expect(matchStudioPage(geo, "/geometry/triangles").id).toBe("triangles");
    expect(geo.pages.find((item) => item.id === "solids")?.route).toBe("/shapes");
    expect(studioNavPages(geo).some((item) => item.id === "ar")).toBe(false);
    expect(studioNavPages(studioMockups.discrete).some((item) => item.id === "sets")).toBe(false);
    expect(matchStudioPage(studioMockups["linear-algebra"], "/linear-algebra", "eigenvectors").id).toBe("eigenvectors");
  });

  it("gives every lab a visible description and a topic-specific action", () => {
    for (const studio of Object.values(studioMockups)) {
      for (const page of studio.pages.filter((item) => item.id !== "home")) {
        expect(page.title.trim().length, page.route).toBeGreaterThan(5);
        expect(page.subtitle.trim().length, page.route).toBeGreaterThan(15);
        expect(page.description.trim().length, page.route).toBeGreaterThan(10);
        expect(page.learning.try.trim().length, page.route).toBeGreaterThan(5);
      }
    }
  });
});
