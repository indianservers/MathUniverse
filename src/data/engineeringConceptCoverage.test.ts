import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { buildEngineeringConceptCoverage, engineeringCoverageSummary } from "./engineeringConceptCoverage";
import { engineeringMathDomains } from "./engineeringMathBlueprint";

const pageSource = new URL("../pages/EngineeringMath.tsx", import.meta.url);

describe("engineering concept coverage", () => {
  it("audits every engineering math domain across content, visual, and solver coverage", () => {
    const rows = buildEngineeringConceptCoverage();

    expect(rows).toHaveLength(engineeringMathDomains.length);
    expect(rows.every((row) => row.counts.topics > 0)).toBe(true);
    expect(rows.every((row) => row.counts.nativeVisuals > 0)).toBe(true);
    expect(rows.every((row) => row.counts.formulas >= 4)).toBe(true);
    expect(rows.every((row) => row.counts.launchers >= 5)).toBe(true);
    expect(rows.every((row) => row.counts.solvers >= 1)).toBe(true);
  });

  it("summarizes remaining upgrade gaps for the hub", () => {
    const summary = engineeringCoverageSummary();

    expect(summary.domainCount).toBe(engineeringMathDomains.length);
    expect(summary.average).toBeGreaterThanOrEqual(90);
    expect(summary.completeDomains).toBeGreaterThan(0);
    expect(summary.examReadinessAverage).toBeGreaterThan(0);
  });

  it("renders the concept coverage audit on the Engineering Mathematics hub", async () => {
    const source = await readFile(pageSource, "utf8");

    expect(source).toContain("Concept Coverage Audit");
    expect(source).toContain("engineeringCoverageSummary");
    expect(source).toContain("buildEngineeringConceptCoverage");
    expect(source).toContain("conceptVisualCount");
    expect(source).toContain("conceptRouteFor");
  });
});
