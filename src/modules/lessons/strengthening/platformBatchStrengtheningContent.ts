import { platformBatchSeeds } from "./platformBatch";
import {
  platformBatchChallenge,
  platformBatchLesson,
  type PlatformBatchChallenge,
} from "./platformBatch/platformBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const platformBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  platformBatchSeeds.map((item) => [item.id, platformBatchLesson(item)]),
);

export const platformBatchStrengthenedChallenges: Record<number, PlatformBatchChallenge> = Object.fromEntries(
  platformBatchSeeds.map((item) => [item.id, platformBatchChallenge(item)]),
);
