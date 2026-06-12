import type { MathRecognizedToken, MathSuggestion } from "./mathRecognitionTypes";

export function buildMathSuggestions(input: string, tokens: MathRecognizedToken[]): MathSuggestion[] {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  const suggestions: MathSuggestion[] = [];

  addAutocompleteSuggestion(lower, suggestions);
  addMissingParenthesesSuggestion(lower, suggestions);
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

export function suggestionMessages(suggestions: MathSuggestion[], tokens: MathRecognizedToken[]) {
  return uniqueStrings([...suggestions.map((suggestion) => suggestion.message), ...tokens.map((token) => token.suggestion).filter(Boolean) as string[]]);
}

function addAutocompleteSuggestion(lower: string, suggestions: MathSuggestion[]) {
  const lastWord = lower.match(/[a-z]+$/)?.[0] ?? "";
  const completions: Record<string, { replacement: string; title: string }> = {
    der: { replacement: "derivative of", title: "Complete derivative command" },
    int: { replacement: "integrate", title: "Complete integral command" },
    sq: { replacement: "sqrt()", title: "Complete square root" },
    ta: { replacement: "tan()", title: "Complete tangent" },
  };
  const completion = completions[lastWord];
  if (!completion) return;
  suggestions.push({ id: `autocomplete-${lastWord}`, message: `Try ${completion.replacement}.`, replacement: completion.replacement, severity: "info", title: completion.title });
}

function addMissingParenthesesSuggestion(lower: string, suggestions: MathSuggestion[]) {
  for (const fn of ["sqrt", "sin", "cos", "tan", "log", "ln"]) {
    const match = lower.match(new RegExp(`^${fn}\\s+(-?\\d+(?:\\.\\d+)?)$`));
    if (!match) continue;
    const replacement = `${fn}(${match[1]})`;
    suggestions.push({ id: `parentheses-${fn}`, message: `Did you mean ${replacement}?`, replacement, severity: "warning", title: "Missing parentheses" });
  }
}

function addMultiplicationHint(input: string, suggestions: MathSuggestion[]) {
  if (/(^|[^\w.])\d+[a-zA-Z]/.test(input)) {
    suggestions.push({ id: "implicit-number-variable", message: "Interpreted as multiplication, for example 2x means 2*x.", severity: "info", title: "Implicit multiplication" });
  }
  if (/\d+\s*\(/.test(input)) {
    suggestions.push({ id: "implicit-number-parentheses", message: "Interpreted as multiplication, for example 3(x+1) means 3*(x+1).", severity: "info", title: "Implicit multiplication" });
  }
}

function addTrigWarning(tokens: MathRecognizedToken[], lower: string, suggestions: MathSuggestion[]) {
  const hasTrig = tokens.some((token) => token.category === "trigonometry");
  const hasNumeric = tokens.some((token) => token.category === "number");
  const hasAngleUnit = /\b(rad|radian|radians|degree|degrees)\b/.test(lower);
  if (hasTrig && hasNumeric && !hasAngleUnit) {
    suggestions.push({ id: "trig-degree-assumption", message: "Trig numeric input is interpreted in degrees unless radians are specified.", severity: "info", title: "Angle unit assumption" });
  }
}

function addStatisticsHint(input: string, lower: string, suggestions: MathSuggestion[]) {
  if (!/^average\b/.test(lower)) return;
  const numbers = input.match(/-?\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length < 2) return;
  const replacement = `mean of ${numbers.join(", ")}`;
  suggestions.push({ id: "average-to-mean", message: `Try ${replacement}.`, replacement, severity: "info", title: "Statistics syntax" });
}

function addMatrixHint(input: string, lower: string, suggestions: MathSuggestion[]) {
  if (!/^det\b/.test(lower) || input.includes("[[")) return;
  const numbers = input.match(/-?\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length !== 4) return;
  const replacement = `determinant [[${numbers[0]},${numbers[1]}],[${numbers[2]},${numbers[3]}]]`;
  suggestions.push({ id: "det-matrix-format", message: `Try ${replacement}.`, replacement, severity: "info", title: "Matrix syntax" });
}

function addCalculusHints(input: string, lower: string, suggestions: MathSuggestion[]) {
  const derivativeMatch = input.match(/^d\s+(.+)/i);
  if (derivativeMatch) {
    const replacement = `derivative of ${derivativeMatch[1].trim()}`;
    suggestions.push({ id: "derivative-command", message: `Try ${replacement}.`, replacement, severity: "info", title: "Derivative syntax" });
  }

  const limitMatch = input.match(/^lim\s+([a-z])\s+(-?\d+(?:\.\d+)?)\s+(.+)/i);
  if (limitMatch && !lower.includes("->")) {
    const replacement = `limit ${limitMatch[1]}->${limitMatch[2]} ${limitMatch[3]}`;
    suggestions.push({ id: "limit-arrow", message: `Try ${replacement}.`, replacement, severity: "info", title: "Limit syntax" });
  }
}

function addEngineeringHint(tokens: MathRecognizedToken[], suggestions: MathSuggestion[]) {
  const engineering = tokens.find((token) => token.category === "engineering");
  if (!engineering) return;
  suggestions.push({ id: "engineering-recognized", message: `Recognized ${engineering.label}. Full solving for this topic may be a future feature.`, severity: "info", title: "Engineering mathematics" });
}

function addWordProblemHint(tokens: MathRecognizedToken[], lower: string, suggestions: MathSuggestion[]) {
  const wordProblemCount = tokens.filter((token) => token.category === "word-problem").length;
  if (wordProblemCount === 0 && !/\b(train|travels|twice|thrice|shared equally|age problem)\b/.test(lower)) return;
  suggestions.push({ id: "word-problem-conversion", message: "Recognized word-problem language. Try converting it into an equation first.", severity: "info", title: "Word problem language" });
}

function addUnknownWordHint(tokens: MathRecognizedToken[], suggestions: MathSuggestion[]) {
  const unknownCount = tokens.filter((token) => token.category === "unknown").length;
  if (tokens.length === 0 || (unknownCount < 2 && unknownCount / tokens.length < 0.45)) return;
  suggestions.push({ id: "unknown-dominant", message: "Some words were not recognized as math keywords. Try a clearer mathematical expression.", severity: "warning", title: "Unrecognized words" });
}

function uniqueSuggestions(suggestions: MathSuggestion[]) {
  return [...new Map(suggestions.map((suggestion) => [suggestion.id, suggestion])).values()];
}

function uniqueStrings(items: string[]) {
  return [...new Set(items)];
}
