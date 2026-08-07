import { inferenceDiscreteBatchSeeds } from "./inferenceDiscreteBatch";
import {
  inferenceDiscreteChallenge,
  inferenceDiscreteLesson,
  type InferenceDiscreteChallenge,
} from "./inferenceDiscreteBatch/inferenceDiscreteBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const inferenceDiscreteBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  inferenceDiscreteBatchSeeds.map((item) => [item.id, inferenceDiscreteLesson(item)]),
);

export const inferenceDiscreteBatchStrengthenedChallenges: Record<number, InferenceDiscreteChallenge> = Object.fromEntries(
  inferenceDiscreteBatchSeeds.map((item) => [item.id, inferenceDiscreteChallenge(item)]),
);
