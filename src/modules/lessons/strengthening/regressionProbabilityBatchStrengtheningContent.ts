import { regressionProbabilityBatchSeeds } from "./regressionProbabilityBatch";
import {
  regressionProbabilityChallenge,
  regressionProbabilityLesson,
  type RegressionProbabilityChallenge,
} from "./regressionProbabilityBatch/regressionProbabilityBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const regressionProbabilityBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  regressionProbabilityBatchSeeds.map((item) => [item.id, regressionProbabilityLesson(item)]),
);

export const regressionProbabilityBatchStrengthenedChallenges: Record<number, RegressionProbabilityChallenge> = Object.fromEntries(
  regressionProbabilityBatchSeeds.map((item) => [item.id, regressionProbabilityChallenge(item)]),
);
