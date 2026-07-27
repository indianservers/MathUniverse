import { describe, expect, it } from "vitest";
import existingLessonCoverage from "./existingLessonCoverage.generated.json";
import schoolSyllabusGapBacklog from "./schoolSyllabusGapBacklog.generated.json";

const expectedBoards = ["NCERT", "CBSE", "AP_SCERT", "TN_SCERT", "CAMBRIDGE_IGCSE", "IB_AA", "IB_AI", "COMMON_CORE"];

describe("Phase 1 lesson syllabus audit artifacts", () => {
  it("audits all original 674 lessons without changing identity", () => {
    expect(existingLessonCoverage.totalLessons).toBe(674);
    expect(existingLessonCoverage.lessons).toHaveLength(674);
    expect(existingLessonCoverage.duplicateReport.duplicateIds).toHaveLength(0);
    expect(existingLessonCoverage.duplicateReport.duplicateRoutes).toHaveLength(0);
    expect(new Set(existingLessonCoverage.lessons.map((lesson) => lesson.id)).size).toBe(674);
    expect(new Set(existingLessonCoverage.lessons.map((lesson) => lesson.route)).size).toBe(674);
  });

  it("adds syllabus traceability candidates to every audited lesson", () => {
    for (const lesson of existingLessonCoverage.lessons) {
      expect(lesson.primaryConcept, `lesson ${lesson.id} primary concept`).toBeTruthy();
      expect(lesson.academicLevels.length, `lesson ${lesson.id} academic levels`).toBeGreaterThan(0);
      expect(lesson.applicableBoards, `lesson ${lesson.id} boards`).toEqual(expectedBoards);
      expect(lesson.syllabusTags.length, `lesson ${lesson.id} syllabus tags`).toBeGreaterThanOrEqual(expectedBoards.length);
      expect(lesson.engine, `lesson ${lesson.id} engine`).toBeTruthy();
      expect(["CONCEPT", "VISUAL_EXPLORATION", "PROOF", "PRACTICE", "APPLICATION"]).toContain(lesson.lessonType);
    }
  });

  it("lists detailed Phase 1 missing school concepts before catalog expansion", () => {
    expect(schoolSyllabusGapBacklog.scope).toBe("Phase 1 school syllabus remediation only");
    expect(schoolSyllabusGapBacklog.boards).toEqual(expectedBoards);
    expect(schoolSyllabusGapBacklog.totalMissingConcepts).toBe(220);
    expect(schoolSyllabusGapBacklog.conceptPacks.length).toBeGreaterThan(25);
    expect(schoolSyllabusGapBacklog.conceptPacks.some((pack) => pack.unit === "Euclidean Geometry")).toBe(true);
    expect(schoolSyllabusGapBacklog.conceptPacks.some((pack) => pack.unit === "Formal Calculus")).toBe(true);
    expect(schoolSyllabusGapBacklog.conceptPacks.flatMap((pack) => pack.missingConcepts).every((concept) => concept.title && concept.suggestedAdapter)).toBe(true);
  });
});
