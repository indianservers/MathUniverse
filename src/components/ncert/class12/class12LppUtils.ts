export type Constraint = { a: number; b: number; c: number; relation: "<=" | ">=" };
export type Point2 = [number, number];

export function satisfiesConstraint(point: Point2, constraint: Constraint) {
  const value = constraint.a * point[0] + constraint.b * point[1];
  return constraint.relation === "<=" ? value <= constraint.c + 1e-9 : value >= constraint.c - 1e-9;
}

export function intersection(first: Constraint, second: Constraint): Point2 | null {
  const determinant = first.a * second.b - second.a * first.b;
  if (Math.abs(determinant) < 1e-9) return null;
  const x = (first.c * second.b - second.c * first.b) / determinant;
  const y = (first.a * second.c - second.a * first.c) / determinant;
  return [x, y];
}

export function feasibleCorners(constraints: Constraint[]) {
  const axes: Constraint[] = [
    { a: 1, b: 0, c: 0, relation: ">=" },
    { a: 0, b: 1, c: 0, relation: ">=" },
  ];
  const all = [...constraints, ...axes];
  const candidates: Point2[] = [];
  for (let i = 0; i < all.length; i += 1) {
    for (let j = i + 1; j < all.length; j += 1) {
      const point = intersection(all[i], all[j]);
      if (point && point.every(Number.isFinite) && all.every((constraint) => satisfiesConstraint(point, constraint))) {
        candidates.push([round(point[0]), round(point[1])]);
      }
    }
  }
  return uniquePoints(candidates);
}

export function evaluateObjective(point: Point2, objective: Point2) {
  return point[0] * objective[0] + point[1] * objective[1];
}

export function optimizeCorners(corners: Point2[], objective: Point2, mode: "max" | "min" = "max") {
  if (corners.length === 0) return null;
  return corners
    .map((point) => ({ point, value: evaluateObjective(point, objective) }))
    .sort((a, b) => mode === "max" ? b.value - a.value : a.value - b.value)[0];
}

function uniquePoints(points: Point2[]) {
  const seen = new Set<string>();
  return points.filter((point) => {
    const key = point.join(",");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
