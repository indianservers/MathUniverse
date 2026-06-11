import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  engineeringCoverageGaps,
  engineeringDomainById,
  engineeringMathDomains,
  engineeringMathMilestones,
  engineeringMathSummary,
  engineeringSyllabusTopics,
} from "./engineeringMathBlueprint";

const sourceFiles = {
  app: new URL("../App.tsx", import.meta.url),
  nav: new URL("../components/layout/navItems.ts", import.meta.url),
  mathLabTools: new URL("./mathLabTools.ts", import.meta.url),
};

describe("engineering math blueprint", () => {
  it("maps the complete engineering syllabus into major B.Tech domains", () => {
    expect(engineeringMathSummary.domainCount).toBeGreaterThanOrEqual(10);
    expect(engineeringMathSummary.topicCount).toBe(engineeringSyllabusTopics.length);
    expect(engineeringMathSummary.topicCount).toBeGreaterThan(40);
    expect(engineeringMathDomains.every((domain) => domain.topics.length > 0)).toBe(true);
  });

  it("keeps every engineering domain native, formula-rich, and workspace-aware", () => {
    expect(engineeringMathDomains.every((domain) => domain.nativeRoutes.every((route) => route.startsWith("/")))).toBe(true);
    expect(engineeringMathDomains.every((domain) => domain.nativeRoutes.length > 0)).toBe(true);
    expect(engineeringMathDomains.every((domain) => domain.formulaFamilies.length >= 4)).toBe(true);
    expect(engineeringMathDomains.every((domain) => domain.workspaceTargets.length >= 3)).toBe(true);
    expect(engineeringCoverageGaps()).toEqual([]);
  });

  it("covers the world-class engineering math pillars explicitly", () => {
    const required = [
      "engineering-calculus",
      "engineering-differential-equations",
      "engineering-linear-algebra",
      "transforms-signals",
      "partial-differential-equations",
      "numerical-methods",
      "probability-statistics-stochastic",
      "optimization-operations-research",
      "vector-calculus-fields",
      "complex-special-control",
    ];

    expect(required.every((id) => engineeringDomainById(id))).toBe(true);
  });

  it("defines phased milestones without touching protected 2D/3D workspaces", () => {
    expect(engineeringMathMilestones.length).toBeGreaterThanOrEqual(3);
    expect(engineeringMathMilestones[0].acceptanceTargets.some((target) => target.includes("No existing 2D/3D workspace layout"))).toBe(true);
    expect(engineeringMathMilestones.every((milestone) => milestone.deliverables.length > 0)).toBe(true);
  });

  it("wires the engineering math hub into app routing, navigation, and Math Lab", async () => {
    const [app, nav, mathLabTools] = await Promise.all([
      readFile(sourceFiles.app, "utf8"),
      readFile(sourceFiles.nav, "utf8"),
      readFile(sourceFiles.mathLabTools, "utf8"),
    ]);

    expect(app).toContain('path="engineering-math"');
    expect(nav).toContain('route: "/engineering-math"');
    expect(mathLabTools).toContain('route: "/engineering-math"');
  });
});
