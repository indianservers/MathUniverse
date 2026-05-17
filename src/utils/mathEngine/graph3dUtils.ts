import { compileTwoVariableExpression } from "../functionParser";

export type SurfacePoint = {
  x: number;
  y: number;
  z: number | null;
  valid: boolean;
};

export type SurfaceSampleResult = {
  grid: SurfacePoint[][];
  minZ: number | null;
  maxZ: number | null;
  error?: string;
  warning?: string;
};

export function safeEvaluateSurface(functionInput: string, x: number, y: number) {
  try {
    const fn = compileTwoVariableExpression(normalizeSurfaceInput(functionInput));
    const z = fn(x, y);
    return Number.isFinite(z) ? { x, y, z, valid: true } : { x, y, z: null, valid: false };
  } catch (error) {
    return { x, y, z: null, valid: false, error: error instanceof Error ? error.message : "Invalid surface expression" };
  }
}

export function sampleSurface(functionInput: string, xMin = -3, xMax = 3, yMin = -3, yMax = 3, resolution = 42): SurfaceSampleResult {
  let fn: (x: number, y: number) => number;
  try {
    fn = compileTwoVariableExpression(normalizeSurfaceInput(functionInput));
  } catch (error) {
    return { grid: [], minZ: null, maxZ: null, error: error instanceof Error ? error.message : "Invalid surface expression" };
  }

  const size = Math.max(8, Math.min(90, Math.round(resolution)));
  const grid: SurfacePoint[][] = [];
  const values: number[] = [];
  for (let iy = 0; iy < size; iy += 1) {
    const y = yMin + (iy / Math.max(1, size - 1)) * (yMax - yMin);
    const row: SurfacePoint[] = [];
    for (let ix = 0; ix < size; ix += 1) {
      const x = xMin + (ix / Math.max(1, size - 1)) * (xMax - xMin);
      try {
        const z = fn(x, y);
        if (Number.isFinite(z)) {
          row.push({ x, y, z, valid: true });
          values.push(z);
        } else {
          row.push({ x, y, z: null, valid: false });
        }
      } catch {
        row.push({ x, y, z: null, valid: false });
      }
    }
    grid.push(row);
  }
  return {
    grid,
    minZ: values.length ? Math.min(...values) : null,
    maxZ: values.length ? Math.max(...values) : null,
    warning: resolution > 70 ? "High resolution can slow down older devices." : undefined,
  };
}

export function generateSurfaceMeshData(samples: SurfaceSampleResult) {
  const positions: number[] = [];
  const indices: number[] = [];
  const colors: number[] = [];
  const rows = samples.grid.length;
  const cols = samples.grid[0]?.length ?? 0;
  const minZ = samples.minZ ?? -1;
  const maxZ = samples.maxZ ?? 1;
  const span = Math.max(1e-8, maxZ - minZ);

  samples.grid.forEach((row) => row.forEach((point) => {
    const z = point.z ?? 0;
    positions.push(point.x, clamp(z, -8, 8), point.y);
    const ratio = clamp((z - minZ) / span, 0, 1);
    colors.push(0.08 + 0.75 * ratio, 0.75 - 0.35 * ratio, 0.95 - 0.75 * ratio);
  }));

  for (let iy = 0; iy < rows - 1; iy += 1) {
    for (let ix = 0; ix < cols - 1; ix += 1) {
      const a = iy * cols + ix;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      const valid = samples.grid[iy][ix].valid && samples.grid[iy][ix + 1].valid && samples.grid[iy + 1][ix].valid && samples.grid[iy + 1][ix + 1].valid;
      if (valid) indices.push(a, b, c, b, d, c);
    }
  }

  return { positions, indices, colors };
}

function normalizeSurfaceInput(input: string) {
  return input.trim().replace(/^z\s*=/i, "");
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
