import { describe, expect, it } from "vitest";
import {
  destandardise,
  standardisationAnalysis,
  standardisationTable,
  standardise,
} from "./standardisationLessonModel";

describe("standardisation lesson model", () => {
  it("maps the target raw score to standard units and back", () => {
    const result = standardisationAnalysis(65, 50, 10);
    expect(result.z).toBe(1.5);
    expect(result.percentile).toBeCloseTo(0.93319, 5);
    expect(destandardise(result.z, 50, 10)).toBe(65);
    expect(standardise(65, 50, 10)).toBe(1.5);
  });

  it("creates reversible percentile rows", () => {
    const rows = standardisationTable(50, 10, 65);
    expect(rows).toHaveLength(6);
    expect(rows[2].raw).toBeCloseTo(50, 8);
    expect(rows[4].z).toBeCloseTo(1.5, 8);
  });
});
