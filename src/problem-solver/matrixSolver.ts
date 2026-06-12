import type { ProblemClassification, ProblemSolverResult } from "./problemTypes";

type Matrix = number[][];

type ParsedMatrix = {
  matrix: Matrix;
  rest: string;
};

const epsilon = 1e-9;

export function solveMatrix(classification: ProblemClassification): ProblemSolverResult | null {
  if (classification.kind !== "matrix") return null;
  const input = classification.rawInput.trim();
  const computed = computeMatrix(input);
  if (!computed) {
    return matrixResult(classification, {
      method: "Invalid matrix input",
      result: "Invalid matrix input",
      steps: [
        "The input was classified as a matrix expression.",
        "The matrix parser could not safely parse the matrix syntax.",
        "No matrix operation was performed.",
      ],
      warnings: ["Invalid matrix syntax or unsupported matrix operation."],
      canCopy: false,
    });
  }
  return matrixResult(classification, computed);
}

function computeMatrix(input: string): { method: string; result: string; steps: string[]; warnings?: string[]; verification?: string[]; canCopy?: boolean } | null {
  const lower = input.toLowerCase();
  if (lower.startsWith("solve matrix")) return solveAugmentedMatrix(input.replace(/^solve\s+matrix\s+/i, ""));
  if (lower.startsWith("determinant")) return determinantOperation(input.replace(/^determinant\s+/i, ""));
  if (lower.startsWith("inverse")) return inverseOperation(input.replace(/^inverse\s+/i, ""));
  if (lower.startsWith("transpose")) return transposeOperation(input.replace(/^transpose\s+/i, ""));
  if (lower.startsWith("rref")) return rrefOperation(input.replace(/^rref\s+/i, ""));
  return binaryOrLiteralOperation(input);
}

function binaryOrLiteralOperation(input: string) {
  const left = parseMatrixAt(input, 0);
  if (!left) return scalarOperation(input);
  const rest = left.rest.trim();
  if (!rest) {
    return {
      method: "Matrix parsing",
      result: formatMatrix(left.matrix),
      steps: [
        `Input matrix: ${formatMatrix(left.matrix)}.`,
        `Dimensions: ${dimensionsText(left.matrix)}.`,
        `Final answer: ${formatMatrix(left.matrix)}.`,
      ],
    };
  }
  const operator = rest[0];
  const right = parseMatrixAt(rest.slice(1).trim(), 0);
  if (!right || right.rest.trim()) return null;
  if (operator === "+") return addSubtractOperation(left.matrix, right.matrix, "add");
  if (operator === "-") return addSubtractOperation(left.matrix, right.matrix, "subtract");
  if (operator === "*") return multiplyOperation(left.matrix, right.matrix);
  return null;
}

function scalarOperation(input: string) {
  const match = input.match(/^([-+]?\d+(?:\.\d+)?)\s*\*\s*/);
  if (!match) return null;
  const parsed = parseMatrixAt(input.slice(match[0].length), 0);
  if (!parsed || parsed.rest.trim()) return null;
  const scalar = Number(match[1]);
  const result = parsed.matrix.map((row) => row.map((value) => scalar * value));
  return {
    method: "Scalar multiplication",
    result: formatMatrix(result),
    steps: [
      `Scalar value: ${formatNumber(scalar)}.`,
      `Input matrix: ${formatMatrix(parsed.matrix)}.`,
      `Multiply each element by ${formatNumber(scalar)}.`,
      `Result matrix: ${formatMatrix(result)}.`,
      `Final answer: ${formatMatrix(result)}.`,
    ],
  };
}

function addSubtractOperation(left: Matrix, right: Matrix, operation: "add" | "subtract") {
  if (!sameDimensions(left, right)) {
    return {
      method: operation === "add" ? "Matrix addition" : "Matrix subtraction",
      result: "Incompatible matrix dimensions",
      steps: [
        `Left dimensions: ${dimensionsText(left)}.`,
        `Right dimensions: ${dimensionsText(right)}.`,
        "Addition/subtraction requires the same dimensions.",
      ],
      warnings: ["Matrix dimensions must match for addition/subtraction."],
      canCopy: false,
    };
  }
  const sign = operation === "add" ? 1 : -1;
  const result = left.map((row, r) => row.map((value, c) => value + sign * right[r][c]));
  return {
    method: operation === "add" ? "Matrix addition" : "Matrix subtraction",
    result: formatMatrix(result),
    steps: [
      `Left matrix dimensions: ${dimensionsText(left)}.`,
      `Right matrix dimensions: ${dimensionsText(right)}.`,
      `Perform ${operation === "add" ? "addition" : "subtraction"} element by element.`,
      ...result.flatMap((row, r) => row.map((value, c) => `Cell (${r + 1}, ${c + 1}): ${formatNumber(left[r][c])} ${operation === "add" ? "+" : "-"} ${formatNumber(right[r][c])} = ${formatNumber(value)}.`)),
      `Result matrix: ${formatMatrix(result)}.`,
    ],
  };
}

