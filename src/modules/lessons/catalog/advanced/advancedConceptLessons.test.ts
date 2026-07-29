import { describe, expect, it } from "vitest";
import { lessonCatalog } from "../lessonCatalog";
import { advancedConceptLessons, advancedConceptStrands, advancedLessonsFor, adjacentAdvancedConceptLessons, findAdvancedConceptLesson } from "./advancedConceptLessons";

describe("Phase 1 advanced concept lesson catalog", () => {
  it("adds the first advanced concept pack without colliding with the original 674 lessons", () => {
    expect(lessonCatalog).toHaveLength(674);
    expect(advancedConceptLessons).toHaveLength(25);
    expect(new Set(advancedConceptLessons.map((lesson) => lesson.id)).size).toBe(25);
    expect(new Set(advancedConceptLessons.map((lesson) => lesson.slug)).size).toBe(25);
    expect(new Set(advancedConceptLessons.map((lesson) => lesson.route)).size).toBe(25);

    const originalNumericIds = new Set(lessonCatalog.map((lesson) => lesson.id));
    expect(advancedConceptLessons.every((lesson) => !originalNumericIds.has(lesson.numericId))).toBe(true);
    expect(Math.min(...advancedConceptLessons.map((lesson) => lesson.numericId))).toBeGreaterThan(674);
  });

  it("covers each advanced strand with five lessons and valid studio links", () => {
    expect(advancedConceptStrands).toEqual(["Continued Fractions", "Famous Problems", "Statistical Inference", "Differential Equations", "Special Functions"]);
    for (const strand of advancedConceptStrands) {
      const lessons = advancedConceptLessons.filter((lesson) => lesson.strand === strand);
      expect(lessons, strand).toHaveLength(5);
      expect(lessons.every((lesson) => lesson.toolRoute.startsWith("/math")), strand).toBe(true);
    }
  });

  it("keeps lesson content substantial enough for a lesson page", () => {
    for (const lesson of advancedConceptLessons) {
      expect(lesson.objectives.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.learn.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.explore.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.practice.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.assessmentPrompts.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.searchKeywords.length, lesson.id).toBeGreaterThanOrEqual(4);
    }
  });

  it("supports route lookup, adjacency, and search", () => {
    const lesson = findAdvancedConceptLesson("2001-partial-quotients");
    expect(lesson?.title).toBe("Partial Quotients");
    expect(lesson?.route).toBe("/lessons/advanced-concepts/2001-partial-quotients");

    const adjacent = adjacentAdvancedConceptLessons(lesson!);
    expect(adjacent.previous).toBeUndefined();
    expect(adjacent.next?.title).toBe("Convergents");

    const matches = advancedLessonsFor("ALL", "Riemann");
    expect(matches.some((candidate) => candidate.title === "Riemann Hypothesis and Primes")).toBe(true);
    expect(advancedLessonsFor("Special Functions", "zeta").map((candidate) => candidate.title)).toContain("Zeta Function");
  });
});
