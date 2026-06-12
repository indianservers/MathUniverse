import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

type LinearEquation = {
  coefficients: number[];
  constant: number;
  display: string;
};

type ParsedSystem = {
  constants: number[];
  equations: LinearEquation[];
  variables: string[];
};

type SolveState = "unique" | "none" | "infinite";

type LinearSolve = {
  matrix: number[][];
  solution: number[];
  state: SolveState;
  steps: string[];
};

const epsilon = 1e-9;

export function solveSystem(classification: ProblemClassification): ProblemSolverResult | null {
  if (classification.kind !== "system") return null;
  const parsed = parseSystem(classification);
  if (!parsed) {
    return {
      kind: "system",
      method: "Unsupported nonlinear system",
      title: "System",
      normalizedInput: classification.normalizedInput,
      result: "Unsupported nonlinear system",
      restrictions: [],
      steps: [
        "The input was classified as a system of equations.",
        "At least one equation is nonlinear or outside the Phase 6 linear parser.",
        "No linear-system steps were generated because that would be misleading.",
      ],
      assumptions: classification.assumptions,
      warnings: [...classification.warnings, "Unsupported nonlinear system: Phase 6 handles linear 2x2 and 3x3 systems only."],
      canCopy: false,
    };
  }

  if (parsed.variables.length < 2 || parsed.variables.length > 3 || parsed.equations.length !== parsed.variables.length) {
    return {
      kind: "system",
      method: "Unsupported system size",
      title: "System",
      normalizedInput: classification.normalizedInput,
      result: "Unsupported system size",
      restrictions: [],
      steps: [
        `Detected ${parsed.equations.length} equation(s) in ${parsed.variables.length} variable(s).`,
        "Phase 6 supports square 2x2 and 3x3 linear systems.",
      ],
      assumptions: classification.assumptions,
      warnings: [...classification.warnings, "Only square 2x2 and 3x3 linear systems are solved in Phase 6."],
      canCopy: false,
    };
  }

  const matrix = parsed.equations.map((equation) => [...equation.coefficients, equation.constant]);
  const solved = gaussianSolve(matrix);
  const method = parsed.variables.length === 2 ? "Elimination method" : "Matrix row-reduction";
  const result = finalAnswer(parsed, solved);
  return {
    kind: "system",
    method,
    title: `${parsed.variables.length}x${parsed.variables.length} Linear System`,
    normalizedInput: classification.normalizedInput,
    result,
    restrictions: [],
    steps: [
      `Write the system: ${parsed.equations.map((equation) => equation.display).join("; ")}.`,
      `Variables: ${parsed.variables.join(", ")}.`,
      `Coefficient matrix: ${formatCoefficientMatrix(parsed)}.`,
      `Constants vector: [${parsed.constants.map(formatNumber).join(", ")}].`,
      ...(parsed.variables.length === 2 ? eliminationSteps2x2(parsed, solved) : matrixSteps3x3(parsed, solved)),
      ...stateSteps(parsed, solved),
    ],
    assumptions: [...classification.assumptions, `${parsed.equations.length} equations and ${parsed.variables.length} variables were parsed as a linear system.`],
    verification: verificationSteps(parsed, solved),
    warnings: stateWarnings(solved),
    canCopy: solved.state === "unique",
  };
}

function parseSystem(classification: ProblemClassification): ParsedSystem | null {
  const equations = splitSystemInput(classification.rawInput || classification.normalizedInput);
  if (equations.length < 2) return null;
  const variables = classification.variables?.length ? classification.variables : extractVariables(equations.join(";"));
  const orderedVariables = variables.slice().sort();
  const parsedEquations: LinearEquation[] = [];
  for (const equation of equations) {
    const parsed = parseLinearEquation(equation, orderedVariables);
    if (!parsed) return null;
    parsedEquations.push(parsed);
  }
  return {
    constants: parsedEquations.map((equation) => equation.constant),
    equations: parsedEquations,
    variables: orderedVariables,
  };
}

function splitSystemInput(input: string) {
  return input
    .replace(/^solve\s+/i, "")
    .split(/\s+and\s+|;|\n/)
    .map((piece) => piece.trim())
    .filter((piece) => piece.includes("="));
}