function multiplyOperation(left: Matrix, right: Matrix) {
  if (left[0].length !== right.length) {
    return {
      method: "Matrix multiplication",
      result: "Incompatible matrix dimensions",
      steps: [
        `Left dimensions: ${dimensionsText(left)}.`,
        `Right dimensions: ${dimensionsText(right)}.`,
        "Matrix multiplication requires left columns to equal right rows.",
      ],
      warnings: ["Incompatible dimensions for matrix multiplication."],
      canCopy: false,
    };
  }
  const result = Array.from({ length: left.length }, (_, r) => Array.from({ length: right[0].length }, (_, c) => {
    return left[r].reduce((total, value, index) => total + value * right[index][c], 0);
  }));
  return {
    method: "Matrix multiplication",
    result: formatMatrix(result),
    steps: [
      `Left dimensions: ${dimensionsText(left)}.`,
      `Right dimensions: ${dimensionsText(right)}.`,
      "Each result cell is a row-column dot product.",
      ...result.flatMap((row, r) => row.map((value, c) => {
        const products = left[r].map((item, index) => `${formatNumber(item)}*${formatNumber(right[index][c])}`);
        return `Cell (${r + 1}, ${c + 1}): ${products.join(" + ")} = ${formatNumber(value)}.`;
      })),
      `Result matrix: ${formatMatrix(result)}.`,
    ],
  };
}

function transposeOperation(body: string) {
  const parsed = parseSingleMatrix(body);
  if (!parsed) return null;
  const result = transpose(parsed);
  return {
    method: "Transpose",
    result: formatMatrix(result),
    steps: [
      `Input matrix: ${formatMatrix(parsed)}.`,
      `Dimensions: ${dimensionsText(parsed)}.`,
      "Rows become columns.",
      `Result matrix: ${formatMatrix(result)}.`,
    ],
  };
}

function determinantOperation(body: string) {
  const matrix = parseSingleMatrix(body);
  if (!matrix) return null;
  if (!isSquare(matrix)) {
    return {
      method: "Determinant",
      result: "Determinant requires a square matrix",
      steps: [`Input matrix: ${formatMatrix(matrix)}.`, `Dimensions: ${dimensionsText(matrix)}.`, "A determinant is defined only for square matrices."],
      warnings: ["Determinant requires a square matrix."],
      canCopy: false,
    };
  }
  if (matrix.length === 2) {
    const [[a, b], [c, d]] = matrix;
    const det = a * d - b * c;
    return {
      method: "Determinant",
      result: formatNumber(det),
      steps: [
        `Input matrix: ${formatMatrix(matrix)}.`,
        "Formula for 2x2 determinant: ad - bc.",
        `Substitute: ${formatNumber(a)}*${formatNumber(d)} - ${formatNumber(b)}*${formatNumber(c)}.`,
        `Determinant = ${formatNumber(det)}.`,
        `Final answer: ${formatNumber(det)}.`,
      ],
    };
  }
  if (matrix.length === 3) {
    const det = determinant3(matrix);
    return {
      method: "Determinant",
      result: formatNumber(det),
      steps: [
        `Input matrix: ${formatMatrix(matrix)}.`,
        "Use cofactor expansion across the first row.",
        `det(A) = a(ei - fh) - b(di - fg) + c(dh - eg).`,
        `Determinant = ${formatNumber(det)}.`,
        `Final answer: ${formatNumber(det)}.`,
      ],
    };
  }
  return {
    method: "Determinant",
    result: "Unsupported determinant size",
    steps: [`Input matrix: ${formatMatrix(matrix)}.`, "Phase 8 supports determinant steps for 2x2 and 3x3 matrices."],
    warnings: ["Determinants larger than 3x3 are not expanded in Phase 8."],
    canCopy: false,
  };
}

