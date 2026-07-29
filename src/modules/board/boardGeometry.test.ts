import { describe, expect, it } from "vitest";
import {
  boxesIntersect,
  calculateBounds,
  screenToBoard,
  smoothPoints,
  strokeHitTest,
} from "./boardGeometry";
import type { StrokeElement } from "./types";

const stroke: StrokeElement = {
  id: "s1",
  type: "stroke",
  points: [
    { x: 10, y: 10, pressure: 0.5, time: 0 },
    { x: 30, y: 30, pressure: 0.7, time: 1 },
  ],
  tool: "pen",
  width: 3,
  opacity: 1,
  color: "#000000",
  bounds: { x: 10, y: 10, width: 20, height: 20 },
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("board geometry", () => {
  it("converts screen coordinates into board coordinates", () => {
    expect(screenToBoard({ x: 140, y: 90 }, { x: 20, y: 10, zoom: 2 })).toEqual({ x: 60, y: 40 });
  });

  it("calculates bounds and rectangle collisions", () => {
    expect(calculateBounds(stroke.points)).toEqual({ x: 10, y: 10, width: 20, height: 20 });
    expect(boxesIntersect(stroke.bounds, { x: 25, y: 25, width: 10, height: 10 })).toBe(true);
    expect(boxesIntersect(stroke.bounds, { x: 50, y: 50, width: 5, height: 5 })).toBe(false);
  });

  it("detects eraser collisions with a stroke", () => {
    expect(strokeHitTest(stroke, { x: 20, y: 20 }, 3)).toBe(true);
    expect(strokeHitTest(stroke, { x: 70, y: 70 }, 3)).toBe(false);
  });

  it("smooths interior stroke points without changing endpoints", () => {
    const points = [...stroke.points, { x: 60, y: 20, pressure: 0.4, time: 2 }];
    const smoothed = smoothPoints(points);
    expect(smoothed[0]).toEqual(points[0]);
    expect(smoothed.at(-1)).toEqual(points.at(-1));
    expect(smoothed[1].x).not.toBe(points[1].x);
  });
});