function parseLinearEquation(equation: string, variables: string[]): LinearEquation | null {
  if (/\^[2-9]|\b(?:sin|cos|tan|log|sqrt)\s*\(/i.test(equation)) return null;
  const [left, right] = equation.split("=");
  if (!left || right === undefined) return null;
  const leftParsed = parseLinearExpression(left, variables);
  const rightParsed = parseLinearExpression(right, variables);
  if (!leftParsed || !rightParsed) return null;
  return {
    coefficients: variables.map((variable) => (leftParsed.coefficients[variable] ?? 0) - (rightParsed.coefficients[variable] ?? 0)),
    constant: rightParsed.constant - leftParsed.constant,
    display: formatEquation(equation),
  };
}

function parseLinearExpression(expression: string, variables: string[]) {
  const normalized = normalizeExpression(expression);
  if (!normalized) return { coefficients: {}, constant: 0 };
  const pieces = splitSignedTerms(normalized);
  const coefficients: Record<string, number> = {};
  let constant = 0;
  for (const piece of pieces) {
    const sign = piece.startsWith("-") ? -1 : 1;
    const body = piece.replace(/^[+-]/, "");
    const variable = variables.find((item) => new RegExp(`(^|\\*)${escapeRegExp(item)}$`).test(body));
    if (variable) {
      const coefficientText = body.replace(new RegExp(`\\*?${escapeRegExp(variable)}$`), "");
      const coefficient = coefficientText ? Number(coefficientText) : 1;
      if (!Number.isFinite(coefficient)) return null;
      coefficients[variable] = (coefficients[variable] ?? 0) + sign * coefficient;
      continue;
    }
    const value = Number(body);
    if (!Number.isFinite(value)) return null;
    constant += sign * value;
  }
  return { coefficients, constant };
}

function gaussianSolve(source: number[][]): LinearSolve {
  const matrix = source.map((row) => [...row]);
  const n = matrix.length;
  const steps: string[] = [`Start with augmented matrix ${formatMatrix(matrix)}.`];
  let row = 0;
  for (let col = 0; col < n && row < n; col += 1) {
    let pivot = row;
    for (let candidate = row + 1; candidate < n; candidate += 1) {
      if (Math.abs(matrix[candidate][col]) > Math.abs(matrix[pivot][col])) pivot = candidate;
    }
    if (isZero(matrix[pivot][col])) continue;
    if (pivot !== row) {
      [matrix[row], matrix[pivot]] = [matrix[pivot], matrix[row]];
      steps.push(`Swap R${row + 1} and R${pivot + 1}: ${formatMatrix(matrix)}.`);
    }
    const pivotValue = matrix[row][col];
    if (!isZero(pivotValue - 1)) {
      for (let j = col; j <= n; j += 1) matrix[row][j] /= pivotValue;
      steps.push(`Scale R${row + 1} by ${formatNumber(1 / pivotValue)}: ${formatMatrix(matrix)}.`);
    }
    for (let target = 0; target < n; target += 1) {
      if (target === row || isZero(matrix[target][col])) continue;
      const factor = matrix[target][col];
      for (let j = col; j <= n; j += 1) matrix[target][j] -= factor * matrix[row][j];
      steps.push(`Replace R${target + 1} with R${target + 1} - (${formatNumber(factor)})R${row + 1}: ${formatMatrix(matrix)}.`);
    }
    row += 1;
  }
  const rankCoefficients = matrix.filter((item) => item.slice(0, n).some((value) => !isZero(value))).length;
  const inconsistent = matrix.some((item) => item.slice(0, n).every(isZero) && !isZero(item[n]));
  if (inconsistent) return { matrix, solution: [], state: "none", steps };
  if (rankCoefficients < n) return { matrix, solution: [], state: "infinite", steps };
  return { matrix, solution: matrix.map((item) => cleanNumber(item[n])), state: "unique", steps };
}

function eliminationSteps2x2(parsed: ParsedSystem, solved: LinearSolve) {
  if (solved.state !== "unique") return solved.steps;
  const [first, second] = parsed.equations;
  const [a, b] = first.coefficients;
  const [c, d] = second.coefficients;
  const [e, f] = parsed.constants;
  const determinantY = b * c - a * d;
  const variableToEliminate = !isZero(b + d) ? parsed.variables[1] : parsed.variables[0];
  const steps = [`Use elimination to solve the 2x2 system.`];
  if (variableToEliminate === parsed.variables[1] && isZero(b + d)) {
    steps.push(`Add the two equations to eliminate ${parsed.variables[1]}.`);
    steps.push(`${formatLinearSide(first.coefficients, parsed.variables)} + ${formatLinearSide(second.coefficients, parsed.variables)} = ${formatNumber(e)} + ${formatNumber(f)}.`);
  } else if (!isZero(determinantY)) {
    steps.push(`Choose ${parsed.variables[1]} to eliminate.`);
    steps.push(`Multiply the first equation by ${formatNumber(d)} and the second by ${formatNumber(-b)}.`);
    steps.push(`Add the new equations so the ${parsed.variables[1]} terms cancel.`);
  } else {
    steps.push(`Use row reduction because direct one-step elimination needs scaling.`);
  }
  const [xValue, yValue] = solved.solution;
  steps.push(`${parsed.variables[0]} = ${formatNumber(xValue)}.`);
  steps.push(`Substitute ${parsed.variables[0]} = ${formatNumber(xValue)} into ${second.display}.`);
  steps.push(`${parsed.variables[1]} = ${formatNumber(yValue)}.`);
  steps.push(`Final answer: ${finalAnswer(parsed, solved)}.`);
  return steps;
}

function matrixSteps3x3(parsed: ParsedSystem, solved: LinearSolve) {
  return [
    "Use matrix row-reduction on the augmented matrix.",
    ...solved.steps,
    solved.state === "unique" ? `Read the solution from the final matrix: ${finalAnswer(parsed, solved)}.` : "Read the system state from the final matrix.",
  ];
}

function stateSteps(parsed: ParsedSystem, solved: LinearSolve) {
  if (solved.state === "none") return ["A row reduces to 0 = nonzero, so the system is inconsistent.", "Final answer: no solution."];
  if (solved.state === "infinite") return ["At least one variable is free after reduction, so the equations are dependent.", "Final answer: infinitely many solutions."];
  return [`Verification by substitution confirms ${finalAnswer(parsed, solved)}.`];
}

function verificationSteps(parsed: ParsedSystem, solved: LinearSolve) {
  if (solved.state !== "unique") return [];
  return parsed.equations.map((equation) => {
    const left = equation.coefficients.reduce((sum, coefficient, index) => sum + coefficient * solved.solution[index], 0);
    return `Check ${equation.display}: ${formatNumber(left)} = ${formatNumber(equation.constant)}.`;
  });
}

function finalAnswer(parsed: ParsedSystem, solved: LinearSolve) {
  if (solved.state === "none") return "No solution";
  if (solved.state === "infinite") return "Infinitely many solutions";
  return parsed.variables.map((variable, index) => `${variable} = ${formatNumber(solved.solution[index])}`).join(", ");
}

function stateWarnings(solved: LinearSolve) {
  if (solved.state === "none") return ["The system is inconsistent and has no solution."];
  if (solved.state === "infinite") return ["The system is dependent and has infinitely many solutions."];
  return [];
}

function normalizeExpression(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "")
    .replace(/(\d)([a-zA-Z(])/g, "$1*$2")
    .replace(/([a-zA-Z)])(\d)/g, "$1*$2")
    .replace(/\)([a-zA-Z(])/g, ")*$1");
}

