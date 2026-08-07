import { geometryLociSeeds } from "./geometryLoci";
import { geometryBatchLesson, type GeometryBatchChallenge } from "./geometryBatch/geometryBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const geometryLociStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  geometryLociSeeds.map((item) => [item.id, geometryBatchLesson(item)]),
);

export const geometryLociStrengthenedChallenges: Record<number, GeometryBatchChallenge> = Object.fromEntries(
  geometryLociSeeds.map((item) => [item.id, item.challenge]),
);