function inverseOperation(body: string) {
  const matrix = parseSingleMatrix(body);
  if (!matrix) return null;
  if (!isSquare(matrix)) {
    return {
      method: "Inverse",
      result: "Inverse requires a square matrix",
      steps: [`Input matrix: ${formatMatrix(matrix)}.`, `Dimensions: ${dimensionsText(matrix)}.`, "Only square matrices can have inverses."],
      warnings: ["Inverse requires a square matrix."],
      canCopy: false,
    };
  }
  if (matrix.length === 2) {
    const [[a, b], [c, d]] = matrix;
    const det = a * d - b * c;
    if (isZero(det)) return singularInverse(matrix);
    const result = [[d / det, -b / det], [-c / det, a / det]];
    return {
      method: "Inverse",
      result: formatMatrix(result),
      steps: [
        `Input matrix: ${formatMatrix(matrix)}.`,
        "For [[a,b],[c,d]], A^-1 = 1/(ad-bc) [[d,-b],[-c,a]].",
        `Determinant = ${formatNumber(a)}*${formatNumber(d)} - ${formatNumber(b)}*${formatNumber(c)} = ${formatNumber(det)}.`,
        `Substitute into the inverse formula: 1/${formatNumber(det)} * ${formatMatrix([[d, -b], [-c, a]])}.`,
        `Result matrix: ${formatMatrix(result)}.`,
      ],
    };
  }
  const augmented = matrix.map((row, r) => [...row, ...identity(matrix.length)[r]]);
  const reduced = rrefWithSteps(augmented);
  const left = reduced.matrix.map((row) => row.slice(0, matrix.length));
  if (!isIdentity(left)) return singularInverse(matrix);
  const inverse = reduced.matrix.map((row) => row.slice(matrix.length));
  return {
    method: "Inverse by RREF",
    result: formatMatrix(inverse),
    steps: [
      `Input matrix: ${formatMatrix(matrix)}.`,
      `Augment with the identity matrix: ${formatMatrix(augmented)}.`,
      ...reduced.steps,
      `Right side is the inverse: ${formatMatrix(inverse)}.`,
    ],
  };
}

function rrefOperation(body: string) {
  const matrix = parseSingleMatrix(body);
  if (!matrix) return null;
  const reduced = rrefWithSteps(matrix);
  return {
    method: "RREF",
    result: formatMatrix(reduced.matrix),
    steps: [
      `Starting matrix: ${formatMatrix(matrix)}.`,
      ...reduced.steps,
      `Final RREF: ${formatMatrix(reduced.matrix)}.`,
    ],
  };
}

function solveAugmentedMatrix(body: string) {
  const matrix = parseSingleMatrix(body);
  if (!matrix) return null;
  const rows = matrix.length;
  const cols = matrix[0].length;
  if (cols !== rows + 1) {
    return {
      method: "Solve matrix",
      result: "Invalid augmented matrix dimensions",
      steps: [`Input matrix: ${formatMatrix(matrix)}.`, "An augmented system matrix needs one more column than variables."],
      warnings: ["Invalid augmented matrix dimensions."],
      canCopy: false,
    };
  }
  const reduced = rrefWithSteps(matrix);
  const coefficientSide = reduced.matrix.map((row) => row.slice(0, rows));
  if (!isIdentity(coefficientSide)) {
    return {
      method: "Solve matrix",
      result: "No unique solution",
      steps: [`Input augmented matrix: ${formatMatrix(matrix)}.`, ...reduced.steps, "The coefficient side did not reduce to the identity matrix."],
      warnings: ["The augmented matrix does not have a unique solution."],
      canCopy: false,
    };
  }
  const variables = ["x", "y", "z", "w"].slice(0, rows);
  const values = reduced.matrix.map((row) => row[cols - 1]);
  const result = variables.map((variable, index) => `${variable} = ${formatNumber(values[index])}`).join(", ");
  return {
    method: "Solve matrix",
    result,
    steps: [
      `Interpret ${formatMatrix(matrix)} as an augmented matrix.`,
      `Variables: ${variables.join(", ")}.`,
      ...matrixToEquationSteps(matrix, variables),
      ...reduced.steps,
      `Read the solution from the final column: ${result}.`,
      `Final answer: ${result}.`,
    ],
    verification: matrix.map((row, r) => {
      const left = row.slice(0, rows).reduce((total, coefficient, index) => total + coefficient * values[index], 0);
      return `Check row ${r + 1}: ${formatNumber(left)} = ${formatNumber(row[cols - 1])}.`;
    }),
  };
}

function parseSingleMatrix(body: string) {
  const parsed = parseMatrixAt(body.trim(), 0);
  if (!parsed || parsed.rest.trim()) return null;
  return parsed.matrix;
}

function parseMatrixAt(input: string, start: number): ParsedMatrix | null {
  let index = start;
  while (/\s/.test(input[index] ?? "")) index += 1;
  if (input[index] !== "[" || input[index + 1] !== "[") return null;
  const begin = index;
  let depth = 0;
  for (; index < input.length; index += 1) {
    if (input[index] === "[") depth += 1;
    if (input[index] === "]") {
      depth -= 1;
      if (depth === 0) {
        const source = input.slice(begin, index + 1);
        const matrix = parseMatrixLiteral(source);
        if (!matrix) return null;
        return { matrix, rest: input.slice(index + 1) };
      }
    }
  }
  return null;
}

