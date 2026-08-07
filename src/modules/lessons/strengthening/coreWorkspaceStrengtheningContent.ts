import { coreWorkspaceSeeds } from "./coreWorkspaces";
import { coreWorkspaceLesson, type CoreWorkspaceChallenge } from "./coreWorkspaces/coreWorkspaceLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const coreWorkspaceStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  coreWorkspaceSeeds.map((item) => [item.id, coreWorkspaceLesson(item)]),
);

export const coreWorkspaceStrengthenedChallenges: Record<number, CoreWorkspaceChallenge> = Object.fromEntries(
  coreWorkspaceSeeds.map((item) => [item.id, item.challenge]),
);
