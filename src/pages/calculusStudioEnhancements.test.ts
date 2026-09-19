import { describe, expect, it } from "vitest";
import {
  calculusStudioEnhancements,
  enhancementCounts,
  enhancementPages,
  enhancementsFor,
} from "./calculusStudioEnhancements";

describe("calculus studio enhancement catalog", () => {
  it("ships at least 20 UI/UX/content ideas for every studio topic", () => {
    expect(calculusStudioEnhancements.length).toBeGreaterThanOrEqual(50);
    for (const page of enhancementPages) {
      const counts = enhancementCounts(page);
      expect(counts.total).toBeGreaterThanOrEqual(20);
      expect(counts.ui).toBeGreaterThanOrEqual(5);
      expect(counts.ux).toBeGreaterThanOrEqual(5);
      expect(counts.content).toBeGreaterThanOrEqual(5);
      expect(enhancementsFor(page).every((item) => item.page === page)).toBe(true);
    }
  });
});
