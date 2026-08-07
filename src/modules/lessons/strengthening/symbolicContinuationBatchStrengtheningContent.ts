import { symbolicContinuationBatchSeeds } from "./symbolicContinuationBatch";
import {
  symbolicContinuationChallenge,
  symbolicContinuationLesson,
  type SymbolicContinuationChallenge,
} from "./symbolicContinuationBatch/symbolicContinuationBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const symbolicContinuationBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  symbolicContinuationBatchSeeds.map((item) => [item.id, symbolicContinuationLesson(item)]),
);

export const symbolicContinuationBatchStrengthenedChallenges: Record<number, SymbolicContinuationChallenge> = Object.fromEntries(
  symbolicContinuationBatchSeeds.map((item) => [item.id, symbolicContinuationChallenge(item)]),
);
