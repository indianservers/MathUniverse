import type { AngleMode } from "../../../utils/calculator";

export type CalculatorLessonPreset = {
  lessonId: number;
  id: string;
  expression: string;
  angleMode: AngleMode;
  resultLabel: string;
  challengeMode: "result" | "history-count" | "accuracy";
};

const presets = [
  preset(1, "basic-arithmetic", "(12+8)/4"),
  preset(2, "fractions", "1/2+3/4"),
  preset(3, "mixed-numbers", "2+1/3+1+3/4"),
  preset(4, "percentages", "15/100*240"),
  preset(5, "ratios", "24/36"),
  preset(6, "powers-roots", "sqrt(144)+2^3"),
  preset(7, "scientific-notation", "6.02*10^5"),
  preset(8, "logarithms", "log(1000)"),
  preset(9, "exponentials", "2^8"),
  preset(10, "trigonometric-values", "sin(30)+cos(60)", "DEG"),
  preset(11, "inverse-trigonometry", "asin(0.5)", "DEG"),
  preset(12, "hyperbolic-functions", "(exp(1)-exp(-1))/2"),
  preset(13, "factorial-permutation-combination", "factorial(6)"),
  preset(14, "absolute-value", "abs(-12)"),
  preset(15, "rounding-precision", "10/3"),
  preset(16, "constants-library", "pi*2"),
  { ...preset(17, "calculation-history", "7*8"), challengeMode: "history-count" as const, resultLabel: "History rows" },
  { ...preset(18, "exact-decimal-modes", "sqrt(2)"), challengeMode: "accuracy" as const, resultLabel: "Evaluation mode" },
] satisfies CalculatorLessonPreset[];

const byLessonId = new Map(presets.map((item) => [item.lessonId, item]));

export function calculatorLessonPreset(lessonId: number) {
  const value = byLessonId.get(lessonId);
  if (!value) throw new Error(`Missing calculator lesson preset for ${lessonId}`);
  return value;
}

export const calculatorLessonPresetIds = Object.freeze(presets.map((item) => item.lessonId));

function preset(lessonId: number, id: string, expression: string, angleMode: AngleMode = "DEG"): CalculatorLessonPreset {
  return { lessonId, id: `calculator.${id}`, expression, angleMode, resultLabel: "Calculated result", challengeMode: "result" };
}
