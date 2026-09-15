export type Mat2 = [[number, number], [number, number]];
export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export function apply2(M: Mat2, x: number, y: number): Vec2 {
  return [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
}

export function mul2(A: Mat2, B: Mat2): Mat2 {
  return [
    [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
    [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
  ];
}

export function det2(M: Mat2) {
  return M[0][0] * M[1][1] - M[0][1] * M[1][0];
}

export function inv2(M: Mat2): Mat2 | null {
  const d = det2(M);
  if (Math.abs(d) < 1e-8) return null;
  return [[M[1][1] / d, -M[0][1] / d], [-M[1][0] / d, M[0][0] / d]];
}

export function transpose2(M: Mat2): Mat2 {
  return [[M[0][0], M[1][0]], [M[0][1], M[1][1]]];
}

export function identity2(): Mat2 {
  return [[1, 0], [0, 1]];
}

export function rotation90(): Mat2 {
  return [[0, -1], [1, 0]];
}

export function scaleX(k: number): Mat2 {
  return [[k, 0], [0, 1]];
}

export function shearX(k: number): Mat2 {
  return [[1, k], [0, 1]];
}

export function namedTransform(name: string, k = 1.4): Mat2 {
  if (name === "R90") return rotation90();
  if (name === "Scale" || name === "Scale X") return scaleX(k);
  if (name === "Shear") return shearX(k - 1);
  return identity2();
}

export function composeNamed(stack: string[], k = 1.4): Mat2 {
  return stack.reduce((acc, name) => mul2(namedTransform(name, k), acc), identity2());
}

export function eigen2(M: Mat2) {
  const trace = M[0][0] + M[1][1];
  const det = det2(M);
  const disc = trace * trace - 4 * det;
  if (disc < 0) {
    return { values: [] as number[], vectors: [] as Vec2[], complex: true as const };
  }
  const root = Math.sqrt(disc);
  const values = [(trace - root) / 2, (trace + root) / 2];
  const vectors: Vec2[] = values.map((lambda) => {
    if (Math.abs(M[0][1]) > 1e-8) return [M[0][1], lambda - M[0][0]];
    if (Math.abs(M[1][0]) > 1e-8) return [lambda - M[1][1], M[1][0]];
    return [1, 0];
  });
  return { values, vectors, complex: false as const };
}

export function parallel2(u: Vec2, v: Vec2) {
  return Math.abs(u[0] * v[1] - u[1] * v[0]) < 0.08 * (Math.hypot(...u) * Math.hypot(...v) || 1);
}

export function multiply(A: number[][], B: number[][]) {
  const rows = A.length;
  const inner = A[0]?.length ?? 0;
  const cols = B[0]?.length ?? 0;
  if (inner !== B.length) return null;
  const C: number[][] = [];
  for (let i = 0; i < rows; i += 1) {
    const row: number[] = [];
    for (let j = 0; j < cols; j += 1) {
      let sum = 0;
      for (let k = 0; k < inner; k += 1) sum += (A[i]?.[k] ?? 0) * (B[k]?.[j] ?? 0);
      row.push(sum);
    }
    C.push(row);
  }
  return C;
}

export function addMatrices(A: number[][], B: number[][]) {
  if (A.length !== B.length || (A[0]?.length ?? 0) !== (B[0]?.length ?? 0)) return null;
  return A.map((row, i) => row.map((cell, j) => cell + (B[i]?.[j] ?? 0)));
}

export function matrixRank(input: number[][]) {
  const M = input.map((row) => row.map((v) => v));
  const rows = M.length;
  const cols = M[0]?.length ?? 0;
  let rank = 0;
  let lead = 0;
  for (let r = 0; r < rows && lead < cols; r += 1) {
    let i = r;
    while (i < rows && Math.abs(M[i]?.[lead] ?? 0) < 1e-8) i += 1;
    if (i === rows) {
      lead += 1;
      r -= 1;
      continue;
    }
    const swap = M[r]!;
    M[r] = M[i]!;
    M[i] = swap;
    const pivot = M[r]![lead]!;
    M[r] = M[r]!.map((v) => v / pivot);
    for (let j = 0; j < rows; j += 1) {
      if (j === r) continue;
      const f = M[j]![lead]!;
      M[j] = M[j]!.map((v, k) => v - f * (M[r]![k] ?? 0));
    }
    rank += 1;
    lead += 1;
  }
  return rank;
}

export function rankAugmented(A: number[][], b: number[]) {
  const rankA = matrixRank(A);
  const rankAb = matrixRank(A.map((row, i) => [...row, b[i] ?? 0]));
  const n = A[0]?.length ?? 0;
  return { rankA, rankAb, n };
}

export function classifySystem(A: number[][], b: number[]) {
  const { rankA, rankAb, n } = rankAugmented(A, b);
  if (rankA < rankAb) return { kind: "inconsistent" as const, rankA, rankAb };
  if (rankA === n) return { kind: "unique" as const, rankA, rankAb };
  return { kind: "infinite" as const, rankA, rankAb };
}

export function solve2(a: number, b: number, c: number, d: number, rhs1: number, rhs2: number) {
  const det = a * d - b * c;
  if (Math.abs(det) < 1e-8) return null;
  return { x: (d * rhs1 - b * rhs2) / det, y: (a * rhs2 - c * rhs1) / det };
}

export function iso3(x: number, y: number, z: number, ox: number, oy: number, u: number, yaw = 0.35) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const X = x * cy + z * sy;
  const Z = -x * sy + z * cy;
  return { x: ox + X * u + Z * u * 0.42, y: oy - y * u - Z * u * 0.22 };
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function setCell(matrix: number[][], r: number, c: number, value: number) {
  return matrix.map((row, i) => row.map((cell, j) => (i === r && j === c ? value : cell)));
}

export function resizeMatrix(matrix: number[][], rows: number, cols: number) {
  return Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => matrix[r]?.[c] ?? 0));
}

export function phaseTrajectories(M: Mat2, count = 12, steps = 40, h = 0.08) {
  return Array.from({ length: count }, (_, i) => {
    const ang = (i / count) * Math.PI * 2;
    let x = Math.cos(ang) * 1.4;
    let y = Math.sin(ang) * 1.4;
    const pts: Vec2[] = [[x, y]];
    for (let s = 0; s < steps; s += 1) {
      const [dx, dy] = apply2(M, x, y);
      x += h * dx;
      y += h * dy;
      if (!Number.isFinite(x) || !Number.isFinite(y) || Math.hypot(x, y) > 8) break;
      pts.push([x, y]);
    }
    return pts;
  });
}
