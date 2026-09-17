import { describe, expect, it } from "vitest";
import { continueGeoHref, relativeOpened } from "./geometryStudioSession";
import { geometrySearchHits } from "./geometryStudioCopy";
import { studioMockups, studioPagesWithoutHome } from "../mockup/studioMockupCatalog";
import { encodeTriangle, parseSnap, parseTriangle, setSideLength, snapPoint } from "./triangles/triangleFigureState";

describe("geometry studio session helpers", () => {
  it("builds continue href with last mode", () => {
    expect(continueGeoHref({
      lastRoute: "/geometry/triangles",
      lastMode: "congruence",
      lastLabel: "Triangles",
      lastOpenedAt: 1,
      completed: [],
      warmups: [],
      theme: "light",
      teacherMode: false,
      classPaused: false,
      hintDismissed: false,
      coachDismissed: false,
      largeLabels: false,
    })).toContain("mode=congruence");
  });

  it("describes a never-opened session", () => {
    expect(relativeOpened(0)).toBe("Not started yet");
  });
});

describe("geometry search", () => {
  it("indexes theorems and triangle modes", () => {
    const labs = studioPagesWithoutHome(studioMockups.geometry);
    const hits = geometrySearchHits(labs, "sss");
    expect(hits.some((hit) => hit.to.includes("congruence"))).toBe(true);
    expect(geometrySearchHits(labs, "thales").some((hit) => hit.label.includes("Thales"))).toBe(true);
  });
});

describe("triangle figure state", () => {
  it("round-trips vertices and snaps to the grid", () => {
    const tri = { A: { x: 2.2, y: 7.4 }, B: { x: 1.4, y: 1.3 }, C: { x: 9.6, y: 1.6 } };
    expect(parseTriangle(encodeTriangle(tri))).toEqual(tri);
    expect(snapPoint({ x: 1.24, y: 2.76 }, "grid")).toEqual({ x: 1, y: 3 });
    expect(parseSnap("angle")).toBe("angle");
    const scaled = setSideLength(tri, "AB", 4);
    expect(Math.abs(Math.hypot(scaled.B.x - scaled.A.x, scaled.B.y - scaled.A.y) - 4)).toBeLessThan(0.02);
  });
});
