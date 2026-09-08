import { describe, expect, it } from "vitest";
import { logisticDefault, logisticFit, sigmoid } from "./logisticRegressionLessonModel";
describe("Logistic regression model", () => { it("returns probabilities in range", () => { const fit = logisticFit(); expect(fit.probs.every(value => value >= 0 && value <= 1)).toBe(true); expect(fit.b1).toBeGreaterThan(0); }); it("calculates sigmoid limits", () => { expect(sigmoid(0)).toBe(.5); expect(sigmoid(20)).toBeGreaterThan(.99); expect(logisticDefault).toHaveLength(10); }); });
