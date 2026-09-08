import { describe, expect, it } from "vitest";
import { residualDefault, residualStats } from "./residualPlotLessonModel";
describe("Residual plot model", () => { it("computes residuals and error metrics", () => { const stats = residualStats(); expect(stats.residuals[0]).toBeCloseTo(.55); expect(stats.rmse).toBeGreaterThan(0); }); it("reports exact fit", () => { const stats = residualStats([{ x: 1, observed: 2, predicted: 2 }, { x: 2, observed: 4, predicted: 4 }]); expect(stats.sse).toBe(0); expect(stats.mean).toBe(0); expect(residualDefault).toHaveLength(10); }); });
