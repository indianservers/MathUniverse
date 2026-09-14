import { compileTwoVariableExpression, compileThreeVariableExpression } from "../utils/functionParser";
import type { Graph3DMesh, Graph3DPoint } from "./graph3dAdvanced";
import type { Graph3DSurface } from "./graph3dSurfaceModel";

export type SurfaceTemplate = {
  id: string;
  name: string;
  kind: Graph3DSurface["kind"];
  expression: string;
  components?: { x: string; y: string; z: string };
};

export type ExpressionFix = {
  message: string;
  rewrite?: string;
  example: string;
};

export type Graph3DAnnotation = {
  id: string;
  kind: "point" | "vector" | "tangent";
  x: number;
  y: number;
  z: number;
  label: string;
};

export type CameraBookmark = {
  id: string;
  name: string;
  camera: [number, number, number];
};

export type ReadGraphChecklist = {
  intercepts: boolean;
  extrema: boolean;
  symmetry: boolean;
  slice: boolean;
};

export type Graph3DSharePayload = {
  surfaces: Graph3DSurface[];
  cameraPosition: [number, number, number];
  analysisPoint: { x: number; y: number };
  selectedSurfaceId: string;
  sliceEnabled: boolean;
  sliceAxis: "x" | "y" | "z";
  sliceValue: number;
};

export const SURFACE_TEMPLATES: SurfaceTemplate[] = [
  { id: "paraboloid", name: "Paraboloid", kind: "explicit", expression: "0.25*(x^2 + y^2)" },
  { id: "saddle", name: "Saddle", kind: "explicit", expression: "0.35*(x^2 - y^2)" },
  { id: "gaussian", name: "Gaussian hill", kind: "explicit", expression: "exp(-(x^2 + y^2))" },
  { id: "sphere", name: "Sphere", kind: "implicit", expression: "x^2 + y^2 + z^2 = 9" },
  { id: "torus", name: "Torus", kind: "parametric", expression: "0", components: { x: "(2+0.6*cos(v))*cos(u)", y: "(2+0.6*cos(v))*sin(u)", z: "0.6*sin(v)" } },
  { id: "mobius", name: "Mobius strip", kind: "parametric", expression: "0", components: { x: "(1+0.3*v*cos(u/2))*cos(u)", y: "(1+0.3*v*cos(u/2))*sin(u)", z: "0.3*v*sin(u/2)" } },
  { id: "helicoid", name: "Helicoid", kind: "parametric", expression: "0", components: { x: "u*cos(v)", y: "u*sin(v)", z: "0.4*v" } },
  { id: "helix", name: "Helix", kind: "curve", expression: "0", components: { x: "cos(t)", y: "sin(t)", z: "t/4" } },
];

export function expressionToLatex(source: string) {
  return source
    .replace(/\s+/g, " ")
    .replace(/\*/g, " ")
    .replace(/\bsin\b/gi, "\\sin")
    .replace(/\bcos\b/gi, "\\cos")
    .replace(/\btan\b/gi, "\\tan")
    .replace(/\bexp\b/gi, "\\exp")
    .replace(/\bln\b/gi, "\\ln")
    .replace(/\bsqrt\(/gi, "\\sqrt{")
    .replace(/\^(\d+)/g, "^{$1}")
    .replace(/sqrt\{([^}]+)\)/g, "sqrt{$1}");
}

export function suggestExpressionFix(expression: string, error?: string): ExpressionFix {
  const source = expression.trim();
  if (!source) {
    return { message: "The expression is empty.", rewrite: "sin(x)*cos(y)", example: "sin(x)*cos(y)" };
  }
  if ((source.match(/\(/g) ?? []).length !== (source.match(/\)/g) ?? []).length) {
    return { message: "Unbalanced parentheses.", rewrite: `${source.replace(/\)+$/, "")})`, example: "sin(x)*cos(y)" };
  }
  if (/\bx\s+y\b/.test(source) || /\d[a-zA-Z]/.test(source)) {
    return { message: "Implied multiplication needs *.", rewrite: source.replace(/(\d)([a-zA-Z])/g, "$1*$2").replace(/\bx\s+y\b/g, "x*y"), example: "2*x*y" };
  }
  if (/==|=(?!$)/.test(source) && !source.includes("=")) {
    return { message: "Use a single equals for implicit surfaces.", example: "x^2+y^2+z^2=9" };
  }
  if (error?.toLowerCase().includes("undefined") || /unknown/i.test(error ?? "")) {
    return { message: "Unknown token. Use x, y, z and functions like sin, cos, exp, sqrt.", rewrite: "sin(x)*cos(y)", example: "sin(x)*cos(y)" };
  }
  return {
    message: error || "This expression could not be sampled.",
    rewrite: "sin(x)*cos(y)",
    example: "sin(x)*cos(y)",
  };
}

