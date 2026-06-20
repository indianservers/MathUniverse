export type SolverConfidence = "verified" | "partially-supported" | "unsupported" | "ambiguous" | "error";

export interface SolverStep {
  title: string;
  explanation: string;
  expression?: string;
}

export interface SolverResult {
  input: string;
  normalizedInput?: string;
  answer?: string;
  exactAnswer?: string;
  approximateAnswer?: string;
  steps?: SolverStep[];
  confidence: SolverConfidence;
  warnings?: string[];
  unsupportedReason?: string;
  verification?: {
    method: string;
    passed: boolean;
    notes?: string[];
  };
  metadata?: {
    solverFamily?: string;
    topic?: string;
    detectedIntent?: string;
  };
}

export const supportedExamples = [
  "2x + 5 = 15",
  "0x + 5 = 5",
  "0x + 5 = 8",
  "x + 1 = x + 2",
  "x^2 - 5x + 6 = 0",
  "x^2 - 2x + 1 = 0",
  "simplify (x^2 - 1)/(x - 1)",
  "factor x^2 - 5x + 6",
  "expand (x+1)^2",
  "2 + 3 * 4",
  "sqrt(34)",
  "sin(30)",
  "cos(60)",
  "tan(45)",
  "log(100)",
  "ln(e)",
  "derivative of x^2",
  "integrate 2x",
  "limit x->0 sin(x)/x",
  "mean of 4, 6, 8, 10",
  "determinant [[1,2],[3,4]]",
] as const;

export function createUnsupportedResult(
  input: string,
  reason: string,
  metadata?: SolverResult["metadata"],
): SolverResult {
  return {
    input,
    confidence: "unsupported",
    unsupportedReason: reason,
    warnings: [reason],
    verification: {
      method: "Safe unsupported gate",
      passed: true,
      notes: ["No answer was generated for an unsupported or ambiguous request."],
    },
    metadata,
  };
}
