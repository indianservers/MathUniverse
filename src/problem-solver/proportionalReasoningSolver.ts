import {
  divideWholeInRatio,
  getActualDistanceFromMapScale,
  getDirectProportionValue,
  getInverseProportionValue,
  getMapDistanceFromActualScale,
  getPieAnglesFromRatio,
  getPiePercentagesFromRatio,
  round,
  simplifyRatio,
} from "../components/ncert/grade8/proportionalReasoningMath";
import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

export function solveProportionalReasoning(classification: ProblemClassification): ProblemSolverResult | null {
  if (classification.kind !== "proportional-reasoning") return null;
  const text = classification.normalizedInput.toLowerCase();

  const ratioParts = extractRatioParts(text);
  const scale = extractScale(text);
  if (scale) {
    if (scale.mapDistance === undefined && scale.actualDistance !== undefined) {
      const map = getMapDistanceFromActualScale({ actualDistance: scale.actualDistance, scaleDenominator: scale.denominator, actualUnit: scale.actualUnit, outputUnit: "cm" });
      return result(classification, `${round(map.map, 4)} cm`, [
        `Scale 1:${scale.denominator} means 1 map unit represents ${scale.denominator} real units.`,
        ...map.steps,
      ], ["Map distance was computed after converting the actual distance into centimetres."]);
    }
    const actual = getActualDistanceFromMapScale({ mapDistance: scale.mapDistance ?? 1, scaleDenominator: scale.denominator, mapUnit: "cm", outputUnit: "km" });
    return result(classification, `${round(actual.actual, 4)} km`, [
      `Use scale 1:${scale.denominator}.`,
      `Actual distance = map distance x ${scale.denominator}.`,
      ...actual.steps,
    ], ["Result is reported in kilometres for readability."]);
  }

  if (ratioParts.length >= 2 && /pie|angle/.test(text)) {
    const angles = getPieAnglesFromRatio(ratioParts);
    return result(classification, angles.map((angle) => `${angle} deg`).join(", "), [
      `Ratio parts are ${ratioParts.join(":")}.`,
      `Total parts = ${ratioParts.reduce((acc, part) => acc + part, 0)}.`,
      "Each pie angle = part / total parts x 360 degrees.",
      `Angles = ${angles.join(" deg, ")} deg.`,
    ]);
  }

  if (ratioParts.length >= 2 && /percent|percentage/.test(text)) {
    const percentages = getPiePercentagesFromRatio(ratioParts);
    return result(classification, percentages.map((item) => `${item}%`).join(", "), [
      `Ratio parts are ${ratioParts.join(":")}.`,
      "Each percentage = part / total parts x 100.",
      `Percentages = ${percentages.join("%, ")}%.`,
    ]);
  }

  const total = extractTotal(text);
  if (ratioParts.length >= 2 && total !== undefined) {
    const shares = divideWholeInRatio(total, ratioParts);
    return result(classification, shares.map((share) => round(share, 4)).join(", "), [
      `Ratio parts are ${ratioParts.join(":")}.`,
      `Total parts = ${ratioParts.reduce((acc, part) => acc + part, 0)}.`,
      `One ratio unit = ${total} / ${ratioParts.reduce((acc, part) => acc + part, 0)}.`,
      `Shares = ${shares.map((share) => round(share, 4)).join(", ")}.`,
    ], [`Shares add back to ${round(shares.reduce((acc, share) => acc + share, 0), 4)}.`]);
  }

  const proportion = extractFourNumbers(text);
  if (proportion.length >= 4 || ratioParts.length >= 4) {
    const [a, b, c, d] = proportion.length >= 4 ? proportion : ratioParts;
    const left = a * d;
    const right = b * c;
    return result(classification, Math.abs(left - right) < 1e-9 ? "Equivalent ratios" : "Not equivalent ratios", [
      `Compare ${a}/${b} and ${c}/${d}.`,
      `Cross-products: ${a} x ${d} = ${left}; ${b} x ${c} = ${right}.`,
      Math.abs(left - right) < 1e-9 ? "The cross-products match, so the ratios are equivalent." : "The cross-products do not match, so the ratios are not equivalent.",
      `Simplified forms: ${simplifyRatio([a, b]).join(":")} and ${simplifyRatio([c, d]).join(":")}.`,
    ]);
  }

  const proportionPair = extractDirectInverseValues(text);
  if (proportionPair) {
    if (/inverse|workers|days|speed|time/.test(text)) {
      const value = getInverseProportionValue(proportionPair);
      return result(classification, `${round(value.y2, 4)}`, ["This is inverse proportion, so x x y stays constant.", ...value.steps]);
    }
    const value = getDirectProportionValue(proportionPair);
    return result(classification, `${round(value.y2, 4)}`, ["This is direct proportion, so y/x stays constant.", ...value.steps]);
  }

  if (ratioParts.length >= 2) {
    return result(classification, simplifyRatio(ratioParts).join(":"), [
      `Original ratio: ${ratioParts.join(":")}.`,
      `Simplified ratio: ${simplifyRatio(ratioParts).join(":")}.`,
      "Use simplified ratios to compare proportional situations.",
    ]);
  }

  return result(classification, "Recognized proportional reasoning prompt", [
    "The prompt matches proportional reasoning vocabulary.",
    "Use the dedicated NCERT lab for interactive cross multiplication, map scale, ratio splitting, pie angles, and direct/inverse proportion.",
  ], ["Open /ncert/class-8-proportional-reasoning-2 for the visual workflow."], ["The solver did not find enough numeric details for a single computed answer."]);
}

