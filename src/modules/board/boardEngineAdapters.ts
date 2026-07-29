import type {
  BoardActionType,
  BoardEngineError,
  BoardGraphConfiguration,
  BoardMathAnalysis,
  BoardSolutionStep,
} from "./types";

export type BoardEngineRequest = {
  action: BoardActionType;
  analysis: BoardMathAnalysis;
  parameters: Record<string, unknown>;
  signal?: AbortSignal;
};

export type BoardEngineResponse = {
  exactOutputLatex?: string;
  approximateOutput?: string;
  plainTextOutput?: string;
  steps?: BoardSolutionStep[];
  assumptions?: string[];
  warnings?: string[];
  graph?: BoardGraphConfiguration;
  workspaceRoute?: string;
  engine: { adapter: string; underlyingEngine: string; version?: string };
};

const resultCache = new Map<string, BoardEngineResponse>();

export async function executeBoardAction(request: BoardEngineRequest): Promise<BoardEngineResponse> {
  validateRequest(request);
  const key = cacheKey(request);
  const cached = resultCache.get(key);
  if (cached) return structuredClone(cached);
  const operation = runAdapter(request);
  const response = await withTimeout(operation, request.signal, 12_000);
  resultCache.set(key, response);
  return structuredClone(response);
}

export async function verifyBoardExpressions(left: string, right: string, variable = "x") {
  const { symbolicVerifyIdentity } = await import("../../utils/symbolic");
  const result = symbolicVerifyIdentity(left, right, variable);
  return {
    status: result.verification.equivalent ? "verified" as const : "not-equivalent" as const,
    explanation: result.detail,
    exactDifferenceLatex: result.steps.find((step) => /difference/i.test(step)),
    counterExample: result.verification.samples.find((sample) => Number(sample.difference) !== 0)?.difference,
  };
}

export function normalizeBoardEngineError(error: unknown): BoardEngineError {
  const message = error instanceof Error ? error.message : String(error);
  if ((error as Error)?.name === "AbortError" || /cancel/i.test(message)) return engineError("CANCELLED", message, "Calculation cancelled.", true);
  if (/timeout/i.test(message)) return engineError("TIMEOUT", message, "The calculation took too long. Try a smaller expression.", true);
  if (/singular/i.test(message)) return engineError("SINGULAR_MATRIX", message, "This matrix is singular, so the requested inverse does not exist.", true);
  if (/division by zero|divide by zero/i.test(message)) return engineError("DIVISION_BY_ZERO", message, "The expression divides by zero in the selected domain.", true);
  if (/unsupported|not supported/i.test(message)) return engineError("UNSUPPORTED_OPERATION", message, "That operation is not supported by the existing engine.", false);
  if (/parse|invalid|expression/i.test(message)) return engineError("PARSING_ERROR", message, "The mathematical expression could not be parsed. Review the recognized notation.", true);
  return engineError("UNKNOWN", message, "The engine could not complete this calculation.", true);
}

async function runAdapter(request: BoardEngineRequest): Promise<BoardEngineResponse> {
  if (request.action === "plot-2d" || request.action === "plot-implicit" || request.action === "table-of-values") return graphAdapter(request);
  if (request.action === "plot-3d") return routeAdapter(request, "/workspace/3d", "graph-3d", "Existing Three.js 3D Workspace");
  if (request.action === "geometry") return routeAdapter(request, "/workspace/geometry", "geometry", "Existing Geometry Workspace");
  if (request.action === "statistics") return statisticsAdapter(request);
  if (request.action === "verify") return verificationAdapter(request);
  return casAdapter(request);
}

async function casAdapter(request: BoardEngineRequest): Promise<BoardEngineResponse> {
  const { solveProblem } = await import("../../problem-solver/problemSolverEngine");
  const expression = request.analysis.engineExpression;
  const transformExpression = expressionBody(expression);
  const variable = String(request.parameters.variable ?? request.analysis.variables[0] ?? "x");
  const prompt: Partial<Record<BoardActionType, string>> = {
    evaluate: expression,
    simplify: `simplify ${transformExpression}`,
    factor: `factor ${transformExpression}`,
    expand: `expand ${transformExpression}`,
    solve: expression.includes("=") ? expression : `${expression}=0`,
    "solve-system": `solve ${expression}`,
    "solve-inequality": expression,
    "find-roots": expression.includes("=") ? expression : `${expression}=0`,
    differentiate: `differentiate ${expression}`,
    integrate: `integrate ${expression}`,
    "evaluate-limit": `limit ${variable}->${String(request.parameters.target ?? "0")} ${stripLimit(expression)}`,
    "matrix-operation": `matrix ${expression}`,
  };
  const output = solveProblem(prompt[request.action] ?? expression);
  if (!output.result.result || output.classification.kind === "unsupported") {
    throw new Error(output.result.unsupportedReason ?? output.result.warnings[0] ?? "Unsupported operation.");
  }
  return {
    exactOutputLatex: output.result.result,
    plainTextOutput: output.result.result,
    steps: output.result.steps.map((step, index) => ({ id: `step-${index}`, index, explanation: step })),
    assumptions: output.result.assumptions,
    warnings: output.result.warnings,
    engine: { adapter: "cas", underlyingEngine: output.result.method ?? "Existing certified problem solver / Nerdamer CAS" },
  };
}

