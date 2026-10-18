import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import authored from "../modules/lessons/authored/authoredLessonIndex.generated.json";
import { allLibraryChapters, higherPathways } from "./globalCurriculumPathways";
import { unifiedLessons } from "../modules/lessons/catalog/unified/unifiedLessons";
import { curriculumNames, curriculumTopics, groupCurriculumTopics, topicHasUpcomingLesson } from "./curriculumTopics";

describe("Class 6 to research curriculum navigation", () => {
  it("includes every catalog lesson exactly once in the complete library", () => {
    const lessons = allLibraryChapters.flatMap((chapter) => chapter.lessons);
    expect(lessons).toHaveLength(unifiedLessons.length);
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(unifiedLessons.length);
  });
  it("has Classes 6 to 12 for every board and distinct university research pathways", () => {
    const tree = groupCurriculumTopics(curriculumTopics);
    for (const board of curriculumNames) for (let grade = 6; grade <= 12; grade++) {
      expect(tree.find((entry) => entry.title === board)?.classes.some((entry) => entry.title === `Class ${grade}`)).toBe(true);
    }
    expect(Object.keys(higherPathways)).toEqual(["Undergraduate", "Postgraduate", "PhD"]);
    expect(higherPathways.PhD.note).toContain("not a fixed PhD syllabus");
  });
  it("only exposes drafts with matching authored content and interactive models", () => {
    const batches = new Map<number, {lessons: Array<{lessonId: number; route: string; sections: unknown[]; practice: unknown[]; interactive: unknown}>}>();
    for (const entry of authored.lessons) {
      if (!batches.has(entry.batch)) batches.set(entry.batch, JSON.parse(readFileSync(new URL(`../modules/lessons/authored/batches/batch-${String(entry.batch).padStart(2, "0")}.generated.json`, import.meta.url), "utf8")));
      const content = batches.get(entry.batch)!.lessons.find((lesson) => lesson.lessonId === entry.lessonId)!;
      expect(content.route).toBe(entry.route);
      expect(content.sections.length).toBeGreaterThan(0);
      expect(content.practice.length).toBeGreaterThan(0);
      expect(content.interactive).toBeTruthy();
    }
    const topic = curriculumTopics.find((entry) => entry.id === "class-10-grouped-mode")!;
    expect(topic.draftLessons?.map((lesson) => lesson.id)).toEqual([30313]);
    expect(topicHasUpcomingLesson(topic)).toBe(false);
    expect(topic.draftLessons?.[0].status).toBe("Upcoming"); // Publication status is preserved.
  });
});
