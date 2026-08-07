import { geometry3DBatchSeeds } from "./geometry3DBatch";
import { geometry3DBatchChallenge, geometry3DBatchLesson, type Geometry3DBatchChallenge } from "./geometry3DBatch/geometry3DBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const geometry3DBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  geometry3DBatchSeeds.map((item) => [item.id, geometry3DBatchLesson(item)]),
);

export const geometry3DBatchStrengthenedChallenges: Record<number, Geometry3DBatchChallenge> = Object.fromEntries(
  geometry3DBatchSeeds.map((item) => [item.id, geometry3DBatchChallenge(item)]),
);
