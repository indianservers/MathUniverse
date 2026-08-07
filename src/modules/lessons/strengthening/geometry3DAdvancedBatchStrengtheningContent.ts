import { geometry3DAdvancedBatchSeeds } from "./geometry3DAdvancedBatch";
import {
  geometry3DAdvancedChallenge,
  geometry3DAdvancedLesson,
  type Geometry3DAdvancedChallenge,
} from "./geometry3DAdvancedBatch/geometry3DAdvancedBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const geometry3DAdvancedBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  geometry3DAdvancedBatchSeeds.map((item) => [item.id, geometry3DAdvancedLesson(item)]),
);

export const geometry3DAdvancedBatchStrengthenedChallenges: Record<number, Geometry3DAdvancedChallenge> = Object.fromEntries(
  geometry3DAdvancedBatchSeeds.map((item) => [item.id, geometry3DAdvancedChallenge(item)]),
);
