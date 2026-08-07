import { distributionInferenceBatchSeeds } from "./distributionInferenceBatch";
import {
  distributionInferenceChallenge,
  distributionInferenceLesson,
  type DistributionInferenceChallenge,
} from "./distributionInferenceBatch/distributionInferenceBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const distributionInferenceBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  distributionInferenceBatchSeeds.map((item) => [item.id, distributionInferenceLesson(item)]),
);

export const distributionInferenceBatchStrengthenedChallenges: Record<number, DistributionInferenceChallenge> = Object.fromEntries(
  distributionInferenceBatchSeeds.map((item) => [item.id, distributionInferenceChallenge(item)]),
);
