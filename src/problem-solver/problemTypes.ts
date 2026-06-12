export type ProblemIntentKind =
  | "linear-equation"
  | "quadratic-equation"
  | "polynomial-equation"
  | "simplify"
  | "factor"
  | "expand"
  | "evaluate"
  | "derivative"
  | "integral"
  | "limit"
  | "system"
  | "statistics"
  | "matrix"
  | "unsupported";

export type ProblemConfidence = "high" | "medium" | "low";

export interface ProblemClassification {
  kind: ProblemIntentKind;
  rawInput: string;
  normalizedInput: string;
  expression?: string;
  variable?: string;
  variables?: string[];
  confidence: ProblemConfidence;
  assumptions: string[];
  warnings: string[];
  reason: string;
}

export interface ProblemSolverResult {
  kind: ProblemIntentKind;
  method?: string;
  title: string;
  normalizedInput: string;
  result?: string;
  restrictions?: string[];
  steps: string[];
  assumptions: string[];
  verification?: string[];
  warnings: string[];
  canCopy: boolean;
}
