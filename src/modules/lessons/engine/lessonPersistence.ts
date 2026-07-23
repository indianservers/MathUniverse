import type { LessonDefinition, LessonProgress, LessonStage } from "../types";
import { normalizeInteractionHistory } from "./lessonInteraction";

const STORAGE_PREFIX = "math-universe-lesson-progress-v1:";

export function lessonProgressKey(lessonId: number) {
  return `${STORAGE_PREFIX}${lessonId}`;
}

export function defaultLessonProgress(lesson: LessonDefinition): LessonProgress {
  return {
    stage: "discover",
    prediction: "",
    answer: "",
    completed: false,
    seed: lesson.id * 104729 + 17,
    interactionHistory: [],
    updatedAt: Date.now(),
  };
}

export function readLessonProgress(lesson: LessonDefinition): LessonProgress {
  if (typeof window === "undefined") return defaultLessonProgress(lesson);
  try {
    const value = JSON.parse(localStorage.getItem(lessonProgressKey(lesson.id)) ?? "null") as Partial<LessonProgress> | null;
    if (!value) return defaultLessonProgress(lesson);
    return {
      stage: isLessonStage(value.stage) ? value.stage : "discover",
      prediction: typeof value.prediction === "string" ? value.prediction : "",
      answer: typeof value.answer === "string" ? value.answer : "",
      completed: value.completed === true,
      seed: Number.isInteger(value.seed) ? Number(value.seed) : lesson.id * 104729 + 17,
      interactionHistory: normalizeInteractionHistory(value.interactionHistory),
      updatedAt: typeof value.updatedAt === "number" ? value.updatedAt : Date.now(),
    };
  } catch {
    return defaultLessonProgress(lesson);
  }
}

export function writeLessonProgress(lessonId: number, progress: LessonProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(lessonProgressKey(lessonId), JSON.stringify({ ...progress, updatedAt: Date.now() }));
}

export function clearLessonProgress(lessonId: number) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(lessonProgressKey(lessonId));
}

function isLessonStage(value: unknown): value is LessonStage {
  return value === "discover" || value === "explore" || value === "try" || value === "check";
}