function parseMatrixLiteral(source: string): Matrix | null {
  try {
    const parsed = JSON.parse(source) as unknown;
    if (!Array.isArray(parsed) || !parsed.length) return null;
    const matrix = parsed.map((row) => {
      if (!Array.isArray(row) || !row.length) throw new Error("Invalid row");
      return row.map((value) => {
        if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Invalid value");
        return value;
      });
    });
    const width = matrix[0].length;
    if (!matrix.every((row) => row.length === width)) return null;
    return matrix;
  } catch {
    return null;
  }
}

function rrefWithSteps(source: Matrix) {
  const matrix = source.map((row) => [...row]);
  const steps: string[] = [];
  let lead = 0;
  for (let r = 0; r < matrix.length; r += 1) {
    if (lead >= matrix[0].length) break;
    let pivot = r;
    while (isZero(matrix[pivot][lead])) {
      pivot += 1;
      if (pivot === matrix.length) {
        pivot = r;
        lead += 1;
        if (lead === matrix[0].length) return { matrix: cleanMatrix(matrix), steps };
      }
    }
    if (pivot !== r) {
      [matrix[r], matrix[pivot]] = [matrix[pivot], matrix[r]];
      steps.push(`Swap R${r + 1} and R${pivot + 1}: ${formatMatrix(matrix)}.`);
    }
    const pivotValue = matrix[r][lead];
    if (!isZero(pivotValue - 1)) {
      for (let c = 0; c < matrix[0].length; c += 1) matrix[r][c] /= pivotValue;
      steps.push(`Scale R${r + 1} by ${formatNumber(1 / pivotValue)}: ${formatMatrix(matrix)}.`);
    }
    for (let target = 0; target < matrix.length; target += 1) {
      if (target === r || isZero(matrix[target][lead])) continue;
      const factor = matrix[target][lead];
      for (let c = 0; c < matrix[0].length; c += 1) matrix[target][c] -= factor * matrix[r][c];
      steps.push(`Replace R${target + 1} with R${target + 1} - (${formatNumber(factor)})R${r + 1}: ${formatMatrix(matrix)}.`);
    }
    lead += 1;
  }
  return { matrix: cleanMatrix(matrix), steps };
}

function matrixResult(classification: ProblemClassification, data: { method: string; result: string; steps: string[]; warnings?: string[]; verification?: string[]; canCopy?: boolean }): ProblemSolverResult {
  return {
    kind: "matrix",
    method: data.method,
    title: "Matrix",
    normalizedInput: classification.normalizedInput,
    result: data.result,
    restrictions: [],
    steps: data.steps,
    assumptions: classification.assumptions,
    verification: data.verification,
    warnings: [...classification.warnings, ...(data.warnings ?? [])],
    canCopy: data.canCopy ?? true,
  };
}

function singularInverse(matrix: Matrix) {
  return {
    method: "Inverse",
    result: "Matrix is singular",
    steps: [`Input matrix: ${formatMatrix(matrix)}.`, "The determinant is 0, so the matrix has no inverse."],
    warnings: ["Inverse requires a non-zero determinant."],
    canCopy: false,
  };
}

function transpose(matrix: Matrix) {
  return Array.from({ length: matrix[0].length }, (_, c) => matrix.map((row) => row[c]));
}

function determinant3(matrix: Matrix) {
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

function identity(size: number) {
  return Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => (r === c ? 1 : 0)));
}

function matrixToEquationSteps(matrix: Matrix, variables: string[]) {
  return matrix.map((row, r) => {
    const left = row.slice(0, variables.length).map((coefficient, index) => `${formatNumber(coefficient)}${variables[index]}`).join(" + ").replace(/\+ -/g, "- ");
    return `Row ${r + 1} represents ${left} = ${formatNumber(row[row.length - 1])}.`;
  });
}

function sameDimensions(left: Matrix, right: Matrix) {
  return left.length === right.length && left[0].length === right[0].length;
}

function isSquare(matrix: Matrix) {
  return matrix.length === matrix[0].length;
}

function isIdentity(matrix: Matrix) {
  return matrix.every((row, r) => row.every((value, c) => (r === c ? isZero(value - 1) : isZero(value))));
}

function cleanMatrix(matrix: Matrix) {
  return matrix.map((row) => row.map((value) => (isZero(value) ? 0 : value)));
}

function dimensionsText(matrix: Matrix) {
  return `${matrix.length}x${matrix[0].length}`;
}

function formatMatrix(matrix: Matrix) {
  return `[${matrix.map((row) => `[${row.map(formatNumber).join(",")} ]`.replace(",]", "]").replace(" ]", "]")).join(",")}]`;
}

function formatNumber(value: number) {
  const rounded = Math.round((isZero(value) ? 0 : value) * 1_000_000) / 1_000_000;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

function isZero(value: number) {
  return Math.abs(value) < epsilon;
}
