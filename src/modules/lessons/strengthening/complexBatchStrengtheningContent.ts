import { complexBatchSeeds } from "./complexBatch";
import { complexBatchChallenge, complexBatchLesson, type ComplexBatchChallenge } from "./complexBatch/complexBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const complexBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  complexBatchSeeds.map((item) => [item.id, complexBatchLesson(item)]),
);

export const complexBatchStrengthenedChallenges: Record<number, ComplexBatchChallenge> = Object.fromEntries(
  complexBatchSeeds.map((item) => [item.id, complexBatchChallenge(item)]),
);
