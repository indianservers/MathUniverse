import { describe, expect, it } from "vitest";
import {
  DEFAULT_GRID_STATE,
  gridCurvePath,
  gridFunctionValue,
  gridLines,
  gridXFromPixel,
  snapGridX,
} from "./gridControlsLesson51Model";

describe("grid controls lesson 51 model", () => {
  it("matches the target selected function value", () => {
    expect(gridFunctionValue(1.5)).toBe(1.125);
  });

  it("snaps to the actual minor-grid interval", () => {
    expect(gridLines(DEFAULT_GRID_STATE).minorSpacing).toBe(0.25);
    expect(snapGridX(1.62, DEFAULT_GRID_STATE)).toBe(1.5);
    expect(snapGridX(1.62, { ...DEFAULT_GRID_STATE, snap: false })).toBe(1.62);
  });

  it("generates graph and pointer geometry", () => {
    expect(gridCurvePath().split(" ")).toHaveLength(401);
    expect(gridXFromPixel(442.857142857, DEFAULT_GRID_STATE)).toBe(1.5);
  });
});
