import { describe, expect, it } from "vitest";
import { iqrAnswer, quartiles, quartilesDefault } from "./quartilesLessonModel";
describe("Quartiles model", () => { it("computes five-number summary and fences", () => { expect(quartiles(quartilesDefault)).toEqual({ min: 2, q1: 3.5, median: 5, q3: 7.5, max: 10, iqr: 4, lowerFence: -2.5, upperFence: 13.5 }); }); it("handles empty data and exact IQR answers", () => { expect(quartiles([])).toBeNull(); expect(iqrAnswer(quartilesDefault, "4")).toBe(true); expect(iqrAnswer(quartilesDefault, "8")).toBe(false); }); });
