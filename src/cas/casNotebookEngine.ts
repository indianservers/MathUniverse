import {
  symbolicDerivative,
  symbolicDefiniteIntegral,
  symbolicExpand,
  symbolicFactor,
  symbolicIntegral,
  symbolicLimit,
  symbolicPartialFractions,
  symbolicPolynomialDivide,
  symbolicSimplify,
  symbolicSolve,
  symbolicSubstitute,
  symbolicSystemSolve,
  symbolicTangentLine,
  symbolicVerifyIdentity,
  trySymbolic,
  type SymbolicAssignment,
  type SymbolicResult,
} from "../utils/symbolic";

export type NotebookOperation =
  | "simplify"
  | "factor"
  | "expand"
  | "solve"
  | "system"
  | "differentiate"
  | "integrate"
  | "definite-integral"
  | "limit"
  | "tangent-line"
  | "verify-identity"
  | "substitute"
  | "partial-fractions"
  | "polynomial-divide"
  | "matrix"
  | "list";

export type EvaluationMode = "exact" | "numeric";

export type NotebookCell = {
  id: string;
  input: string;
  operation: NotebookOperation;
  output: string;
  exact?: string;
  numeric?: string;
  ok: boolean;
  detail: string;
  steps: string[];
  createdAt: string;
  resolvedInput?: string;
  dependencies?: string[];
  warnings?: string[];
  assumptionSummary?: string[];
};

export type NotebookState = {
  cells: NotebookCell[];
  assumptions: string;
  mode: EvaluationMode;
};

type NotebookMemory = {
  byNumber: Map<number, string>;
  assignments: Map<string, string>;
};

type NotebookEvaluationContext = {
  assumptions: string;
  mode: EvaluationMode;
  memory: NotebookMemory;
  displayIndex: number;
};

type ResolvedInput = {
  input: string;
  dependencies: string[];
  warnings: string[];
};

export const operationOptions: Array<{ value: NotebookOperation; label: string }> = [
  { value: "simplify", label: "Simplify" },
  { value: "factor", label: "Factor" },
  { value: "expand", label: "Expand" },
  { value: "solve", label: "Solve" },
  { value: "system", label: "Equation System" },
  { value: "differentiate", label: "Differentiate" },
  { value: "integrate", label: "Integrate" },
  { value: "definite-integral", label: "Definite Integral" },
  { value: "limit", label: "Limit" },
  { value: "tangent-line", label: "Tangent Line" },
  { value: "verify-identity", label: "Verify Identity" },
  { value: "substitute", label: "Substitute" },
  { value: "partial-fractions", label: "Partial Fractions" },
  { value: "polynomial-divide", label: "Polynomial Divide" },
  { value: "matrix", label: "Matrix" },
  { value: "list", label: "List" },
];

export const casNotebookExamples: Array<{ label: string; input: string; operation: NotebookOperation }> = [
  { label: "Define a", input: "a := 3", operation: "simplify" },
  { label: "Use memory", input: "a*x + #1", operation: "expand" },
  { label: "Factor quadratic", input: "x^2-5*x+6", operation: "factor" },
  { label: "Equation system", input: "x+y=5; x-y=1", operation: "system" },
  { label: "Matrix", input: "[[1,2],[3,4]]", operation: "matrix" },
  { label: "Limit", input: "sin(x)/x, x, 0", operation: "limit" },
  { label: "Definite integral", input: "x^2, 0, 2, x", operation: "definite-integral" },
  { label: "Tangent line", input: "x^2, 3, x", operation: "tangent-line" },
  { label: "Verify identity", input: "tan(x), sin(x)/cos(x), x", operation: "verify-identity" },
];

export const starterNotebookCells: NotebookCell[] = [
  createNotebookCell("a := 3", "simplify"),
  createNotebookCell("x^2-5*x+6", "factor"),
  createNotebookCell("x^2-5*x+6=0", "solve"),
  createNotebookCell("x+y=5; x-y=1", "system"),
];

export function createNotebookCell(input: string, operation: NotebookOperation): NotebookCell {
  return {
    id: crypto.randomUUID(),
    input,
    operation,
    output: "",
    ok: false,
    detail: "",
    steps: [],
    createdAt: new Date().toLocaleString(),
  };
}

export function evaluateNotebookCells(cells: NotebookCell[], assumptions: string, mode: EvaluationMode): NotebookCell[] {
  const ordered = [...cells].reverse();
  const memory = createMemory();
  const evaluatedById = new Map<string, NotebookCell>();

  ordered.forEach((cell, index) => {
    const evaluated = evaluateNotebookCell(cell, {
      assumptions,
      mode,
      memory,
      displayIndex: index + 1,
    });
    rememberCell(memory, evaluated, index + 1);
    evaluatedById.set(cell.id, evaluated);
  });

  return cells.map((cell) => evaluatedById.get(cell.id) ?? cell);
}

