import { describe, expect, it } from "vitest";
import { percentileFromZ, zAnswer, zScore } from "./zScoresLessonModel";
describe("Z-score model", () => { it("standardises values and maps to a normal percentile", () => { expect(zScore(64, 50, 10)).toBe(1.4); expect(percentileFromZ(1.4)).toBeCloseTo(91.92, 1); expect(zScore(50, 50, 10)).toBe(0); }); it("rejects invalid spread and validates answers", () => { expect(zScore(10, 5, 0)).toBeNull(); expect(zAnswer(118, 100, 15, "1.2")).toBe(true); expect(zAnswer(118, 100, 15, "2")).toBe(false); }); });