async function graphAdapter(request: BoardEngineRequest): Promise<BoardEngineResponse> {
  const expression = explicitExpression(request.analysis.engineExpression);
  if (request.action === "plot-implicit" || (request.analysis.classification === "equation" && request.analysis.variables.length > 1)) {
    return routeAdapter(request, `/workspace/graph?q=${encodeURIComponent(request.analysis.engineExpression)}`, "graph-2d", "Existing Graph Workspace (implicit routing)");
  }
  const { generateTableValues, sampleFunction } = await import("../../utils/mathEngine/graphSampler");
  const xMin = boundedNumber(request.parameters.xMin, -10, -100, 99);
  const xMax = boundedNumber(request.parameters.xMax, 10, xMin + 0.1, 100);
  const yMin = boundedNumber(request.parameters.yMin, -10, -100, 99);
  const yMax = boundedNumber(request.parameters.yMax, 10, yMin + 0.1, 100);
  const sampled = sampleFunction(expression, xMin, xMax, 500);
  if (sampled.error) throw new Error(sampled.error);
  const table = generateTableValues(expression, Math.max(xMin, -5), Math.min(xMax, 5), 1);
  return {
    plainTextOutput: request.action === "table-of-values" ? `${table.rows.length} table rows generated.` : `Interactive graph of ${expression}.`,
    graph: {
      mode: "explicit",
      expression,
      series: [{ id: "board-series", label: expression, color: "#0891b2", visible: true, points: sampled.points }],
      view: { xMin, xMax, yMin, yMax },
      table: table.rows,
      workspaceRoute: `/workspace/graph?q=${encodeURIComponent(expression)}`,
      accessibilitySummary: `Graph of ${expression} from x ${xMin} to ${xMax}.`,
    },
    workspaceRoute: `/workspace/graph?q=${encodeURIComponent(expression)}`,
    engine: { adapter: "graph-2d", underlyingEngine: "FunctionGraphCanvas + graphSampler" },
  };
}

async function statisticsAdapter(request: BoardEngineRequest): Promise<BoardEngineResponse> {
  const { solveProblem } = await import("../../problem-solver/problemSolverEngine");
  const values = request.analysis.engineExpression.replaceAll("[", "").replaceAll("]", "");
  const parsed = values.split(/[\s,;]+/).filter(Boolean);
  if (!parsed.length || parsed.some((value) => !Number.isFinite(Number(value)))) throw new Error("Statistical data contains a non-numeric value.");
  const output = solveProblem(`statistics ${values}`);
  if (!output.result.result) throw new Error("Statistics engine did not return a result.");
  return {
    exactOutputLatex: output.result.result,
    plainTextOutput: output.result.result,
    steps: output.result.steps.map((step, index) => ({ id: `stats-${index}`, index, explanation: step })),
    assumptions: output.result.assumptions,
    warnings: output.result.warnings,
    workspaceRoute: "/statistics",
    engine: { adapter: "statistics", underlyingEngine: "Existing certified statistics solver" },
  };
}

async function verificationAdapter(request: BoardEngineRequest): Promise<BoardEngineResponse> {
  const comparison = String(request.parameters.compareWith ?? "0");
  const verified = await verifyBoardExpressions(request.analysis.engineExpression, comparison, String(request.parameters.variable ?? "x"));
  return {
    exactOutputLatex: verified.status === "verified" ? "\\text{Verified}" : "\\text{Not equivalent}",
    plainTextOutput: `${verified.status}: ${verified.explanation}`,
    warnings: verified.counterExample ? [`Counterexample difference: ${verified.counterExample}`] : undefined,
    engine: { adapter: "verification", underlyingEngine: "symbolicVerifyIdentity" },
  };
}

function routeAdapter(request: BoardEngineRequest, workspaceRoute: string, adapter: string, engine: string): BoardEngineResponse {
  return {
    plainTextOutput: `Ready to open ${request.analysis.engineExpression} in the existing workspace.`,
    workspaceRoute,
    engine: { adapter, underlyingEngine: engine },
  };
}

function validateRequest(request: BoardEngineRequest) {
  if (!request.analysis.engineExpression || request.analysis.engineExpression.length > 2_000) throw new Error("Invalid expression length.");
  if (request.signal?.aborted) throw new DOMException("Calculation cancelled", "AbortError");
  if (request.analysis.ambiguities.some((ambiguity) => ambiguity.requiresResolution)) throw new Error("Resolve mathematical ambiguities before calculation.");
}

function explicitExpression(expression: string) {
  const functionMatch = expression.match(/^[a-z]\s*\(\s*[a-z]\s*\)\s*=\s*(.+)$/i);
  if (functionMatch) return functionMatch[1];
  const equation = expression.match(/^y\s*=\s*(.+)$/i);
  if (equation) return equation[1];
  return expressionBody(expression);
}

function expressionBody(expression: string) {
  const equality = expression.match(/^(.+?)=(.+)$/);
  if (!equality) return expression;
  const left = equality[1].trim();
  const right = equality[2].trim();
  return right === "0" ? left : `(${left})-(${right})`;
}

function stripLimit(expression: string) {
  return expression.replace(/^.*?(?:lim|limit)[^(a-z]*[a-z]\s*(?:->|to)\s*[^\s]+\s*/i, "") || expression;
}

function boundedNumber(value: unknown, fallback: number, min: number, max: number) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(max, Math.max(min, numeric)) : fallback;
}

function cacheKey(request: BoardEngineRequest) {
  return JSON.stringify([request.action, request.analysis.engineExpression, request.parameters]);
}

function engineError(code: BoardEngineError["code"], message: string, userMessage: string, recoverable: boolean): BoardEngineError {
  return { code, message, userMessage, recoverable };
}

async function withTimeout<T>(operation: Promise<T>, signal: AbortSignal | undefined, milliseconds: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Engine timeout")), milliseconds);
    const cancel = () => reject(new DOMException("Calculation cancelled", "AbortError"));
    signal?.addEventListener("abort", cancel, { once: true });
    operation.then(resolve, reject).finally(() => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", cancel);
    });
  });
}