export function evaluateNotebookCellInState(targetId: string, cells: NotebookCell[], assumptions: string, mode: EvaluationMode): NotebookCell[] {
  const ordered = [...cells].reverse();
  const targetIndex = ordered.findIndex((cell) => cell.id === targetId);
  if (targetIndex < 0) return cells;

  const memory = createMemory();
  ordered.slice(0, targetIndex).forEach((cell, index) => rememberCell(memory, cell, index + 1));

  const target = ordered[targetIndex];
  const evaluated = evaluateNotebookCell(target, {
    assumptions,
    mode,
    memory,
    displayIndex: targetIndex + 1,
  });

  return cells.map((cell) => (cell.id === targetId ? evaluated : cell));
}

export function evaluateNotebookCell(cell: NotebookCell, context: NotebookEvaluationContext): NotebookCell {
  const input = cell.input.trim();
  const assumptionSummary = parseAssumptions(context.assumptions);
  if (!input) {
    return {
      ...cell,
      ok: false,
      output: "Enter an expression first.",
      detail: "The cell is empty.",
      steps: ["Choose an operation.", "Enter an expression, matrix, list, or system.", "Run the cell again."],
      createdAt: new Date().toLocaleString(),
      warnings: ["Empty cells are skipped by the worksheet engine."],
      assumptionSummary,
    };
  }

  const resolved = resolveNotebookInput(input, context.memory);
  const assignment = parseNotebookAssignment(resolved.input);
  const result = assignment ? assignmentResult(assignment.name, assignment.value, context.memory) : runNotebookOperation(cell.operation, resolved.input, context.assumptions);
  const numeric = context.mode === "numeric" ? numericCheck(resolved.input, result?.result ?? resolved.input, context.memory) : undefined;
  const warnings = [...resolved.warnings, ...assumptionWarnings(context.assumptions)];

  return {
    ...cell,
    output: context.mode === "numeric" && numeric ? numeric : result?.result ?? "CAS could not process this cell.",
    exact: result?.exact ?? result?.result,
    numeric,
    ok: Boolean(result),
    detail: result?.detail ?? "The CAS engine could not produce a supported symbolic result for this input.",
    steps: [
      `Assumptions: ${context.assumptions.trim() || "none"}.`,
      `Mode: ${context.mode}.`,
      resolved.input !== input ? `Resolved worksheet references: ${resolved.input}.` : "No worksheet references needed resolving.",
      ...(result?.steps ?? ["Parse the cell input.", "No supported transformation matched this cell."]),
    ],
    createdAt: new Date().toLocaleString(),
    resolvedInput: resolved.input,
    dependencies: resolved.dependencies,
    warnings,
    assumptionSummary,
  };
}

export function serializeCasNotebookMarkdown(state: NotebookState) {
  const lines = [
    "# CAS Notebook Export",
    "",
    `Mode: ${state.mode}`,
    `Assumptions: ${state.assumptions.trim() || "none"}`,
    "",
  ];

  [...state.cells].reverse().forEach((cell, index) => {
    lines.push(`## In [${index + 1}] ${cell.operation}`);
    lines.push("");
    lines.push("```text");
    lines.push(cell.input || "(empty)");
    lines.push("```");
    lines.push("");
    lines.push(`Output: ${cell.output || "(not run)"}`);
    if (cell.resolvedInput && cell.resolvedInput !== cell.input) lines.push(`Resolved input: ${cell.resolvedInput}`);
    if (cell.numeric) lines.push(`Numeric check: ${cell.numeric}`);
    if (cell.dependencies?.length) lines.push(`Dependencies: ${cell.dependencies.join(", ")}`);
    if (cell.warnings?.length) lines.push(`Warnings: ${cell.warnings.join("; ")}`);
    if (cell.steps.length) {
      lines.push("");
      lines.push("Steps:");
      cell.steps.forEach((step, stepIndex) => lines.push(`${stepIndex + 1}. ${step}`));
    }
    lines.push("");
  });

  return lines.join("\n").trim();
}

export function isNotebookOperation(value: unknown): value is NotebookOperation {
  return operationOptions.some((item) => item.value === value);
}

function createMemory(): NotebookMemory {
  return { byNumber: new Map(), assignments: new Map() };
}

