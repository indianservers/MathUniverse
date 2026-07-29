import katex from "katex";
import { classifyProblem } from "../../problem-solver/problemClassifier";
import type {
  BoardActionType,
  BoardMathAmbiguity,
  BoardMathAnalysis,
  BoardMathClassification,
  BoardSuggestedAction,
} from "./types";

const MAX_EXPRESSION_LENGTH = 2_000;
const functionNames = new Set(["sin", "cos", "tan", "asin", "acos", "atan", "ln", "log", "exp", "sqrt", "abs", "lim"]);
const actionDetails: Record<BoardActionType, Omit<BoardSuggestedAction, "id" | "type">> = {
  evaluate: { label: "Evaluate", priority: 10, engineAdapter: "cas", enabled: true },
  simplify: { label: "Simplify", priority: 20, engineAdapter: "cas", enabled: true },
  factor: { label: "Factor", priority: 10, engineAdapter: "cas", enabled: true },
  expand: { label: "Expand", priority: 35, engineAdapter: "cas", enabled: true },
  solve: { label: "Solve", priority: 10, engineAdapter: "cas", enabled: true },
  "solve-system": { label: "Solve system", priority: 10, engineAdapter: "cas", enabled: true },
  "solve-inequality": { label: "Solve inequality", priority: 10, engineAdapter: "cas", enabled: true },
  "find-roots": { label: "Find roots", priority: 15, engineAdapter: "cas", enabled: true },
  differentiate: { label: "Differentiate", priority: 25, engineAdapter: "cas", enabled: true },
  integrate: { label: "Integrate", priority: 30, engineAdapter: "cas", enabled: true },
  "evaluate-limit": { label: "Evaluate limit", priority: 10, engineAdapter: "cas", enabled: true },
  "matrix-operation": { label: "Matrix summary", priority: 10, engineAdapter: "cas", enabled: true },
  "plot-2d": { label: "Draw graph", priority: 10, engineAdapter: "graph-2d", enabled: true },
  "plot-implicit": { label: "Open implicit graph", priority: 25, engineAdapter: "graph-2d", enabled: true },
  "plot-3d": { label: "Open in 3D", priority: 30, engineAdapter: "graph-3d", enabled: true },
  "table-of-values": { label: "Value table", priority: 40, engineAdapter: "graph-2d", enabled: true },
  statistics: { label: "Analyze statistics", priority: 10, engineAdapter: "statistics", enabled: true },
  geometry: { label: "Open in geometry", priority: 20, engineAdapter: "geometry", enabled: true },
  verify: { label: "Verify", priority: 45, engineAdapter: "verification", enabled: true },
};

export function normalizeBoardExpression(rawLatex: string) {
  const value = rawLatex.trim();
  if (!value) throw new Error("Expression is empty.");
  if (value.length > MAX_EXPRESSION_LENGTH) throw new Error(`Expression exceeds ${MAX_EXPRESSION_LENGTH} characters.`);
  katex.renderToString(value, { throwOnError: true, strict: false });

  const withoutFormatting = value
    .replace(/\\(?:displaystyle|textstyle|left|right)\b/g, "")
    .replace(/\\operatorname\{([^{}]+)\}/g, "$1")
    .replace(/\\mathrm\{([^{}]+)\}/g, "$1")
    .replace(/\\cdot|\\times/g, "*")
    .replace(/\\div/g, "/")
    .replace(/\\pi/g, "pi")
    .replace(/\\(?:leq|le)/g, "<=")
    .replace(/\\(?:geq|ge)/g, ">=")
    .replace(/\\neq/g, "!=")
    .replace(/\\sqrt\{([^{}]+)\}/g, "sqrt($1)");
  const fractions = replaceSimpleFractions(withoutFormatting);
  const powers = fractions.replace(/\^\{([^{}]+)\}/g, "^($1)");
  const grouped = powers.replace(/[{}]/g, (token) => token === "{" ? "(" : ")");
  const functions = grouped.replace(/\\(sin|cos|tan|arcsin|arccos|arctan|ln|log|exp)\b/g, (_, name: string) => (
    name === "arcsin" ? "asin" : name === "arccos" ? "acos" : name === "arctan" ? "atan" : name
  ));
  const engineExpression = functions
    .replace(/\u2212/g, "-")
    .replace(/\u00d7/g, "*")
    .replace(/\u00f7/g, "/")
    .replace(/\s+/g, " ")
    .trim();
  if (/[\\<>](?:script|iframe)|javascript:/i.test(engineExpression)) throw new Error("Unsupported unsafe content.");
  return { normalizedLatex: value, engineExpression };
}

