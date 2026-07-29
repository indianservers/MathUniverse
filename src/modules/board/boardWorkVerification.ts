import { analyzeBoardExpression } from "./boardMathAnalyzer";
import type {
  BoardElement,
  BoardMisconception,
  BoardRelationship,
  BoardSolutionSequence,
  BoardSolutionStepElement,
  BoardWorkVerificationResult,
  MathExpressionElement,
} from "./types";

export function orderMathElements(elements: MathExpressionElement[]) {
  return [...elements].sort((left, right) => {
    const verticalDistance = left.bounds.y - right.bounds.y;
    if (Math.abs(verticalDistance) > Math.min(left.bounds.height, right.bounds.height) * 0.45) return verticalDistance;
    return left.bounds.x - right.bounds.x;
  });
}

export function createSolutionSequence(elements: MathExpressionElement[]) {
  const ordered = orderMathElements(elements);
  if (ordered.length < 2) throw new Error("Select at least two mathematical expressions.");
  const sequenceId = `sequence-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const steps: BoardSolutionStepElement[] = ordered.map((element, order) => ({
    id: `solution-step-${Date.now()}-${order}`,
    type: "solution-step",
    sequenceId,
    order,
    latex: element.latex,
    normalizedExpression: element.normalizedExpression,
    sourceStrokeIds: element.sourceStrokeIds,
    recognitionConfidence: element.recognitionConfidence,
    bounds: element.bounds,
    createdAt: new Date().toISOString(),
  }));
  const sequence: BoardSolutionSequence = {
    id: sequenceId,
    sourceStrokeIds: [...new Set(ordered.flatMap((element) => element.sourceStrokeIds))],
    orderedStepIds: steps.map((step) => step.id),
    problemElementId: ordered[0]?.id,
    finalAnswerElementId: ordered.at(-1)?.id,
    orientation: detectOrientation(ordered),
    recognitionConfidence: average(ordered.map((element) => element.recognitionConfidence).filter((value): value is number => typeof value === "number")),
  };
  const relationships: BoardRelationship[] = steps.map((step, index) => ({
    id: `relationship-sequence-${Date.now()}-${index}`,
    type: index === 0 ? "part-of-sequence" : "next-step-of",
    sourceElementId: index === 0 ? ordered[0].id : steps[index - 1].id,
    targetElementId: step.id,
    createdAt: new Date().toISOString(),
  }));
  return { sequence, steps, relationships };
}

export async function verifySolutionSequence(sequence: BoardSolutionSequence, elements: BoardElement[]): Promise<BoardWorkVerificationResult> {
  const steps = sequence.orderedStepIds
    .map((id) => elements.find((element): element is BoardSolutionStepElement => element.id === id && element.type === "solution-step"))
    .filter((element): element is BoardSolutionStepElement => Boolean(element))
    .sort((left, right) => left.order - right.order);
  if (steps.length < 2) {
    return {
      sequenceId: sequence.id,
      overallStatus: "incomplete",
      verifiedSteps: steps.map((step) => ({ stepId: step.id, status: "unverified" })),
      finalAnswerStatus: "not-reached",
      warnings: ["At least two recognized steps are required."],
    };
  }

  const verifiedSteps: BoardWorkVerificationResult["verifiedSteps"] = [{
    stepId: steps[0].id,
    status: steps[0].recognitionConfidence !== undefined && steps[0].recognitionConfidence < 0.55 ? "ambiguous" : "valid",
    explanation: "Starting expression.",
    recognitionIssue: steps[0].recognitionConfidence !== undefined && steps[0].recognitionConfidence < 0.55,
  }];
  let firstInvalidStepId: string | undefined;
  for (let index = 1; index < steps.length; index += 1) {
    const previous = steps[index - 1];
    const current = steps[index];
    if (current.recognitionConfidence !== undefined && current.recognitionConfidence < 0.55) {
      verifiedSteps.push({
        stepId: current.id,
        previousStepId: previous.id,
        status: "ambiguous",
        explanation: "Recognition confidence is too low to judge this step safely.",
        recognitionIssue: true,
      });
      continue;
    }
    const verification = await verifyTransition(previous.latex, current.latex);
    verifiedSteps.push({
      stepId: current.id,
      previousStepId: previous.id,
      status: verification.valid ? "valid" : "invalid",
      ruleApplied: verification.method,
      explanation: verification.explanation,
    });
    if (!verification.valid && !firstInvalidStepId) firstInvalidStepId = current.id;
  }
  const misconceptions = firstInvalidStepId
    ? detectMisconceptions(steps.find((step) => step.id === firstInvalidStepId)!, steps[steps.findIndex((step) => step.id === firstInvalidStepId) - 1])
    : [];
  const hasAmbiguous = verifiedSteps.some((step) => step.status === "ambiguous");
  return {
    sequenceId: sequence.id,
    overallStatus: firstInvalidStepId ? "incorrect" : hasAmbiguous ? "ambiguous" : "correct",
    verifiedSteps,
    firstInvalidStepId,
    finalAnswerStatus: firstInvalidStepId ? "incorrect" : hasAmbiguous ? "ambiguous" : "correct",
    misconceptions,
  };
}

export async function verifyTransition(previous: string, current: string) {
  const left = stripLeadingEquality(previous);
  const right = stripLeadingEquality(current);
  const previousAnalysis = analyzeBoardExpression(left);
  const currentAnalysis = analyzeBoardExpression(right);
  if (previousAnalysis.classification === "equation" && currentAnalysis.classification === "equation") {
    const { solveProblem } = await import("../../problem-solver/problemSolverEngine");
    const previousResult = solveProblem(previousAnalysis.engineExpression).result.result;
    const currentResult = solveProblem(currentAnalysis.engineExpression).result.result;
    const valid = Boolean(previousResult && currentResult && normalizeResult(previousResult) === normalizeResult(currentResult));
    return {
      valid,
      method: "Existing equation solver solution-set comparison",
      explanation: valid ? "Both equations have the same verified solution set." : "This transformation changes the verified solution set.",
    };
  }
  const { symbolicVerifyIdentity } = await import("../../utils/symbolic");
  const variable = previousAnalysis.variables[0] ?? currentAnalysis.variables[0] ?? "x";
  const result = symbolicVerifyIdentity(previousAnalysis.engineExpression, currentAnalysis.engineExpression, variable);
  return {
    valid: result.verification.equivalent,
    method: "Existing symbolic equivalence engine",
    explanation: result.verification.equivalent ? "The expressions are mathematically equivalent." : result.detail,
  };
}

export function applyVerification(elements: BoardElement[], result: BoardWorkVerificationResult) {
  const byId = new Map(result.verifiedSteps.map((step) => [step.stepId, step]));
  return elements.map((element) => {
    if (element.type !== "solution-step") return element;
    const verification = byId.get(element.id);
    return verification ? {
      ...element,
      verificationStatus: verification.status,
      verificationExplanation: verification.explanation,
    } : element;
  });
}

function detectMisconceptions(current: BoardSolutionStepElement, previous?: BoardSolutionStepElement): BoardMisconception[] {
  if (!previous) return [];
  const pair = `${previous.latex} -> ${current.latex}`;
  const patterns: Array<{ pattern: RegExp; code: string; title: string; hint: string }> = [
    { pattern: /[+-].*\([^)]*[+-][^)]*\).*(?:->|=).*[+-]\w+\s*[+-]\s*\d+/i, code: "sign-distribution", title: "Check sign distribution", hint: "Distribute the outside sign to every term in the parentheses." },
    { pattern: /x\^?\d?.*sin.*(?:->|=).*(?:cos.*sin|sin.*sin)/i, code: "product-rule", title: "Possible product-rule error", hint: "For uv, write u′v + uv′ and keep each original factor in the opposite term." },
    { pattern: />.*(?:->|=).*<|<.*(?:->|=).*>/i, code: "inequality-direction", title: "Check the inequality direction", hint: "Reverse the inequality only when multiplying or dividing by a negative quantity." },
    { pattern: /\\int|integral/i, code: "integration-check", title: "Check the constant or bounds", hint: "Use + C for an indefinite integral; for a definite integral evaluate upper minus lower." },
  ];
  return patterns.filter(({ pattern }) => pattern.test(pair)).slice(0, 1).map((match) => ({
    id: `misconception-${Date.now()}`,
    code: match.code,
    title: match.title,
    description: "This is evidence from one invalid step, not a persistent learner diagnosis.",
    confidence: 0.72,
    evidenceStepIds: [current.id],
    correctiveHint: match.hint,
  }));
}

function stripLeadingEquality(value: string) {
  return value.trim().replace(/^=\s*/, "");
}

function normalizeResult(value: string) {
  return value.replace(/\s+/g, "").replace(/\\left|\\right/g, "").toLowerCase();
}

function detectOrientation(elements: MathExpressionElement[]): BoardSolutionSequence["orientation"] {
  const first = elements[0].bounds;
  const last = elements.at(-1)!.bounds;
  const dx = Math.abs(last.x - first.x);
  const dy = Math.abs(last.y - first.y);
  if (dy > dx * 1.5) return "vertical";
  if (dx > dy * 1.5) return "horizontal";
  return "mixed";
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined;
}