function rememberCell(memory: NotebookMemory, cell: NotebookCell, displayIndex: number) {
  if (cell.ok && (cell.exact || cell.output)) memory.byNumber.set(displayIndex, cell.exact ?? cell.output);
  const assignment = parseNotebookAssignment(cell.resolvedInput ?? cell.input);
  if (assignment && cell.ok) memory.assignments.set(assignment.name, cell.exact ?? assignment.value);
}

function resolveNotebookInput(input: string, memory: NotebookMemory): ResolvedInput {
  const dependencies: string[] = [];
  const warnings: string[] = [];
  let resolved = input.replace(/#(\d+)\b|\b(?:ans|out)(\d+)\b/gi, (match, hashIndex: string | undefined, namedIndex: string | undefined) => {
    const index = Number(hashIndex ?? namedIndex);
    const value = memory.byNumber.get(index);
    if (!value) {
      warnings.push(`Reference ${match} has no solved earlier cell.`);
      return match;
    }
    dependencies.push(`In [${index}]`);
    return `(${value})`;
  });

  memory.assignments.forEach((value, name) => {
    const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, "g");
    if (pattern.test(resolved)) {
      dependencies.push(`${name} := ${value}`);
      resolved = resolved.replace(pattern, `(${value})`);
    }
  });

  return { input: resolved, dependencies: Array.from(new Set(dependencies)), warnings };
}

function parseNotebookAssignment(input: string) {
  const match = input.match(/^\s*([a-zA-Z]\w*)\s*:=\s*(.+?)\s*$/);
  if (!match) return null;
  return { name: match[1], value: match[2] };
}

function assignmentResult(name: string, value: string, memory: NotebookMemory): SymbolicResult {
  const simplified = trySymbolic(() => symbolicSimplify(value));
  const exact = simplified?.result ?? value;
  memory.assignments.set(name, exact);
  return {
    result: `${name} := ${exact}`,
    exact,
    detail: "Worksheet assignment stored for later cells in this notebook run.",
    steps: [
      `Read assignment ${name} := ${value}.`,
      simplified ? `Simplify the assigned expression to ${exact}.` : "Keep the assigned expression as written.",
      `Store ${name} for later cells. Later expressions may reference ${name}.`,
    ],
  };
}

function runNotebookOperation(operation: NotebookOperation, input: string, assumptions: string): SymbolicResult | null {
  if (operation === "simplify") return withAssumptions(trySymbolic(() => symbolicSimplify(input)), assumptions);
  if (operation === "factor") return withAssumptions(trySymbolic(() => symbolicFactor(input)), assumptions);
  if (operation === "expand") return withAssumptions(trySymbolic(() => symbolicExpand(input)), assumptions);
  if (operation === "solve") return withAssumptions(trySymbolic(() => symbolicSolve(input.includes("=") ? input : `${input}=0`, inferVariable(input))), assumptions);
  if (operation === "system") return withAssumptions(trySymbolic(() => symbolicSystemSolve(splitTopLevel(input), inferVariables(input))), assumptions);
  if (operation === "differentiate") return withAssumptions(trySymbolic(() => symbolicDerivative(firstArg(input), secondArg(input) ?? inferVariable(input))), assumptions);
  if (operation === "integrate") return withAssumptions(trySymbolic(() => symbolicIntegral(firstArg(input), secondArg(input) ?? inferVariable(input))), assumptions);
  if (operation === "definite-integral") {
    const [expression, lower = "0", upper = "1", variable = inferVariable(input)] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicDefiniteIntegral(expression, lower, upper, variable)), assumptions);
  }
  if (operation === "limit") {
    const [expression, variable = inferVariable(input), target = "0"] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicLimit(expression, variable, target)), assumptions);
  }
  if (operation === "tangent-line") {
    const [expression, point = "0", variable = inferVariable(input)] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicTangentLine(expression, point, variable)), assumptions);
  }
  if (operation === "verify-identity") {
    const [left, right = "0", variable = inferVariable(input)] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicVerifyIdentity(left, right, variable)), assumptions);
  }
  if (operation === "substitute") {
    const [expression, ...rawAssignments] = splitTopLevel(input);
    const assignments = rawAssignments.map(parseAssignment).filter(Boolean) as SymbolicAssignment[];
    return withAssumptions(trySymbolic(() => symbolicSubstitute(expression, assignments)), assumptions);
  }
  if (operation === "partial-fractions") {
    const [expression, variable = inferVariable(input)] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicPartialFractions(expression, variable)), assumptions);
  }
  if (operation === "polynomial-divide") {
    const [dividend, divisor = "1", variable = inferVariable(input)] = splitTopLevel(input);
    return withAssumptions(trySymbolic(() => symbolicPolynomialDivide(dividend, divisor, variable)), assumptions);
  }
  if (operation === "matrix") return matrixResult(input);
  if (operation === "list") return listResult(input);
  return null;
}

