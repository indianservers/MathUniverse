import { describe, expect, it } from "vitest";
import { histogramBins, histogramDefault, modalBins } from "./histogramLessonModel";
describe("Histogram model", () => { it("bins continuous data and finds modal bins", () => { const bins = histogramBins(histogramDefault, 10); expect(bins.map(bin => bin.frequency)).toEqual([3, 5, 6, 4, 5, 5]); expect(modalBins(bins)).toEqual([2]); }); it("handles changing widths", () => { expect(histogramBins([1, 2, 9], 5, 0).map(bin => bin.frequency)).toEqual([2, 1]); }); });
