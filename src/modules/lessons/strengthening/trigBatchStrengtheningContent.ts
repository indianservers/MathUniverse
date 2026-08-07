import { trigBatchSeeds } from "./trigBatch";
import { trigLesson, type TrigChallenge } from "./trigBatch/trigBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const trigBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  trigBatchSeeds.map((item) => [item.id, trigLesson(item)]),
);

export const trigBatchStrengthenedChallenges: Record<number, TrigChallenge> = Object.fromEntries(
  trigBatchSeeds.map((item) => [item.id, item.challenge]),
);
