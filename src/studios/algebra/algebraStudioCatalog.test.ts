import { describe, expect, it } from "vitest";
import { challengeOfTheDay, dailyChallenges, workbenchTools } from "./algebraStudioCatalog";
import { recordChallengeResult, recordLabMode, uniqueModesUsed } from "./algebraStudioProgress";

describe("algebra studio catalog", () => {
  it("keeps a daily challenge bank, glossary, and 25 workbench tools", () => {
    expect(dailyChallenges.length).toBeGreaterThanOrEqual(8);
    expect(workbenchTools).toHaveLength(25);
    expect(workbenchTools[0]?.id).toBe("ALG-01");
    expect(workbenchTools[24]?.title).toContain("CAS candidate verification");
    expect(challengeOfTheDay(0).lab).toBe("Expressions");
  });
});

describe("algebra studio progress", () => {
  it("records modes and challenge outcomes", () => {
    const afterVisit = recordLabMode("expressions", "Factor");
    expect(afterVisit.visited).toContain("expressions");
    expect(uniqueModesUsed(afterVisit)).toBeGreaterThanOrEqual(1);
    const afterChallenge = recordChallengeResult(true);
    expect(afterChallenge.challengesPassed).toBeGreaterThanOrEqual(1);
  });
});
