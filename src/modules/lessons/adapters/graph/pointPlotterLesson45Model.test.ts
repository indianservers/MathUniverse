import { describe, expect, it } from "vitest";
import {
  DEFAULT_PLOT_POINTS,
  connectedPointPath,
  pointFromPlotPixels,
  reorderPlotPoints,
} from "./pointPlotterLesson45Model";

describe("point plotter lesson 45 model", () => {
  it("maps the target points to exact graph coordinates", () => {
    expect(pointFromPlotPixels(386, 198, true)).toEqual({ x: 1, y: 2 });
    expect(connectedPointPath(DEFAULT_PLOT_POINTS).split(" ")).toHaveLength(5);
  });

  it("reorders the point collection without changing its objects", () => {
    const reordered = reorderPlotPoints(DEFAULT_PLOT_POINTS, "E", "A");
    expect(reordered.map((point) => point.id)).toEqual([
      "E",
      "A",
      "B",
      "C",
      "D",
    ]);
    expect(DEFAULT_PLOT_POINTS[0].id).toBe("A");
  });
});
