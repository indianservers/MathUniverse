import { integralBatchSeeds } from "./integralBatch";
import { integralChallenge, integralLesson, type IntegralChallenge } from "./integralBatch/integralBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const integralBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  integralBatchSeeds.map((item) => [item.id, integralLesson(item)]),
);

export const integralBatchStrengthenedChallenges: Record<number, IntegralChallenge> = Object.fromEntries(
  integralBatchSeeds.map((item) => [item.id, integralChallenge(item)]),
);
