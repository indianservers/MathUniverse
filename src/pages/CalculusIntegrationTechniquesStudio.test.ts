import { describe, expect, it } from "vitest";
import {
  evaluateTechnique,
  type TechniqueId,
} from "./CalculusIntegrationTechniquesStudio";

describe("Integration Techniques Studio", () => {
  it("matches the substitution example and transforms both bounds", () => {
    const result = evaluateTechnique("substitution", 0, 2);

    expect(result.value).toBeCloseTo((5 * Math.sqrt(5) - 1) / 3, 8);
    expect(result.mappedBounds).toEqual([1, 5]);
    expect(result.transformed).toContain("u^{1/2}");
  });

  it("provides a finite, distinct workflow for every technique tab", () => {
    const examples: Array<[TechniqueId, number, number]> = [
      ["substitution", 0, 2],
      ["parts", 0, 2],
      ["partial", 2, 4],
      ["trig", 0, Math.PI / 2],
      ["trig-sub", 0, 2],
      ["improper", 1, 8],
    ];
    const transformed = new Set<string>();

    for (const [technique, lower, upper] of examples) {
      const result = evaluateTechnique(technique, lower, upper);
      expect(Number.isFinite(result.value)).toBe(true);
      expect(result.original).not.toBe(result.transformed);
      transformed.add(result.transformed);
    }

    expect(transformed.size).toBe(examples.length);
  });

  it("uses the expected convergence value for the improper example", () => {
    const finiteProbe = evaluateTechnique("improper", 1, 8);
    const distantProbe = evaluateTechnique("improper", 1, 10000);

    expect(finiteProbe.value).toBeCloseTo(0.875, 8);
    expect(distantProbe.value).toBeCloseTo(1, 3);
  });
});
