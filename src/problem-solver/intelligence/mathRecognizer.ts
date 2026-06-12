import { detectMathEducationLevel } from "./mathEducationLevel";
import { buildMathRecognitionAudit } from "./mathRecognitionAudit";
import type { MathRecognitionResult, MathTokenCategory } from "./mathRecognitionTypes";
import { buildMathSuggestions, suggestionMessages } from "./mathSuggestions";
import { tokenizeMathInput } from "./mathTokenizer";

export function recognizeMathInput(
  input: string,
  possibleProblemType = "Unknown",
  classifierAssumptions: string[] = [],
  classifierWarnings: string[] = [],
): MathRecognitionResult {
  const tokens = tokenizeMathInput(input);
  const suggestions = buildMathSuggestions(input, tokens);
  const suggestionText = suggestionMessages(suggestions, tokens);
  const unknownCount = tokens.filter((token) => token.category === "unknown").length;
  const assumptions = [...classifierAssumptions, ...recognitionAssumptions(tokens)];
  const warnings = [
    ...classifierWarnings,
    ...(unknownCount ? [`${unknownCount} token${unknownCount === 1 ? "" : "s"} need manual interpretation.`] : []),
  ];

  return {
    assumptions: uniqueStrings(assumptions),
    audit: buildMathRecognitionAudit(tokens, suggestionText.length),
    categories: uniqueCategories(tokens.map((token) => token.category)),
    input,
    level: detectMathEducationLevel(tokens),
    possibleProblemType,
    suggestions: suggestionText,
    tokens,
    warnings: uniqueStrings(warnings),
  };
}

function recognitionAssumptions(tokens: ReturnType<typeof tokenizeMathInput>) {
  const hasTrig = tokens.some((token) => token.category === "trigonometry");
  const hasNumber = tokens.some((token) => token.category === "number");
  return hasTrig && hasNumber ? ["Numeric trigonometry inputs are interpreted in degrees unless radians are specified."] : [];
}

function uniqueCategories(categories: MathTokenCategory[]) {
  return [...new Set(categories)];
}

function uniqueStrings(items: string[]) {
  return [...new Set(items)];
}
