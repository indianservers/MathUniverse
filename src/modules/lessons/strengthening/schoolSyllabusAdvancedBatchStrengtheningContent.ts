import { schoolSyllabusAdvancedBatchSeeds } from "./schoolSyllabusAdvancedBatch";
import {
  schoolSyllabusAdvancedChallenge,
  schoolSyllabusAdvancedLesson,
  type SchoolSyllabusAdvancedChallenge,
} from "./schoolSyllabusAdvancedBatch/schoolSyllabusAdvancedBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const schoolSyllabusAdvancedBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  schoolSyllabusAdvancedBatchSeeds.map((item) => [item.id, schoolSyllabusAdvancedLesson(item)]),
);

export const schoolSyllabusAdvancedBatchStrengthenedChallenges: Record<number, SchoolSyllabusAdvancedChallenge> = Object.fromEntries(
  schoolSyllabusAdvancedBatchSeeds.map((item) => [item.id, schoolSyllabusAdvancedChallenge(item)]),
);
