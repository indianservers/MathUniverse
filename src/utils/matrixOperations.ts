export type Matrix = number[][];
export type Cell = [number, number];

export type MatrixStep = {
  title: string;
  formula: string;
  calculation: string;
  matrix?: Matrix;
  result?: Matrix;
  highlightA?: Cell[];
  highlightB?: Cell[];
  highlightResult?: Cell[];
};

export type MatrixStepResult = {
  result: Matrix;
  steps: MatrixStep[];
  error?: string;
  value?: number;
};

export function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}

export function createMatrix(rows: number, cols: number, fill = 0): Matrix {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
}

export function parseMatrixValue(value: string | number) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const clean = value.trim();
  if (!clean) return 0;
  if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(clean)) {
    const [top, bottom] = clean.split("/").map(Number);
    return bottom === 0 ? 0 : top / bottom;
  }
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function matrixOrder(matrix: Matrix) {
  return { rows: matrix.length, cols: matrix[0]?.length ?? 0 };
}

export function sameOrder(a: Matrix, b: Matrix) {
  const ao = matrixOrder(a);
  const bo = matrixOrder(b);
  return ao.rows === bo.rows && ao.cols === bo.cols;
}

export function isSquare(matrix: Matrix) {
  const order = matrixOrder(matrix);
  return order.rows > 0 && order.rows === order.cols;
}

export function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) < 1e-10) return "0";
  return Number(value.toFixed(4)).toString();
}

export function addMatrices(a: Matrix, b: Matrix): MatrixStepResult {
  if (!sameOrder(a, b)) return { result: [], steps: [], error: "Matrix addition requires both matrices to have the same order." };
  const result = createMatrix(a.length, a[0].length);
  const steps: MatrixStep[] = [];
  a.forEach((row, i) => row.forEach((value, j) => {
    result[i][j] = value + b[i][j];
    steps.push({
      title: `Calculate C${i + 1}${j + 1}`,
      formula: `C${i + 1}${j + 1} = A${i + 1}${j + 1} + B${i + 1}${j + 1}`,
      calculation: `${formatNumber(value)} + ${formatNumber(b[i][j])} = ${formatNumber(result[i][j])}`,
      result: cloneMatrix(result),
      highlightA: [[i, j]],
      highlightB: [[i, j]],
      highlightResult: [[i, j]],
    });
  }));
  return { result, steps };
}

export function subtractMatrices(a: Matrix, b: Matrix): MatrixStepResult {
  if (!sameOrder(a, b)) return { result: [], steps: [], error: "Matrix subtraction requires both matrices to have the same order." };
  const result = createMatrix(a.length, a[0].length);
  const steps: MatrixStep[] = [];
  a.forEach((row, i) => row.forEach((value, j) => {
    result[i][j] = value - b[i][j];
    steps.push({
      title: `Calculate C${i + 1}${j + 1}`,
      formula: `C${i + 1}${j + 1} = A${i + 1}${j + 1} - B${i + 1}${j + 1}`,
      calculation: `${formatNumber(value)} - ${formatNumber(b[i][j])} = ${formatNumber(result[i][j])}`,
      result: cloneMatrix(result),
      highlightA: [[i, j]],
      highlightB: [[i, j]],
      highlightResult: [[i, j]],
    });
  }));
  return { result, steps };
}

export function scalarMultiply(k: number, a: Matrix): MatrixStepResult {
  const result = createMatrix(a.length, a[0].length);
  const steps: MatrixStep[] = [];
  a.forEach((row, i) => row.forEach((value, j) => {
    result[i][j] = k * value;
    steps.push({
      title: `Scale A${i + 1}${j + 1}`,
      formula: `B${i + 1}${j + 1} = k x A${i + 1}${j + 1}`,
      calculation: `${formatNumber(k)} x ${formatNumber(value)} = ${formatNumber(result[i][j])}`,
      result: cloneMatrix(result),
      highlightA: [[i, j]],
      highlightResult: [[i, j]],
    });
  }));
  return { result, steps };
}

