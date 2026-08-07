import { graphToolSeeds } from "./graphTools";
import { graphToolLesson, type GraphToolChallenge } from "./graphTools/graphToolLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const graphToolStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  graphToolSeeds.map((item) => [item.id, graphToolLesson(item)]),
);

export const graphToolStrengthenedChallenges: Record<number, GraphToolChallenge> = Object.fromEntries(
  graphToolSeeds.map((item) => [item.id, item.challenge]),
);