function withAssumptions(result: SymbolicResult | null, assumptions: string): SymbolicResult | null {
  if (!result) return null;
  const clean = assumptions.trim();
  if (!clean) return result;
  return {
    ...result,
    detail: `${result.detail} Assumptions recorded but not automatically enforced by the offline CAS: ${clean}.`,
    steps: [...result.steps, `Carry assumptions forward for interpretation: ${clean}.`],
  };
}

function matrixResult(input: string): SymbolicResult | null {
  const matrix = parseMatrix(input);
  if (!matrix.length) return null;
  const rows = matrix.length;
  const columns = matrix[0]?.length ?? 0;
  const determinant = rows === columns ? determinantOf(matrix) : null;
  const transpose = transposeMatrix(matrix);
  const trace = rows === columns ? matrix.reduce((total, row, index) => total + (row[index] ?? 0), 0) : null;
  const inverse = rows === 2 && columns === 2 ? inverse2x2(matrix) : null;
  const rref = rrefMatrix(matrix);
  return {
    result: `matrix ${rows}x${columns}${determinant !== null ? `, det=${round(determinant)}` : ""}${trace !== null ? `, trace=${round(trace)}` : ""}`,
    exact: JSON.stringify(matrix),
    detail: "Matrix parsed for row/column structure, determinant, transpose, trace, inverse where supported, and RREF preview.",
    steps: [
      "Read nested bracket matrix syntax.",
      `Detected ${rows} row${rows === 1 ? "" : "s"} and ${columns} column${columns === 1 ? "" : "s"}.`,
      determinant !== null ? `Computed determinant: ${round(determinant)}.` : "Determinant skipped because the matrix is not square.",
      trace !== null ? `Computed trace: ${round(trace)}.` : "Trace skipped because the matrix is not square.",
      inverse ? `2x2 inverse: ${JSON.stringify(inverse)}.` : "Inverse preview is currently shown for 2x2 matrices only.",
      `Transpose: ${JSON.stringify(transpose)}.`,
      `RREF: ${JSON.stringify(rref)}.`,
    ],
  };
}

function listResult(input: string): SymbolicResult | null {
  const values = input.replace(/^\[|\]$/g, "").split(/[,\s]+/).map(Number).filter(Number.isFinite);
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const sum = values.reduce((total, value) => total + value, 0);
  const mean = sum / values.length;
  const median = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length;
  const stdev = Math.sqrt(variance);
  return {
    result: `list n=${values.length}, sum=${round(sum)}, mean=${round(mean)}, median=${round(median)}, stdev=${round(stdev)}`,
    exact: `[${values.join(", ")}]`,
    detail: "Numeric list object with reusable summary statistics.",
    steps: [
      "Parse comma/space separated numeric entries.",
      `Count ${values.length} values.`,
      `Sum values to ${round(sum)} and divide by n for mean ${round(mean)}.`,
      `Sort values as [${sorted.join(", ")}] to read median ${round(median)}.`,
      `Compute population variance ${round(variance)} and standard deviation ${round(stdev)}.`,
      "Expose list summary for follow-up spreadsheet or statistics workflows.",
    ],
  };
}

function numericCheck(input: string, exact: string, memory: NotebookMemory) {
  const substitutedInput = substituteAssignmentsForNumeric(input, memory);
  const substitutedExact = substituteAssignmentsForNumeric(exact, memory);
  const values = [substitutedInput, substitutedExact].map((value) => evaluateNumericExpression(value)).filter(Number.isFinite);
  return values.length ? values.map(round).join(" -> ") : undefined;
}

function substituteAssignmentsForNumeric(input: string, memory: NotebookMemory) {
  let output = input;
  memory.assignments.forEach((value, name) => {
    output = output.replace(new RegExp(`\\b${escapeRegExp(name)}\\b`, "g"), `(${value})`);
  });
  return output;
}