export function multiplyMatrices(a: Matrix, b: Matrix): MatrixStepResult {
  const ao = matrixOrder(a);
  const bo = matrixOrder(b);
  if (ao.cols !== bo.rows) return { result: [], steps: [], error: "Matrix multiplication requires columns of A to equal rows of B." };
  const result = createMatrix(ao.rows, bo.cols);
  const steps: MatrixStep[] = [];
  for (let i = 0; i < ao.rows; i += 1) {
    for (let j = 0; j < bo.cols; j += 1) {
      const products = Array.from({ length: ao.cols }, (_, k) => a[i][k] * b[k][j]);
      result[i][j] = products.reduce((sum, value) => sum + value, 0);
      steps.push({
        title: `Dot row ${i + 1} with column ${j + 1}`,
        formula: `C${i + 1}${j + 1} = row ${i + 1}(A) dot column ${j + 1}(B)`,
        calculation: products.map((value, k) => `${formatNumber(a[i][k])}x${formatNumber(b[k][j])}`).join(" + ") + ` = ${formatNumber(result[i][j])}`,
        result: cloneMatrix(result),
        highlightA: Array.from({ length: ao.cols }, (_, k) => [i, k] as Cell),
        highlightB: Array.from({ length: ao.cols }, (_, k) => [k, j] as Cell),
        highlightResult: [[i, j]],
      });
    }
  }
  return { result, steps };
}

export function transposeMatrix(a: Matrix): MatrixStepResult {
  const order = matrixOrder(a);
  const result = createMatrix(order.cols, order.rows);
  const steps: MatrixStep[] = [];
  for (let i = 0; i < order.rows; i += 1) {
    for (let j = 0; j < order.cols; j += 1) {
      result[j][i] = a[i][j];
      steps.push({
        title: `Move A${i + 1}${j + 1} to transpose`,
        formula: `(A^T)${j + 1}${i + 1} = A${i + 1}${j + 1}`,
        calculation: `${formatNumber(a[i][j])} moves from row ${i + 1}, column ${j + 1} to row ${j + 1}, column ${i + 1}`,
        result: cloneMatrix(result),
        highlightA: [[i, j]],
        highlightResult: [[j, i]],
      });
    }
  }
  return { result, steps };
}

export function determinant2x2(a: Matrix) {
  return a[0][0] * a[1][1] - a[0][1] * a[1][0];
}

export function determinant3x3(a: Matrix) {
  const p1 = a[0][0] * a[1][1] * a[2][2];
  const p2 = a[0][1] * a[1][2] * a[2][0];
  const p3 = a[0][2] * a[1][0] * a[2][1];
  const n1 = a[0][2] * a[1][1] * a[2][0];
  const n2 = a[0][0] * a[1][2] * a[2][1];
  const n3 = a[0][1] * a[1][0] * a[2][2];
  return p1 + p2 + p3 - n1 - n2 - n3;
}

export function determinant(a: Matrix): number {
  if (!isSquare(a)) throw new Error("Determinant exists only for square matrices.");
  if (a.length === 1) return a[0][0];
  if (a.length === 2) return determinant2x2(a);
  if (a.length === 3) return determinant3x3(a);
  return a[0].reduce((sum, value, col) => {
    const sign = col % 2 === 0 ? 1 : -1;
    return sum + sign * value * determinant(getMinor(a, 0, col));
  }, 0);
}

export function determinantSteps(a: Matrix): MatrixStepResult {
  if (!isSquare(a)) return { result: [], steps: [], error: "Determinant exists only for square matrices." };
  if (a.length === 1) {
    const value = a[0][0];
    return {
      value,
      result: [[value]],
      steps: [{ title: "Read 1x1 determinant", formula: "det([a]) = a", calculation: `det(A) = ${formatNumber(value)}`, result: [[value]], highlightA: [[0, 0]] }],
    };
  }
  if (a.length === 2) {
    const value = determinant2x2(a);
    return {
      value,
      result: [[value]],
      steps: [
        {
          title: "Multiply the main diagonal",
          formula: "ad",
          calculation: `${formatNumber(a[0][0])} x ${formatNumber(a[1][1])} = ${formatNumber(a[0][0] * a[1][1])}`,
          highlightA: [[0, 0], [1, 1]],
        },
        {
          title: "Subtract the other diagonal",
          formula: "det(A) = ad - bc",
          calculation: `${formatNumber(a[0][0] * a[1][1])} - ${formatNumber(a[0][1] * a[1][0])} = ${formatNumber(value)}`,
          highlightA: [[0, 1], [1, 0]],
          result: [[value]],
        },
      ],
    };
  }
  if (a.length >= 3) {
    const terms = a[0].map((value, col) => {
      const sign = col % 2 === 0 ? 1 : -1;
      const minorDet = determinant(getMinor(a, 0, col));
      return { value, col, sign, minorDet, term: sign * value * minorDet };
    });
    const value = terms.reduce((sum, term) => sum + term.term, 0);
    const formula = `det(A) = ${a[0].map((_, col) => `${col % 2 === 0 ? "+" : "-"} a1${col + 1} det(M1${col + 1})`).join(" ")}`;
    return {
      value,
      result: [[value]],
      steps: [
        ...terms.map((term) => ({
          title: "Cofactor Expansion along Row 1",
          formula,
          calculation: `${term.sign > 0 ? "+" : "-"} ${formatNumber(term.value)} x det(M1${term.col + 1}) = ${term.sign > 0 ? "+" : "-"} ${formatNumber(term.value)} x ${formatNumber(term.minorDet)} = ${formatNumber(term.term)}`,
          matrix: getMinor(a, 0, term.col),
          highlightA: [[0, term.col]] as Cell[],
        })),
        {
          title: "Sum cofactors",
          formula,
          calculation: terms.map((term) => formatNumber(term.term)).join(" + ") + ` = ${formatNumber(value)}`,
          result: [[value]],
        },
      ],
    };
  }
  return { result: [], steps: [], error: "Determinant requires at least one row and one column." };
}

