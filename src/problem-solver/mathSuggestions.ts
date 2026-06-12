import type { MathRecognizedToken, MathTokenCategory } from "./mathKeywordRecognizer";

export type MathEducationLevel = "School" | "Intermediate" | "Engineering";

export interface MathSuggestion {
  id: string;
  title: string;
  message: string;
  replacement?: string;
  severity: "info" | "warning";
}

const engineeringCategories = new Set<MathTokenCategory>(["engineering"]);
const intermediateCategories = new Set<MathTokenCategory>(["calculus", "trigonometry", "log-exp", "matrix", "complex", "probability"]);

export function detectEducationLevel(tokens: MathRecognizedToken[]): MathEducationLevel {
  if (tokens.some((token) => engineeringCategories.has(token.category))) return "Engineering";
  if (tokens.some((token) => intermediateCategories.has(token.category))) return "Intermediate";
  return "School";
}

export function buildMathSuggestions(input: string, tokens: MathRecognizedToken[]): MathSuggestion[] {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  const suggestions: MathSuggestion[] = [];

  addAutocompleteSuggestion(lower, suggestions);
  addMissingParenthesesSuggestion(trimmed, lower, suggestions);
  addMultiplicationHint(trimmed, suggestions);
  addTrigWarning(tokens, lower, suggestions);
  addStatisticsHint(trimmed, lower, suggestions);
  addMatrixHint(trimmed, lower, suggestions);
  addCalculusHints(trimmed, lower, suggestions);
  addEngineeringHint(tokens, suggestions);
  addWordProblemHint(tokens, lower, suggestions);
  addUnknownWordHint(tokens, suggestions);

  return uniqueSuggestions(suggestions);
}

function addAutocompleteSuggestion(lower: string, suggestions: MathSuggestion[]) {
  const lastWord = lower.match(/[a-z]+$/)?.[0] ?? "";
  const completions: Record<string, { replacement: string; title: string }> = {
    sq: { replacement: "sqrt()", title: "Complete square root" },
    ta: { replacement: "tan()", title: "Complete tangent" },
    der: { replacement: "derivative of", title: "Complete derivative command" },
    int: { replacement: "integrate", title: "Complete integral command" },
  };
  const completion = completions[lastWord];
  if (!completion) return;
  suggestions.push({
    id: `autocomplete-${lastWord}`,
    title: completion.title,
    message: `Try ${completion.replacement}.`,
    replacement: completion.replacement,
    severity: "info",
  });
}

function addMissingParenthesesSuggestion(input: string, lower: string, suggestions: MathSuggestion[]) {
  const functions = ["sqrt", "sin", "cos", "tan", "log", "ln"];
  for (const fn of functions) {
    const match = lower.match(new RegExp(`^${fn}\\s+(-?\\d+(?:\\.\\d+)?)$`));
    if (!match) continue;
    const replacement = `${fn}(${match[1]})`;
    suggestions.push({
      id: `parentheses-${fn}`,
      title: "Missing parentheses",
      message: `Did you mean ${replacement}?`,
      replacement,
      severity: "warning",
    });
  }

  if (/^absolute value\s+/.test(lower)) {
    suggestions.push({
      id: "absolute-value-bars",
      title: "Absolute value notation",
      message: "Use vertical bars for absolute value, for example |x - 3|.",
      severity: "info",
    });
  }
}

