import { describe, expect, it } from "vitest";
import { advancedConceptLessons } from "../catalog/advanced/advancedConceptLessons";
import { lessonCatalog } from "../catalog/lessonCatalog";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import { advancedStepExamples, advancedTryItems } from "../pages/AdvancedConceptLessonPage";
import { expandedWorkedExamples, isNumericalExample } from "../components/LessonSectionJourney";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import { bannedGenericLessonPhrases, validateStrengthenedLesson } from "../strengthening/strengthenedLessonSchema";

describe("lesson-by-lesson important-content audit", () => {
  it("audits every core and school lesson for complete topic-specific teaching content", () => {
    const sources = [
      ...lessonCatalog.map((lesson) => ({ id: lesson.id, title: lesson.title })),
      ...schoolLessonCatalog.map((lesson) => ({ id: lesson.numericId, title: lesson.title })),
    ];
    expect(sources).toHaveLength(894);

    const gaps: string[] = [];
    for (const source of sources) {
      const label = `${source.id}: ${source.title}`;
      const lesson = getStrengthenedFoundationLesson(source.id);
      if (!lesson) {
        gaps.push(`${label} has no strengthened content`);
        continue;
      }

      for (const error of validateStrengthenedLesson(lesson)) gaps.push(`${label}: ${error}`);
      checkMinimum(gaps, label, "objectives", lesson.learningObjectives.length, 3);
      checkMinimum(gaps, label, "prerequisites", lesson.prerequisites.length, 1);
      checkMinimum(gaps, label, "vocabulary", lesson.keyVocabulary.length, 2);
      checkMinimum(gaps, label, "definitions", lesson.definitions.length, 1);
      checkMinimum(gaps, label, "facts", lesson.facts.length, 1);
      checkMinimum(gaps, label, "conditions", lesson.conditionsAndRestrictions.length, 1);
      checkMinimum(gaps, label, "applications", lesson.realLifeExamples.length, 3);
      checkMinimum(gaps, label, "misconceptions", lesson.misconceptions.length, 1);
      checkMinimum(gaps, label, "practice progression", lesson.practice.length, 5);
      checkMinimum(gaps, label, "exit checks", lesson.exitCheck.length, 1);
      checkMinimum(gaps, label, "accessibility notes", lesson.accessibilityNotes.length, 1);

      const examples = expandedWorkedExamples(lesson);
      if (examples.length !== 3) gaps.push(`${label}: worked examples ${examples.length}/3`);
      if (!examples.every(isNumericalExample)) gaps.push(`${label}: includes a non-numerical example`);

      const searchable = JSON.stringify(lesson).toLowerCase();
      const teachingText = [
        lesson.introduction,
        lesson.basicIdea,
        lesson.howItWorks,
        lesson.whyItWorks,
        ...lesson.definitions.map((item) => item.statement),
        ...lesson.facts.map((item) => item.statement),
        ...lesson.conditionsAndRestrictions,
      ].join(" ").toLowerCase();
      const titleTerms = source.title.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length >= 4);
      if (titleTerms.length && !titleTerms.some((term) => teachingText.includes(term))) {
        gaps.push(`${label}: teaching content is not anchored to a meaningful title term`);
      }
      for (const phrase of bannedGenericLessonPhrases) {
        if (searchable.includes(phrase.toLowerCase())) gaps.push(`${label}: generic phrase "${phrase}"`);
      }
    }
    expect(gaps).toEqual([]);
  }, 20_000);

  it("audits every advanced lesson for a complete topic-specific learning sequence", () => {
    expect(advancedConceptLessons).toHaveLength(25);

    const gaps: string[] = [];
    for (const lesson of advancedConceptLessons) {
      const label = `${lesson.numericId}: ${lesson.title}`;
      if (!lesson.summary.trim()) gaps.push(`${label}: summary is empty`);
      checkMinimum(gaps, label, "objectives", lesson.objectives.length, 3);
      checkMinimum(gaps, label, "essential ideas", lesson.learn.length, 3);
      checkMinimum(gaps, label, "investigations", lesson.explore.length, 3);
      checkMinimum(gaps, label, "practice", lesson.practice.length, 3);
      checkMinimum(gaps, label, "assessment", lesson.assessmentPrompts.length, 2);
      checkMinimum(gaps, label, "vocabulary tags", lesson.searchKeywords.length, 3);
      checkMinimum(gaps, label, "worked practice", advancedTryItems(lesson).length, 3);

      const examples = advancedStepExamples(lesson);
      if (examples.length !== 3) gaps.push(`${label}: worked examples ${examples.length}/3`);
      if (!examples.every(isNumericalExample)) gaps.push(`${label}: includes a non-numerical example`);
    }
    expect(gaps).toEqual([]);
  });

  it("accounts for all 919 lessons exactly once", () => {
    const ids = [
      ...lessonCatalog.map((lesson) => `core:${lesson.id}`),
      ...schoolLessonCatalog.map((lesson) => `school:${lesson.numericId}`),
      ...advancedConceptLessons.map((lesson) => `advanced:${lesson.numericId}`),
    ];
    expect(ids).toHaveLength(919);
    expect(new Set(ids).size).toBe(919);
  });
});

function checkMinimum(gaps: string[], label: string, field: string, actual: number, expected: number) {
  if (actual < expected) gaps.push(`${label}: ${field} ${actual}/${expected}`);
}
