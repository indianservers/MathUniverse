import { describe, expect, it } from "vitest";
import { lessonCatalog } from "../lessonCatalog";
import { schoolLessonsFor } from "./schoolSyllabusCatalog";
import { schoolSyllabusLessons } from "./schoolSyllabusLessons.generated";
import { schoolSyllabusPathways } from "../../pathways/school/schoolSyllabusPathways.generated";
import { validateSchoolLessonCatalog, validateSchoolPathways } from "../../syllabus/lessonSyllabusValidation";

describe("Phase 1 generated school syllabus catalog", () => {
  it("adds the audited school remediation concepts without colliding with the original 674 lessons", () => {
    expect(lessonCatalog).toHaveLength(674);
    expect(schoolSyllabusLessons).toHaveLength(220);
    expect(new Set(schoolSyllabusLessons.map((lesson) => lesson.id)).size).toBe(220);
    expect(new Set(schoolSyllabusLessons.map((lesson) => lesson.slug)).size).toBe(220);
    expect(new Set(schoolSyllabusLessons.map((lesson) => lesson.route)).size).toBe(220);

    const originalNumericIds = new Set(lessonCatalog.map((lesson) => lesson.id));
    expect(schoolSyllabusLessons.every((lesson) => !originalNumericIds.has(lesson.numericId))).toBe(true);
    expect(Math.min(...schoolSyllabusLessons.map((lesson) => lesson.numericId))).toBeGreaterThan(674);
  });

  it("passes schema validation for lesson metadata, prerequisites, and content", () => {
    expect(validateSchoolLessonCatalog(schoolSyllabusLessons)).toEqual([]);
    for (const lesson of schoolSyllabusLessons) {
      expect(lesson.metadata.learningObjectives.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.metadata.syllabusTags.length, lesson.id).toBeGreaterThanOrEqual(8);
      expect(lesson.metadata.assessment?.diagnostic, lesson.id).toBe(true);
      expect(lesson.metadata.assessment?.formative, lesson.id).toBe(true);
      expect(lesson.content.summary, lesson.id).toContain(lesson.title);
      expect(lesson.content.learn.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.content.explore.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.content.practice.length, lesson.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("creates board and class pathways that reference generated lessons", () => {
    expect(schoolSyllabusPathways).toHaveLength(56);
    expect(validateSchoolPathways(schoolSyllabusPathways, schoolSyllabusLessons)).toEqual([]);
    expect(new Set(schoolSyllabusPathways.map((pathway) => pathway.board))).toEqual(new Set(["NCERT", "CBSE", "AP_SCERT", "TN_SCERT", "CAMBRIDGE_IGCSE", "IB_AA", "IB_AI", "COMMON_CORE"]));
    expect(new Set(schoolSyllabusPathways.map((pathway) => pathway.academicLevel))).toEqual(new Set(["CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10", "CLASS_11", "CLASS_12"]));
  });

  it("includes required proof-first and senior-secondary concept packs", () => {
    const titles = new Set(schoolSyllabusLessons.map((lesson) => lesson.title));
    expect(titles.has("Euclid's Five Postulates")).toBe(true);
    expect(titles.has("SAS Congruence")).toBe(true);
    expect(titles.has("Bayes' Theorem")).toBe(true);
    expect(titles.has("Rolle's Theorem")).toBe(true);
    expect(titles.has("Feasible Region")).toBe(true);
    expect(titles.has("Direction Cosines")).toBe(true);
  });

  it("makes generated missing lessons searchable by concept from the lessons surface", () => {
    const matches = schoolLessonsFor("ALL", "ALL", "Bayes");
    expect(matches.some((lesson) => lesson.title === "Bayes' Theorem")).toBe(true);
    expect(matches.find((lesson) => lesson.title === "Bayes' Theorem")?.route).toBe("/lessons/school/class-12/class-12-probability-bayes-theorem");
  });
});
