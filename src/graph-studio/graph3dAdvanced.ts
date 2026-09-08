import { compileThreeVariableExpression, compileTwoVariableExpression } from "../utils/functionParser";

export type Graph3DPoint = { x: number; y: number; z: number };
export type Graph3DMesh = {
  positions: number[];
  indices: number[];
  minZ: number | null;
  maxZ: number | null;
  error?: string;
  adaptiveCells?: number;
};
export type Graph3DVector = { origin: Graph3DPoint; vector: Graph3DPoint };
export type Graph3DVectorField = { vectors: Graph3DVector[]; streamlines: Graph3DPoint[][]; error?: string };
export type Graph3DCriticalPoint = Graph3DPoint & {
  kind: "minimum" | "maximum" | "saddle" | "degenerate";
  determinant: number;
};

type Bounds2D = { uMin: number; uMax: number; vMin: number; vMax: number };

export function normalizeImplicitEquation(input: string) {
  const source = input.trim();
  const separator = source.indexOf("=");
  if (separator < 0) return source;
  const left = source.slice(0, separator).trim();
  const right = source.slice(separator + 1).trim();
  return `(${left})-(${right || "0"})`;
}

export function sampleImplicitSurface(expression: string, range = 3, resolution = 24): Graph3DMesh {
  let evaluate: (x: number, y: number, z: number) => number;
  try {
    evaluate = compileThreeVariableExpression(normalizeImplicitEquation(expression));
  } catch (error) {
    return emptyMesh(errorMessage(error, "Invalid implicit equation"));
  }
  const size = clampInt(resolution, 12, 34);
  const step = range * 2 / (size - 1);
  const positions: number[] = [];
  const indices: number[] = [];
  const values = new Float64Array(size * size * size);
  const at = (ix: number, iy: number, iz: number) => (iz * size + iy) * size + ix;
  for (let iz = 0; iz < size; iz += 1) {
    const z = -range + iz * step;
    for (let iy = 0; iy < size; iy += 1) {
      const y = -range + iy * step;
      for (let ix = 0; ix < size; ix += 1) {
        const x = -range + ix * step;
        try {
          const value = evaluate(x, y, z);
          values[at(ix, iy, iz)] = Number.isFinite(value) ? value : Number.NaN;
        } catch {
          values[at(ix, iy, iz)] = Number.NaN;
        }
      }
    }
  }
  const cubeOffsets = [
    [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
    [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
  ] as const;
  const tetrahedra = [
    [0, 5, 1, 6], [0, 1, 2, 6], [0, 2, 3, 6],
    [0, 3, 7, 6], [0, 7, 4, 6], [0, 4, 5, 6],
  ] as const;
  for (let iz = 0; iz < size - 1; iz += 1) {
    for (let iy = 0; iy < size - 1; iy += 1) {
      for (let ix = 0; ix < size - 1; ix += 1) {
        const corners = cubeOffsets.map(([dx, dy, dz]) => ({
          point: { x: -range + (ix + dx) * step, y: -range + (iy + dy) * step, z: -range + (iz + dz) * step },
          value: values[at(ix + dx, iy + dy, iz + dz)],
        }));
        if (corners.some((corner) => !Number.isFinite(corner.value))) continue;
        for (const tetrahedron of tetrahedra) {
          polygonizeTetrahedron(tetrahedron.map((index) => corners[index]), positions, indices);
        }
      }
    }
  }
  if (!positions.length) return emptyMesh("No zero-level surface was found in the visible cube.");
  const zValues = positions.filter((_, index) => index % 3 === 2);
  return { positions, indices, minZ: Math.min(...zValues), maxZ: Math.max(...zValues) };
}

export function sampleParametricSurface(
  components: { x: string; y: string; z: string },
  bounds: Bounds2D,
  resolution = 42,
): Graph3DMesh {
  let fx: (u: number, v: number) => number;
  let fy: (u: number, v: number) => number;
  let fz: (u: number, v: number) => number;
  try {
    fx = compileParametric2D(components.x);
    fy = compileParametric2D(components.y);
    fz = compileParametric2D(components.z);
  } catch (error) {
    return emptyMesh(errorMessage(error, "Invalid parametric surface"));
  }
  const size = clampInt(resolution, 8, 80);
  const positions: number[] = [];
  const valid: boolean[] = [];
  const zValues: number[] = [];
  for (let iv = 0; iv < size; iv += 1) {
    const v = lerp(bounds.vMin, bounds.vMax, iv / Math.max(1, size - 1));
    for (let iu = 0; iu < size; iu += 1) {
      const u = lerp(bounds.uMin, bounds.uMax, iu / Math.max(1, size - 1));
      try {
        const point = { x: fx(u, v), y: fy(u, v), z: fz(u, v) };
        const finite = finitePoint(point);
        positions.push(finite ? point.x : 0, finite ? point.y : 0, finite ? point.z : 0);
        valid.push(finite);
        if (finite) zValues.push(point.z);
      } catch {
        positions.push(0, 0, 0);
        valid.push(false);
      }
    }
  }
  const indices: number[] = [];
  for (let iv = 0; iv < size - 1; iv += 1) {
    for (let iu = 0; iu < size - 1; iu += 1) {
      const a = iv * size + iu;
      const b = a + 1;
      const c = a + size;
      const d = c + 1;
      if (valid[a] && valid[b] && valid[c]) indices.push(a, b, c);
      if (valid[b] && valid[d] && valid[c]) indices.push(b, d, c);
    }
  }
  if (!indices.length) return emptyMesh("The parametric surface has no finite samples in its parameter domain.");
  return { positions, indices, minZ: Math.min(...zValues), maxZ: Math.max(...zValues) };
}

export function sampleCoordinateSurface(
  expression: string,
  mode: "cylindrical" | "spherical",
  bounds: Bounds2D,
  resolution = 42,
) {
  if (mode === "cylindrical") {
    return sampleParametricSurface({
      x: "u*cos(v)",
      y: "u*sin(v)",
      z: expression,
    }, bounds, resolution);
  }
  return sampleParametricSurface({
    x: `(${expression})*sin(v)*cos(u)`,
    y: `(${expression})*sin(v)*sin(u)`,
    z: `(${expression})*cos(v)`,
  }, bounds, resolution);
}

export function sampleParametricCurve(components: { x: string; y: string; z: string }, tMin: number, tMax: number, samples = 320) {
  try {
    const fx = compileParametric1D(components.x);
    const fy = compileParametric1D(components.y);
    const fz = compileParametric1D(components.z);
    const points: Graph3DPoint[] = [];
    const count = clampInt(samples, 32, 900);
    for (let index = 0; index < count; index += 1) {
      const t = lerp(tMin, tMax, index / Math.max(1, count - 1));
      const point = { x: fx(t), y: fy(t), z: fz(t) };
      if (finitePoint(point)) points.push(point);
    }
    return { points, error: points.length < 2 ? "The curve has fewer than two finite samples." : undefined };
  } catch (error) {
    return { points: [] as Graph3DPoint[], error: errorMessage(error, "Invalid parametric curve") };
  }
}

export function sampleVectorField(
  components: { x: string; y: string; z: string },
  range = 3,
  density = 5,
  includeStreamlines = true,
): Graph3DVectorField {
  let fx: (x: number, y: number, z: number) => number;
  let fy: (x: number, y: number, z: number) => number;
  let fz: (x: number, y: number, z: number) => number;
  try {
    fx = compileThreeVariableExpression(components.x);
    fy = compileThreeVariableExpression(components.y);
    fz = compileThreeVariableExpression(components.z);
  } catch (error) {
    return { vectors: [], streamlines: [], error: errorMessage(error, "Invalid vector field") };
  }
  const evaluate = (point: Graph3DPoint) => ({ x: fx(point.x, point.y, point.z), y: fy(point.x, point.y, point.z), z: fz(point.x, point.y, point.z) });
  const count = clampInt(density, 3, 8);
  const vectors: Graph3DVector[] = [];
  for (let iz = 0; iz < count; iz += 1) for (let iy = 0; iy < count; iy += 1) for (let ix = 0; ix < count; ix += 1) {
    const origin = {
      x: lerp(-range, range, ix / (count - 1)),
      y: lerp(-range, range, iy / (count - 1)),
      z: lerp(-range, range, iz / (count - 1)),
    };
    try {
      const vector = evaluate(origin);
      if (finitePoint(vector) && magnitude(vector) > 1e-8) vectors.push({ origin, vector });
    } catch { /* Skip singular samples. */ }
  }
  const streamlines: Graph3DPoint[][] = [];
  if (includeStreamlines) {
    const seeds = [-0.7, 0, 0.7].flatMap((factor) => [
      { x: -range * 0.85, y: factor * range, z: 0 },
      { x: factor * range, y: -range * 0.85, z: range * 0.35 },
    ]);
    for (const seed of seeds) {
      const line = integrateStreamline(seed, evaluate, range);
      if (line.length > 2) streamlines.push(line);
    }
  }
  return { vectors, streamlines, error: vectors.length ? undefined : "The vector field has no finite vectors in this window." };
}

export function sampleAdaptiveExplicitSurface(expression: string, rangeX: number, rangeY: number, baseResolution = 18, maxDepth = 2): Graph3DMesh {
  let evaluate: (x: number, y: number) => number;
  try {
    evaluate = compileTwoVariableExpression(expression.trim().replace(/^z\s*=\s*/i, ""));
  } catch (error) {
    return emptyMesh(errorMessage(error, "Invalid explicit surface"));
  }
  const positions: number[] = [];
  const indices: number[] = [];
  const zValues: number[] = [];
  const cells = clampInt(baseResolution, 8, 28);
  const dx = rangeX * 2 / cells;
  const dy = rangeY * 2 / cells;
  let adaptiveCells = 0;
  const addCell = (x0: number, x1: number, y0: number, y1: number, depth: number) => {
    const points = [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [(x0 + x1) / 2, (y0 + y1) / 2]] as const;
    let values: number[];
    try { values = points.map(([x, y]) => evaluate(x, y)); } catch { return; }
    if (!values.every(Number.isFinite)) return;
    const bilinearCenter = (values[0] + values[1] + values[2] + values[3]) / 4;
    const curvature = Math.abs(values[4] - bilinearCenter);
    const localSpan = Math.max(...values.slice(0, 4)) - Math.min(...values.slice(0, 4));
    const threshold = 0.035 * (1 + Math.abs(values[4]));
    if (depth < maxDepth && (curvature > threshold || localSpan > 1.25)) {
      const xm = (x0 + x1) / 2;
      const ym = (y0 + y1) / 2;
      addCell(x0, xm, y0, ym, depth + 1); addCell(xm, x1, y0, ym, depth + 1);
      addCell(xm, x1, ym, y1, depth + 1); addCell(x0, xm, ym, y1, depth + 1);
      return;
    }
    const base = positions.length / 3;
    for (let index = 0; index < 4; index += 1) {
      positions.push(points[index][0], points[index][1], values[index]);
      zValues.push(values[index]);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    adaptiveCells += 1;
  };
  for (let iy = 0; iy < cells; iy += 1) for (let ix = 0; ix < cells; ix += 1) {
    addCell(-rangeX + ix * dx, -rangeX + (ix + 1) * dx, -rangeY + iy * dy, -rangeY + (iy + 1) * dy, 0);
  }
  if (!indices.length) return emptyMesh("The surface has no finite adaptive cells.");
  return { positions, indices, minZ: Math.min(...zValues), maxZ: Math.max(...zValues), adaptiveCells };
}

export function findCriticalPoints(expression: string, rangeX: number, rangeY: number, resolution = 41): Graph3DCriticalPoint[] {
  let fn: (x: number, y: number) => number;
  try { fn = compileTwoVariableExpression(expression.trim().replace(/^z\s*=\s*/i, "")); } catch { return []; }
  const size = clampInt(resolution, 21, 65);
  const hx = rangeX * 2 / (size - 1);
  const hy = rangeY * 2 / (size - 1);
  const candidates: Array<Graph3DCriticalPoint & { score: number }> = [];
  for (let iy = 1; iy < size - 1; iy += 1) for (let ix = 1; ix < size - 1; ix += 1) {
    const x = -rangeX + ix * hx;
    const y = -rangeY + iy * hy;
    try {
      const z = fn(x, y);
      const fx = (fn(x + hx, y) - fn(x - hx, y)) / (2 * hx);
      const fy = (fn(x, y + hy) - fn(x, y - hy)) / (2 * hy);
      const score = Math.hypot(fx, fy);
      if (![z, score].every(Number.isFinite) || score > Math.max(0.12, (hx + hy) * 0.42)) continue;
      const fxx = (fn(x + hx, y) - 2 * z + fn(x - hx, y)) / (hx * hx);
      const fyy = (fn(x, y + hy) - 2 * z + fn(x, y - hy)) / (hy * hy);
      const fxy = (fn(x + hx, y + hy) - fn(x + hx, y - hy) - fn(x - hx, y + hy) + fn(x - hx, y - hy)) / (4 * hx * hy);
      const determinant = fxx * fyy - fxy * fxy;
      const kind = determinant > 1e-5 ? (fxx > 0 ? "minimum" : "maximum") : determinant < -1e-5 ? "saddle" : "degenerate";
      candidates.push({ x, y, z, kind, determinant, score });
    } catch { /* Skip singular neighborhoods. */ }
  }
  candidates.sort((a, b) => a.score - b.score);
  const accepted: Graph3DCriticalPoint[] = [];
  for (const candidate of candidates) {
    if (accepted.some((point) => Math.hypot(point.x - candidate.x, point.y - candidate.y) < Math.max(hx, hy) * 2.2)) continue;
    const { score: _score, ...point } = candidate;
    void _score;
    accepted.push(point);
    if (accepted.length >= 12) break;
  }
  return accepted;
}

export function volumeBetweenSurfaces(topExpression: string, bottomExpression: string, rangeX: number, rangeY: number, resolution = 70) {
  try {
    const top = compileTwoVariableExpression(topExpression.trim().replace(/^z\s*=\s*/i, ""));
    const bottom = compileTwoVariableExpression(bottomExpression.trim().replace(/^z\s*=\s*/i, ""));
    const size = clampInt(resolution, 20, 120);
    const dx = rangeX * 2 / (size - 1);
    const dy = rangeY * 2 / (size - 1);
    let signed = 0;
    let absolute = 0;
    let samples = 0;
    for (let iy = 0; iy < size; iy += 1) for (let ix = 0; ix < size; ix += 1) {
      const x = -rangeX + ix * dx;
      const y = -rangeY + iy * dy;
      const difference = top(x, y) - bottom(x, y);
      if (!Number.isFinite(difference)) continue;
      const weightX = ix === 0 || ix === size - 1 ? 0.5 : 1;
      const weightY = iy === 0 || iy === size - 1 ? 0.5 : 1;
      signed += difference * weightX * weightY;
      absolute += Math.abs(difference) * weightX * weightY;
      samples += 1;
    }
    return { signed: signed * dx * dy, absolute: absolute * dx * dy, samples };
  } catch (error) {
    return { signed: Number.NaN, absolute: Number.NaN, samples: 0, error: errorMessage(error, "Volume calculation failed") };
  }
}

function polygonizeTetrahedron(corners: Array<{ point: Graph3DPoint; value: number }>, positions: number[], indices: number[]) {
  const edges = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]] as const;
  const intersections: Graph3DPoint[] = [];
  for (const [a, b] of edges) {
    const first = corners[a]; const second = corners[b];
    if ((first.value < 0) === (second.value < 0) && first.value !== 0 && second.value !== 0) continue;
    const ratio = Math.abs(first.value - second.value) < 1e-12 ? 0.5 : first.value / (first.value - second.value);
    intersections.push({
      x: lerp(first.point.x, second.point.x, ratio),
      y: lerp(first.point.y, second.point.y, ratio),
      z: lerp(first.point.z, second.point.z, ratio),
    });
  }
  if (intersections.length < 3) return;
  const base = positions.length / 3;
  intersections.slice(0, 4).forEach((point) => positions.push(point.x, point.y, point.z));
  indices.push(base, base + 1, base + 2);
  if (intersections.length >= 4) indices.push(base, base + 2, base + 3);
}

function compileParametric2D(expression: string) {
  return compileTwoVariableExpression(expression.replace(/\bu\b/gi, "x").replace(/\bv\b/gi, "y"));
}

function compileParametric1D(expression: string) {
  const compiled = compileTwoVariableExpression(expression.replace(/\bt\b/gi, "x"));
  return (t: number) => compiled(t, 0);
}

function integrateStreamline(seed: Graph3DPoint, evaluate: (point: Graph3DPoint) => Graph3DPoint, range: number) {
  const line = [seed];
  const step = range * 0.045;
  let point = seed;
  for (let index = 0; index < 100; index += 1) {
    try {
      const direction = evaluate(point);
      const length = magnitude(direction);
      if (!Number.isFinite(length) || length < 1e-8) break;
      point = { x: point.x + direction.x / length * step, y: point.y + direction.y / length * step, z: point.z + direction.z / length * step };
      if (!finitePoint(point) || Math.max(Math.abs(point.x), Math.abs(point.y), Math.abs(point.z)) > range * 1.05) break;
      line.push(point);
    } catch { break; }
  }
  return line;
}

function emptyMesh(error: string): Graph3DMesh { return { positions: [], indices: [], minZ: null, maxZ: null, error }; }
function finitePoint(point: Graph3DPoint) { return Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z); }
function magnitude(point: Graph3DPoint) { return Math.hypot(point.x, point.y, point.z); }
function lerp(a: number, b: number, ratio: number) { return a + (b - a) * ratio; }
function clampInt(value: number, min: number, max: number) { return Math.max(min, Math.min(max, Math.round(value))); }
function errorMessage(error: unknown, fallback: string) { return error instanceof Error ? error.message : fallback; }
