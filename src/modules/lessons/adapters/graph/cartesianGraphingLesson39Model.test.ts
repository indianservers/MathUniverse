import { describe, expect, it } from "vitest";
import {
  cartesianPointAnalysis,
  graphPosition,
  pointFromGraphPosition,
} from "./cartesianGraphingLesson39Model";

describe("Cartesian graphing lesson 39 model", () => {
  it("describes the target point in read order", () => {
    const point = cartesianPointAnalysis(2, 3);
    expect(point).toMatchObject({
      x: 2,
      y: 3,
      orderedPair: "(2, 3)",
      quadrant: "Quadrant I",
      horizontalDirection: "right",
      verticalDirection: "up",
      confirmed: true,
    });
  });

  it("classifies every quadrant, axis, and the origin", () => {
    expect(cartesianPointAnalysis(-2, 3).quadrant).toBe("Quadrant II");
    expect(cartesianPointAnalysis(-2, -3).quadrant).toBe("Quadrant III");
    expect(cartesianPointAnalysis(2, -3).quadrant).toBe("Quadrant IV");
    expect(cartesianPointAnalysis(0, 3).quadrant).toBe("y-axis");
    expect(cartesianPointAnalysis(2, 0).quadrant).toBe("x-axis");
    expect(cartesianPointAnalysis(0, 0).quadrant).toBe("Origin");
  });

  it("snaps and clamps graph coordinates", () => {
    expect(cartesianPointAnalysis(1.76, -8)).toMatchObject({ x: 2, y: -5 });
    expect(pointFromGraphPosition(500, 160)).toMatchObject({ x: 2, y: 3 });
    expect(graphPosition({ x: 2, y: 3 })).toEqual({ x: 500, y: 160 });
  });
});
