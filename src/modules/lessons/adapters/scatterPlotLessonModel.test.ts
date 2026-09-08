import { describe, expect, it } from "vitest";
import { regression, scatterDefault } from "./scatterPlotLessonModel";
describe("Scatter plot model", () => { it("calculates positive correlation and regression", () => { const result = regression(); expect(result.r).toBeGreaterThan(.98); expect(result.slope).toBeGreaterThan(0); }); it("handles a perfect line", () => { expect(regression([{ x: 1, y: 2 }, { x: 2, y: 4 }]).r).toBeCloseTo(1); expect(scatterDefault).toHaveLength(7); }); });
