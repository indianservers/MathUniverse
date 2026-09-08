import { describe, expect, it } from "vitest";
import {
  DEFAULT_AXIS_STATE,
  applyAxisPreset,
  axisCurvePath,
  axisGraphPosition,
  axisWorldFromPixels,
  normalizeAxisState,
} from "./axisControlsLesson50Model";

describe("axis controls lesson 50 model", () => {
  it("projects and unprojects the target visible window", () => {
    expect(axisGraphPosition(0, 0, DEFAULT_AXIS_STATE)).toEqual({
      x: 310,
      y: 500,
    });
    expect(axisWorldFromPixels(310, 250, DEFAULT_AXIS_STATE)).toEqual({
      x: 0,
      y: 9,
    });
  });

  it("keeps logarithmic ranges mathematically valid", () => {
    const normalized = normalizeAxisState({
      ...DEFAULT_AXIS_STATE,
      xScale: "log",
      yScale: "log",
    });
    expect(normalized.xMin).toBe(0.1);
    expect(normalized.yMin).toBe(0.1);
  });

  it("applies real presets and generates the exponential curve", () => {
    expect(applyAxisPreset(DEFAULT_AXIS_STATE, "origin")).toMatchObject({
      xMin: -2,
      xMax: 2,
      yMin: -2,
      yMax: 2,
    });
    expect(axisCurvePath(DEFAULT_AXIS_STATE).split(" ").length).toBeGreaterThan(
      300,
    );
  });
});
