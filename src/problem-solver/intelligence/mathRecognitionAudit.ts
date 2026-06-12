import type { MathRecognizedToken, MathRecognitionAudit } from "./mathRecognitionTypes";

const functionCategories = new Set(["power-root", "trigonometry", "log-exp", "calculus", "statistics", "matrix", "engineering"]);

export function buildMathRecognitionAudit(tokens: MathRecognizedToken[], suggestionsGenerated: number): MathRecognitionAudit {
  const unknownTokens = tokens.filter((token) => token.category === "unknown");
  const recognizedTokens = tokens.length - unknownTokens.length;

  return {
    confidenceSummary: {
      high: tokens.filter((token) => token.confidence === "high").length,
      low: tokens.filter((token) => token.confidence === "low").length,
      medium: tokens.filter((token) => token.confidence === "medium").length,
    },
    detectedFunctions: tokens.filter((token) => functionCategories.has(token.category)).map((token) => token.text),
    detectedStructures: detectedStructures(tokens),
    detectedSymbols: tokens.filter((token) => token.text.length === 1 && !/[A-Za-z0-9]/.test(token.text)).map((token) => token.text),
    matchedKeywords: tokens.filter((token) => token.category !== "number" && token.category !== "unknown" && token.category !== "variable").map((token) => token.text),
    recognitionRate: tokens.length ? recognizedTokens / tokens.length : 0,
    recognizedTokens,
    suggestionsGenerated,
    totalTokens: tokens.length,
    unknownTokens: unknownTokens.length,
    unmatchedSegments: unknownTokens.map((token) => token.text),
  };
}

function detectedStructures(tokens: MathRecognizedToken[]) {
  const categories = new Set(tokens.map((token) => token.category));
  const structures: string[] = [];
  if (categories.has("relation") && categories.has("variable")) structures.push("equation-or-inequality");
  if (categories.has("matrix") || tokens.some((token) => token.text === "[")) structures.push("matrix-like");
  if (categories.has("trigonometry")) structures.push("trigonometric-expression");
  if (categories.has("calculus")) structures.push("calculus-command");
  if (categories.has("statistics")) structures.push("statistics-query");
  if (categories.has("engineering")) structures.push("engineering-math-query");
  if (categories.has("word-problem")) structures.push("word-problem-language");
  return structures;
}
