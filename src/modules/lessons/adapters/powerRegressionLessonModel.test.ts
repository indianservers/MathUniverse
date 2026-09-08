import { describe, expect, it } from "vitest";
import { powerDefault, powerFit } from "./powerRegressionLessonModel";
describe("Power regression model", () => { it("fits a positive power law", () => { const fit = powerFit(); expect(fit.a).toBeGreaterThan(0); expect(fit.b).toBeGreaterThan(0); expect(fit.r2).toBeGreaterThan(.8); }); it("fits an exact power relation", () => { const fit = powerFit([{ x: 1, y: 3 }, { x: 2, y: 6 }, { x: 4, y: 12 }]); expect(fit.a).toBeCloseTo(3); expect(fit.b).toBeCloseTo(1); expect(fit.rmse).toBeCloseTo(0); expect(powerDefault).toHaveLength(9); }); });
