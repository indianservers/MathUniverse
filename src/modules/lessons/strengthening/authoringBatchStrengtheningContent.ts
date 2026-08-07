import { authoringBatchSeeds } from "./authoringBatch";
import {
  authoringBatchChallenge,
  authoringBatchLesson,
  type AuthoringBatchChallenge,
} from "./authoringBatch/authoringBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const authoringBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  authoringBatchSeeds.map((item) => [item.id, authoringBatchLesson(item)]),
);

export const authoringBatchStrengthenedChallenges: Record<number, AuthoringBatchChallenge> = Object.fromEntries(
  authoringBatchSeeds.map((item) => [item.id, authoringBatchChallenge(item)]),
);
