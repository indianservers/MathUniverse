import { describe, expect, it } from "vitest";
import { comparisonDefault, compareModels } from "./modelComparisonLessonModel";
describe("Model comparison", () => { it("returns all model metrics", () => { const models = compareModels(); expect(models.linear.r2).toBeGreaterThan(0); expect(models.quadratic.rmse).toBeGreaterThanOrEqual(0); expect(models.exponential.params).toBe(2); }); it("supports edited data", () => { expect(compareModels([{ x: 1, y: 1 }, { x: 2, y: 2 }]).linear.rmse).toBeCloseTo(0); expect(comparisonDefault).toHaveLength(10); }); });
