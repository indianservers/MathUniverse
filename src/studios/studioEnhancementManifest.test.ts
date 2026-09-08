import { describe, expect, it } from "vitest";
import { allRequestedEnhancements, enhancementCoverage, platformEnhancements, studioEnhancements } from "./studioEnhancementManifest";

describe("studio enhancement implementation ledger", () => {
  it("tracks exactly 25 requirements for each of the nine studios and 10 platform requirements", () => {
    const studioCounts = studioEnhancements.reduce<Record<string, number>>((counts, item) => ({ ...counts, [item.studio]: (counts[item.studio] ?? 0) + 1 }), {});
    expect(Object.keys(studioCounts)).toHaveLength(9);
    expect(Object.values(studioCounts).every((count) => count === 25)).toBe(true);
    expect(platformEnhancements).toHaveLength(10);
    expect(allRequestedEnhancements).toHaveLength(235);
  });

  it("uses unique stable requirement identifiers", () => {
    expect(new Set(allRequestedEnhancements.map((item) => item.id)).size).toBe(235);
  });

  it("only marks requirements implemented when route and evidence are recorded", () => {
    const implemented = allRequestedEnhancements.filter((item) => item.status === "implemented");
    expect(implemented.every((item) => item.route && item.evidence && item.evidence.length >= 3)).toBe(true);
    expect(enhancementCoverage()).toEqual({ implemented: 235, missing: 0, total: 235 });
  });
});
