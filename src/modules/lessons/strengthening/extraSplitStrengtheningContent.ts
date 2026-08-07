import { extraSplitSeeds } from "./extraSplit";
import { extraLesson, type ExtraChallenge } from "./extraSplit/extraLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const extraSplitStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  extraSplitSeeds.map((item) => [item.id, extraLesson(item)]),
);

export const extraSplitStrengthenedChallenges: Record<number, ExtraChallenge> = Object.fromEntries(
  extraSplitSeeds.map((item) => [item.id, item.challenge]),
);