export function inverse(a: Matrix): MatrixStepResult {
  if (!isSquare(a)) return { result: [], steps: [], error: "Inverse exists only for square matrices." };
  if (a.length === 1) {
    if (Math.abs(a[0][0]) < 1e-10) return { result: [], steps: [], error: "Inverse does not exist because determinant is zero." };
    return {
      result: [[1 / a[0][0]]],
      steps: [{ title: "Invert 1x1 matrix", formula: "A^-1 = [1/a]", calculation: `1/${formatNumber(a[0][0])} = ${formatNumber(1 / a[0][0])}`, result: [[1 / a[0][0]]] }],
    };
  }
  if (a.length <= 3) return inverseByAdjugate(a);
  return inverseByGaussJordan(a);
}

export function inverse2x2(a: Matrix): MatrixStepResult {
  return inverse(a);
}

function inverseByAdjugate(a: Matrix): MatrixStepResult {
  const det = determinant(a);
  if (Math.abs(det) < 1e-10) return { result: [], steps: [], error: "Inverse does not exist because determinant is zero." };
  const adjoint = adjointMatrix(a);
  if (adjoint.error) return adjoint;
  const adj = adjoint.result;
  const result = adj.map((row) => row.map((value) => value / det));
  const steps: MatrixStep[] = [
    { title: "Find determinant", formula: "det(A)", calculation: `det(A) = ${formatNumber(det)}`, result: [[det]], highlightA: allCells(a) },
  ];
  if (a.length === 2) {
    const swapped = [[a[1][1], a[0][1]], [a[1][0], a[0][0]]];
    steps.push(
      { title: "Swap a and d", formula: "[[d,b],[c,a]]", calculation: "Move diagonal entries into each other's places.", result: swapped, highlightResult: [[0, 0], [1, 1]] },
      { title: "Change signs of b and c", formula: "[[d,-b],[-c,a]]", calculation: "Negate the off-diagonal entries.", result: adj, highlightResult: [[0, 1], [1, 0]] },
    );
  } else {
    steps.push(...adjoint.steps);
  }
  steps.push({ title: "Multiply by reciprocal determinant", formula: "A^-1=(1/det(A)) adj(A)", calculation: `Multiply every entry by 1/${formatNumber(det)}.`, result, highlightResult: allCells(result) });
  return { result, steps };
}

function inverseByGaussJordan(a: Matrix): MatrixStepResult {
  const n = a.length;
  const augmented = a.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => i === j ? 1 : 0)]);
  const steps: MatrixStep[] = [{ title: "Augment with identity", formula: "[A | I]", calculation: "Attach the identity matrix to the right of A.", result: cloneMatrix(augmented) }];

  for (let col = 0; col < n; col += 1) {
    let pivotRow = col;
    for (let row = col + 1; row < n; row += 1) if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivotRow][col])) pivotRow = row;
    if (Math.abs(augmented[pivotRow][col]) < 1e-10) return { result: [], steps, error: "Inverse does not exist because a pivot is zero." };
    if (pivotRow !== col) {
      [augmented[col], augmented[pivotRow]] = [augmented[pivotRow], augmented[col]];
      steps.push({ title: "Swap pivot row", formula: `R${col + 1} <-> R${pivotRow + 1}`, calculation: "Move the largest available pivot into place.", result: cloneMatrix(augmented), highlightResult: augmented[col].map((_, j) => [col, j] as Cell) });
    }
    const pivot = augmented[col][col];
    augmented[col] = augmented[col].map((value) => value / pivot);
    steps.push({ title: "Scale pivot row", formula: `R${col + 1} -> R${col + 1}/${formatNumber(pivot)}`, calculation: "Make the pivot equal to 1.", result: cloneMatrix(augmented), highlightResult: [[col, col]] });
    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = augmented[row][col];
      if (Math.abs(factor) < 1e-10) continue;
      augmented[row] = augmented[row].map((value, j) => value - factor * augmented[col][j]);
      steps.push({ title: "Eliminate column entry", formula: `R${row + 1} -> R${row + 1} - (${formatNumber(factor)})R${col + 1}`, calculation: `Create a zero in column ${col + 1}.`, result: cloneMatrix(augmented), highlightResult: [[row, col]] });
    }
  }

  const result = augmented.map((row) => row.slice(n).map((value) => Math.abs(value) < 1e-10 ? 0 : value));
  steps.push({ title: "Read inverse", formula: "[I | A^-1]", calculation: "The right half is the inverse matrix.", result, highlightResult: allCells(result) });
  return { result, steps };
}

