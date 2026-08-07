import { schoolSyllabusBatchSeeds } from "./schoolSyllabusBatch";
import {
  schoolSyllabusChallenge,
  schoolSyllabusLesson,
  type SchoolSyllabusBatchChallenge,
} from "./schoolSyllabusBatch/schoolSyllabusBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const schoolSyllabusBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  schoolSyllabusBatchSeeds.map((item) => [item.id, schoolSyllabusLesson(item)]),
);

export const schoolSyllabusBatchStrengthenedChallenges: Record<number, SchoolSyllabusBatchChallenge> = Object.fromEntries(
  schoolSyllabusBatchSeeds.map((item) => [item.id, schoolSyllabusChallenge(item)]),
);
