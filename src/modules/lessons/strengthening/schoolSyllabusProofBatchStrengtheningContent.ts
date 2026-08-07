import { schoolSyllabusProofBatchSeeds } from "./schoolSyllabusProofBatch";
import {
  schoolSyllabusProofChallenge,
  schoolSyllabusProofLesson,
  type SchoolSyllabusProofChallenge,
} from "./schoolSyllabusProofBatch/schoolSyllabusProofBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const schoolSyllabusProofBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  schoolSyllabusProofBatchSeeds.map((item) => [item.id, schoolSyllabusProofLesson(item)]),
);

export const schoolSyllabusProofBatchStrengthenedChallenges: Record<number, SchoolSyllabusProofChallenge> = Object.fromEntries(
  schoolSyllabusProofBatchSeeds.map((item) => [item.id, schoolSyllabusProofChallenge(item)]),
);
