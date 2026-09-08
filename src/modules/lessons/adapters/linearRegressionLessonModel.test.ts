import { describe, expect, it } from "vitest";
import { regressionDefault, regressionFit } from "./linearRegressionLessonModel";
describe("Linear regression model", () => { it("fits a least-squares line", () => { const fit = regressionFit(); expect(fit.slope).toBeGreaterThan(0); expect(fit.r2).toBeGreaterThan(.9); }); it("fits an exact line", () => { const fit = regressionFit([{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }]); expect(fit.slope).toBeCloseTo(2); expect(fit.intercept).toBeCloseTo(0); expect(fit.sse).toBeCloseTo(0); expect(regressionDefault).toHaveLength(9); }); });
