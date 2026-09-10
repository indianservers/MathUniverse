import { describe, expect, it } from "vitest";
import { advancedConceptLessons } from "../catalog/advanced/advancedConceptLessons";
import { lessonCatalog } from "../catalog/lessonCatalog";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import { expandedWorkedExamples } from "../components/LessonSectionJourney";
import { advancedStepExamples, advancedTryItems } from "../pages/AdvancedConceptLessonPage";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import { bannedGenericLessonPhrases, validateStrengthenedLesson, type StrengthenedLesson } from "../strengthening/strengthenedLessonSchema";

describe("catalog-wide lesson-specific content audit", () => {
  const coreAndSchool = [
    ...lessonCatalog.map((lesson) => ({ catalog: "core", id: lesson.id, title: lesson.title })),
    ...schoolLessonCatalog.map((lesson) => ({ catalog: "school", id: lesson.numericId, title: lesson.title })),
  ];

  it("covers all 919 lessons with structured, lesson-specific content", () => {
    expect(lessonCatalog).toHaveLength(674);
    expect(schoolLessonCatalog).toHaveLength(220);
    expect(advancedConceptLessons).toHaveLength(25);
    expect(coreAndSchool.length + advancedConceptLessons.length).toBe(919);

    for (const source of coreAndSchool) {
      const lesson = getStrengthenedFoundationLesson(source.id);
      expect(lesson, `${source.catalog} lesson ${source.id} (${source.title})`).not.toBeNull();
      expect(titleKey(lesson?.title ?? "")).toBe(titleKey(source.title));
      expect(validateStrengthenedLesson(lesson!)).toEqual([]);
      expect(lesson?.workedExamples.length, `${source.title} worked examples`).toBeGreaterThan(0);
      expect(expandedWorkedExamples(lesson!), `${source.title} expanded examples`).toHaveLength(3);
      expect(lesson?.realLifeExamples.length, `${source.title} applications`).toBeGreaterThanOrEqual(3);
      expect(lesson?.misconceptions.length, `${source.title} misconceptions`).toBeGreaterThan(0);
      expect(lesson?.practice.map((item) => item.difficulty)).toEqual(["recognition", "direct", "multi_step", "error_diagnosis", "transfer"]);
    }

    for (const lesson of advancedConceptLessons) {
      expect(lesson.summary.length, `${lesson.title} summary`).toBeGreaterThan(40);
      expect(lesson.learn.length, `${lesson.title} Learn content`).toBeGreaterThanOrEqual(3);
      expect(lesson.explore.length, `${lesson.title} examples`).toBeGreaterThanOrEqual(3);
      expect(lesson.practice.length, `${lesson.title} practice`).toBeGreaterThanOrEqual(3);
      expect(lesson.assessmentPrompts.length, `${lesson.title} assessment`).toBeGreaterThanOrEqual(2);
      expect(advancedStepExamples(lesson), `${lesson.title} step-by-step examples`).toHaveLength(3);
      const tryItems = advancedTryItems(lesson);
      expect(tryItems.length, `${lesson.title} Try these questions`).toBeGreaterThanOrEqual(3);
      expect(tryItems.every((item) => item.answer && item.steps.length >= 2), `${lesson.title} answer support`).toBe(true);
    }
  });

  it("does not reuse introductions, procedures, or rationales between lessons", () => {
    const lessons = coreAndSchool.map(({ id }) => getStrengthenedFoundationLesson(id)!);
    expectDuplicateFree(lessons, "introduction");
    expectDuplicateFree(lessons, "howItWorks");
    expectDuplicateFree(lessons, "whyItWorks");
  });

  it("keeps placeholder language out of every visible learning narrative", () => {
    for (const source of coreAndSchool) {
      const lesson = getStrengthenedFoundationLesson(source.id)!;
      const visibleNarrative = [
        lesson.introduction,
        lesson.basicIdea,
        lesson.howItWorks,
        lesson.whyItWorks,
        ...lesson.workedExamples.flatMap((example) => [example.prompt, ...example.steps, example.answer]),
        ...lesson.practice.flatMap((question) => [question.prompt, ...question.hints, ...question.workedSolution, question.answer]),
      ].join("\n").toLowerCase();
      for (const phrase of bannedGenericLessonPhrases) {
        expect(visibleNarrative, `${source.title}: ${phrase}`).not.toContain(phrase.toLowerCase());
      }
    }
  });
});

function expectDuplicateFree(lessons: StrengthenedLesson[], field: "introduction" | "howItWorks" | "whyItWorks") {
  const occurrences = new Map<string, string[]>();
  for (const lesson of lessons) {
    occurrences.set(lesson[field], [...occurrences.get(lesson[field]) ?? [], `${lesson.id}: ${lesson.title}`]);
  }
  const duplicates = [...occurrences].filter(([, owners]) => owners.length > 1);
  expect(duplicates, `${field} duplicates`).toEqual([]);
}

function titleKey(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "").toLowerCase();
}
