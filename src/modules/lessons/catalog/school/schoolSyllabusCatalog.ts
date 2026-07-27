import { schoolSyllabusLessons } from "./schoolSyllabusLessons.generated";
import { schoolSyllabusPathways } from "../../pathways/school/schoolSyllabusPathways.generated";
import type { AcademicLevel, SchoolSyllabusLesson, SyllabusBoard } from "../../syllabus/lessonSyllabusTypes";

export const schoolLessonCatalog: readonly SchoolSyllabusLesson[] = schoolSyllabusLessons;
export const schoolPathways = schoolSyllabusPathways;

export function findSchoolLesson(levelSlug: string | undefined, lessonSlug: string | undefined) {
  if (!levelSlug || !lessonSlug) return null;
  const level = levelFromSlug(levelSlug);
  if (!level) return null;
  return schoolLessonCatalog.find((lesson) => lesson.metadata.academicLevel === level && lesson.slug === lessonSlug) ?? null;
}

export function schoolLessonsFor(level: AcademicLevel | "ALL", board: SyllabusBoard | "ALL", query: string) {
  const normalized = query.trim().toLowerCase();
  return schoolLessonCatalog.filter((lesson) => {
    const levelMatches = level === "ALL" || lesson.metadata.academicLevel === level;
    const boardMatches = board === "ALL" || lesson.boardPathways.includes(board);
    const queryMatches = !normalized || [
      lesson.title,
      lesson.metadata.conceptFamily,
      lesson.content.summary,
      lesson.metadata.searchKeywords.join(" "),
      lesson.metadata.learningObjectives.join(" "),
    ].join(" ").toLowerCase().includes(normalized);
    return levelMatches && boardMatches && queryMatches;
  });
}

export function levelSlug(level: AcademicLevel) {
  return level.toLowerCase().replace("_", "-");
}

export function levelFromSlug(slug: string): AcademicLevel | null {
  const value = slug.toUpperCase().replace("-", "_");
  return ["CLASS_6", "CLASS_7", "CLASS_8", "CLASS_9", "CLASS_10", "CLASS_11", "CLASS_12"].includes(value) ? value as AcademicLevel : null;
}

export function adjacentSchoolLessons(lesson: SchoolSyllabusLesson) {
  const related = schoolLessonCatalog.filter((candidate) => candidate.metadata.academicLevel === lesson.metadata.academicLevel && candidate.metadata.conceptFamily === lesson.metadata.conceptFamily);
  const index = related.findIndex((candidate) => candidate.id === lesson.id);
  return {
    previous: index > 0 ? related[index - 1] : null,
    next: index >= 0 && index < related.length - 1 ? related[index + 1] : null,
  };
}
