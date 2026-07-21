import { describe, expect, it } from "vitest";
import { updateMasteryEvidence } from "./useProgress";

const day = 86_400_000;

describe("Phase 2 durable mastery evidence", () => {
  it("does not award durable mastery from one high score", () => {
    const evidence = updateMasteryEvidence(undefined, 100, 0);
    expect(evidence.status).toBe("developing");
    expect(evidence.reason).toContain("1 assessed attempt");
  });

  it("requires repeated performance for proficiency", () => {
    const first = updateMasteryEvidence(undefined, 85, 0);
    const second = updateMasteryEvidence(first, 80, day);
    expect(second.status).toBe("proficient");
    expect(second.nextReviewAt).toBe(day + 7 * day);
  });

  it("requires evidence spread across at least seven days for durable mastery", () => {
    const first = updateMasteryEvidence(undefined, 90, 0);
    const second = updateMasteryEvidence(first, 90, day);
    expect(updateMasteryEvidence(second, 90, 6 * day).status).toBe("proficient");
    const durable = updateMasteryEvidence(second, 90, 8 * day);
    expect(durable.status).toBe("durable");
    expect(durable.reason).toContain("across at least 7 days");
  });
});
