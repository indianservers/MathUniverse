import { describe, expect, it } from "vitest";
import { ncertConcepts } from "./ncertConcepts";
import {
  getNCERTPracticeItems,
  ncertPracticeBank,
  phase11Class10PriorityConceptIds,
  phase11Class12PriorityConceptIds,
  phase11Grade7PriorityConceptIds,
} from "./ncertPracticeBank";
import { checkNCERTPracticeAnswer } from "../components/ncert/practice/ncertPracticeUtils";

describe("NCERT practice bank", () => {
  it("has valid unique practice items connected to existing concepts", () => {
    const conceptIds = new Set(ncertConcepts.map((concept) => concept.id));
    const itemIds = new Set<string>();
    for (const item of ncertPracticeBank) {
      expect(item.id).toBeTruthy();
      expect(itemIds.has(item.id)).toBe(false);
      itemIds.add(item.id);
      expect(conceptIds.has(item.conceptId), item.conceptId).toBe(true);
      expect(item.prompt).toBeTruthy();
      expect(item.hint).toBeTruthy();
      expect(item.explanation).toBeTruthy();
      expect(["easy", "medium", "exam"]).toContain(item.difficulty);
      expect(["numeric", "text", "multiple-choice"]).toContain(item.answerType);
    }
  });

  it("meets Phase 11 minimum question counts", () => {
    for (const conceptId of phase11Grade7PriorityConceptIds) {
      expect(getNCERTPracticeItems(conceptId).length, conceptId).toBeGreaterThanOrEqual(8);
    }
    for (const conceptId of phase11Class10PriorityConceptIds) {
      expect(getNCERTPracticeItems(conceptId).length, conceptId).toBeGreaterThanOrEqual(8);
    }
    for (const conceptId of phase11Class12PriorityConceptIds) {
      expect(getNCERTPracticeItems(conceptId).length, conceptId).toBeGreaterThanOrEqual(5);
    }
  });

  it("checks every stored answer with its own answer key", () => {
    for (const item of ncertPracticeBank) {
      const answer = Array.isArray(item.answer) ? item.answer[0] : item.answer;
      expect(checkNCERTPracticeAnswer(String(answer), item).ok, item.id).toBe(true);
    }
  });
});
