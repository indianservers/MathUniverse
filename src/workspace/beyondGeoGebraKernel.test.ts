import { describe, expect, it } from "vitest";
import {
  assessConstruction,
  buildBeyondGeoGebraUnitPackages,
  commandDocsForPackages,
  objectAwareTutorResponse,
  productionReadinessPlan,
  validateGuidedTaskResponse,
} from "./beyondGeoGebraKernel";

describe("beyond GeoGebra intelligence kernel", () => {
  it("creates complete lab packages across major syllabus units", () => {
    const packages = buildBeyondGeoGebraUnitPackages();

    expect(packages.length).toBeGreaterThanOrEqual(10);
    expect(packages.map((item) => item.unit)).toEqual(expect.arrayContaining(["Number Systems", "Polynomials", "Circles", "Trigonometry", "Statistics", "3D Geometry"]));
    expect(packages.every((item) => item.guidedTasks.length === 4 && item.formulas.length >= 3 && item.misconceptions.length >= 3)).toBe(true);
    expect(packages.every((item) => item.assessment.rubric.reduce((sum, row) => sum + row.points, 0) === 10)).toBe(true);
  });

  it("validates guided responses and assesses construction evidence", () => {
    const circle = buildBeyondGeoGebraUnitPackages().find((item) => item.unit === "Circles")!;
    const validation = validateGuidedTaskResponse(circle.guidedTasks[0], "My prediction mentions the formula and visible invariant radius.");
    const assessment = assessConstruction(circle, [
      { kind: "circle", definition: "Circle[(0,0), 4]", visible: true },
      { kind: "measurement", definition: "Radius measurement", visible: true },
      { kind: "tangent", definition: "Tangent line", visible: true },
    ]);

    expect(validation.passed).toBe(true);
    expect(assessment.passed).toBe(true);
    expect(assessment.score).toBe(100);
  });

  it("generates object-aware tutor responses and searchable docs", () => {
    const packages = buildBeyondGeoGebraUnitPackages();
    const response = objectAwareTutorResponse(packages[0], "what theorem applies", "Line AB moved");
    const docs = commandDocsForPackages(packages);
    const readiness = productionReadinessPlan();

    expect(response.explanation.length).toBeGreaterThan(20);
    expect(docs.length).toBeGreaterThan(packages.length);
    expect(readiness.performance).toContain("Move CAS/geometry stress work to a Web Worker");
    expect(readiness.discoverability).toContain("Show-me-how mini tours");
  });
});
