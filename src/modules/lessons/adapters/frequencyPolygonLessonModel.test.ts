import { describe, expect, it } from "vitest";
import { cumulative, frequencyPolygonDefault, polygonPoints } from "./frequencyPolygonLessonModel";
describe("Frequency polygon model", () => { it("adds zero endpoints and midpoints", () => { const points = polygonPoints(); expect(points[0]).toEqual({ midpoint: -5, frequency: 0 }); expect(points[1]).toEqual({ midpoint: 5, frequency: 2 }); expect(points.at(-1)?.frequency).toBe(0); }); it("calculates cumulative frequency", () => { expect(cumulative(frequencyPolygonDefault).at(-1)).toBe(50); }); });
