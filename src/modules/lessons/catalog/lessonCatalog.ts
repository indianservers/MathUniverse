import { phaseOneLessons } from "./phase1.generated";
import { phaseTwoLessons } from "./phase2.generated";
import { phaseThreeLessons } from "./phase3.generated";
import { phaseFourLessons } from "./phase4.generated";
import { enrichLessonDefinition } from "../engine/lessonContracts";
import type { LessonDefinition } from "../types";

export const lessonCatalog: readonly LessonDefinition[] = [...phaseOneLessons, ...phaseTwoLessons, ...phaseThreeLessons, ...phaseFourLessons].map(enrichLessonDefinition);

export type LessonCategorySummary = {
  slug: string;
  title: string;
  count: number;
  topics: Array<{ title: string; count: number }>;
};

export const lessonCategories: LessonCategorySummary[] = Array.from(
  lessonCatalog.reduce((categories, lesson) => {
    const current = categories.get(lesson.categorySlug) ?? {
      slug: lesson.categorySlug,
      title: lesson.category,
      count: 0,
      topicCounts: new Map<string, number>(),
    };
    current.count += 1;
    current.topicCounts.set(lesson.topic, (current.topicCounts.get(lesson.topic) ?? 0) + 1);
    categories.set(lesson.categorySlug, current);
    return categories;
  }, new Map<string, { slug: string; title: string; count: number; topicCounts: Map<string, number> }>()).values(),
).map(({ topicCounts, ...category }) => ({
  ...category,
  topics: Array.from(topicCounts, ([title, count]) => ({ title, count })),
}));

export function lessonsForCategory(categorySlug: string | undefined) {
  return lessonCatalog.filter((lesson) => lesson.categorySlug === categorySlug);
}

export function findLesson(categorySlug: string | undefined, lessonSlug: string | undefined) {
  const id = Number.parseInt(lessonSlug?.split("-")[0] ?? "", 10);
  if (!Number.isInteger(id)) return null;
  return lessonCatalog.find((lesson) => lesson.id === id && lesson.categorySlug === categorySlug && lesson.route.endsWith(`/${lessonSlug}`)) ?? null;
}

export function adjacentLessons(lesson: LessonDefinition) {
  const topicLessons = lessonCatalog.filter((candidate) => candidate.topic === lesson.topic);
  const index = topicLessons.findIndex((candidate) => candidate.id === lesson.id);
  return {
    previous: index > 0 ? topicLessons[index - 1] : null,
    next: index >= 0 && index < topicLessons.length - 1 ? topicLessons[index + 1] : null,
  };
}
