import { sequenceBatchSeeds } from "./sequenceBatch";
import { sequenceChallenge, sequenceLesson, type SequenceChallenge } from "./sequenceBatch/sequenceBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const sequenceBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  sequenceBatchSeeds.map((item) => [item.id, sequenceLesson(item)]),
);

export const sequenceBatchStrengthenedChallenges: Record<number, SequenceChallenge> = Object.fromEntries(
  sequenceBatchSeeds.map((item) => [item.id, sequenceChallenge(item)]),
);
