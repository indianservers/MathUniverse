import { matrixBatchSeeds } from "./matrixBatch";
import { matrixBatchChallenge, matrixBatchLesson, type MatrixBatchChallenge } from "./matrixBatch/matrixBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const matrixBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  matrixBatchSeeds.map((item) => [item.id, matrixBatchLesson(item)]),
);

export const matrixBatchStrengthenedChallenges: Record<number, MatrixBatchChallenge> = Object.fromEntries(
  matrixBatchSeeds.map((item) => [item.id, matrixBatchChallenge(item)]),
);
