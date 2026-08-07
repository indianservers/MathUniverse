import { sequenceSeriesBatchSeeds } from "./sequenceSeriesBatch";
import { sequenceSeriesChallenge, sequenceSeriesLesson, type SequenceSeriesChallenge } from "./sequenceSeriesBatch/sequenceSeriesBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const sequenceSeriesBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  sequenceSeriesBatchSeeds.map((item) => [item.id, sequenceSeriesLesson(item)]),
);

export const sequenceSeriesBatchStrengthenedChallenges: Record<number, SequenceSeriesChallenge> = Object.fromEntries(
  sequenceSeriesBatchSeeds.map((item) => [item.id, sequenceSeriesChallenge(item)]),
);
