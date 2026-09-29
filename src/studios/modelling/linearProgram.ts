export type Constraint = { name: string; a: number; b: number; limit: number };
export type Point = { x: number; y: number };

export function solveLinearProgram(constraints: Constraint[], objective: Point) {
  const lines = [...constraints, { name: "x ≥ 0", a: -1, b: 0, limit: 0 }, { name: "y ≥ 0", a: 0, b: -1, limit: 0 }];
  const vertices: Point[] = [];
  for (let i = 0; i < lines.length; i += 1) for (let j = i + 1; j < lines.length; j += 1) {
    const u = lines[i], v = lines[j];
    const determinant = u.a * v.b - v.a * u.b;
    if (Math.abs(determinant) < 1e-9) continue;
    const point = { x: (u.limit * v.b - v.limit * u.b) / determinant, y: (u.a * v.limit - v.a * u.limit) / determinant };
    if (lines.every((line) => line.a * point.x + line.b * point.y <= line.limit + 1e-7) && !vertices.some((p) => Math.hypot(p.x - point.x, p.y - point.y) < 1e-7)) vertices.push(point);
  }
  vertices.sort((a, b) => Math.atan2(a.y - average(vertices, "y"), a.x - average(vertices, "x")) - Math.atan2(b.y - average(vertices, "y"), b.x - average(vertices, "x")));
  const best = vertices.reduce<Point | null>((winner, point) => !winner || point.x * objective.x + point.y * objective.y > winner.x * objective.x + winner.y * objective.y ? point : winner, null);
  return { vertices, best, value: best ? best.x * objective.x + best.y * objective.y : null, binding: best ? constraints.filter((line) => Math.abs(line.a * best.x + line.b * best.y - line.limit) < 1e-6).map((line) => line.name) : [] };
}

function average(points: Point[], key: keyof Point) { return points.reduce((sum, point) => sum + point[key], 0) / Math.max(1, points.length); }
