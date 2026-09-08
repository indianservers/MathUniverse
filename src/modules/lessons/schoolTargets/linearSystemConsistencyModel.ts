export type LinearSystem = [number, number, number, number, number, number];

export function equationGeometry(a: number, b: number, c: number, extent = 8) {
  if (a === 0 && b === 0) return { kind: c === 0 ? "plane" : "empty", endpoints: null } as const;
  const endpoints = b === 0
    ? [c / a, -extent, c / a, extent]
    : [-extent, (c + extent * a) / b, extent, (c - extent * a) / b];
  return { kind: "line", endpoints } as const;
}

export function consistencyGeometryMessage(system: LinearSystem) {
  const first = equationGeometry(system[0], system[1], system[2]);
  const second = equationGeometry(system[3], system[4], system[5]);
  if (first.kind === "empty" || second.kind === "empty") return "A contradictory equation has no points, so the system has no solution.";
  if (first.kind === "plane" && second.kind === "plane") return "Both equations hold everywhere. Every point in the plane is a solution.";
  if (first.kind === "plane" || second.kind === "plane") return "One equation holds everywhere. Every point on the other equation's line is a solution.";
  const result = analyzeConsistency(system);
  return result.type === "unique" ? "The lines intersect once, so the system has one solution." : result.type === "none" ? "The lines are parallel, so the system has no solution." : "The lines coincide, so the system has infinitely many solutions.";
}

export function analyzeConsistency([a, b, c, d, e, f]: LinearSystem) {
  const determinant = a * e - b * d;
  const minors = [determinant, a * f - c * d, b * f - c * e];
  const rankA = a || b || d || e ? (determinant ? 2 : 1) : 0;
  const rankAugmented =
    a || b || c || d || e || f ? (minors.some(Boolean) ? 2 : 1) : 0;
  const type =
    rankA !== rankAugmented ? "none" : rankA === 2 ? "unique" : "infinite";
  return {
    type,
    rankA,
    rankAugmented,
    x: determinant ? (c * e - b * f) / determinant : null,
    y: determinant ? (a * f - c * d) / determinant : null,
  } as const;
}

export function reduceConsistency(system: LinearSystem) {
  const rows = [system.slice(0, 3), system.slice(3, 6)];
  const pivot = rows[0].findIndex((value) => value !== 0);
  const secondPivot = rows[1].findIndex((value) => value !== 0);
  const operations: string[] = [];
  const preferUnitPivot = pivot >= 0 && secondPivot === pivot &&
    Math.abs(rows[1][pivot]) === 1 && Math.abs(rows[0][pivot]) !== 1;
  if (secondPivot >= 0 && (pivot < 0 || secondPivot < pivot || preferUnitPivot)) {
    [rows[0], rows[1]] = [rows[1], rows[0]];
    operations.push("R1 <-> R2");
  }
  const column = rows[0].findIndex((value) => value !== 0);
  if (column >= 0 && rows[1][column] !== 0) {
    const scale = rows[0][column];
    const factor = rows[1][column];
    rows[1] = rows[1].map((value, index) =>
      index === column ? 0 : scale * value - factor * rows[0][index],
    );
    operations.push(`R2 <- (${scale})R2 - (${factor})R1`);
  }
  return {
    values: rows.flat(),
    operation: operations.join("; ") || "Already in row-echelon form",
  };
}
