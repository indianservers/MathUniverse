import { describe, expect, it } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import { advancedConceptLessons } from "../catalog/advanced/advancedConceptLessons";
import { expandedWorkedExamples, isNumericalExample } from "../components/LessonSectionJourney";
import { advancedStepExamples } from "../pages/AdvancedConceptLessonPage";
import { getStrengthenedFoundationLesson } from "./foundationNumberContent";
import { lessonsWithSupplementalNumericalExamples } from "./catalogNumericalExamples";

describe("catalog numerical examples", () => {
  it("gives all 674 core lessons three numerical example cards", () => {
    const lessons = lessonCatalog.filter((lesson) => lesson.id <= 674);
    expect(lessons).toHaveLength(674);

    for (const source of lessons) {
      const examples = expandedWorkedExamples(getStrengthenedFoundationLesson(source.id)!);
      expect(examples, `${source.id}: ${source.title}`).toHaveLength(3);
      expect(
        examples.every(isNumericalExample),
        `${source.id}: ${source.title} uses numerical examples`,
      ).toBe(true);
    }
  });

  it("keeps supplemental worked calculations in explicit lesson-id entries", () => {
    expect(new Set(lessonsWithSupplementalNumericalExamples).size).toBe(lessonsWithSupplementalNumericalExamples.length);
    expect(lessonsWithSupplementalNumericalExamples).toContain(29);
    expect(lessonsWithSupplementalNumericalExamples).toContain(674);
  });

  it("gives all 220 school lessons three numerical example cards", () => {
    expect(schoolLessonCatalog).toHaveLength(220);

    for (const source of schoolLessonCatalog) {
      const examples = expandedWorkedExamples(getStrengthenedFoundationLesson(source.numericId)!);
      expect(examples, `${source.numericId}: ${source.title}`).toHaveLength(3);
      expect(
        examples.every(isNumericalExample),
        `${source.numericId}: ${source.title} uses numerical examples`,
      ).toBe(true);
    }
  });

  it("gives all 25 advanced lessons three numerical example cards", () => {
    expect(advancedConceptLessons).toHaveLength(25);

    for (const source of advancedConceptLessons) {
      const examples = advancedStepExamples(source);
      expect(examples, `${source.numericId}: ${source.title}`).toHaveLength(3);
      expect(
        examples.every(isNumericalExample),
        `${source.numericId}: ${source.title} uses numerical examples`,
      ).toBe(true);
    }
  });

  it("covers all 919 catalog lessons", () => {
    expect(lessonCatalog.length + schoolLessonCatalog.length + advancedConceptLessons.length).toBe(919);
  });
});
