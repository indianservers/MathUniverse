import { describe, expect, it } from "vitest";
import {
  nearbyTraceValues,
  snapTraceX,
  traceFunctionPath,
  traceModeSlope,
  traceModeValue,
  traceXFromPixel,
} from "./traceModeLesson48Model";

describe("trace mode lesson 48 model", () => {
  it("calculates the target point and the true instantaneous slope", () => {
    expect(traceModeValue(1.8)).toBeCloseTo(1.513848, 5);
    expect(traceModeSlope(1.8)).toBeCloseTo(0.072798, 5);
  });

  it("generates nearby values from the active step", () => {
    const values = nearbyTraceValues(1.8, 0.1);
    expect(values.map((item) => item.x)).toEqual([
      1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2,
    ]);
    expect(values[4].y).toBeCloseTo(traceModeValue(1.8));
  });

  it("generates the curve and snaps graph movement", () => {
    expect(traceFunctionPath().split(" ")).toHaveLength(601);
    expect(snapTraceX(1.84, 0.1)).toBe(1.8);
    expect(traceXFromPixel(345, 0.1)).toBe(0);
  });
});
