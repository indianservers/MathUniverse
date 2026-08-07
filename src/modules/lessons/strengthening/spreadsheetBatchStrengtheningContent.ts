import { spreadsheetBatchSeeds } from "./spreadsheetBatch";
import {
  spreadsheetBatchChallenge,
  spreadsheetBatchLesson,
  type SpreadsheetBatchChallenge,
} from "./spreadsheetBatch/spreadsheetBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const spreadsheetBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  spreadsheetBatchSeeds.map((item) => [item.id, spreadsheetBatchLesson(item)]),
);

export const spreadsheetBatchStrengthenedChallenges: Record<number, SpreadsheetBatchChallenge> = Object.fromEntries(
  spreadsheetBatchSeeds.map((item) => [item.id, spreadsheetBatchChallenge(item)]),
);
