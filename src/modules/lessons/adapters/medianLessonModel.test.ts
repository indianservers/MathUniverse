import { describe, expect, it } from "vitest";
import { isMedianAnswer, medianDefault, medianValue, sorted } from "./medianLessonModel";
describe("Median model", () => { it("sorts and handles odd and even counts", () => { expect(sorted(medianDefault)).toEqual([1, 2, 3, 5, 7, 8, 9]); expect(medianValue(medianDefault)).toBe(5); expect(medianValue([1, 3, 5, 7, 8, 2])).toBe(4); }); it("handles empty data and answer tolerance", () => { expect(medianValue([])).toBeNull(); expect(isMedianAnswer([11, 4, 9, 7, 3], "7.00")).toBe(true); expect(isMedianAnswer([11, 4, 9, 7, 3], "6")).toBe(false); }); });
