import { describe, expect, it } from "vitest";
import {
  DEFAULT_DATA_PLOTTER_POINTS,
  dataOutlierIds,
  dataPlotterAnalysis,
  dataPointFromPixels,
} from "./dataPlotterLesson46Model";

describe("data plotter lesson 46 model", () => {
  it("detects the target outlier and fits the remaining observations", () => {
    const outliers = dataOutlierIds(DEFAULT_DATA_PLOTTER_POINTS);
    expect([...outliers]).toEqual([5]);
    const analysis = dataPlotterAnalysis(
      DEFAULT_DATA_PLOTTER_POINTS,
      "linear",
      true,
    );
    expect(analysis.included).toHaveLength(9);
    expect(analysis.correlation).toBeGreaterThan(0.98);
  });

  it("supports a real quadratic regression option", () => {
    const analysis = dataPlotterAnalysis(
      DEFAULT_DATA_PLOTTER_POINTS,
      "quadratic",
      true,
    );
    expect(analysis.fit.predict(5)).toBeGreaterThan(50);
    expect(analysis.fit.equation).toContain("x²");
  });

  it("maps graph dragging to bounded study-hour and score values", () => {
    expect(dataPointFromPixels(348, 418)).toEqual({ x: 5, y: 20 });
  });
});