export function getMinor(a: Matrix, row: number, col: number): Matrix {
  return a.filter((_, i) => i !== row).map((items) => items.filter((_, j) => j !== col));
}

export function cofactorMatrix(a: Matrix): MatrixStepResult {
  if (!isSquare(a) || a.length < 2) return { result: [], steps: [], error: "Cofactor matrix exists for square matrices of order at least 2." };
  const result = createMatrix(a.length, a.length);
  const steps: MatrixStep[] = [];
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < a.length; j += 1) {
      const minor = getMinor(a, i, j);
      const minorDet = determinant(minor);
      const sign = (i + j) % 2 === 0 ? 1 : -1;
      result[i][j] = sign * minorDet;
      steps.push({
        title: `Cofactor C${i + 1}${j + 1}`,
        formula: `C${i + 1}${j + 1}=(-1)^(${i + 1}+${j + 1}) minor`,
        calculation: `${sign > 0 ? "+" : "-"} ${formatNumber(minorDet)} = ${formatNumber(result[i][j])}`,
        matrix: minor,
        result: cloneMatrix(result),
        highlightA: [[i, j]],
        highlightResult: [[i, j]],
      });
    }
  }
  return { result, steps };
}

export function adjointMatrix(a: Matrix): MatrixStepResult {
  const cofactors = cofactorMatrix(a);
  if (cofactors.error) return cofactors;
  const transposed = transposeMatrix(cofactors.result).result;
  return {
    result: transposed,
    steps: [
      ...cofactors.steps,
      { title: "Transpose cofactor matrix", formula: "adj(A)=C^T", calculation: "Rows of the cofactor matrix become columns.", result: transposed, highlightResult: allCells(transposed) },
    ],
  };
}

export function rowSwap(a: Matrix, r1: number, r2: number): MatrixStepResult {
  const result = cloneMatrix(a);
  [result[r1], result[r2]] = [result[r2], result[r1]];
  return { result, steps: [{ title: `Swap R${r1 + 1} and R${r2 + 1}`, formula: `R${r1 + 1} <-> R${r2 + 1}`, calculation: "The selected rows exchange positions.", result, highlightResult: result[r1].map((_, j) => [r1, j] as Cell).concat(result[r2].map((_, j) => [r2, j] as Cell)) }] };
}

export function rowScale(a: Matrix, row: number, scalar: number): MatrixStepResult {
  const result = cloneMatrix(a);
  result[row] = result[row].map((value) => scalar * value);
  return { result, steps: [{ title: `Scale R${row + 1}`, formula: `R${row + 1} -> ${formatNumber(scalar)}R${row + 1}`, calculation: "Every element in the selected row is multiplied by the scalar.", result, highlightResult: result[row].map((_, j) => [row, j] as Cell) }] };
}

export function rowAddMultiple(a: Matrix, targetRow: number, sourceRow: number, scalar: number): MatrixStepResult {
  const result = cloneMatrix(a);
  result[targetRow] = result[targetRow].map((value, j) => value + scalar * result[sourceRow][j]);
  return { result, steps: [{ title: `Add a multiple of R${sourceRow + 1}`, formula: `R${targetRow + 1} -> R${targetRow + 1} + (${formatNumber(scalar)})R${sourceRow + 1}`, calculation: "Add the scaled source row to the target row.", result, highlightResult: result[targetRow].map((_, j) => [targetRow, j] as Cell) }] };
}

