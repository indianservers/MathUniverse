import { describe, expect, it } from "vitest";
import {
  evaluateInverseTrig,
  formatAngleDeg,
  formatAngleRad,
  getDomainLabel,
  getInverseTrigRange,
  getReflectedPoint,
  sampleInverseGraph,
  sampleRestrictedOriginalGraph,
  type InverseTrigId,
} from "./InverseTrigVisualizer";

const cases: Record<InverseTrigId, Array<[number, number]>> = {
  asin: [
    [-1, -90],
    [-0.5, -30],
    [0, 0],
    [0.5, 30],
    [1, 90],
  ],
  acos: [
    [-1, 180],
    [-0.5, 120],
    [0, 90],
    [0.5, 60],
    [1, 0],
  ],
  atan: [
    [-5, -78.6900675],
    [-1, -45],
    [0, 0],
    [1, 45],
    [5, 78.6900675],
  ],
};

describe("InverseTrigVisualizer math helpers", () => {
  it("evaluates arcsin principal values", () => {
    for (const [input, expectedDeg] of cases.asin) {
      const result = evaluateInverseTrig("asin", input);
      expect(result.defined).toBe(true);
      expect(result.angleDeg).toBeCloseTo(expectedDeg, 4);
      expect(result.angleRad).not.toBeNull();
    }
  });

  it("evaluates arccos principal values", () => {
    for (const [input, expectedDeg] of cases.acos) {
      const result = evaluateInverseTrig("acos", input);
      expect(result.defined).toBe(true);
      expect(result.angleDeg).toBeCloseTo(expectedDeg, 4);
      expect(result.angleRad).not.toBeNull();
    }
  });

  it("evaluates arctan principal values", () => {
    for (const [input, expectedDeg] of cases.atan) {
      const result = evaluateInverseTrig("atan", input);
      expect(result.defined).toBe(true);
      expect(result.angleDeg).toBeCloseTo(expectedDeg, 4);
      expect(result.angleRad).not.toBeNull();
    }
  });

  it("rejects invalid arcsin and arccos inputs without NaN", () => {
    for (const id of ["asin", "acos"] as InverseTrigId[]) {
      for (const input of [-1.1, 1.1]) {
        const result = evaluateInverseTrig(id, input);
        expect(result.defined).toBe(false);
        expect(result.angleDeg).toBeNull();
        expect(result.angleRad).toBeNull();
        expect(JSON.stringify(result)).not.toContain("NaN");
        expect(JSON.stringify(result)).not.toContain("Infinity");
      }
    }
  });

  it("uses correct domain and range labels", () => {
    expect(getDomainLabel("asin")).toBe("[-1, 1]");
    expect(getDomainLabel("acos")).toBe("[-1, 1]");
    expect(getDomainLabel("atan")).toBe("(-infinity, infinity)");
    expect(evaluateInverseTrig("asin", 0.5).rangeLabel).toContain("-90 deg");
    expect(evaluateInverseTrig("acos", 0.5).rangeLabel).toContain("180 deg");
    expect(evaluateInverseTrig("atan", 1).rangeLabel).toContain("90 deg");
  });

  it("uses correct principal value ranges", () => {
    expect(getInverseTrigRange("asin")).toMatchObject({ minRad: -Math.PI / 2, maxRad: Math.PI / 2 });
    expect(getInverseTrigRange("acos")).toMatchObject({ minRad: 0, maxRad: Math.PI });
    expect(getInverseTrigRange("atan")).toMatchObject({ minRad: -Math.PI / 2, maxRad: Math.PI / 2, openMin: true, openMax: true });
  });

  it("maps reflected coordinates by swapping original x and y", () => {
    const point = getReflectedPoint("asin", 0.5);
    expect(point).not.toBeNull();
    expect(point?.original.y).toBeCloseTo(0.5, 6);
    expect(point?.inverse.x).toBeCloseTo(0.5, 6);
    expect(point?.original.x).toBeCloseTo(point?.inverse.y ?? 0, 6);
  });

  it("samples restricted and inverse graphs without NaN or Infinity", () => {
    for (const id of ["asin", "acos", "atan"] as InverseTrigId[]) {
      const samples = [...sampleRestrictedOriginalGraph(id), ...sampleInverseGraph(id)];
      expect(samples.length).toBeGreaterThan(100);
      for (const sample of samples) {
        expect(Number.isNaN(sample.x)).toBe(false);
        expect(sample.x).not.toBe(Infinity);
        expect(sample.x).not.toBe(-Infinity);
        if (sample.y !== null) {
          expect(Number.isNaN(sample.y)).toBe(false);
          expect(sample.y).not.toBe(Infinity);
          expect(sample.y).not.toBe(-Infinity);
        }
      }
    }
  });

  it("formats common principal values clearly", () => {
    expect(formatAngleDeg(30)).toBe("30 deg");
    expect(formatAngleRad(Math.PI / 6)).toBe("pi/6");
    expect(formatAngleRad(null)).toBe("undefined");
  });
});