export function analyzeBoardExpression(rawLatex: string): BoardMathAnalysis {
  const normalized = normalizeBoardExpression(rawLatex);
  const classificationResult = classifyProblem(normalized.engineExpression);
  const classification = mapClassification(normalized.engineExpression, classificationResult.kind);
  const variables = classificationResult.variables?.length
    ? classificationResult.variables
    : detectVariables(normalized.engineExpression);
  const ambiguities = detectAmbiguities(rawLatex, classification);
  const structures = detectStructures(normalized.engineExpression);
  const suggestedActions = actionsForClassification(classification, normalized.engineExpression, variables, ambiguities);
  return {
    rawLatex,
    ...normalized,
    classification,
    variables,
    dependentVariables: classification === "function" ? ["y"] : undefined,
    independentVariables: variables.includes("x") ? ["x"] : variables.slice(0, 1),
    detectedStructures: structures,
    suggestedActions,
    ambiguities,
    warnings: classificationResult.warnings,
    metadata: {
      degree: polynomialDegree(normalized.engineExpression, variables[0] ?? "x"),
      hasBounds: /\\int_|\\lim_/.test(rawLatex),
      hasMultipleEquations: classification === "system-of-equations",
      isExplicitFunction: classification === "function",
      isImplicitFunction: classification === "equation" && variables.length > 1,
      dimensions: matrixDimensions(normalized.engineExpression),
    },
  };
}

export function actionsForClassification(
  classification: BoardMathClassification,
  expression: string,
  variables: string[],
  ambiguities: BoardMathAmbiguity[] = [],
) {
  const rules: Record<BoardMathClassification, BoardActionType[]> = {
    numeric: ["evaluate", "simplify", "verify"],
    arithmetic: ["evaluate", "simplify", "verify"],
    "algebraic-expression": ["factor", "simplify", "expand", "find-roots", "plot-2d", "differentiate", "integrate", "table-of-values", "verify"],
    equation: variables.length > 1 ? ["solve", "plot-implicit", "geometry", "verify"] : ["solve", "plot-2d", "verify"],
    "system-of-equations": ["solve-system", "plot-2d", "verify"],
    inequality: ["solve-inequality", "verify"],
    function: ["plot-2d", "find-roots", "differentiate", "integrate", "table-of-values", "verify"],
    derivative: ["differentiate", "simplify", "plot-2d", "verify"],
    integral: ["integrate", "plot-2d", "verify"],
    limit: ["evaluate-limit", "plot-2d", "table-of-values", "verify"],
    matrix: ["matrix-operation", "verify"],
    vector: ["geometry", "plot-3d", "verify"],
    coordinate: ["geometry", "plot-2d"],
    geometry: ["geometry", "plot-2d", "plot-3d"],
    "data-series": ["statistics"],
    statistics: ["statistics"],
    unknown: ["verify"],
  };
  const unresolved = ambiguities.some((ambiguity) => ambiguity.requiresResolution);
  return (rules[classification] ?? []).map((type) => ({
    id: `${type}-${classification}`,
    type,
    ...actionDetails[type],
    enabled: !unresolved && actionDetails[type].enabled,
    disabledReason: unresolved ? "Resolve the highlighted ambiguity first." : undefined,
    defaultParameters: {
      variable: variables[0] ?? "x",
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
      expression,
    },
  })).sort((left, right) => left.priority - right.priority);
}

export function detectVariables(expression: string) {
  const tokens = expression.match(/[a-zA-Z]+/g) ?? [];
  return Array.from(new Set(tokens.filter((token) => !functionNames.has(token.toLowerCase()) && !["pi", "e", "d", "dx", "dy"].includes(token.toLowerCase())).flatMap((token) => token.length === 1 ? [token] : []))).sort();
}

