import { describe, expect, it } from "vitest";
import { continueHref } from "./trigStudioSession";
import { parseChallengeAnswer as parseBox } from "./studioLabKit";
import { searchHits } from "./trigStudioCopy";
import { studioMockups, studioPagesWithoutHome } from "./studioMockupCatalog";

describe("trig studio session helpers", () => {
  it("builds continue href with last mode", () => {
    expect(continueHref({
      units: "deg",
      theta: 30,
      lastRoute: "/trigonometry/identities",
      lastMode: "Double Angle",
      lastLabel: "Identities",
      completed: ["unit-circle"],
      xp: 10,
      theme: "dark",
      teacherMode: false,
      hintDismissed: false,
      stripScroll: 0,
    })).toContain("mode=Double%20Angle");
  });

  it("indexes lab modes in search hits", () => {
    const labs = studioPagesWithoutHome(studioMockups.trigonometry);
    const hits = searchHits(labs, "exact");
    expect(hits.some((hit) => hit.label === "Exact Values" && hit.to.includes("unit-circle"))).toBe(true);
  });
});

describe("challenge answers", () => {
  it("parses exact-value text", () => {
    expect(parseBox("1")).toBe(1);
    expect(parseBox("√2/2")).toBeCloseTo(Math.SQRT1_2);
    expect(parseBox("1/2")).toBe(0.5);
  });
});
