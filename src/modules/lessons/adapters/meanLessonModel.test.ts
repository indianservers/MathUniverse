import { describe, expect, it } from "vitest";
import { deviations, isMeanAnswer, meanDefault, meanValue, sumDeviation } from "./meanLessonModel";
describe("Mean model", () => { it("computes average and balancing deviations", () => { expect(meanValue(meanDefault)).toBeCloseTo(48 / 9); expect(sumDeviation(meanDefault)).toBeCloseTo(0); expect(deviations([2, 4, 6])).toEqual([-2, 0, 2]); }); it("handles empty data and checked answers", () => { expect(meanValue([])).toBeNull(); expect(isMeanAnswer([1, 4, 5, 7, 9], "5.2")).toBe(true); expect(isMeanAnswer([1, 4, 5, 7, 9], "5")).toBe(false); }); });
