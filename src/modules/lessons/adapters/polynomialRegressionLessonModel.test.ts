import { describe, expect, it } from "vitest";
import { polynomialDefault, polynomialFit } from "./polynomialRegressionLessonModel";
describe("Polynomial regression model", () => { it("fits a cubic and reports quality", () => { const fit = polynomialFit(); expect(fit.coefficients).toHaveLength(4); expect(fit.r2).toBeGreaterThan(.8); }); it("fits an exact quadratic", () => { const fit = polynomialFit([{ x: -1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 1 }], 2); expect(fit.coefficients[2]).toBeCloseTo(1); expect(fit.sse).toBeCloseTo(0); expect(polynomialDefault).toHaveLength(7); }); });