function addMultiplicationHint(input: string, suggestions: MathSuggestion[]) {
  if (/(^|[^\w.])\d+[a-zA-Z]/.test(input)) {
    suggestions.push({
      id: "implicit-number-variable",
      title: "Implicit multiplication",
      message: "Interpreted as multiplication, for example 2x means 2*x.",
      severity: "info",
    });
  }
  if (/\d+\s*\(/.test(input)) {
    suggestions.push({
      id: "implicit-number-parentheses",
      title: "Implicit multiplication",
      message: "Interpreted as multiplication, for example 3(x+1) means 3*(x+1).",
      severity: "info",
    });
  }
}

function addTrigWarning(tokens: MathRecognizedToken[], lower: string, suggestions: MathSuggestion[]) {
  const hasTrig = tokens.some((token) => token.category === "trigonometry");
  const hasNumeric = tokens.some((token) => token.category === "number");
  const hasAngleUnit = /\b(rad|radian|radians|degree|degrees)\b/.test(lower);
  if (!hasTrig || !hasNumeric || hasAngleUnit) return;
  suggestions.push({
    id: "trig-degree-assumption",
    title: "Angle unit assumption",
    message: "Trig numeric input is interpreted in degrees unless radians are specified.",
    severity: "info",
  });
}

function addStatisticsHint(input: string, lower: string, suggestions: MathSuggestion[]) {
  if (!/^average\b/.test(lower)) return;
  const numbers = input.match(/-?\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length < 2) return;
  const replacement = `mean of ${numbers.join(", ")}`;
  suggestions.push({
    id: "average-to-mean",
    title: "Statistics syntax",
    message: `Try ${replacement}.`,
    replacement,
    severity: "info",
  });
}

function addMatrixHint(input: string, lower: string, suggestions: MathSuggestion[]) {
  if (!/^det\b/.test(lower) || input.includes("[[")) return;
  const numbers = input.match(/-?\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length !== 4) return;
  const replacement = `determinant [[${numbers[0]},${numbers[1]}],[${numbers[2]},${numbers[3]}]]`;
  suggestions.push({
    id: "det-matrix-format",
    title: "Matrix syntax",
    message: `Try ${replacement}.`,
    replacement,
    severity: "info",
  });
}

function addCalculusHints(input: string, lower: string, suggestions: MathSuggestion[]) {
  const derivativeMatch = input.match(/^d\s+(.+)/i);
  if (derivativeMatch) {
    const replacement = `derivative of ${derivativeMatch[1].trim()}`;
    suggestions.push({
      id: "derivative-command",
      title: "Derivative syntax",
      message: `Try ${replacement}.`,
      replacement,
      severity: "info",
    });
  }

  const limitMatch = input.match(/^lim\s+([a-z])\s+(-?\d+(?:\.\d+)?)\s+(.+)/i);
  if (limitMatch && !lower.includes("->")) {
    const replacement = `limit ${limitMatch[1]}->${limitMatch[2]} ${limitMatch[3]}`;
    suggestions.push({
      id: "limit-arrow",
      title: "Limit syntax",
      message: `Try ${replacement}.`,
      replacement,
      severity: "info",
    });
  }
}

function addEngineeringHint(tokens: MathRecognizedToken[], suggestions: MathSuggestion[]) {
  const engineering = tokens.find((token) => token.category === "engineering");
  if (!engineering) return;
  suggestions.push({
    id: "engineering-recognized",
    title: "Engineering mathematics",
    message: `Recognized ${engineering.label}. Full solving for this topic may be a future feature.`,
    severity: "info",
  });
}

function addWordProblemHint(tokens: MathRecognizedToken[], lower: string, suggestions: MathSuggestion[]) {
  const wordProblemCount = tokens.filter((token) => token.category === "word-problem").length;
  if (wordProblemCount === 0 && !/\b(train|travels|twice|thrice|shared equally|age problem)\b/.test(lower)) return;
  suggestions.push({
    id: "word-problem-conversion",
    title: "Word problem language",
    message: "Recognized word-problem language. Try converting it into an equation first.",
    severity: "info",
  });
}

function addUnknownWordHint(tokens: MathRecognizedToken[], suggestions: MathSuggestion[]) {
  const unknownCount = tokens.filter((token) => token.category === "unknown").length;
  if (tokens.length === 0 || (unknownCount < 2 && unknownCount / tokens.length < 0.45)) return;
  suggestions.push({
    id: "unknown-dominant",
    title: "Unrecognized words",
    message: "Some words were not recognized as math keywords. Try a clearer mathematical expression.",
    severity: "warning",
  });
}

function uniqueSuggestions(suggestions: MathSuggestion[]) {
  return [...new Map(suggestions.map((suggestion) => [suggestion.id, suggestion])).values()];
}
