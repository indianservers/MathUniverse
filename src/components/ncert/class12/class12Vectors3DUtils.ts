export type Vector3 = [number, number, number];

export function dot(a: Vector3, b: Vector3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(a: Vector3, b: Vector3): Vector3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function magnitude(a: Vector3) {
  return Math.hypot(...a);
}

export function angleBetween(a: Vector3, b: Vector3) {
  const denominator = magnitude(a) * magnitude(b);
  if (denominator === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, dot(a, b) / denominator)));
}

export function projectionLength(a: Vector3, onto: Vector3) {
  const denominator = magnitude(onto);
  return denominator === 0 ? 0 : dot(a, onto) / denominator;
}

export function directionCosines(a: Vector3) {
  const mag = magnitude(a);
  if (mag === 0) return [0, 0, 0] as Vector3;
  return [a[0] / mag, a[1] / mag, a[2] / mag] as Vector3;
}

export function lineVectorForm(point: Vector3, direction: Vector3) {
  return `r = (${point.join(", ")}) + lambda(${direction.join(", ")})`;
}

export function shortestDistanceSkew(p1: Vector3, d1: Vector3, p2: Vector3, d2: Vector3) {
  const normal = cross(d1, d2);
  const normalMagnitude = magnitude(normal);
  if (normalMagnitude === 0) return 0;
  const delta: Vector3 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  return Math.abs(dot(delta, normal)) / normalMagnitude;
}
