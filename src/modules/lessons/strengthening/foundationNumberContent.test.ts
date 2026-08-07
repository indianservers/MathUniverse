import { describe, expect, it } from "vitest";
import { getStrengthenedFoundationLesson, getStrengthenedLessonContent, strengthenedFoundationLessonIds } from "./foundationNumberContent";
import { validateStrengthenedLesson } from "./strengthenedLessonSchema";

describe("Phase 2 foundation number lessons", () => {
  it("provides valid structured content for the first controlled batch", () => {
    expect(strengthenedFoundationLessonIds).toEqual([
      ...Array.from({ length: 461 }, (_, index) => index + 1).filter((id) => id !== 359 && id !== 404 && id !== 443),
      ...Array.from({ length: 31 }, (_, index) => index + 462).filter((id) => id !== 480),
      ...Array.from({ length: 30 }, (_, index) => index + 493),
      ...Array.from({ length: 30 }, (_, index) => index + 523),
      ...Array.from({ length: 23 }, (_, index) => index + 553),
      ...Array.from({ length: 5 }, (_, index) => index + 577),
      584,
      585,
      590,
      ...Array.from({ length: 26 }, (_, index) => index + 592),
      ...Array.from({ length: 57 }, (_, index) => index + 618),
      10001,
      10002,
      10003,
      ...Array.from({ length: 50 }, (_, index) => index + 10004),
      ...Array.from({ length: 50 }, (_, index) => index + 10054),
      ...Array.from({ length: 50 }, (_, index) => index + 10104),
      ...Array.from({ length: 50 }, (_, index) => index + 10154),
      ...Array.from({ length: 17 }, (_, index) => index + 10204),
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
