import { describe, expect, it } from "vitest";
import { sinusoidalDefault, sinusoidalModel, sinusoidalStats } from "./sinusoidalRegressionLessonModel";
describe("Sinusoidal regression model", () => { it("computes a period and diagnostics", () => { const stats = sinusoidalStats(); expect(stats.period).toBeGreaterThan(0); expect(stats.r2).toBeGreaterThanOrEqual(-1); expect(stats.r2).toBeLessThanOrEqual(1); }); it("evaluates the model", () => { expect(sinusoidalModel(0, 2, 1, 0, 3)).toBeCloseTo(3); expect(sinusoidalDefault).toHaveLength(12); }); });
