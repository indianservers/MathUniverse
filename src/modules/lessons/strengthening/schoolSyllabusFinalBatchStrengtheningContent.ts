import { schoolSyllabusFinalBatchSeeds } from "./schoolSyllabusFinalBatch";
import {
  schoolSyllabusFinalChallenge,
  schoolSyllabusFinalLesson,
  type SchoolSyllabusFinalChallenge,
} from "./schoolSyllabusFinalBatch/schoolSyllabusFinalBatchLessonFactory";
import type { StrengthenedLesson } from "./strengthenedLessonSchema";

export const schoolSyllabusFinalBatchStrengthenedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  schoolSyllabusFinalBatchSeeds.map((item) => [item.id, schoolSyllabusFinalLesson(item)]),
);

export const schoolSyllabusFinalBatchStrengthenedChallenges: Record<number, SchoolSyllabusFinalChallenge> = Object.fromEntries(
  schoolSyllabusFinalBatchSeeds.map((item) => [item.id, schoolSyllabusFinalChallenge(item)]),
);
