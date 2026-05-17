export type Vector2 = [number, number];
export type Matrix2x2 = [[number, number], [number, number]];

export function vectorMagnitude(vector: Vector2) {
  return Math.hypot(vector[0], vector[1]);
}

export function matrixVectorMultiply2D(matrix: Matrix2x2, vector: Vector2): Vector2 {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
  ];
}

export function matrixMultiply2x2(a: Matrix2x2, b: Matrix2x2): Matrix2x2 {
  return [
    [a[0][0] * b[0][0] + a[0][1] * b[1][0], a[0][0] * b[0][1] + a[0][1] * b[1][1]],
    [a[1][0] * b[0][0] + a[1][1] * b[1][0], a[1][0] * b[0][1] + a[1][1] * b[1][1]],
  ];
}

export function rotationMatrix(theta: number): Matrix2x2 {
  return [[Math.cos(theta), -Math.sin(theta)], [Math.sin(theta), Math.cos(theta)]];
}

export function scalingMatrix(sx: number, sy: number): Matrix2x2 {
  return [[sx, 0], [0, sy]];
}

export function reflectionMatrixX(): Matrix2x2 {
  return [[1, 0], [0, -1]];
}

export function reflectionMatrixY(): Matrix2x2 {
  return [[-1, 0], [0, 1]];
}

export function shearMatrix(shx: number, shy: number): Matrix2x2 {
  return [[1, shx], [shy, 1]];
}
