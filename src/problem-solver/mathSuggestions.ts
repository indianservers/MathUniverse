import { detectMathEducationLevel } from "./intelligence/mathEducationLevel";
import type { MathRecognizedToken, MathSuggestion } from "./intelligence/mathRecognitionTypes";
export type { MathSuggestion } from "./intelligence/mathRecognitionTypes";
export { buildMathSuggestions } from "./intelligence/mathSuggestions";

export type MathEducationLevel = "School" | "Intermediate" | "Engineering";

export function detectEducationLevel(tokens: MathRecognizedToken[]): MathEducationLevel {
  const level = detectMathEducationLevel(tokens);
  if (level === "engineering") return "Engineering";
  if (level === "intermediate") return "Intermediate";
  return "School";
}

export function suggestionMessages(suggestions: MathSuggestion[]) {
  return suggestions.map((suggestion) => suggestion.message);
}
