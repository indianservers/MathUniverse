import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { engineeringMathDomains } from "./engineeringMathBlueprint";
import {
  dependenciesForDomain,
  dependencyGraphSummary,
  engineeringDependencyEdges,
  engineeringLearningPaths,
  learningPathsForDomain,
  unlocksForDomain,
} from "./engineeringDependencyGraph";

describe("engineering dependency graph", () => {
  it("connects every engineering math domain", () => {
    const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
    const connectedDomainIds = new Set(engineeringDependencyEdges.flatMap((edge) => [edge.from, edge.to]));
    expect(Array.from(domainIds).every((domainId) => connectedDomainIds.has(domainId))).toBe(true);
    expect(dependencyGraphSummary().connectedDomainCount).toBe(engineeringMathDomains.length);
  });

  it("uses only valid domain ids in edges and paths", () => {
    const domainIds = new Set(engineeringMathDomains.map((domain) => domain.id));
    expect(engineeringDependencyEdges.every((edge) => domainIds.has(edge.from) && domainIds.has(edge.to))).toBe(true);
    expect(engineeringLearningPaths.every((path) => path.domainIds.every((domainId) => domainIds.has(domainId)))).toBe(true);
  });

  it("returns prerequisites, unlocks, and path memberships for selected domains", () => {
    expect(unlocksForDomain("engineering-calculus").length).toBeGreaterThanOrEqual(3);
    expect(dependenciesForDomain("partial-differential-equations").length).toBeGreaterThanOrEqual(3);
    expect(learningPathsForDomain("engineering-linear-algebra").length).toBeGreaterThanOrEqual(2);
  });

  it("keeps learning paths meaningful", () => {
    const summary = dependencyGraphSummary();
    expect(summary.edgeCount).toBeGreaterThanOrEqual(12);
    expect(summary.pathCount).toBeGreaterThanOrEqual(5);
    expect(summary.longestPathLength).toBeGreaterThanOrEqual(3);
    expect(engineeringLearningPaths.every((path) => path.outcome.length > 30)).toBe(true);
  });

  it("renders the dependency map on the Engineering Mathematics hub", async () => {
    const source = await readFile("src/pages/EngineeringMath.tsx", "utf8");
    expect(source).toContain("Dependency Map");
    expect(source).toContain("dependenciesForDomain");
    expect(source).toContain("learningPathsForDomain");
  });
});
