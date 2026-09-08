import { describe, expect, it } from "vitest";
import { barPieDefault, chartStats } from "./barPieLessonModel";
describe("Bar and pie model", () => { it("links frequencies to angles and percentages", () => { const stats = chartStats(); expect(stats[1].angle).toBeCloseTo(96, 5); expect(stats.reduce((sum, row) => sum + row.percent, 0)).toBeCloseTo(100, 5); }); it("handles an empty whole", () => { expect(chartStats([{ name: "A", frequency: 0 }])[0].angle).toBe(0); expect(barPieDefault).toHaveLength(5); }); });
