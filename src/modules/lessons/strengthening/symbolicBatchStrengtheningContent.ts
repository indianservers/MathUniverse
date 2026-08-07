import { symbolicBatchSeeds } from "./symbolicBatch";
import {
  symbolicBatchChallenge,
  symbolicBatchLesson,
  type SymbolicBatchChallenge,
} from "./symbolicBatch/symbolicBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const symbolicBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  symbolicBatchSeeds.map((item) => [item.id, symbolicBatchLesson(item)]),
);

export const symbolicBatchStrengthenedChallenges: Record<number, SymbolicBatchChallenge> = Object.fromEntries(
  symbolicBatchSeeds.map((item) => [item.id, symbolicBatchChallenge(item)]),
);
