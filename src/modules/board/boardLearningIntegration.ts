import {
  emptyMasteryRecord,
  readNCERTMasteryStore,
  updateNCERTMasteryRecord,
  writeNCERTMasteryStore,
} from "../../hooks/useNCERTMastery";
import type { BoardMathClassification, BoardWorkVerificationResult } from "./types";

const CONCEPT_MAP: Partial<Record<BoardMathClassification, string>> = {
  equation: "algebra.linear-equations",
  "system-of-equations": "algebra.simultaneous-equations",
  inequality: "algebra.inequalities",
  "algebraic-expression": "algebra.expressions",
  derivative: "calculus.derivatives",
  integral: "calculus.integration",
  limit: "calculus.limits",
  matrix: "linear-algebra.matrices",
  statistics: "statistics.descriptive-statistics",
  "data-series": "statistics.descriptive-statistics",
  geometry: "geometry.coordinate-geometry",
};

export function mapBoardConcept(classification: BoardMathClassification) {
  return CONCEPT_MAP[classification];
}

export function recordBoardMasteryEvidence(input: {
  classification: BoardMathClassification;
  verification: BoardWorkVerificationResult;
  recognitionConfidence?: number;
}) {
  const conceptId = mapBoardConcept(input.classification);
  if (!conceptId || (input.recognitionConfidence ?? 1) < 0.7 || input.verification.overallStatus === "ambiguous") return false;
  const store = readNCERTMasteryStore();
  store[conceptId] = updateNCERTMasteryRecord(
    store[conceptId] ?? emptyMasteryRecord(),
    "board-work-verification",
    input.verification.overallStatus === "correct",
  );
  writeNCERTMasteryStore(store);
  return true;
}
