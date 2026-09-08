import { describe, expect, it } from "vitest";
import {
  EXPORT_BOUNDS_56,
  exportFilename56,
  exportXFromPixel56,
  logisticPath56,
  logisticValue56,
} from "./exportGraphLesson56Model";

describe("exportGraphLesson56Model", () => {
  it("computes the logistic graph and selected point", () => {
    expect(logisticValue56(0)).toBe(0.5);
    expect(logisticValue56(-2)).toBeCloseTo(1 - logisticValue56(2));
    expect(
      logisticPath56(EXPORT_BOUNDS_56, 600, 400).split(" ").length,
    ).toBeGreaterThan(150);
  });

  it("maps graph interaction and sanitizes export names", () => {
    expect(exportXFromPixel56(300, EXPORT_BOUNDS_56, 600)).toBe(0);
    expect(exportFilename56(" Logistic graph / final ")).toBe(
      "Logistic-graph-final",
    );
    expect(exportFilename56("   ")).toBe("export-graph-logistic");
  });
});
