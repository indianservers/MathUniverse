import { statisticsBatchSeeds } from "./statisticsBatch";
import {
  statisticsBatchChallenge,
  statisticsBatchLesson,
  type StatisticsBatchChallenge,
} from "./statisticsBatch/statisticsBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const statisticsBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  statisticsBatchSeeds.map((item) => [item.id, statisticsBatchLesson(item)]),
);

export const statisticsBatchStrengthenedChallenges: Record<number, StatisticsBatchChallenge> = Object.fromEntries(
  statisticsBatchSeeds.map((item) => [item.id, statisticsBatchChallenge(item)]),
);
