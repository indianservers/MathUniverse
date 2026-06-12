import {
  circle,
  conic,
  distanceBetween,
  intersectObjects,
  line,
  midpoint,
  parseConicEquation,
  point,
  polygonArea,
  polygonPerimeter,
  ray,
  relationBetween,
  segment,
  type KernelCircle,
  type KernelConic,
  type KernelLinearObject,
  type KernelObject,
  type KernelPoint,
} from "./geometry2dKernel";
import { solveExact2D, solveExact2DWithDiagnostics, type Exact2DConstraint, type Exact2DState, type ExactConstraintDiagnostic } from "./constructionKernels";

export type Geometry2DObject =
  | { id: string; kind: "point"; label: string; point: KernelPoint; parents?: string[] }
  | { id: string; kind: "line" | "segment" | "ray"; label: string; object: KernelLinearObject; parents: string[] }
  | { id: string; kind: "circle"; label: string; object: KernelCircle; parents: string[] }
  | { id: string; kind: "conic"; label: string; object: KernelConic; parents?: string[] }
  | { id: string; kind: "polygon"; label: string; points: KernelPoint[]; parents: string[] }
  | { id: string; kind: "locus"; label: string; points: KernelPoint[]; parents: string[] };

export type Geometry2DScene = {
  objects: Geometry2DObject[];
  constraints: Exact2DConstraint[];
};

export type Geometry2DSolveReport = Geometry2DScene & {
  diagnostics: ExactConstraintDiagnostic[];
  valid: boolean;
};

export type SnapKind = "grid" | "point" | "intersection" | "midpoint" | "object";

export type SnapResult = {
  kind: SnapKind;
  point: KernelPoint;
  distance: number;
  targetId?: string;
  label: string;
};

export type GeometryMeasurement =
  | { kind: "distance"; label: string; value: number; unit: "unit" }
  | { kind: "area"; label: string; value: number; unit: "square-unit" }
  | { kind: "perimeter"; label: string; value: number; unit: "unit" }
  | { kind: "slope"; label: string; value: number | "undefined"; unit: "unitless" }
  | { kind: "equation"; label: string; value: string; unit: "equation" }
  | { kind: "angle"; label: string; value: number; unit: "degree" }
  | { kind: "relation"; label: string; value: string; unit: "statement" };

export function createPointObject(id: string, label: string, x: number, y: number): Geometry2DObject {
  return { id, kind: "point", label, point: point(x, y), parents: [] };
}

export function createLineObject(id: string, label: string, a: Geometry2DObject, b: Geometry2DObject, kind: "line" | "segment" | "ray" = "line"): Geometry2DObject {
  const pa = objectPoint(a);
  const pb = objectPoint(b);
  const object = kind === "segment" ? segment(pa, pb) : kind === "ray" ? { kind: "ray" as const, a: pa, b: pb } : line(pa, pb);
  return { id, kind, label, object, parents: [a.id, b.id] };
}

export function createCircleObject(id: string, label: string, center: Geometry2DObject, edge: Geometry2DObject): Geometry2DObject {
  const c = objectPoint(center);
  const e = objectPoint(edge);
  return { id, kind: "circle", label, object: circle(c, distanceBetween(c, e)), parents: [center.id, edge.id] };
}

export function createConicObject(id: string, label: string, equation: string): Geometry2DObject {
  return { id, kind: "conic", label, object: parseConicEquation(equation) ?? conic([1, 0, 1, 0, 0, -1]), parents: [] };
}

export function createPolygonObject(id: string, label: string, vertices: Geometry2DObject[]): Geometry2DObject {
  return { id, kind: "polygon", label, points: vertices.map(objectPoint), parents: vertices.map((vertex) => vertex.id) };
}

export function solveGeometry2DScene(scene: Geometry2DScene, movingPointId?: string): Geometry2DScene {
  const state = toExactState(scene);
  const solved = solveExact2D(state, movingPointId);
  return fromExactState(scene, solved);
}

export function solveGeometry2DSceneWithDiagnostics(scene: Geometry2DScene, movingPointId?: string): Geometry2DSolveReport {
  const solved = solveExact2DWithDiagnostics(toExactState(scene), movingPointId);
  return { ...fromExactState(scene, solved), diagnostics: solved.diagnostics, valid: solved.valid };
}

