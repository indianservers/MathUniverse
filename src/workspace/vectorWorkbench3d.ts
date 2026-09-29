export type Vector3Tuple = [number, number, number];
export type VectorView3D = "sum" | "difference" | "cross" | "projection";

export const vectorAdd3 = (a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const vectorSubtract3 = (a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const vectorDot3 = (a: Vector3Tuple, b: Vector3Tuple) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const vectorCross3 = (a: Vector3Tuple, b: Vector3Tuple): Vector3Tuple => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const vectorMagnitude3 = (vector: Vector3Tuple) => Math.hypot(...vector);
export const vectorUnit3 = (vector: Vector3Tuple): Vector3Tuple | null => {
  const length = vectorMagnitude3(vector);
  return length < 1e-10 ? null : vector.map((value) => value / length) as Vector3Tuple;
};
export const vectorProjection3 = (a: Vector3Tuple, onto: Vector3Tuple): Vector3Tuple | null => {
  const squared = vectorDot3(onto, onto);
  return squared < 1e-10 ? null : onto.map((value) => value * vectorDot3(a, onto) / squared) as Vector3Tuple;
};
export const vectorAngle3 = (a: Vector3Tuple, b: Vector3Tuple): number | null => {
  const denominator = vectorMagnitude3(a) * vectorMagnitude3(b);
  return denominator < 1e-10 ? null : Math.acos(Math.max(-1, Math.min(1, vectorDot3(a, b) / denominator))) * 180 / Math.PI;
};

export function vectorWorkbenchResult(a: Vector3Tuple, b: Vector3Tuple, view: VectorView3D): Vector3Tuple | null {
  if (view === "sum") return vectorAdd3(a, b);
  if (view === "difference") return vectorSubtract3(a, b);
  if (view === "cross") return vectorCross3(a, b);
  return vectorProjection3(a, b);
}
