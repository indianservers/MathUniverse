import { describe, expect, it } from "vitest";
import { movingAverage, timeSeriesDefault, trend } from "./timeSeriesLessonModel";
describe("Time-series model", () => { it("calculates moving averages", () => { expect(movingAverage([1, 2, 3], 3)).toEqual([null, null, 2]); }); it("calculates OLS trend", () => { expect(trend([1, 2, 3]).slope).toBeCloseTo(1); expect(timeSeriesDefault).toHaveLength(11); }); });