export function dragGeometryPoint(scene: Geometry2DScene, pointId: string, nextPoint: KernelPoint): Geometry2DSolveReport {
  const moved: Geometry2DScene = {
    ...scene,
    objects: scene.objects.map((object) => object.kind === "point" && object.id === pointId ? { ...object, point: nextPoint } : object),
  };
  return solveGeometry2DSceneWithDiagnostics(moved, pointId);
}

export function snapPointToGeometry(pointer: KernelPoint, scene: Geometry2DScene, options: { gridSize?: number; threshold?: number } = {}): SnapResult {
  const gridSize = options.gridSize ?? 1;
  const threshold = options.threshold ?? gridSize / 2;
  const grid = point(Math.round(pointer.x / gridSize) * gridSize, Math.round(pointer.y / gridSize) * gridSize);
  const candidates: SnapResult[] = [{ kind: "grid", point: grid, distance: distanceBetween(pointer, grid), label: "Grid" }];

  scene.objects.forEach((object) => {
    if (object.kind === "point") candidates.push({ kind: "point", point: object.point, distance: distanceBetween(pointer, object.point), targetId: object.id, label: object.label });
    if (object.kind === "segment" || object.kind === "line" || object.kind === "ray") {
      const projected = projectPointToLinear(pointer, object.object);
      candidates.push({ kind: "object", point: projected, distance: distanceBetween(pointer, projected), targetId: object.id, label: object.label });
      const mid = midpoint(object.object.a, object.object.b);
      candidates.push({ kind: "midpoint", point: mid, distance: distanceBetween(pointer, mid), targetId: object.id, label: `midpoint ${object.label}` });
    }
    if (object.kind === "circle") {
      const projected = projectPointToCircle(pointer, object.object);
      candidates.push({ kind: "object", point: projected, distance: distanceBetween(pointer, projected), targetId: object.id, label: object.label });
    }
  });

  allSceneIntersections(scene).forEach((hit, index) => {
    candidates.push({ kind: "intersection", point: hit, distance: distanceBetween(pointer, hit), label: `intersection ${index + 1}` });
  });

  const nearby = candidates.filter((candidate) => candidate.distance <= threshold);
  if (nearby.length > 0) return nearby.sort((a, b) => snapPriority(a.kind) - snapPriority(b.kind) || a.distance - b.distance)[0];
  return candidates.sort((a, b) => a.distance - b.distance)[0];
}

export function measureGeometry2D(scene: Geometry2DScene): GeometryMeasurement[] {
  const measurements: GeometryMeasurement[] = [];
  scene.objects.forEach((object) => {
    if (object.kind === "segment" || object.kind === "line" || object.kind === "ray") {
      measurements.push({ kind: "distance", label: object.label, value: round(distanceBetween(object.object.a, object.object.b)), unit: "unit" });
      measurements.push({ kind: "slope", label: `slope ${object.label}`, value: slopeValue(object.object), unit: "unitless" });
      measurements.push({ kind: "equation", label: `equation ${object.label}`, value: lineEquationText(object.object), unit: "equation" });
    }
    if (object.kind === "circle") {
      measurements.push({ kind: "distance", label: `radius ${object.label}`, value: round(object.object.radius), unit: "unit" });
      measurements.push({ kind: "area", label: `area ${object.label}`, value: round(Math.PI * object.object.radius ** 2), unit: "square-unit" });
      measurements.push({ kind: "equation", label: `equation ${object.label}`, value: circleEquationText(object.object), unit: "equation" });
    }
    if (object.kind === "polygon") {
      measurements.push({ kind: "area", label: `area ${object.label}`, value: round(polygonArea(object.points)), unit: "square-unit" });
      measurements.push({ kind: "perimeter", label: `perimeter ${object.label}`, value: round(polygonPerimeter(object.points)), unit: "unit" });
      object.points.forEach((vertex, index, points) => {
        measurements.push({ kind: "angle", label: `angle ${object.label}.${index + 1}`, value: round(angleBetween(points[(index - 1 + points.length) % points.length], vertex, points[(index + 1) % points.length])), unit: "degree" });
      });
    }
  });

  const comparable = scene.objects.filter((object): object is Extract<Geometry2DObject, { object: KernelObject }> => "object" in object);
  for (let i = 0; i < comparable.length; i += 1) {
    for (let j = i + 1; j < comparable.length; j += 1) {
      const relation = relationBetween(comparable[i].object, comparable[j].object);
      if (relation.relation !== "none") measurements.push({ kind: "relation", label: `${comparable[i].label} vs ${comparable[j].label}`, value: relation.relation, unit: "statement" });
    }
  }
  return measurements;
}

