import { solveAlgebraSteps } from "./algebraStepSolver";
import { solveCalculus } from "./calculusSolver";
import { solveExpressionOperation } from "./expressionOperationSolver";
import { solveFractal } from "./fractalSolver";
import { solveMatrix } from "./matrixSolver";
import { classifyProblem } from "./problemClassifier";
import type { ProblemClassification, ProblemIntentKind, ProblemSolverResult } from "./problemTypes";
import { solveStatistics } from "./statisticsSolver";
import { solveSystem } from "./systemSolver";
import type { SolverConfidence, SolverResult, SolverStep } from "./types/solverResult";
import { createUnsupportedResult } from "./types/solverResult";
import { solveWordProblem } from "./wordProblemSolver";
import { symbolicSolve, trySymbolic } from "../utils/symbolic";

const equationKinds: ProblemIntentKind[] = ["linear-equation", "quadratic-equation", "polynomial-equation"];

export interface TrustedProblemSolverOutput {
  classification: ProblemClassification;
  result: ProblemSolverResult;
  trust: SolverResult;
}

export function solveProblem(input: string): TrustedProblemSolverOutput {
  const classification = classifyProblem(input);
  const result = buildSolverResult(classification);
  const trust = toSolverResult(classification, result);
  return {
    classification,
    result: {
      ...result,
      confidenceStatus: trust.confidence,
      trust,
      unsupportedReason: trust.unsupportedReason,
    },
    trust,
  };
}

export function buildSolverResult(classification: ProblemClassification): ProblemSolverResult {
  if (equationKinds.includes(classification.kind)) {
    const algebra = solveAlgebraSteps(classification.normalizedInput);
    if (algebra) {
      return {
        kind: classification.kind,
        method: algebra.method,
        title: algebra.kind === "rational" ? "Rational Equation" : labelForKind(classification.kind),
        normalizedInput: classification.normalizedInput,
        result: algebra.finalAnswer,
        restrictions: algebra.restrictions,
        steps: algebra.steps,
        assumptions: classification.assumptions,
        verification: algebra.verification,
        warnings: [...classification.warnings, ...algebra.warnings],
        canCopy: true,
      };
    }

    const solution = trySymbolic(() => symbolicSolve(classification.normalizedInput, classification.variable ?? "x"));
    if (solution) {
      return {
        kind: classification.kind,
        method: "CAS fallback",
        title: labelForKind(classification.kind),
        normalizedInput: classification.normalizedInput,
        result: solution.result,
        restrictions: solution.restrictions,
        steps: [
          "CAS fallback: the deterministic algebra step solver does not yet support this exact equation form.",
          "The following steps are CAS wrapper steps, not a human derivation.",
          ...solution.steps,
        ],
        assumptions: classification.assumptions,
        verification: Array.isArray(solution.verification) ? solution.verification : undefined,
        warnings: [...classification.warnings, ...(solution.warnings ?? [])],
        canCopy: true,
      };
    }
    return safeResult(classification, "The equation was detected, but the symbolic solver could not produce a safe result.");
  }

  if (classification.kind === "unsupported") {
    return {
      kind: "unsupported",
      title: "Unsupported Problem Type",
      normalizedInput: classification.normalizedInput,
      result: "This problem type is not yet supported.",
      method: "Safe unsupported handling",
      steps: [
        "The input was classified before solving.",
        classification.reason,
        "No solver was called because the intent is unclear or not supported in the certified solver scope.",
      ],
      assumptions: classification.assumptions,
      warnings: classification.warnings,
      canCopy: false,
    };
  }

  const expressionResult = solveExpressionOperation(classification);
  if (expressionResult) return expressionResult;

  const calculusResult = solveCalculus(classification);
  if (calculusResult) return calculusResult;

  const systemResult = solveSystem(classification);
  if (systemResult) return systemResult;

  const statisticsResult = solveStatistics(classification);
  if (statisticsResult) return statisticsResult;

  const matrixResult = solveMatrix(classification);
  if (matrixResult) return matrixResult;

  const fractalResult = solveFractal(classification);
  if (fractalResult) return fractalResult;

  const wordProblemResult = solveWordProblem(classification);
  if (wordProblemResult) return wordProblemResult;

  return safeResult(classification, "This operation is recognized, but no certified deterministic solver is available yet.");
}

export function toSolverResult(classification: ProblemClassification, result: ProblemSolverResult): SolverResult {
  const unsupportedReason = unsupportedReasonFor(classification, result);
  if (unsupportedReason) {
    return createUnsupportedResult(classification.rawInput, unsupportedReason, {
      detectedIntent: classification.kind,
      solverFamily: result.method,
      topic: labelForKind(classification.kind),
    });
  }

  const confidence = confidenceFor(result);
  const verificationNotes = result.verification?.length ? result.verification : verificationNotesFor(result);
  return {
    input: classification.rawInput,
    normalizedInput: classification.normalizedInput,
    answer: result.result,
    exactAnswer: result.result,
    steps: result.steps.map((step, index): SolverStep => ({
      title: `Step ${index + 1}`,
      explanation: step,
    })),
    confidence,
    warnings: result.warnings,
    verification: {
      method: verificationMethodFor(result),
      passed: confidence === "verified" || confidence === "partially-supported",
      notes: verificationNotes,
    },
    metadata: {
      detectedIntent: classification.kind,
      solverFamily: result.method,
      topic: labelForKind(classification.kind),
    },
  };
}

function safeResult(classification: ProblemClassification, message: string): ProblemSolverResult {
  return {
    kind: classification.kind,
    method: "Safe classification",
    title: `Detected: ${labelForKind(classification.kind)}`,
    normalizedInput: classification.normalizedInput,
    result: `Detected: ${labelForKind(classification.kind)}`,
    steps: [
      `Detected: ${labelForKind(classification.kind)}.`,
      classification.expression ? `Expression: ${classification.expression}.` : `Normalized input: ${classification.normalizedInput}.`,
      message,
      "No equation-solving fallback was used.",
    ],
    assumptions: classification.assumptions,
    warnings: classification.warnings,
    canCopy: false,
  };
}

function unsupportedReasonFor(classification: ProblemClassification, result: ProblemSolverResult) {
  if (classification.kind === "unsupported") return classification.reason || "Input does not match the certified supported solver scope.";
  if (!result.canCopy && result.method === "Safe classification") return "Recognized input, but no certified deterministic solver is available for this form.";
  if (!result.canCopy && /invalid|undefined|no real|cannot compute/i.test(result.result ?? "")) return result.result ?? "The result is not defined in the supported real-number scope.";
  return "";
}

function confidenceFor(result: ProblemSolverResult): SolverConfidence {
  if (!result.canCopy) return "unsupported";
  if (/CAS/i.test(result.method ?? "")) return "partially-supported";
  if (result.warnings.some((warning) => /not available|limited|not expanded/i.test(warning))) return "partially-supported";
  return "verified";
}

function verificationMethodFor(result: ProblemSolverResult) {
  if (result.verification?.length) return "Substitution or deterministic check";
  if (/CAS/i.test(result.method ?? "")) return "CAS-assisted guardrail";
  return "Deterministic solver guardrail";
}

function verificationNotesFor(result: ProblemSolverResult) {
  if (!result.canCopy) return ["No copyable answer was produced."];
  if (/CAS/i.test(result.method ?? "")) return ["Answer is marked partially supported because the human derivation is not fully deterministic."];
  return ["A deterministic solver produced the answer inside the supported scope."];
}

function labelForKind(kind: ProblemIntentKind) {
  return kind.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
