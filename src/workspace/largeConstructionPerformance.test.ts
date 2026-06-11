import { describe, expect, it } from "vitest";
import { generateLargeConstruction, runLargeConstructionBenchmark } from "./largeConstructionPerformance";

describe("large construction performance", () => {
  it("generates dependency-rich synthetic constructions", () => {
    const objects = generateLargeConstruction(25);

    expect(objects.length).toBe(49);
    expect(objects.some((object) => (object.dependencies?.length ?? 0) > 0)).toBe(true);
  });

  it("benchmarks evaluate/protocol/export for large constructions", () => {
    const benchmark = runLargeConstructionBenchmark(80, 1000);

    expect(benchmark.objectCount).toBe(159);
    expect(benchmark.dependencyCount).toBeGreaterThan(0);
    expect(benchmark.passed).toBe(true);
  });
});