export function transformGeometryObject(object: Geometry2DObject, transform: { type: "translate"; vector: KernelPoint } | { type: "rotate"; center: KernelPoint; degrees: number } | { type: "dilate"; center: KernelPoint; factor: number } | { type: "mirror"; a: KernelPoint; b: KernelPoint }): Geometry2DObject {
  const transformPoint = (p: KernelPoint) => {
    if (transform.type === "translate") return point(p.x + transform.vector.x, p.y + transform.vector.y);
    if (transform.type === "rotate") return rotatePoint(p, transform.center, transform.degrees);
    if (transform.type === "dilate") return point(transform.center.x + (p.x - transform.center.x) * transform.factor, transform.center.y + (p.y - transform.center.y) * transform.factor);
    return mirrorPoint(p, transform.a, transform.b);
  };
  if (object.kind === "point") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, point: transformPoint(object.point), parents: [object.id] };
  if (object.kind === "line" || object.kind === "segment" || object.kind === "ray") {
    const a = transformPoint(object.object.a);
    const b = transformPoint(object.object.b);
    return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, object: object.kind === "segment" ? segment(a, b) : object.kind === "ray" ? { kind: "ray", a, b } : line(a, b), parents: [object.id] };
  }
  if (object.kind === "circle") {
    const center = transformPoint(object.object.center);
    const edge = transformPoint(point(object.object.center.x + object.object.radius, object.object.center.y));
    return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, object: circle(center, distanceBetween(center, edge)), parents: [object.id] };
  }
  if (object.kind === "polygon") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, points: object.points.map(transformPoint), parents: [object.id] };
  return object;
}

export function generateLocus(id: string, label: string, source: Geometry2DObject, motion: { center?: KernelPoint; radius?: number; samples?: number } = {}): Geometry2DObject {
  const base = objectPoint(source);
  const center = motion.center ?? base;
  const radius = motion.radius ?? 2;
  const samples = Math.max(8, Math.min(720, motion.samples ?? 120));
  const points = Array.from({ length: samples + 1 }, (_, index) => {
    const theta = (index / samples) * Math.PI * 2;
    return point(center.x + Math.cos(theta) * radius, center.y + Math.sin(theta) * radius);
  });
  return { id, kind: "locus", label, points, parents: [source.id] };
}

export function allSceneIntersections(scene: Geometry2DScene): KernelPoint[] {
  const objects = scene.objects.filter((object): object is Extract<Geometry2DObject, { object: KernelObject }> => "object" in object).map((object) => object.object);
  const hits: KernelPoint[] = [];
  for (let i = 0; i < objects.length; i += 1) {
    for (let j = i + 1; j < objects.length; j += 1) hits.push(...intersectObjects(objects[i], objects[j]));
  }
  return uniquePoints(hits);
}

function toExactState(scene: Geometry2DScene): Exact2DState {
  const points: Record<string, KernelPoint> = {};
  const objects: Record<string, KernelObject> = {};
  scene.objects.forEach((object) => {
    if (object.kind === "point") points[object.id] = object.point;
    if ("object" in object) objects[object.id] = object.object;
  });
  return { points, objects, constraints: scene.constraints };
}

function fromExactState(scene: Geometry2DScene, state: Exact2DState): Geometry2DScene {
  return {
    constraints: scene.constraints,
    objects: scene.objects.map((object) => {
      if (object.kind === "point" && state.points[object.id]) return { ...object, point: state.points[object.id] };
      if ((object.kind === "line" || object.kind === "segment" || object.kind === "ray") && object.parents.length >= 2) {
        const a = state.points[object.parents[0]] ?? object.object.a;
        const b = state.points[object.parents[1]] ?? object.object.b;
        return { ...object, object: object.kind === "segment" ? segment(a, b) : object.kind === "ray" ? ray(a, b) : line(a, b) };
      }
      if (object.kind === "circle" && object.parents.length >= 2) {
        const center = state.points[object.parents[0]] ?? object.object.center;
        const edge = state.points[object.parents[1]];
        return { ...object, object: circle(center, edge ? distanceBetween(center, edge) : object.object.radius) };
      }
      if (object.kind === "polygon") {
        return { ...object, points: object.parents.map((id, index) => state.points[id] ?? object.points[index]).filter((item): item is KernelPoint => Boolean(item)) };
      }
      if ("object" in object && state.objects[object.id]) return { ...object, object: state.objects[object.id] as never };
      return object;
    }),
  };
}

