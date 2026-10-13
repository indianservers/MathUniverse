import { describe, expect, it } from "vitest";
import registry from "./apCurriculumRegistry.generated.json";
import { lessonCatalog } from "../lessonCatalog";
import { schoolLessonCatalog } from "../school/schoolSyllabusCatalog";
import { advancedConceptLessons } from "../advanced/advancedConceptLessons";

describe("AP upcoming lesson reservations", () => {
  it("reserves unique identities outside all existing lesson catalogs", () => {
    const existing = new Set([...lessonCatalog.map(x => x.id), ...schoolLessonCatalog.map(x => x.numericId), ...advancedConceptLessons.map(x => x.numericId)]);
    const ids = registry.upcomingLessons.map(x => x.lessonId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(registry.upcomingLessons.map(x => x.plannedRoute)).size).toBe(ids.length);
    for (const lesson of registry.upcomingLessons) {
      expect(existing.has(lesson.lessonId)).toBe(false);
      expect(lesson.status).toBe("Upcoming");
      expect(lesson.coverageVerified).toBe("No");
      expect(lesson.pageName).toBeTruthy();
    }
  });
  it("retains source editions and valid page anchors for every school topic", () => {
    for (const topic of registry.schoolTopics) {
      const source = registry.sources.find(x => x.id === topic.sourceId);
      expect(source).toBeDefined();
      expect(topic.pdfPage).toBeGreaterThan(0);
      expect(topic.pdfPage).toBeLessThanOrEqual(source!.pdfPages);
      expect(topic.sourceYear).toBe(source!.academicYear);
      if (topic.status === "Upcoming") expect(registry.upcomingLessons.some(x => x.topicKey === topic.topicKey && x.lessonId === topic.lessonId)).toBe(true);
      else expect([...lessonCatalog, ...schoolLessonCatalog].some(x => ("numericId" in x ? x.numericId : x.id) === topic.existingLessonId)).toBe(true);
    }
  });
  it("reconciles chapter and registry totals without claiming completed coverage", () => {
    expect(registry.summary.totalUpcoming).toBe(registry.upcomingLessons.length);
    expect(registry.summary.schoolTopics).toBe(registry.schoolTopics.length);
    expect(registry.summary.schoolMapped + registry.summary.schoolUpcoming).toBe(registry.summary.schoolTopics);
    expect(registry.summary.verifiedTopics).toBe(0);
    for (const chapter of registry.chapters) {
      const topics = registry.schoolTopics.filter(x => x.sourceId === chapter.sourceId && x.chapterNumber === chapter.chapterNumber);
      expect(chapter.topics).toBe(topics.length);
      expect(chapter.mapped + chapter.upcoming).toBe(chapter.topics);
    }
  });
});
