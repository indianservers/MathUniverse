import { describe, expect, it } from "vitest";
import {
  lissajousPath,
  parametricPath,
  parametricPoint,
  parametricVelocity,
  timeFromGraphPosition,
} from "./parametricCurvesLesson43Model";

describe("parametric curves lesson 43 model", () => {
  it("derives the real target-time position from the displayed equations", () => {
    const point = parametricPoint(3, 2, Math.PI * 1.2);
    expect(point.x).toBeCloseTo(-2.427051, 5);
    expect(point.y).toBeCloseTo(-1.175571, 5);
    expect(parametricVelocity(3, 2, Math.PI * 1.2).speed).toBeGreaterThan(0);
  });

  it("generates primary and comparison paths", () => {
    expect(parametricPath(3, 2).split(" ")).toHaveLength(361);
    expect(lissajousPath(3, 2).split(" ")).toHaveLength(721);
  });

  it("maps a dragged point back to its parameter", () => {
    expect(timeFromGraphPosition(611, 290, 3, 2)).toBeCloseTo(0);
  });
});
