import { geometryBatchSeeds } from "./geometryBatch";
import { geometryBatchLesson, type GeometryBatchChallenge } from "./geometryBatch/geometryBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const geometryBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  geometryBatchSeeds.map((item) => [item.id, geometryBatchLesson(item)]),
);

export const geometryBatchStrengthenedChallenges: Record<number, GeometryBatchChallenge> = Object.fromEntries(
  geometryBatchSeeds.map((item) => [item.id, item.challenge]),
);