function splitSignedTerms(expression: string) {
  const prefixed = expression.startsWith("-") ? expression : `+${expression}`;
  return prefixed.match(/[+-][^+-]+/g) ?? [];
}

function extractVariables(value: string) {
  return Array.from(new Set(value.match(/[a-zA-Z]/g) ?? [])).sort();
}

function formatCoefficientMatrix(parsed: ParsedSystem) {
  return `[${parsed.equations.map((equation) => `[${equation.coefficients.map(formatNumber).join(", ")}]`).join(", ")}]`;
}

function formatMatrix(matrix: number[][]) {
  return `[${matrix.map((row) => `[${row.map((value) => formatNumber(cleanNumber(value))).join(", ")}]`).join(", ")}]`;
}

function formatLinearSide(coefficients: number[], variables: string[]) {
  const terms = coefficients.map((coefficient, index) => formatVariableTerm(coefficient, variables[index])).filter(Boolean);
  return terms.length ? terms.map((term, index) => index === 0 ? term : term.startsWith("-") ? ` - ${term.slice(1)}` : ` + ${term}`).join("") : "0";
}

function formatVariableTerm(coefficient: number, variable: string) {
  if (isZero(coefficient)) return "";
  const sign = coefficient < 0 ? "-" : "";
  const abs = Math.abs(coefficient);
  return `${sign}${isZero(abs - 1) ? "" : formatNumber(abs)}${variable}`;
}

function formatEquation(equation: string) {
  const [left, right] = equation.split("=");
  return `${formatEquationSide(left)} = ${formatEquationSide(right)}`;
}

function formatEquationSide(value = "") {
  return normalizeExpression(value).replace(/\*/g, "").replace(/\+/g, " + ").replace(/-/g, " - ").replace(/\s+/g, " ").trim().replace(/^-\s*/, "-");
}

function cleanNumber(value: number) {
  return isZero(value) ? 0 : value;
}

function formatNumber(value: number) {
  const rounded = Math.round(cleanNumber(value) * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isZero(value: number) {
  return Math.abs(value) < epsilon;
}
