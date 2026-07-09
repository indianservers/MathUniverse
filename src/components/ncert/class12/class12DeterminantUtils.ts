export type Matrix2 = [[number, number], [number, number]];
export type Matrix3 = [[number, number, number], [number, number, number], [number, number, number]];

export function det2(matrix: Matrix2) {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

export function det3(matrix: Matrix3) {
  const [[a, b, c], [d, e, f], [g, h, i]] = matrix;
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

export function minor3(matrix: Matrix3, row: number, col: number) {
  const rows = matrix.filter((_, r) => r !== row);
  const two = rows.map((values) => values.filter((_, c) => c !== col)) as Matrix2;
  return det2(two);
}

export function cofactor3(matrix: Matrix3, row: number, col: number) {
  return ((row + col) % 2 === 0 ? 1 : -1) * minor3(matrix, row, col);
}

export function cofactorMatrix3(matrix: Matrix3): Matrix3 {
  return [0, 1, 2].map((row) => [0, 1, 2].map((col) => cofactor3(matrix, row, col))) as Matrix3;
}

export function adjoint3(matrix: Matrix3): Matrix3 {
  const cofactors = cofactorMatrix3(matrix);
  return [0, 1, 2].map((row) => [0, 1, 2].map((col) => cofactors[col][row])) as Matrix3;
}

export function inverse2(matrix: Matrix2): Matrix2 | null {
  const determinant = det2(matrix);
  if (Math.abs(determinant) < 1e-9) return null;
  const [[a, b], [c, d]] = matrix;
  return [[d / determinant, -b / determinant], [-c / determinant, a / determinant]];
}

export function multiplyMatrixVector2(matrix: Matrix2, vector: [number, number]) {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
  ] as [number, number];
}

export function cramer2(matrix: Matrix2, constants: [number, number]) {
  const determinant = det2(matrix);
  if (Math.abs(determinant) < 1e-9) return null;
  const [[a, b], [c, d]] = matrix;
  const dx = det2([[constants[0], b], [constants[1], d]]);
  const dy = det2([[a, constants[0]], [c, constants[1]]]);
  return { x: dx / determinant, y: dy / determinant, determinant, dx, dy };
}

export function triangleAreaFromPoints(points: [[number, number], [number, number], [number, number]]) {
  const [[x1, y1], [x2, y2], [x3, y3]] = points;
  return Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
}
