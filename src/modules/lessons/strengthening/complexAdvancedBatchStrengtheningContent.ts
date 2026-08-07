import { complexAdvancedBatchSeeds } from "./complexAdvancedBatch";
import { complexAdvancedChallenge, complexAdvancedLesson, type ComplexAdvancedChallenge } from "./complexAdvancedBatch/complexAdvancedBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const complexAdvancedBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  complexAdvancedBatchSeeds.map((item) => [item.id, complexAdvancedLesson(item)]),
);

export const complexAdvancedBatchStrengthenedChallenges: Record<number, ComplexAdvancedChallenge> = Object.fromEntries(
  complexAdvancedBatchSeeds.map((item) => [item.id, complexAdvancedChallenge(item)]),
);
