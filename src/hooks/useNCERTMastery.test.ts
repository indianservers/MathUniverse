import { describe, expect, it } from "vitest";
import { emptyMasteryRecord, masteryPercent, masteryStatus, updateNCERTMasteryRecord } from "./useNCERTMastery";

describe("NCERT mastery calculations", () => {
  it("calculates status from attempt history", () => {
    let record = emptyMasteryRecord();
    expect(masteryStatus(record)).toBe("Not started");
    record = updateNCERTMasteryRecord(record, "easy", true);
    record = updateNCERTMasteryRecord(record, "medium", false);
    expect(record.attempted).toBe(2);
    expect(record.correct).toBe(1);
    expect(masteryPercent(record)).toBeGreaterThan(0);
    expect(masteryStatus(record)).toBe("Practicing");
  });

  it("marks strong streaks as mastered", () => {
    let record = emptyMasteryRecord();
    for (let index = 0; index < 8; index += 1) {
      record = updateNCERTMasteryRecord(record, "exam", true);
    }
    expect(masteryPercent(record)).toBe(100);
    expect(masteryStatus(record)).toBe("Mastered");
  });
});
