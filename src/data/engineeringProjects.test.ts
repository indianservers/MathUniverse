import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import { engineeringProjects, projectsForDomain, projectSummary } from "./engineeringProjects";

describe("engineering portfolio projects", () => {
  it("covers every engineering math domain with multiple projects", () => {
    const coveredDomainIds = new Set(engineeringProjects.map((project) => project.domainId));
    expect(engineeringMathDomains.every((domain) => coveredDomainIds.has(domain.id))).toBe(true);
    expect(projectSummary().coveredDomainCount).toBe(engineeringMathDomains.length);

    engineeringMathDomains.forEach((domain) => {
      expect(projectsForDomain(domain.id).length).toBeGreaterThanOrEqual(2);
    });
  });

  it("keeps projects route-backed with meaningful assessment artifacts", () => {
    expect(engineeringProjects.every((project) => project.workspaceRoute.startsWith("/"))).toBe(true);
    expect(engineeringProjects.every((project) => project.deliverables.length >= 3)).toBe(true);
    expect(engineeringProjects.every((project) => project.rubric.length >= 3)).toBe(true);
    expect(engineeringProjects.every((project) => project.evidence.length >= 3)).toBe(true);
    expect(engineeringProjects.every((project) => project.estimatedMinutes > 0)).toBe(true);
  });

  it("summarizes project depth for the hub", () => {
    const summary = projectSummary();
    expect(summary.projectCount).toBe(engineeringProjects.length);
    expect(summary.domainCount).toBe(engineeringMathDomains.length);
    expect(summary.capstoneCount).toBeGreaterThan(0);
    expect(summary.deliverableCount).toBeGreaterThanOrEqual(engineeringProjects.length * 3);
    expect(summary.totalMinutes).toBeGreaterThan(600);
  });

  it("includes recognizable engineering project briefs", () => {
    expect(projectsForDomain("optimization-operations-research").some((project) => project.title.includes("LP"))).toBe(true);
    expect(projectsForDomain("complex-special-control").some((project) => project.title.includes("Pole"))).toBe(true);
    expect(projectsForDomain("partial-differential-equations").some((project) => project.title.includes("Heat"))).toBe(true);
  });

  it("renders portfolio projects on the Engineering Mathematics hub", async () => {
    const source = await readFile("src/pages/EngineeringMath.tsx", "utf8");
    expect(source).toContain("Portfolio Projects");
    expect(source).toContain("projectsForDomain");
    expect(source).toContain("projectSummary");
  });
});
