import { describe, expect, it } from "vitest";
import { cumulative, frequencyPolygonDefault, polygonPoints } from "./frequencyPolygonLessonModel";
describe("Frequency polygon model", () => { it("adds zero endpoints and midpoints", () => { const points = polygonPoints(); expect(points[0]).toEqual({ midpoint: -5, frequency: 0 }); expect(points[1]).toEqual({ midpoint: 5, frequency: 2 }); expect(points.at(-1)?.frequency).toBe(0); }); it("calculates cumulative frequency", () => { expect(cumulative(frequencyPolygonDefault).at(-1)).toBe(50); }); });


describe("frequency polygon endpoint boundaries", () => {
 it("preserves a zero endpoint instead of replacing it with a default",()=>{
  expect(polygonPoints([{from:5,to:15,frequency:3}])).toEqual([{midpoint:0,frequency:0},{midpoint:10,frequency:3},{midpoint:20,frequency:0}]);
 });
 it("supports negative intervals ending at zero",()=>{
  expect(polygonPoints([{from:-10,to:0,frequency:2}]).at(-1)).toEqual({midpoint:5,frequency:0});
  expect(polygonPoints([])).toEqual([]);
 });
});
