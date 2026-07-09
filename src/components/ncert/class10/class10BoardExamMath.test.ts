import { describe, expect, it } from "vitest";
import {
  annulusArea,
  bptRatios,
  classifyLinearSystem,
  coneVolume,
  cylinderVolume,
  frustumCSA,
  frustumSlantHeight,
  frustumTSA,
  frustumVolume,
  groupedStats,
  heightFromAngleDistance,
  round,
  sectorArea,
  segmentArea,
  similarTriangleAreaRatio,
  solveLinearSystem,
  tangentCase,
  tangentLength,
  triangleAreaFromTwoRadii,
} from "./class10BoardExamMath";

describe("Class 10 board exam math utilities", () => {
  it("calculates tangent cases and tangent length", () => {
    expect(tangentCase(1, 2)).toContain("inside");
    expect(tangentCase(2, 2)).toContain("on circle");
    expect(tangentCase(5, 3)).toContain("outside");
    expect(round(tangentLength(5, 3))).toBe(4);
  });

  it("checks BPT ratios and similar triangle area ratio", () => {
    expect(bptRatios(0.5, 0.5).parallel).toBe(true);
    expect(bptRatios(0.3, 0.6).parallel).toBe(false);
    expect(similarTriangleAreaRatio(2)).toBe(4);
  });

  it("classifies and solves linear systems", () => {
    expect(classifyLinearSystem(2, 1, 7, 1, -1, 1)).toBe("unique");
    expect(classifyLinearSystem(2, 1, 7, 4, 2, 3)).toBe("none");
    expect(classifyLinearSystem(2, 1, 7, 4, 2, 14)).toBe("infinite");
    const solution = solveLinearSystem(2, 1, 7, 1, -1, 1);
    expect(round(solution?.x ?? 0)).toBe(2.67);
    expect(round(solution?.y ?? 0)).toBe(1.67);
  });

  it("calculates grouped mean, mode, and median", () => {
    const stats = groupedStats([
      { lower: 0, upper: 10, frequency: 6 },
      { lower: 10, upper: 20, frequency: 10 },
      { lower: 20, upper: 30, frequency: 14 },
      { lower: 30, upper: 40, frequency: 18 },
      { lower: 40, upper: 50, frequency: 12 },
    ]);
    expect(round(stats.mean)).toBe(28.33);
    expect(stats.modalIndex).toBe(3);
    expect(round(stats.modal)).toBe(34);
    expect(round(stats.median)).toBe(30);
  });

  it("calculates sector, triangle, segment, and annulus areas", () => {
    expect(round(sectorArea(7, 90))).toBe(38.48);
    expect(round(triangleAreaFromTwoRadii(7, 90))).toBe(24.5);
    expect(round(segmentArea(7, 90))).toBe(13.98);
    expect(round(annulusArea(5, 3))).toBe(50.27);
  });

  it("calculates solid volumes and frustum formulas", () => {
    expect(round(cylinderVolume(2, 5))).toBe(62.83);
    expect(round(coneVolume(2, 6))).toBe(25.13);
    const l = frustumSlantHeight(4, 2, 5);
    expect(round(l)).toBe(5.39);
    expect(round(frustumVolume(4, 2, 5))).toBe(146.61);
    expect(round(frustumCSA(4, 2, l))).toBe(101.51);
    expect(round(frustumTSA(4, 2, l))).toBe(164.34);
  });

  it("calculates heights and distances with tangent", () => {
    expect(round(heightFromAngleDistance(45, 100))).toBe(100);
    expect(round(heightFromAngleDistance(30, 100))).toBe(57.74);
  });
});
