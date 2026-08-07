import { calculusBatchSeeds } from "./calculusBatch";
import { calculusLesson, type CalculusChallenge } from "./calculusBatch/calculusBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const calculusBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  calculusBatchSeeds.map((item) => [item.id, calculusLesson(item)]),
);

export const calculusBatchStrengthenedChallenges: Record<number, CalculusChallenge> = Object.fromEntries(
  calculusBatchSeeds.map((item) => [item.id, item.challenge]),
);
