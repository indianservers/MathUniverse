import {
  getSierpinskiCumulativeRemovedSquareCount,
  getSierpinskiIterationSummary,
  getSierpinskiRetainedSquareCount,
  getSierpinskiSmallestSideScale,
} from "../components/ncert/grade8/fractalsSolidViewsMath";
import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

export function solveFractal(classification: ProblemClassification): ProblemSolverResult | null {
  if (classification.kind !== "fractal") return null;
  const text = classification.normalizedInput.toLowerCase();
  const iteration = extractIteration(text);
  const retainedTarget = extractTargetCount(text, /retained|remaining|left/);
  const sideTarget = extractSideDenominator(text);

  if (retainedTarget) {
    const found = findIterationForRetainedCount(retainedTarget);
    return result(classification, found === null ? "No whole-number iteration matches that retained count." : `n = ${found}`, [
      "Use the retained-square formula R_n = 8^n.",
      `Set 8^n = ${retainedTarget}.`,
      found === null ? "The target is not an exact power of 8 in the supported range." : `Since 8^${found} = ${retainedTarget}, the iteration is n = ${found}.`,
    ]);
  }

  if (sideTarget) {
    const found = findIterationForSideDenominator(sideTarget);
    return result(classification, found === null ? "No whole-number iteration matches that side scale." : `n = ${found}`, [
      "Use the smallest-side formula s_n = 1 / 3^n.",
      `Set 1 / 3^n = 1 / ${sideTarget}.`,
      found === null ? "The denominator is not an exact power of 3 in the supported range." : `Since 3^${found} = ${sideTarget}, the iteration is n = ${found}.`,
    ]);
  }

  const n = iteration ?? 3;
  const stats = getSierpinskiIterationSummary(n);
  const answer = text.includes("cumulative") || text.includes("total removed")
    ? `${stats.cumulativeRemovedSquares}`
    : text.includes("removed area")
      ? stats.removedAreaText
      : text.includes("side")
        ? getSierpinskiSmallestSideScale(n).text
        : text.includes("removed")
          ? `${stats.newlyRemovedSquares}`
          : text.includes("area")
            ? stats.retainedAreaText
            : `${stats.retainedSquares}`;

  return result(classification, answer, [
    `Use n = ${n}.`,
    "Retained squares: R_n = 8^n.",
    `Newly removed squares: N_n = ${n === 0 ? "0" : "8^(n-1)"}.`,
    "Cumulative removed count: C_n = (8^n - 1) / 7.",
    "Retained area fraction: A_n = (8/9)^n.",
    `For n = ${n}: retained = ${getSierpinskiRetainedSquareCount(n)}, total removed = ${getSierpinskiCumulativeRemovedSquareCount(n)}, retained area = ${stats.retainedAreaText}.`,
  ]);
}

function result(classification: ProblemClassification, answer: string, steps: string[]): ProblemSolverResult {
  return {
    kind: "fractal",
    method: "Sierpinski carpet formulas",
    title: "Sierpinski Carpet",
    normalizedInput: classification.normalizedInput,
    result: answer,
    steps,
    assumptions: classification.assumptions,
    verification: ["Checked using exact integer powers and exact fraction formulas."],
    warnings: classification.warnings,
    canCopy: true,
  };
}

function extractIteration(text: string) {
  const match = text.match(/(?:iteration|step|after|n)\s*=?\s*(\d+)/i);
  return match ? Number(match[1]) : undefined;
}

function extractTargetCount(text: string, marker: RegExp) {
  if (!marker.test(text)) return undefined;
  const match = text.match(/(?:is|=|count|squares)\s*(\d{1,12})/i) ?? text.match(/(\d{2,12})/);
  return match ? Number(match[1]) : undefined;
}

function extractSideDenominator(text: string) {
  const match = text.match(/1\s*\/\s*(\d+)/);
  return /side|scale/.test(text) && match ? Number(match[1]) : undefined;
}

function findIterationForRetainedCount(target: number) {
  for (let n = 0; n <= 12; n += 1) {
    if (8 ** n === target) return n;
  }
  return null;
}

function findIterationForSideDenominator(target: number) {
  for (let n = 0; n <= 12; n += 1) {
    if (3 ** n === target) return n;
  }
  return null;
}