export function evaluateDomainPredicate(predicate: string, x: number, y: number, z = 0) {
  const source = predicate.trim().replace(/≤/g, "<=").replace(/≥/g, ">=");
  if (!source) return true;
  try {
    if (source.includes("<=")) {
      const [left, right] = source.split("<=");
      return compileThreeVariableExpression(`(${left})-(${right || "0"})`)(x, y, z) <= 1e-9;
    }
    if (source.includes(">=")) {
      const [left, right] = source.split(">=");
      return compileThreeVariableExpression(`(${left})-(${right || "0"})`)(x, y, z) >= -1e-9;
    }
    return compileThreeVariableExpression(source)(x, y, z) > 0.5;
  } catch {
    return true;
  }
}

export function meshToStl(mesh: Graph3DMesh) {
  const lines = ["solid graph-studio-3d"];
  for (let index = 0; index < mesh.indices.length; index += 3) {
    const a = mesh.indices[index] * 3;
    const b = mesh.indices[index + 1] * 3;
    const c = mesh.indices[index + 2] * 3;
    const ax = mesh.positions[a]; const ay = mesh.positions[a + 1]; const az = mesh.positions[a + 2];
    const bx = mesh.positions[b]; const by = mesh.positions[b + 1]; const bz = mesh.positions[b + 2];
    const cx = mesh.positions[c]; const cy = mesh.positions[c + 1]; const cz = mesh.positions[c + 2];
    const nx = (by - ay) * (cz - az) - (bz - az) * (cy - ay);
    const ny = (bz - az) * (cx - ax) - (bx - ax) * (cz - az);
    const nz = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    lines.push(`facet normal ${nx} ${ny} ${nz}`, "outer loop", `vertex ${ax} ${ay} ${az}`, `vertex ${bx} ${by} ${bz}`, `vertex ${cx} ${cy} ${cz}`, "endloop", "endfacet");
  }
  lines.push("endsolid graph-studio-3d");
  return lines.join("\n");
}

export function meshToObj(mesh: Graph3DMesh) {
  const lines: string[] = ["# Graph Studio 3D"];
  for (let index = 0; index < mesh.positions.length; index += 3) {
    lines.push(`v ${mesh.positions[index]} ${mesh.positions[index + 1]} ${mesh.positions[index + 2]}`);
  }
  for (let index = 0; index < mesh.indices.length; index += 3) {
    lines.push(`f ${mesh.indices[index] + 1} ${mesh.indices[index + 1] + 1} ${mesh.indices[index + 2] + 1}`);
  }
  return lines.join("\n");
}

export function explicitSurfaceArea(expression: string, xMin: number, xMax: number, yMin: number, yMax: number, samples = 36) {
  try {
    const fn = compileTwoVariableExpression(expression.trim().replace(/^z\s*=\s*/i, ""));
    const hx = (xMax - xMin) / samples;
    const hy = (yMax - yMin) / samples;
    let area = 0;
    for (let iy = 0; iy < samples; iy += 1) {
      for (let ix = 0; ix < samples; ix += 1) {
        const x = xMin + (ix + 0.5) * hx;
        const y = yMin + (iy + 0.5) * hy;
        const fx = (fn(x + hx * 0.5, y) - fn(x - hx * 0.5, y)) / hx;
        const fy = (fn(x, y + hy * 0.5) - fn(x, y - hy * 0.5)) / hy;
        if ([fx, fy].every(Number.isFinite)) area += Math.sqrt(1 + fx * fx + fy * fy) * hx * hy;
      }
    }
    return { area, error: undefined as string | undefined };
  } catch (error) {
    return { area: Number.NaN, error: error instanceof Error ? error.message : "Surface area failed." };
  }
}

export function curveArcLength(points: Graph3DPoint[]) {
  let length = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    length += Math.hypot(point.x - previous.x, point.y - previous.y, point.z - previous.z);
  }
  return length;
}

