import { detectMathEducationLevel } from "./mathEducationLevel";
import { buildMathRecognitionAudit } from "./mathRecognitionAudit";
import type { MathOperationInsight, MathRecognitionResult, MathTokenCategory } from "./mathRecognitionTypes";
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
  const operationInsight = inferOperationInsight(input, possibleProblemType);
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
    operationInsight,
    possibleProblemType,
    suggestions: suggestionText,
    tokens,
    warnings: uniqueStrings(warnings),
  };
}

function inferOperationInsight(input: string, possibleProblemType: string): MathOperationInsight | undefined {
  const cleaned = input.trim().toLowerCase().replace(/\?+$/g, "");
  const numbers = cleaned.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const expression = input.trim();

  if (/\b(sum|add|plus|total)\b/.test(cleaned) && numbers.length >= 2) {
    return { confidence: "high", explanation: "Interpreting the numbers as terms to add.", name: "Addition / Sum", normalizedExpression: numbers.join("+") };
  }
  if (/\b(multiply|multiplication|mul|times|product)\b/.test(cleaned) && numbers.length >= 2) {
    return { confidence: "high", explanation: "Interpreting the numbers as factors to multiply.", name: "Multiplication / Product", normalizedExpression: numbers.join("*") };
  }
  if (/\b(subtract|minus|difference)\b/.test(cleaned) && numbers.length >= 2) {
    const normalizedExpression = /^subtract\b.+\bfrom\b/i.test(expression) ? `${numbers[1]}-${numbers[0]}` : numbers.join("-");
    return { confidence: "high", explanation: "Interpreting the numbers as a subtraction operation.", name: "Subtraction / Difference", normalizedExpression };
  }
  if (/\b(divide|divided|quotient)\b/.test(cleaned) && numbers.length >= 2) {
    return { confidence: "high", explanation: "Interpreting the numbers as a division operation.", name: "Division / Quotient", normalizedExpression: numbers.join("/") };
  }
  if (/\b(gcd|hcf|greatest common divisor)\b/.test(cleaned) && numbers.length >= 2) {
    return { confidence: "high", explanation: "Interpreting integer inputs as a greatest common divisor request.", name: "Greatest Common Divisor", normalizedExpression: `gcd(${numbers.join(",")})` };
  }
  if (/\b(lcm|least common multiple)\b/.test(cleaned) && numbers.length >= 2) {
    return { confidence: "high", explanation: "Interpreting integer inputs as a least common multiple request.", name: "Least Common Multiple", normalizedExpression: `lcm(${numbers.join(",")})` };
  }
  if (/\b(percent|percentage)\b|%\s+of\b/.test(cleaned) && numbers.length >= 2) {
    return { confidence: "high", explanation: "Interpreting the first value as a percent of the second value.", name: "Percent Of", normalizedExpression: `percent(${numbers[0]},${numbers[1]})` };
  }
  if (/\bfactorial\b|^\s*\d+!\s*$/.test(cleaned) && numbers.length >= 1) {
    return { confidence: "high", explanation: "Interpreting the integer as a factorial input.", name: "Factorial", normalizedExpression: `${numbers[0]}!` };
  }
  if (possibleProblemType !== "Unsupported") {
    return { confidence: "medium", explanation: `The classifier selected ${possibleProblemType}.`, name: possibleProblemType };
  }
  return undefined;
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
