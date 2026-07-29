import { beforeEach, describe, expect, it } from "vitest";
import { NCERT_MASTERY_STORAGE_KEY } from "../../hooks/useNCERTMastery";
import { mapBoardConcept, recordBoardMasteryEvidence } from "./boardLearningIntegration";
import type { BoardWorkVerificationResult } from "./types";

const result: BoardWorkVerificationResult = {
  sequenceId: "sequence",
  overallStatus: "correct",
  verifiedSteps: [],
  finalAnswerStatus: "correct",
};

describe("Board learner evidence mapping", () => {
  beforeEach(() => {
    localStorage.clear();
    if (typeof window === "undefined") Object.defineProperty(globalThis, "window", { configurable: true, value: globalThis });
  });

  it("maps supported classifications to the existing mastery store", () => {
    expect(mapBoardConcept("equation")).toBe("algebra.linear-equations");
    expect(recordBoardMasteryEvidence({ classification: "equation", verification: result, recognitionConfidence: 0.95 })).toBe(true);
    const stored = JSON.parse(localStorage.getItem(NCERT_MASTERY_STORAGE_KEY) ?? "{}");
    expect(stored["algebra.linear-equations"].attempted).toBe(1);
  });

  it("does not persist low-confidence or ambiguous evidence", () => {
    expect(recordBoardMasteryEvidence({ classification: "equation", verification: result, recognitionConfidence: 0.4 })).toBe(false);
    expect(localStorage.getItem(NCERT_MASTERY_STORAGE_KEY)).toBeNull();
  });
});
