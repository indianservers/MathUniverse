import { authoringContinuationBatchSeeds } from "./authoringContinuationBatch";
import {
  authoringContinuationChallenge,
  authoringContinuationLesson,
  type AuthoringContinuationChallenge,
} from "./authoringContinuationBatch/authoringContinuationBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const authoringContinuationBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  authoringContinuationBatchSeeds.map((item) => [item.id, authoringContinuationLesson(item)]),
);

export const authoringContinuationBatchStrengthenedChallenges: Record<number, AuthoringContinuationChallenge> = Object.fromEntries(
  authoringContinuationBatchSeeds.map((item) => [item.id, authoringContinuationChallenge(item)]),
);
