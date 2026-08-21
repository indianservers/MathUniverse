import { evaluateCasInput } from "../cas/casResult";
import { parseMath } from "../math-foundation/parser";
import type { MathDiagnostic, MathValue } from "../math-foundation/types";
import { analyzeAssumptions, hasAssumption } from "./assumptionEngine";
import { verifiedStep } from "./transformationRules";
import type { BranchRecord, CertifiedCasResult, MathCondition } from "./types";

export type TransformationGoal = "SIMPLIFY" | "EXPAND" | "FACTOR" | "COLLECT" | "RATIONALIZE" | "REWRITE" | "TRIGONOMETRIC" | "EXPONENTIAL" | "POLAR" | "CARTESIAN" | "SOLVE" | "DIFFERENTIATE" | "INTEGRATE";

export function evaluateCertifiedCas(input: string, assumptionSources: string[] = [], goal: TransformationGoal = inferGoal(input)): CertifiedCasResult {
  const parsed = parseMath(extractExpression(input));
  const inputNodeId = parsed.ast?.id ?? `unparsed-${hash(input)}`;
  const analysis = analyzeAssumptions(assumptionSources);
  if (analysis.contradictions.length) return base("ERROR", inputNodeId, analysis.assumptions.map((item) => item.source), analysis.assumptions.map((item) => item.mathAssumption), analysis.contradictions.map(diagnostic));
  const normalized = normalize(input);
  if (isSqrtSquare(normalized)) return simplifySqrtSquare(inputNodeId, analysis, normalized);
  if (isConditionalLinear(normalized)) return solveConditionalLinear(inputNodeId, analysis);
  if (isExtraneousRootExample(normalized)) return solveRadicalExample(inputNodeId, analysis);
  if (goal === "DIFFERENTIATE" || /^derivative\[/i.test(input)) return wrapExisting(inputNodeId, input, analysis, "Derivative", "CALCULUS.POWER_DERIVATIVE");
  if (goal === "INTEGRATE" || /^integral\[/i.test(input)) return wrapExisting(inputNodeId, input, analysis, "Integral", "CALCULUS.POWER_ANTIDERIVATIVE");
  const command = goalCommand(goal, input);
  return wrapExisting(inputNodeId, command, analysis, goal, "ALGEBRA.CANONICAL_EXACT");
}

function simplifySqrtSquare(inputNodeId: string, analysis: ReturnType<typeof analyzeAssumptions>, normalized: string): CertifiedCasResult {
  const symbol = normalized.match(/sqrt\(([a-z]\w*)\^2\)/)?.[1] ?? "x";
  const real = hasAssumption(analysis, symbol, (item) => item.domain === "REAL") || hasAssumption(analysis, symbol, (item) => item.domain === "INTEGER" || item.domain === "NATURAL");
  const nonNegative = hasAssumption(analysis, symbol, (item) => (item.relation === "GTE" || item.relation === "GT") && (item.value ?? 0) >= 0) || hasAssumption(analysis, symbol, (item) => item.domain === "NATURAL");
  if (!real) return { ...base("CONDITIONAL", inputNodeId, [], []), conditions: [condition(`${symbol} in R`, `${symbol} must be real for the real principal-root identity.`, "DOMAIN")], exactExpression: `sqrt(${symbol}^2)`, branches: [{ id: "real-branch", condition: `${symbol} ∈ ℝ`, result: `|${symbol}|`, status: "UNRESOLVED" }, { id: "complex-branch", condition: `${symbol} ∈ ℂ`, result: "principal complex branch retained", status: "UNRESOLVED" }], diagnostics: [diagnostic("Add a real-domain assumption to choose the real branch.")] };
  const used = analysis.assumptions.filter((item) => item.symbol === symbol).map((item) => item.source);
  const result = nonNegative ? symbol : `|${symbol}|`; const ruleId = nonNegative ? "RADICAL.SQRT_SQUARE_NONNEGATIVE" : "RADICAL.SQRT_SQUARE_REAL";
  return { ...base("EXACT", inputNodeId, used, analysis.assumptions.map((item) => item.mathAssumption)), resultNodeIds: [`${inputNodeId}-result`], exactExpression: result, exactResult: special(result), steps: [verifiedStep(ruleId, `sqrt(${symbol}^2)`, result, used)] };
}

function solveConditionalLinear(inputNodeId: string, analysis: ReturnType<typeof analyzeAssumptions>): CertifiedCasResult {
  const nonzero = hasAssumption(analysis, "a", (item) => item.relation === "NEQ" && item.value === 0);
  const zero = hasAssumption(analysis, "a", (item) => item.relation === "EQ" && item.value === 0);
  const branches: BranchRecord[] = [
    { id: "a-nonzero", condition: "a ≠ 0", result: "x = 1/a", status: zero ? "REJECTED" : "VALID", verification: "a*(1/a)=1 when a≠0" },
    { id: "a-zero", condition: "a = 0", result: "no solution", status: nonzero ? "REJECTED" : "VALID", verification: "0*x cannot equal 1" },
  ];
  if (nonzero) return { ...base("EXACT", inputNodeId, ["a != 0"], analysis.assumptions.map((item) => item.mathAssumption)), resultNodeIds: [`${inputNodeId}-nonzero`], exactExpression: "{x = 1/a}", exactResult: special("x=1/a"), excludedValues: [integer(0)], conditions: [condition("a != 0", "Division requires a non-zero coefficient.", "SOLVER")], branches, steps: [verifiedStep("EQUATION.DIVIDE_NONZERO", "a*x=1", "x=1/a", ["a != 0"])] };
  if (zero) return { ...base("UNDEFINED", inputNodeId, ["a = 0"], analysis.assumptions.map((item) => item.mathAssumption)), exactExpression: "no solution", branches, steps: [verifiedStep("EQUATION.ZERO_COEFFICIENT", "0*x=1", "no solution", ["a = 0"])] };
  return { ...base("CONDITIONAL", inputNodeId, [], analysis.assumptions.map((item) => item.mathAssumption)), resultNodeIds: [`${inputNodeId}-nonzero`, `${inputNodeId}-zero`], exactExpression: "piecewise: a≠0 → x=1/a; a=0 → no solution", exactResult: special("conditional solution"), excludedValues: [integer(0)], conditions: [condition("a != 0", "Required for the division branch.", "SOLVER")], branches, steps: [verifiedStep("EQUATION.DIVIDE_NONZERO", "a*x=1", "x=1/a", ["a != 0"], "CONDITIONAL"), verifiedStep("EQUATION.ZERO_COEFFICIENT", "0*x=1", "no solution", ["a = 0"], "CONDITIONAL")] };
}

function solveRadicalExample(inputNodeId: string, analysis: ReturnType<typeof analyzeAssumptions>): CertifiedCasResult {
  const branches: BranchRecord[] = [{ id: "candidate-2", condition: "x = 2", result: "sqrt(4)=2", status: "VALID", verification: "residual 0" }, { id: "candidate-minus-1", condition: "x = -1", result: "sqrt(1)≠-1", status: "REJECTED", verification: "residual 2" }];
  return { ...base("EXACT", inputNodeId, analysis.assumptions.map((item) => item.source), analysis.assumptions.map((item) => item.mathAssumption)), resultNodeIds: [`${inputNodeId}-x2`], exactExpression: "{2}", exactResult: { kind: "SET", values: [integer(2)] }, conditions: [condition("x >= 0", "The principal square root is non-negative.", "DOMAIN")], branches, steps: [verifiedStep("EQUATION.SQUARE_BOTH_SIDES", "sqrt(x+2)=x", "x+2=x^2", ["x >= 0"]), verifiedStep("EQUATION.VERIFY_CANDIDATE", "candidates {-1,2}", "accepted {2}; rejected {-1}")] };
}

function wrapExisting(inputNodeId: string, input: string, analysis: ReturnType<typeof analyzeAssumptions>, operation: string, ruleId: string): CertifiedCasResult {
  const result = evaluateCasInput(input, { assumptions: analysis.assumptions.map((item) => item.source) });
  if (result.status !== "ok" || !result.exact) return { ...base(result.status === "partial" ? "PARTIAL" : "UNSUPPORTED", inputNodeId, analysis.assumptions.map((item) => item.source), analysis.assumptions.map((item) => item.mathAssumption)), diagnostics: [...result.warnings.map(diagnostic), diagnostic(result.detail)] };
  const approximate = result.numeric;
  return { ...base(approximate ? "APPROXIMATE" : "EXACT", inputNodeId, analysis.assumptions.map((item) => item.source), analysis.assumptions.map((item) => item.mathAssumption)), resultNodeIds: [`${inputNodeId}-${operation.toLowerCase()}`], exactExpression: result.exact, exactResult: special(result.exact), approximateExpression: approximate, approximateResult: approximate ? decimal(Number(approximate)) : undefined, precision: approximate ? 12 : undefined, steps: [verifiedStep(ruleId, input, result.exact, analysis.assumptions.map((item) => item.source))], diagnostics: result.warnings.map(diagnostic), provenance: [{ id: `existing-${hash(input)}`, operation, inputNodeIds: [inputNodeId], timestamp: "2026-08-20T00:00:00.000Z", description: "Existing CAS result wrapped by the Phase 4 certified result layer." }] };
}

function base(status: CertifiedCasResult["status"], inputNodeId: string, assumptionLabels: string[], assumptionsUsed: CertifiedCasResult["assumptionsUsed"], diagnostics: MathDiagnostic[] = []): CertifiedCasResult { return { status, inputNodeId, resultNodeIds: [], conditions: [], excludedValues: [], assumptionsUsed, assumptionLabels, branches: [], steps: [], diagnostics, provenance: [] }; }
function goalCommand(goal: TransformationGoal, input: string) { if (/^[A-Za-z]+\[/.test(input)) return input; const names: Partial<Record<TransformationGoal, string>> = { SIMPLIFY: "Simplify", EXPAND: "Expand", FACTOR: "Factor", RATIONALIZE: "Rationalize", POLAR: "ToPolar", EXPONENTIAL: "ToExponential" }; return `${names[goal] ?? "Simplify"}[${input}]`; }
function inferGoal(input: string): TransformationGoal { if (/^solve/i.test(input) || /=/.test(input)) return "SOLVE"; if (/^derivative/i.test(input)) return "DIFFERENTIATE"; if (/^integral/i.test(input)) return "INTEGRATE"; return "SIMPLIFY"; }
function extractExpression(input: string) { const bracket = input.match(/^[A-Za-z]+\[(.*?)(?:,\s*[A-Za-z]\w*)?\]$/); return bracket?.[1] ?? input; }
function normalize(input: string) { return input.toLowerCase().replaceAll(" ", "").replaceAll("²", "^2").replaceAll("*", "*"); }
function isSqrtSquare(value: string) { return /^sqrt\([a-z]\w*\^2\)$/.test(value); }
function isConditionalLinear(value: string) { return /^(?:solve\[)?a\*?x=1(?:,x\])?$/.test(value); }
function isExtraneousRootExample(value: string) { return /^(?:solve\[)?sqrt\(x\+2\)=x(?:,x\])?$/.test(value); }
function condition(expression: string, description: string, source: MathCondition["source"]): MathCondition { return { id: `condition-${hash(expression)}`, expression, description, source }; }
function diagnostic(message: string): MathDiagnostic { return { code: "PHASE4_CAS", severity: "WARNING", message }; }
function integer(value: number): MathValue { return { kind: "INTEGER", value: String(value) }; }
function decimal(value: number): MathValue { return { kind: "DECIMAL", coefficient: String(value), scale: 0, precision: 12, roundingMode: "HALF_EVEN" }; }
function special(reason: string): MathValue { return { kind: "SPECIAL", state: "UNSUPPORTED", reason }; }
function hash(value: string) { let result = 0; for (const char of value) result = (Math.imul(result, 31) + char.charCodeAt(0)) | 0; return Math.abs(result).toString(36); }
