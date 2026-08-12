import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generateLargeConstruction, runLargeConstructionBenchmark } from "./largeConstructionPerformance";

describe("large construction performance", () => {
  it("generates dependency-rich synthetic constructions", () => {
    const objects = generateLargeConstruction(25);

    expect(objects.length).toBe(49);
    expect(objects.some((object) => (object.dependencies?.length ?? 0) > 0)).toBe(true);
  });

  it("benchmarks evaluate/protocol/export for large constructions", () => {
    const scenarios = [
      { size: 250, budgetMs: 1000 },
      { size: 500, budgetMs: 2000 },
      { size: 1000, budgetMs: 5000 },
    ];
    const results = scenarios.map(({ size, budgetMs }) => {
      runLargeConstructionBenchmark(size, budgetMs);
      return runLargeConstructionBenchmark(size, budgetMs);
    });
    const artifactDirectory = resolve(process.cwd(), "artifacts/math-workspaces-phase3");
    mkdirSync(artifactDirectory, { recursive: true });
    writeFileSync(resolve(artifactDirectory, "performance.json"), `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      environment: "Vitest Node worker; one warm-up run before each measured scenario",
      scenarios: results,
    }, null, 2)}\n`);

    expect(results.map((benchmark) => benchmark.objectCount)).toEqual([499, 999, 1999]);
    expect(results.every((benchmark) => benchmark.dependencyCount > 0)).toBe(true);
    expect(results.every((benchmark) => benchmark.passed)).toBe(true);
  }, 15000);
});
