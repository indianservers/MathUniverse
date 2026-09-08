import { describe, expect, it } from "vitest";
import {
  DEFAULT_ZOOM_VIEWPORT,
  panViewport,
  viewportBounds,
  viewportCenterFromPixels,
  viewportRectangle,
  zoomPanCurvePath,
  zoomViewport,
} from "./zoomPanLesson49Model";

describe("zoom and pan lesson 49 model", () => {
  it("starts at the exact target viewport and performs real zoom", () => {
    expect(viewportBounds(DEFAULT_ZOOM_VIEWPORT)).toEqual({
      xMin: -2,
      xMax: 2,
      yMin: -1,
      yMax: 1,
    });
    expect(viewportBounds(zoomViewport(DEFAULT_ZOOM_VIEWPORT, "in"))).toEqual({
      xMin: -1.5,
      xMax: 1.5,
      yMin: -0.75,
      yMax: 0.75,
    });
  });

  it("constrains panning to the overview domain", () => {
    const moved = panViewport(DEFAULT_ZOOM_VIEWPORT, 100, -100);
    expect(viewportBounds(moved)).toEqual({
      xMin: 2,
      xMax: 6,
      yMin: -3,
      yMax: -1,
    });
  });

  it("generates synchronized curve and viewport geometry", () => {
    expect(
      zoomPanCurvePath(viewportBounds(DEFAULT_ZOOM_VIEWPORT), 300, 220).split(
        " ",
      ),
    ).toHaveLength(401);
    expect(viewportRectangle(DEFAULT_ZOOM_VIEWPORT, 300, 220)).toEqual({
      x: 100,
      y: 73.33333333333333,
      width: 100,
      height: 73.33333333333333,
    });
    expect(viewportCenterFromPixels(150, 110, 300, 220)).toEqual({
      centerX: 0,
      centerY: 0,
    });
  });
});
