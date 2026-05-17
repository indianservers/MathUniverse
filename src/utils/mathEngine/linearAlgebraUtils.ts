export type Vector2 = [number, number];
export type Vector3 = [number, number, number];
export type Matrix = number[][];

export type RowReductionStep = {
  title: string;
  operation: string;
  matrix: Matrix;
  pivot?: [number, number];
};

export function vectorMagnitude(v: number[]) {
  return Math.sqrt(v.reduce((sum, value) => sum + value * value, 0));
}

export function unitVector(v: number[]) {
  const magnitude = vectorMagnitude(v);
  if (magnitude < 1e-10) return { result: v.map(() => 0), warning: "Zero vector has no unique unit direction." };
  return { result: v.map((value) => value / magnitude) };
}

export function dotProduct(u: number[], v: number[]) {
  const length = Math.min(u.length, v.length);
  return Array.from({ length }, (_, index) => u[index] * v[index]).reduce((sum, value) => sum + value, 0);
}

export function crossProduct(u: Vector3, v: Vector3) {
  return {
    result: [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ] as Vector3,
    steps: [
      `i component = ${format(u[1])} x ${format(v[2])} - ${format(u[2])} x ${format(v[1])}`,
      `j component = ${format(u[2])} x ${format(v[0])} - ${format(u[0])} x ${format(v[2])}`,
      `k component = ${format(u[0])} x ${format(v[1])} - ${format(u[1])} x ${format(v[0])}`,
    ],
  };
}

export function vectorProjection(u: Vector2, v: Vector2) {
  const denominator = dotProduct(v, v);
  if (Math.abs(denominator) < 1e-10) return { result: [0, 0] as Vector2, scalar: 0, warning: "Cannot project onto the zero vector." };
  const scalar = dotProduct(u, v) / denominator;
  return { result: scalarVectorMultiply(scalar, v) as Vector2, scalar };
}

export function vectorAdd(u: number[], v: number[]) {
  return u.map((value, index) => value + (v[index] ?? 0));
}

export function vectorSubtract(u: number[], v: number[]) {
  return u.map((value, index) => value - (v[index] ?? 0));
}

export function scalarVectorMultiply(k: number, v: number[]) {
  return v.map((value) => k * value);
}

export function determinant2x2(matrix: Matrix) {
  if (matrix.length < 2 || matrix[0]?.length < 2 || matrix[1]?.length < 2) return { value: 0, error: "Use a 2x2 matrix." };
  return { value: matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0] };
}

export function checkBasis2D(u: Vector2, v: Vector2) {
  const det = u[0] * v[1] - v[0] * u[1];
  return {
    determinant: det,
    isBasis: Math.abs(det) > 1e-10,
    explanation: Math.abs(det) > 1e-10 ? "The vectors are independent and span R^2." : "The vectors are parallel or dependent, so they span a line.",
  };
}

export function gaussianElimination(input: Matrix) {
  const matrix = cloneMatrix(input);
  const steps: RowReductionStep[] = [{ title: "Start", operation: "Original matrix", matrix: cloneMatrix(matrix) }];
  let pivotRow = 0;
  for (let col = 0; col < columns(matrix) && pivotRow < matrix.length; col += 1) {
    let best = pivotRow;
    for (let row = pivotRow + 1; row < matrix.length; row += 1) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[best][col])) best = row;
    }
    if (Math.abs(matrix[best][col]) < 1e-10) continue;
    if (best !== pivotRow) {
      [matrix[pivotRow], matrix[best]] = [matrix[best], matrix[pivotRow]];
      steps.push({ title: "Swap rows", operation: `R${pivotRow + 1} <-> R${best + 1}`, matrix: cloneMatrix(matrix), pivot: [pivotRow, col] });
    }
    const pivot = matrix[pivotRow][col];
    if (Math.abs(pivot - 1) > 1e-10) {
      matrix[pivotRow] = matrix[pivotRow].map((value) => value / pivot);
      steps.push({ title: "Scale pivot row", operation: `R${pivotRow + 1} -> R${pivotRow + 1} / ${format(pivot)}`, matrix: cloneMatrix(matrix), pivot: [pivotRow, col] });
    }
    for (let row = pivotRow + 1; row < matrix.length; row += 1) {
      const factor = matrix[row][col];
      if (Math.abs(factor) < 1e-10) continue;
      matrix[row] = matrix[row].map((value, index) => value - factor * matrix[pivotRow][index]);
      steps.push({ title: "Eliminate below pivot", operation: `R${row + 1} -> R${row + 1} - (${format(factor)})R${pivotRow + 1}`, matrix: cloneMatrix(matrix), pivot: [pivotRow, col] });
    }
    pivotRow += 1;
  }
  return { result: cleanMatrix(matrix), steps };
}