export function detectAmbiguities(raw: string, classification: BoardMathClassification): BoardMathAmbiguity[] {
  const ambiguities: BoardMathAmbiguity[] = [];
  if (/(?:^|[^a-z])l(?:[^a-z]|$)/.test(raw) || /1\s*\/\s*l/.test(raw)) {
    ambiguities.push({
      id: "one-or-l",
      type: "character",
      description: "The handwritten mark may be the number 1 or lowercase l.",
      candidates: [{ label: "Number 1", latex: raw.replace(/\bl\b/g, "1") }, { label: "Variable l", latex: raw }],
      requiresResolution: true,
    });
  }
  if (/sin\s*\^\s*(?:\{-?1\}|\(-?1\)|-1)/i.test(raw)) {
    ambiguities.push({
      id: "inverse-or-reciprocal",
      type: "function",
      description: "sin⁻¹ can mean inverse sine or the reciprocal of sine.",
      candidates: [{ label: "Inverse sine", latex: raw.replace(/sin\s*\^\s*(?:\{-?1\}|\(-?1\)|-1)/i, "\\arcsin") }, { label: "Reciprocal", latex: `1/(${raw.replace(/\^\s*(?:\{-?1\}|\(-?1\)|-1)/, "")})` }],
      requiresResolution: true,
    });
  }
  if (classification === "integral" && !/d[a-zA-Z]\b/.test(raw)) {
    ambiguities.push({
      id: "integral-variable",
      type: "variable",
      description: "The integration variable is missing.",
      candidates: [{ label: "Integrate with respect to x", value: "x" }, { label: "Integrate with respect to t", value: "t" }],
      requiresResolution: true,
    });
  }
  return ambiguities;
}

function mapClassification(expression: string, kind: string): BoardMathClassification {
  if (/\\(?:frac\{d|partial)|\bd\/d[a-z]\b/i.test(expression)) return "derivative";
  if (/\\int|\bintegral\b|\bintegrate\b/i.test(expression)) return "integral";
  if (/\\lim|\blim(?:it)?\b/i.test(expression)) return "limit";
  if (/^[\s[]*-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?){2,}\s*$/.test(expression)) return "data-series";
  if (/^\s*\[\s*\[/.test(expression) || kind === "matrix") return "matrix";
  if (/;\s*|\n/.test(expression) && (expression.match(/=/g) ?? []).length > 1) return "system-of-equations";
  if (/[<>]=?|!=/.test(expression)) return "inequality";
  if (/^[fg]\s*\([a-z]\)\s*=|^y\s*=/i.test(expression)) return "function";
  if (/^\s*\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\)\s*$/.test(expression)) return "coordinate";
  if (kind === "linear-equation" || kind === "quadratic-equation" || kind === "polynomial-equation" || expression.includes("=")) return "equation";
  if (kind === "statistics") return "statistics";
  if (kind === "evaluate" && !/[a-z]/i.test(expression)) return /[+\-*/^]/.test(expression) ? "arithmetic" : "numeric";
  if (detectVariables(expression).length) return "algebraic-expression";
  return kind === "unsupported" ? "unknown" : "arithmetic";
}

function detectStructures(expression: string) {
  const structures: string[] = [];
  const checks: Array<[RegExp, string]> = [
    [/\+/, "addition"], [/-/, "subtraction"], [/\*|(?:\d|\))(?=[a-z(])/, "multiplication"],
    [/\//, "division"], [/\^/, "power"], [/sqrt/, "root"], [/[a-z].*\^|[a-z].*[+-]/i, "polynomial"],
    [/\b(?:sin|cos|tan)\b/i, "trigonometric"], [/\b(?:ln|log)\b/i, "logarithmic"], [/\bexp\b|\be\^/i, "exponential"],
    [/=/, "equation"], [/[<>]=?/, "inequality"], [/d\/d|\\frac\{d/, "derivative"],
    [/\\int|\bintegr/, "integral"], [/\\lim|\blim/, "limit"], [/^\s*\[\s*\[/, "matrix"],
  ];
  checks.forEach(([pattern, label]) => { if (pattern.test(expression)) structures.push(label); });
  return structures;
}

function replaceSimpleFractions(value: string) {
  let result = value;
  for (let iteration = 0; iteration < 8; iteration += 1) {
    const next = result.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "(($1)/($2))");
    if (next === result) break;
    result = next;
  }
  return result;
}

function polynomialDegree(expression: string, variable: string) {
  if (!variable) return undefined;
  const escaped = variable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const powers = Array.from(expression.matchAll(new RegExp(`${escaped}\\s*\\^\\s*\\(?([0-9]+)`, "g"))).map((match) => Number(match[1]));
  return expression.includes(variable) ? Math.max(1, ...powers) : 0;
}

function matrixDimensions(expression: string) {
  if (!/^\s*\[\s*\[/.test(expression)) return undefined;
  try {
    const matrix = JSON.parse(expression) as unknown[][];
    return [matrix.length, matrix[0]?.length ?? 0];
  } catch {
    return undefined;
  }
}
