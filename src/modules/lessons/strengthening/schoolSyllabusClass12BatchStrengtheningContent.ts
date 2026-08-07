import { schoolSyllabusClass12BatchSeeds } from "./schoolSyllabusClass12Batch";
import {
  schoolSyllabusClass12Challenge,
  schoolSyllabusClass12Lesson,
  type SchoolSyllabusClass12Challenge,
} from "./schoolSyllabusClass12Batch/schoolSyllabusClass12BatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const schoolSyllabusClass12BatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  schoolSyllabusClass12BatchSeeds.map((item) => [item.id, schoolSyllabusClass12Lesson(item)]),
);

export const schoolSyllabusClass12BatchStrengthenedChallenges: Record<number, SchoolSyllabusClass12Challenge> = Object.fromEntries(
  schoolSyllabusClass12BatchSeeds.map((item) => [item.id, schoolSyllabusClass12Challenge(item)]),
);