export function toRowEchelon(a: Matrix): MatrixStepResult {
  const result = cloneMatrix(a);
  const steps: MatrixStep[] = [{ title: "Start row reduction", formula: "Use elementary row operations", calculation: "Find pivots from left to right.", result: cloneMatrix(result) }];
  let pivotRow = 0;
  for (let col = 0; col < matrixOrder(result).cols && pivotRow < result.length; col += 1) {
    let best = pivotRow;
    for (let r = pivotRow + 1; r < result.length; r += 1) if (Math.abs(result[r][col]) > Math.abs(result[best][col])) best = r;
    if (Math.abs(result[best][col]) < 1e-10) continue;
    if (best !== pivotRow) {
      [result[pivotRow], result[best]] = [result[best], result[pivotRow]];
      steps.push({ title: "Swap pivot row", formula: `R${pivotRow + 1}<->R${best + 1}`, calculation: "Bring a non-zero pivot into position.", result: cloneMatrix(result), highlightResult: [[pivotRow, col]] });
    }
    const pivot = result[pivotRow][col];
    result[pivotRow] = result[pivotRow].map((value) => value / pivot);
    steps.push({ title: "Scale pivot row", formula: `R${pivotRow + 1}->R${pivotRow + 1}/${formatNumber(pivot)}`, calculation: "Make the pivot equal to 1.", result: cloneMatrix(result), highlightResult: [[pivotRow, col]] });
    for (let r = pivotRow + 1; r < result.length; r += 1) {
      const factor = result[r][col];
      if (Math.abs(factor) < 1e-10) continue;
      result[r] = result[r].map((value, j) => value - factor * result[pivotRow][j]);
      steps.push({ title: "Eliminate below pivot", formula: `R${r + 1}->R${r + 1}-(${formatNumber(factor)})R${pivotRow + 1}`, calculation: "Create a zero below the pivot.", result: cloneMatrix(result), highlightResult: [[r, col]] });
    }
    pivotRow += 1;
  }
  return { result, steps };
}

export function rankMatrix(a: Matrix): MatrixStepResult & { rank: number } {
  const echelon = toRowEchelon(a);
  const rank = echelon.result.filter((row) => row.some((value) => Math.abs(value) > 1e-8)).length;
  return { ...echelon, rank, steps: [...echelon.steps, { title: "Count non-zero rows", formula: "rank(A)=number of non-zero rows in echelon form", calculation: `Rank is ${rank}.`, result: echelon.result }] };
}

export function solve2x2System(augmented: Matrix): MatrixStepResult & { solution?: { x: number; y: number } } {
  if (augmented.length !== 2 || augmented[0].length !== 3) return { result: [], steps: [], error: "Use a 2x3 augmented matrix for a two-variable system." };
  const [[a, b, e], [c, d, f]] = augmented;
  const det = a * d - b * c;
  if (Math.abs(det) < 1e-10) return { result: [], steps: [], error: "The system does not have a unique solution because the coefficient determinant is zero." };
  const x = (e * d - b * f) / det;
  const y = (a * f - e * c) / det;
  const echelon = toRowEchelon(augmented);
  return { ...echelon, solution: { x, y }, steps: [...echelon.steps, { title: "Read the solution", formula: "x and y come from the final augmented matrix", calculation: `x=${formatNumber(x)}, y=${formatNumber(y)}`, result: [[x], [y]] }] };
}

export function eigen2x2(a: Matrix) {
  if (a.length !== 2 || a[0].length !== 2) return { error: "Eigenvalue visualizer currently supports 2x2 matrices." };
  const trace = a[0][0] + a[1][1];
  const det = determinant2x2(a);
  const disc = trace * trace - 4 * det;
  if (disc < 0) return { error: "This simple visualizer supports real eigenvalues. This matrix has complex eigenvalues." };
  const root = Math.sqrt(disc);
  const values = [(trace + root) / 2, (trace - root) / 2];
  const vectors = values.map((lambda) => {
    const b = a[0][1];
    const c = a[1][0];
    if (Math.abs(b) > 1e-10) return [b, lambda - a[0][0]];
    if (Math.abs(c) > 1e-10) return [lambda - a[1][1], c];
    return [1, 0];
  });
  return { values, vectors, trace, det, discriminant: disc };
}

export function apply2DTransformation(matrix: Matrix, points: Cell[]): Cell[] {
  return points.map(([x, y]) => [matrix[0][0] * x + matrix[0][1] * y, matrix[1][0] * x + matrix[1][1] * y]);
}

export function allCells(matrix: Matrix): Cell[] {
  return matrix.flatMap((row, i) => row.map((_, j) => [i, j] as Cell));
}

export function randomMatrix(rows: number, cols: number) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.floor(Math.random() * 11) - 5));
}
