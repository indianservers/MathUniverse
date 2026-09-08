import { describe, expect, it } from "vitest";
import {
  DEFAULT_PLOTTER_FUNCTIONS,
  evaluatePlotterExpression,
  plotterIntersections,
  plotterPath,
} from "./functionPlotterLesson40Model";

describe("function plotter lesson 40 model", () => {
  it("evaluates every default function at the target trace", () => {
    expect(evaluatePlotterExpression("x^2 - 2", 1.5)).toBeCloseTo(0.25);
    expect(evaluatePlotterExpression("0.8x + 1", 1.5)).toBeCloseTo(2.2);
    expect(evaluatePlotterExpression("sin(x)", 1.5)).toBeCloseTo(0.997495);
  });

  it("rejects unsupported input and generates real graph geometry", () => {
    expect(evaluatePlotterExpression("alert(1)", 2)).toBeNaN();
    expect(plotterPath("x^2 - 2").split(" ").length).toBe(361);
  });

  it("finds intersections from the active function definitions", () => {
    const intersections = plotterIntersections(DEFAULT_PLOTTER_FUNCTIONS);
    expect(intersections.length).toBeGreaterThan(3);
    expect(intersections.some((point) => point.pair === "f & g")).toBe(true);
  });
});