function evaluateNumericExpression(value: string) {
  try {
    const expression = value
      .replace(/\+C$/, "")
      .replace(/\^/g, "**")
      .replace(/\bpi\b/gi, "Math.PI")
      .replace(/\be\b/g, "Math.E")
      .replace(/\bsin\b/gi, "Math.sin")
      .replace(/\bcos\b/gi, "Math.cos")
      .replace(/\btan\b/gi, "Math.tan")
      .replace(/\bsqrt\b/gi, "Math.sqrt")
      .replace(/\blog\b/gi, "Math.log10")
      .replace(/\bln\b/gi, "Math.log");
    if (/[a-zA-Z_]/.test(expression.replace(/Math\.[a-zA-Z0-9_]+/g, "")) || hasUnsafeNumericSyntax(expression)) return Number.NaN;
    return Function(`"use strict"; return (${expression});`)() as number;
  } catch {
    return Number.NaN;
  }
}

function hasUnsafeNumericSyntax(expression: string) {
  return [";", "=", "{", "}", "[", "]", "'", "\""].some((token) => expression.includes(token));
}

function splitTopLevel(value: string) {
  const output: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "(" || char === "[") depth += 1;
    if (char === ")" || char === "]") depth -= 1;
    if ((char === "," || char === ";") && depth === 0) {
      if (current.trim()) output.push(current.trim());
      current = "";
    } else current += char;
  }
  if (current.trim()) output.push(current.trim());
  return output;
}

function firstArg(value: string) {
  return splitTopLevel(value)[0] ?? value;
}

function secondArg(value: string) {
  return splitTopLevel(value)[1];
}

function parseAssignment(value: string) {
  const [name, ...rest] = value.split("=");
  const expression = rest.join("=").trim();
  return name?.trim() && expression ? { name: name.trim(), value: expression } : null;
}

function inferVariable(value: string) {
  return value.match(/\b[a-z]\b/i)?.[0] ?? "x";
}

function inferVariables(value: string) {
  return Array.from(new Set(value.match(/\b[a-z]\b/gi)?.map((item) => item.toLowerCase()) ?? ["x", "y"]));
}

function parseMatrix(input: string) {
  try {
    const parsed = JSON.parse(input.replace(/'/g, "\"")) as unknown;
    if (!Array.isArray(parsed)) return [];
    const rows = parsed
      .map((row) => (Array.isArray(row) ? row.map(Number).filter(Number.isFinite) : []))
      .filter((row) => row.length > 0);
    const width = rows[0]?.length ?? 0;
    return rows.every((row) => row.length === width) ? rows : [];
  } catch {
    return [];
  }
}

function transposeMatrix(matrix: number[][]) {
  const columns = Math.max(...matrix.map((row) => row.length));
  return Array.from({ length: columns }, (_, column) => matrix.map((row) => row[column] ?? 0));
}

function determinantOf(matrix: number[][]): number | null {
  if (matrix.length === 0 || matrix.some((row) => row.length !== matrix.length)) return null;
  if (matrix.length === 1) return matrix[0][0];
  if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  return matrix[0].reduce((total, value, column) => total + value * ((column % 2 === 0 ? 1 : -1) * (determinantOf(minor(matrix, 0, column)) ?? 0)), 0);
}

function inverse2x2(matrix: number[][]) {
  const det = determinantOf(matrix);
  if (!det) return null;
  return [
    [round(matrix[1][1] / det), round(-matrix[0][1] / det)],
    [round(-matrix[1][0] / det), round(matrix[0][0] / det)],
  ];
}

function rrefMatrix(matrix: number[][]) {
  const output = matrix.map((row) => [...row]);
  let lead = 0;
  for (let row = 0; row < output.length; row += 1) {
    if (lead >= output[0].length) return output.map((item) => item.map(round));
    let pivot = row;
    while (Math.abs(output[pivot][lead]) < 1e-12) {
      pivot += 1;
      if (pivot === output.length) {
        pivot = row;
        lead += 1;
        if (lead === output[0].length) return output.map((item) => item.map(round));
      }
    }
    [output[pivot], output[row]] = [output[row], output[pivot]];
    const divisor = output[row][lead];
    output[row] = output[row].map((value) => value / divisor);
    for (let other = 0; other < output.length; other += 1) {
      if (other !== row) {
        const factor = output[other][lead];
        output[other] = output[other].map((value, column) => value - factor * output[row][column]);
      }
    }
    lead += 1;
  }
  return output.map((row) => row.map(round));
}

function minor(matrix: number[][], rowToRemove: number, columnToRemove: number) {
  return matrix.filter((_, row) => row !== rowToRemove).map((row) => row.filter((_, column) => column !== columnToRemove));
}

function parseAssumptions(assumptions: string) {
  return assumptions
    .split(/[;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function assumptionWarnings(assumptions: string) {
  return assumptions.trim() ? ["Assumptions are recorded for interpretation; the offline CAS does not enforce every domain condition automatically."] : [];
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
