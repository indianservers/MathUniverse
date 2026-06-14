export type MathTokenCategory =
  | "arithmetic"
  | "number"
  | "grouping"
  | "algebra"
  | "power-root"
  | "trigonometry"
  | "log-exp"
  | "calculus"
  | "coordinate-geometry"
  | "geometry"
  | "statistics"
  | "probability"
  | "matrix"
  | "complex"
  | "discrete"
  | "engineering"
  | "unit"
  | "finance"
  | "word-problem"
  | "constant"
  | "relation"
  | "variable"
  | "unknown";

export type MathRecognitionLevel = "school" | "intermediate" | "engineering";
export type MathTokenConfidence = "high" | "medium" | "low";

export interface MathKeywordDefinition {
  keyword: string;
  normalized: string;
  category: MathTokenCategory;
  label: string;
  description: string;
  aliases?: string[];
  level: MathRecognitionLevel;
  examples?: string[];
  suggestion?: string;
}

export interface MathRecognizedToken {
  text: string;
  normalized: string;
  category: MathTokenCategory;
  label: string;
  description: string;
  start: number;
  end: number;
  confidence: MathTokenConfidence;
  level: MathRecognitionLevel;
  suggestion?: string;
}

export interface MathRecognitionResult {
  input: string;
  tokens: MathRecognizedToken[];
  categories: MathTokenCategory[];
  level: MathRecognitionLevel;
  operationInsight?: MathOperationInsight;
  possibleProblemType: string;
  assumptions: string[];
  warnings: string[];
  suggestions: string[];
  audit: MathRecognitionAudit;
}

export interface MathOperationInsight {
  confidence: MathTokenConfidence;
  explanation: string;
  name: string;
  normalizedExpression?: string;
}

export interface MathRecognitionAudit {
  totalTokens: number;
  recognizedTokens: number;
  unknownTokens: number;
  recognitionRate: number;
  matchedKeywords: string[];
  unmatchedSegments: string[];
  detectedFunctions: string[];
  detectedSymbols: string[];
  detectedStructures: string[];
  suggestionsGenerated: number;
  confidenceSummary: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface MathSuggestion {
  id: string;
  title: string;
  message: string;
  replacement?: string;
  severity: "info" | "warning";
}