export function levelCurvePolylines(expression: string, xMin: number, xMax: number, yMin: number, yMax: number, levels: number[], samples = 28) {
  try {
    const fn = compileTwoVariableExpression(expression.trim().replace(/^z\s*=\s*/i, ""));
    const polylines: Graph3DPoint[][] = [];
    const hx = (xMax - xMin) / samples;
    const hy = (yMax - yMin) / samples;
    for (const level of levels) {
      const segments: Graph3DPoint[] = [];
      for (let iy = 0; iy < samples; iy += 1) {
        for (let ix = 0; ix < samples; ix += 1) {
          const x0 = xMin + ix * hx;
          const y0 = yMin + iy * hy;
          const corners = [
            [x0, y0, fn(x0, y0)],
            [x0 + hx, y0, fn(x0 + hx, y0)],
            [x0 + hx, y0 + hy, fn(x0 + hx, y0 + hy)],
            [x0, y0 + hy, fn(x0, y0 + hy)],
          ] as const;
          if (corners.some((corner) => !Number.isFinite(corner[2]))) continue;
          for (let edge = 0; edge < 4; edge += 1) {
            const a = corners[edge];
            const b = corners[(edge + 1) % 4];
            if ((a[2] - level) * (b[2] - level) > 0) continue;
            const t = Math.abs(b[2] - a[2]) < 1e-12 ? 0.5 : (level - a[2]) / (b[2] - a[2]);
            segments.push({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, z: level });
          }
        }
      }
      if (segments.length > 1) polylines.push(segments);
    }
    return polylines;
  } catch {
    return [];
  }
}

export function intersectionCurve(top: string, bottom: string, xMin: number, xMax: number, yMin: number, yMax: number, samples = 40) {
  try {
    const f = compileTwoVariableExpression(top.trim().replace(/^z\s*=\s*/i, ""));
    const g = compileTwoVariableExpression(bottom.trim().replace(/^z\s*=\s*/i, ""));
    const points: Graph3DPoint[] = [];
    const hx = (xMax - xMin) / samples;
    const hy = (yMax - yMin) / samples;
    for (let iy = 0; iy < samples; iy += 1) {
      for (let ix = 0; ix < samples; ix += 1) {
        const x0 = xMin + ix * hx;
        const y0 = yMin + iy * hy;
        const corners = [
          [x0, y0],
          [x0 + hx, y0],
          [x0 + hx, y0 + hy],
          [x0, y0 + hy],
        ] as const;
        const values = corners.map(([x, y]) => f(x, y) - g(x, y));
        if (values.some((value) => !Number.isFinite(value))) continue;
        for (let edge = 0; edge < 4; edge += 1) {
          const a = corners[edge];
          const b = corners[(edge + 1) % 4];
          const va = values[edge];
          const vb = values[(edge + 1) % 4];
          if (va * vb > 0) continue;
          const t = Math.abs(vb - va) < 1e-12 ? 0.5 : va / (va - vb);
          const x = a[0] + (b[0] - a[0]) * t;
          const y = a[1] + (b[1] - a[1]) * t;
          const z = f(x, y);
          if (Number.isFinite(z)) points.push({ x, y, z });
        }
      }
    }
    return points.slice(0, 400);
  } catch {
    return [];
  }
}

export function vectorCalculusAt(components: { x: string; y: string; z: string }, point: Graph3DPoint, h = 0.05) {
  try {
    const fx = compileThreeVariableExpression(components.x);
    const fy = compileThreeVariableExpression(components.y);
    const fz = compileThreeVariableExpression(components.z);
    const { x, y, z } = point;
    const dFxdx = (fx(x + h, y, z) - fx(x - h, y, z)) / (2 * h);
    const dFydy = (fy(x, y + h, z) - fy(x, y - h, z)) / (2 * h);
    const dFzdz = (fz(x, y, z + h) - fz(x, y, z - h)) / (2 * h);
    const dFzdy = (fz(x, y + h, z) - fz(x, y - h, z)) / (2 * h);
    const dFydz = (fy(x, y, z + h) - fy(x, y, z - h)) / (2 * h);
    const dFxdz = (fx(x, y, z + h) - fx(x, y, z - h)) / (2 * h);
    const dFzdx = (fz(x + h, y, z) - fz(x - h, y, z)) / (2 * h);
    const dFydx = (fy(x + h, y, z) - fy(x - h, y, z)) / (2 * h);
    const dFxdy = (fx(x, y + h, z) - fx(x, y - h, z)) / (2 * h);
    return {
      divergence: dFxdx + dFydy + dFzdz,
      curl: { x: dFzdy - dFydz, y: dFxdz - dFzdx, z: dFydx - dFxdy },
      field: { x: fx(x, y, z), y: fy(x, y, z), z: fz(x, y, z) },
    };
  } catch {
    return null;
  }
}

export function encodeSharePayload(payload: Graph3DSharePayload) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function decodeSharePayload(raw: string): Graph3DSharePayload | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(raw)))) as Graph3DSharePayload;
    if (!Array.isArray(parsed.surfaces) || !parsed.cameraPosition) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function emptyChecklist(): ReadGraphChecklist {
  return { intercepts: false, extrema: false, symmetry: false, slice: false };
}

export function implicitLodResolution(base: number, lod: number) {
  const scale = lod <= 1 ? 0.45 : lod === 2 ? 0.7 : 1;
  return Math.max(12, Math.min(56, Math.round(base * scale)));
}
