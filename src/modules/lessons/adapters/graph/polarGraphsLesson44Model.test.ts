import { describe, expect, it } from "vitest";
import {
  polarAngleFromPixels,
  polarPetalCount,
  polarReferencePath,
  polarRosePath,
  polarRosePoint,
} from "./polarGraphsLesson44Model";

describe("polar graphs lesson 44 model", () => {
  it("derives the live point from the displayed polar equation", () => {
    const point = polarRosePoint(4, 3, 40);
    expect(point.radius).toBeCloseTo(3.464102, 5);
    expect(point.x).toBeCloseTo(2.653656, 5);
    expect(point.y).toBeCloseTo(2.226682, 5);
  });

  it("calculates odd and even rose petal counts", () => {
    expect(polarPetalCount(3)).toBe(3);
    expect(polarPetalCount(4)).toBe(8);
  });

  it("generates both paths and maps pointer angle", () => {
    expect(polarRosePath(4, 3).split(" ")).toHaveLength(721);
    expect(polarReferencePath(4).split(" ")).toHaveLength(361);
    expect(polarAngleFromPixels(450, 300)).toBe(0);
    expect(polarAngleFromPixels(350, 200)).toBe(90);
  });
});
