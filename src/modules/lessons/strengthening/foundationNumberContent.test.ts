import { describe, expect, it } from "vitest";
import { getStrengthenedFoundationLesson, getStrengthenedLessonContent, strengthenedFoundationLessonIds } from "./foundationNumberContent";
import { validateStrengthenedLesson } from "./strengthenedLessonSchema";

describe("Phase 2 foundation number lessons", () => {
  it("provides valid structured content for the first controlled batch", () => {
    expect(strengthenedFoundationLessonIds).toEqual([
      ...Array.from({ length: 674 }, (_, index) => index + 1),
      ...Array.from({ length: 220 }, (_, index) => index + 10_001),
    ]);
    for (const id of strengthenedFoundationLessonIds) {
      const lesson = getStrengthenedFoundationLesson(id);
      expect(lesson, String(id)).not.toBeNull();
      expect(validateStrengthenedLesson(lesson!)).toEqual([]);
      expect(lesson!.practice.map((item) => item.difficulty)).toEqual(["recognition", "direct", "multi_step", "error_diagnosis", "transfer"]);
    }
  });

  it("replaces generic runtime lesson content and challenges for strengthened routes", () => {
    for (const id of strengthenedFoundationLessonIds) {
      const source = getStrengthenedFoundationLesson(id)!;
      const content = getStrengthenedLessonContent({ id, title: source.title, topic: source.topic, outcome: source.exitCheck[0].criterion });
      expect(content?.explanation).not.toContain("Think of this lesson as a small experiment");
      expect(content?.realWorldExamples.length).toBeGreaterThanOrEqual(3);
      expect(content?.keyIdeas.some((idea) => idea.startsWith("Common mistake:"))).toBe(true);
    }
  });
});