function result(classification: ProblemClassification, answer: string, steps: string[], verification: string[] = ["Computed using deterministic Grade 8 proportional reasoning formulas."], warnings: string[] = []): ProblemSolverResult {
  return {
    kind: "proportional-reasoning",
    method: "Grade 8 proportional reasoning formulas",
    title: "Proportional Reasoning",
    normalizedInput: classification.normalizedInput,
    result: answer,
    steps,
    assumptions: classification.assumptions,
    verification,
    warnings: [...classification.warnings, ...warnings],
    canCopy: true,
  };
}

function extractRatioParts(text: string) {
  const match = text.match(/(\d+(?:\.\d+)?(?:\s*:\s*\d+(?:\.\d+)?){1,4})/);
  return match ? match[1].split(":").map((part) => Number(part.trim())).filter((part) => Number.isFinite(part) && part > 0) : [];
}

function extractFourNumbers(text: string) {
  return (text.match(/\d+(?:\.\d+)?/g) ?? []).map(Number).filter((value) => Number.isFinite(value) && value > 0).slice(0, 4);
}

function extractTotal(text: string) {
  const match = text.match(/(?:divide|split|share|total|whole)\D{0,20}(\d+(?:\.\d+)?)/) ?? text.match(/(\d+(?:\.\d+)?)\s*(?:in|into)\s*(?:the\s*)?ratio/);
  return match ? Number(match[1]) : undefined;
}

function extractScale(text: string): { denominator: number; mapDistance?: number; actualDistance?: number; actualUnit: "cm" | "m" | "km" } | null {
  const denominator = Number((text.match(/1\s*:\s*(\d+)/) ?? [])[1]);
  if (!Number.isFinite(denominator) || denominator <= 0) return null;
  const mapDistance = Number((text.match(/(\d+(?:\.\d+)?)\s*cm\s*(?:on|in)?\s*(?:the\s*)?map/) ?? text.match(/map\s*(?:distance)?\s*(?:is|=)?\s*(\d+(?:\.\d+)?)\s*cm/) ?? [])[1]);
  const actualMatch = text.match(/(\d+(?:\.\d+)?)\s*(km|m|cm)\s*(?:actual|real|ground)?/);
  return {
    denominator,
    mapDistance: Number.isFinite(mapDistance) ? mapDistance : undefined,
    actualDistance: actualMatch && !/map/.test(actualMatch[0]) ? Number(actualMatch[1]) : undefined,
    actualUnit: (actualMatch?.[2] as "cm" | "m" | "km" | undefined) ?? "km",
  };
}

function extractDirectInverseValues(text: string) {
  const numbers = extractFourNumbers(text);
  if (numbers.length < 3) return null;
  return { x1: numbers[0], y1: numbers[1], x2: numbers[2] };
}
