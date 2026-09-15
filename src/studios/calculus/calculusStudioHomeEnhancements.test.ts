import { describe, expect, it } from "vitest";
import { calculusHomeEnhancementCounts, calculusStudioHomeEnhancements } from "./calculusStudioHomeEnhancements";

describe("calculus studio home learning enhancements", () => {
  it("catalogues at least fifty UI and UX ideas", () => {
    const counts = calculusHomeEnhancementCounts();
    expect(counts.total).toBeGreaterThanOrEqual(50);
    expect(counts.ui).toBeGreaterThan(20);
    expect(counts.ux).toBeGreaterThan(20);
    expect(new Set(calculusStudioHomeEnhancements.map((item) => item.id)).size).toBe(counts.total);
    expect(calculusStudioHomeEnhancements.every((item) => item.title.length > 8 && item.detail.length > 24)).toBe(true);
  });
});