export function rref(input: Matrix) {
  const matrix = cloneMatrix(input);
  const steps: RowReductionStep[] = [{ title: "Start", operation: "Original matrix", matrix: cloneMatrix(matrix) }];
  let pivotRow = 0;
  for (let col = 0; col < columns(matrix) && pivotRow < matrix.length; col += 1) {
    let best = pivotRow;
    for (let row = pivotRow + 1; row < matrix.length; row += 1) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[best][col])) best = row;
    }
    if (Math.abs(matrix[best][col]) < 1e-10) continue;
    if (best !== pivotRow) {
      [matrix[pivotRow], matrix[best]] = [matrix[best], matrix[pivotRow]];
      steps.push({ title: "Swap rows", operation: `R${pivotRow + 1} <-> R${best + 1}`, matrix: cloneMatrix(matrix), pivot: [pivotRow, col] });
    }
    const pivot = matrix[pivotRow][col];
    matrix[pivotRow] = matrix[pivotRow].map((value) => value / pivot);
    steps.push({ title: "Normalize pivot", operation: `R${pivotRow + 1} -> R${pivotRow + 1} / ${format(pivot)}`, matrix: cloneMatrix(matrix), pivot: [pivotRow, col] });
    for (let row = 0; row < matrix.length; row += 1) {
      if (row === pivotRow) continue;
      const factor = matrix[row][col];
      if (Math.abs(factor) < 1e-10) continue;
      matrix[row] = matrix[row].map((value, index) => value - factor * matrix[pivotRow][index]);
      steps.push({ title: "Clear pivot column", operation: `R${row + 1} -> R${row + 1} - (${format(factor)})R${pivotRow + 1}`, matrix: cloneMatrix(matrix), pivot: [pivotRow, col] });
    }
    pivotRow += 1;
  }
  const result = cleanMatrix(matrix);
  return { result, steps, rank: rank(result) };
}

export function rank(input: Matrix) {
  return input.filter((row) => row.some((value) => Math.abs(value) > 1e-8)).length;
}

export function solveAugmentedRref(input: Matrix) {
  const reduced = rref(input);
  const cols = columns(reduced.result);
  if (cols < 2) return { ...reduced, solution: null, status: "not an augmented matrix" };
  const inconsistent = reduced.result.some((row) => row.slice(0, cols - 1).every((value) => Math.abs(value) < 1e-8) && Math.abs(row[cols - 1]) > 1e-8);
  if (inconsistent) return { ...reduced, solution: null, status: "inconsistent" };
  const coefficientRank = rank(reduced.result.map((row) => row.slice(0, cols - 1)));
  if (coefficientRank < cols - 1) return { ...reduced, solution: null, status: "infinitely many solutions" };
  return { ...reduced, solution: reduced.result.slice(0, cols - 1).map((row) => row[cols - 1]), status: "unique solution" };
}

function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}

function cleanMatrix(matrix: Matrix) {
  return matrix.map((row) => row.map((value) => (Math.abs(value) < 1e-10 ? 0 : Number(value.toFixed(6)))));
}

function columns(matrix: Matrix) {
  return matrix[0]?.length ?? 0;
}

function format(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) < 1e-10) return "0";
  return Number(value.toFixed(4)).toString();
}
