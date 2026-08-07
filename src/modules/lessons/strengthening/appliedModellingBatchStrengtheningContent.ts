import { appliedModellingBatchSeeds } from "./appliedModellingBatch";
import {
  appliedModellingChallenge,
  appliedModellingLesson,
  type AppliedModellingChallenge,
} from "./appliedModellingBatch/appliedModellingBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const appliedModellingBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  appliedModellingBatchSeeds.map((item) => [item.id, appliedModellingLesson(item)]),
);

export const appliedModellingBatchStrengthenedChallenges: Record<number, AppliedModellingChallenge> = Object.fromEntries(
  appliedModellingBatchSeeds.map((item) => [item.id, appliedModellingChallenge(item)]),
);