function objectPoint(object: Geometry2DObject): KernelPoint {
  if (object.kind === "point") return object.point;
  if (object.kind === "circle") return object.object.center;
  if (object.kind === "polygon" || object.kind === "locus") return object.points[0] ?? point(0, 0);
  if ("object" in object && "a" in object.object) return object.object.a;
  return point(0, 0);
}

function projectPointToLinear(target: KernelPoint, object: KernelLinearObject) {
  const dx = object.b.x - object.a.x;
  const dy = object.b.y - object.a.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = ((target.x - object.a.x) * dx + (target.y - object.a.y) * dy) / lengthSquared;
  const clamped = object.kind === "segment" ? Math.max(0, Math.min(1, t)) : object.kind === "ray" ? Math.max(0, t) : t;
  return point(object.a.x + clamped * dx, object.a.y + clamped * dy);
}

function projectPointToCircle(target: KernelPoint, object: KernelCircle) {
  const dx = target.x - object.center.x;
  const dy = target.y - object.center.y;
  const length = Math.hypot(dx, dy) || 1;
  return point(object.center.x + (dx / length) * object.radius, object.center.y + (dy / length) * object.radius);
}

function slopeValue(object: KernelLinearObject) {
  const dx = object.b.x - object.a.x;
  return Math.abs(dx) < 1e-9 ? "undefined" : round((object.b.y - object.a.y) / dx);
}

function lineEquationText(object: KernelLinearObject) {
  const a = object.b.y - object.a.y;
  const b = object.a.x - object.b.x;
  const c = -(a * object.a.x + b * object.a.y);
  return `${round(a)}x ${b >= 0 ? "+" : "-"} ${Math.abs(round(b))}y ${c >= 0 ? "+" : "-"} ${Math.abs(round(c))} = 0`;
}

function circleEquationText(object: KernelCircle) {
  return `(x ${object.center.x >= 0 ? "-" : "+"} ${Math.abs(round(object.center.x))})^2 + (y ${object.center.y >= 0 ? "-" : "+"} ${Math.abs(round(object.center.y))})^2 = ${round(object.radius ** 2)}`;
}

function angleBetween(a: KernelPoint, vertex: KernelPoint, b: KernelPoint) {
  const va = normalize(point(a.x - vertex.x, a.y - vertex.y));
  const vb = normalize(point(b.x - vertex.x, b.y - vertex.y));
  return (Math.acos(Math.max(-1, Math.min(1, va.x * vb.x + va.y * vb.y))) * 180) / Math.PI;
}

function rotatePoint(p: KernelPoint, center: KernelPoint, degrees: number) {
  const theta = (degrees * Math.PI) / 180;
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  return point(center.x + dx * Math.cos(theta) - dy * Math.sin(theta), center.y + dx * Math.sin(theta) + dy * Math.cos(theta));
}

function mirrorPoint(p: KernelPoint, a: KernelPoint, b: KernelPoint) {
  const projection = projectPointToLinear(p, line(a, b));
  return point(2 * projection.x - p.x, 2 * projection.y - p.y);
}

function normalize(p: KernelPoint) {
  const length = Math.hypot(p.x, p.y) || 1;
  return point(p.x / length, p.y / length);
}

function snapPriority(kind: SnapKind) {
  const order: Record<SnapKind, number> = {
    intersection: 0,
    point: 1,
    midpoint: 2,
    object: 3,
    grid: 4,
  };
  return order[kind];
}

function uniquePoints(points: KernelPoint[], tolerance = 1e-6) {
  return points.filter((item, index) => points.findIndex((other) => distanceBetween(item, other) < tolerance) === index);
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000;
}
