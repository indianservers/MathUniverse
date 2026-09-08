import { oneSampleTTest } from "./oneSampleTTestLessonModel";

export type PairedObservation = { before: number; after: number };

export const pairedTDefaults: PairedObservation[] = [
  { before: 72, after: 80 },
  { before: 68, after: 75 },
  { before: 55, after: 60 },
  { before: 90, after: 96 },
  { before: 62, after: 70 },
  { before: 75, after: 78 },
  { before: 58, after: 65 },
  { before: 80, after: 86 },
  { before: 66, after: 72 },
  { before: 70, after: 76 },
];

export function pairedTTest(pairs: PairedObservation[], alpha = 0.05) {
  const validPairs = pairs.filter(
    (pair) => Number.isFinite(pair.before) && Number.isFinite(pair.after),
  );
  const differences = validPairs.map((pair) => pair.after - pair.before);
  const test = oneSampleTTest(differences, 0, alpha, "two-sided");
  const meanBefore = validPairs.length
    ? validPairs.reduce((sum, pair) => sum + pair.before, 0) / validPairs.length
    : 0;
  const meanAfter = validPairs.length
    ? validPairs.reduce((sum, pair) => sum + pair.after, 0) / validPairs.length
    : 0;
  return { pairs: validPairs, differences, meanBefore, meanAfter, ...test };
}
