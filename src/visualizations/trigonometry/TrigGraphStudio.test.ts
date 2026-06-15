import { describe, expect, it } from "vitest";
import {
  evaluateTrigGraphPoint,
  getAmplitudeBounds,
  getPhaseShift,
  getTrigGraphPeriod,
  safeTan,
  sampleTrigGraph,
  type GraphTransformState,
} from "./TrigGraphStudio";

const parentSin: GraphTransformState = { fn: "sin", amplitude: 1, frequency: 1, phase: 0, verticalShift: 0 };
const parentCos: GraphTransformState = { fn: "cos", amplitude: 1, frequency: 1, phase: 0, verticalShift: 0 };
const parentTan: GraphTransformState = { fn: "tan", amplitude: 1, frequency: 1, phase: 0, verticalShift: 0 };

describe("TrigGraphStudio math helpers", () => {
  it("evaluates sine parent graph values", () => {
    expect(evaluateTrigGraphPoint(parentSin, 0)).toBeCloseTo(0);
    expect(evaluateTrigGraphPoint(parentSin, Math.PI / 2)).toBeCloseTo(1);
    expect(evaluateTrigGraphPoint(parentSin, Math.PI)).toBeCloseTo(0);
  });

  it("evaluates cosine parent graph values", () => {
    expect(evaluateTrigGraphPoint(parentCos, 0)).toBeCloseTo(1);
    expect(evaluateTrigGraphPoint(parentCos, Math.PI / 2)).toBeCloseTo(0);
    expect(evaluateTrigGraphPoint(parentCos, Math.PI)).toBeCloseTo(-1);
  });

  it("marks tangent undefined near asymptotes", () => {
    expect(safeTan(Math.PI / 2)).toBeNull();
    expect(evaluateTrigGraphPoint(parentTan, Math.PI / 2)).toBeNull();
  });

  it("computes periods for sine, cosine, and tangent", () => {
    expect(getTrigGraphPeriod(parentSin)).toBeCloseTo(Math.PI * 2);
    expect(getTrigGraphPeriod({ ...parentCos, frequency: 2 })).toBeCloseTo(Math.PI);
    expect(getTrigGraphPeriod({ ...parentTan, frequency: 2 })).toBeCloseTo(Math.PI / 2);
  });

  it("computes phase shift as -c / b", () => {
    expect(getPhaseShift({ ...parentSin, frequency: 2, phase: Math.PI / 2 })).toBeCloseTo(-Math.PI / 4);
    expect(getPhaseShift({ ...parentSin, frequency: 1, phase: -Math.PI })).toBeCloseTo(Math.PI);
  });

  it("applies amplitude and vertical shift", () => {
    const state: GraphTransformState = { fn: "sin", amplitude: 2, frequency: 1, phase: 0, verticalShift: 1 };
    expect(evaluateTrigGraphPoint(state, Math.PI / 2)).toBeCloseTo(3);
    expect(getAmplitudeBounds(state)).toEqual({ lower: -1, upper: 3 });
  });

  it("returns no amplitude bounds for tangent", () => {
    expect(getAmplitudeBounds(parentTan)).toBeNull();
  });

  it("splits tangent into safe segments", () => {
    const samples = sampleTrigGraph(parentTan, -Math.PI, Math.PI, 200);
    const defined = samples.filter((sample) => sample.y !== null);
    const segments = new Set(defined.map((sample) => sample.segmentId));

    expect(segments.size).toBeGreaterThan(1);
    expect(samples.some((sample) => sample.y === null)).toBe(true);
  });

  it("never samples NaN or Infinity", () => {
    const states: GraphTransformState[] = [
      parentSin,
      { ...parentSin, amplitude: 2, frequency: 2, phase: Math.PI / 2, verticalShift: 1 },
      parentCos,
      parentTan,
    ];
    for (const state of states) {
      const samples = sampleTrigGraph(state, -Math.PI * 2, Math.PI * 2, 320);
      for (const sample of samples) {
        if (sample.y !== null) {
          expect(Number.isFinite(sample.y)).toBe(true);
        }
      }
    }
  });
});
