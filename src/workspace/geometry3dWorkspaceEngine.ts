import {
  cone3,
  createTransformGizmo,
  cylinder3,
  distance3,
  intersect3,
  line3,
  object3Measurement,
  plane3,
  point3,
  sphere3,
  vector3,
  type Cone3,
  type Cylinder3,
  type Intersection3,
  type Line3,
  type Object3,
  type Plane3,
  type Point3,
  type Sphere3,
  type Vector3,
} from "./geometry3dKernel";
import { solveExact3D, type Exact3DConstraint, type Exact3DState } from "./constructionKernels";

export type Geometry3DObject =
  | { id: string; kind: "point"; label: string; point: Point3; parents?: string[] }
  | { id: string; kind: "vector"; label: string; vector: Vector3; origin: Point3; parents?: string[] }
  | { id: string; kind: "line"; label: string; object: Line3; parents: string[] }
  | { id: string; kind: "plane"; label: string; object: Plane3; parents: string[] }
  | { id: string; kind: "sphere"; label: string; object: Sphere3; parents: string[] }
  | { id: string; kind: "cylinder"; label: string; object: Cylinder3; parents: string[] }
  | { id: string; kind: "cone"; label: string; object: Cone3; parents: string[] }
  | { id: string; kind: "section"; label: string; section: Intersection3; parents: string[] }
  | { id: string; kind: "locus"; label: string; points: Point3[]; parents: string[] };

export type Geometry3DScene = {
  objects: Geometry3DObject[];
  constraints: Exact3DConstraint[];
};

export type Snap3DKind = "grid" | "point" | "intersection" | "object";

export type Snap3DResult = {
  kind: Snap3DKind;
  point: Point3;
  distance: number;
  label: string;
  targetId?: string;
};

export type Geometry3DMeasurement =
  | { kind: "distance"; label: string; value: number; unit: "unit" }
  | { kind: "volume"; label: string; value: number; unit: "cubic-unit" }
  | { kind: "surface-area"; label: string; value: number; unit: "square-unit" }
  | { kind: "equation"; label: string; value: string; unit: "equation" }
  | { kind: "direction"; label: string; value: string; unit: "vector" }
  | { kind: "section"; label: string; value: string; unit: "object" };

export function createPoint3DObject(id: string, label: string, x: number, y: number, z: number): Geometry3DObject {
  return { id, kind: "point", label, point: point3(x, y, z), parents: [] };
}

export function createVector3DObject(id: string, label: string, vector: Vector3, origin: Point3 = point3(0, 0, 0)): Geometry3DObject {
  return { id, kind: "vector", label, vector, origin, parents: [] };
}

export function createLine3DObject(id: string, label: string, a: Geometry3DObject, b: Geometry3DObject): Geometry3DObject {
  const pa = objectPoint3(a);
  const pb = objectPoint3(b);
  return { id, kind: "line", label, object: line3(pa, vector3(pb.x - pa.x, pb.y - pa.y, pb.z - pa.z)), parents: [a.id, b.id] };
}

export function createPlane3DObject(id: string, label: string, anchor: Geometry3DObject, normal: Vector3): Geometry3DObject {
  return { id, kind: "plane", label, object: plane3(objectPoint3(anchor), normal), parents: [anchor.id] };
}

export function createSphere3DObject(id: string, label: string, center: Geometry3DObject, radius: number): Geometry3DObject {
  return { id, kind: "sphere", label, object: sphere3(objectPoint3(center), radius), parents: [center.id] };
}

export function createCylinder3DObject(id: string, label: string, center: Geometry3DObject, radius: number, height: number): Geometry3DObject {
  return { id, kind: "cylinder", label, object: cylinder3(objectPoint3(center), radius, height), parents: [center.id] };
}

export function createCone3DObject(id: string, label: string, center: Geometry3DObject, radius: number, height: number): Geometry3DObject {
  return { id, kind: "cone", label, object: cone3(objectPoint3(center), radius, height), parents: [center.id] };
}

export function solveGeometry3DScene(scene: Geometry3DScene): Geometry3DScene {
  const solved = solveExact3D(toExactState(scene));
  return fromExactState(scene, solved);
}

export function allSceneIntersections3D(scene: Geometry3DScene): Intersection3[] {
  const objects = scene.objects.filter((object): object is Extract<Geometry3DObject, { object: Object3 }> => "object" in object).map((object) => object.object);
  const hits: Intersection3[] = [];
  for (let i = 0; i < objects.length; i += 1) {
    for (let j = i + 1; j < objects.length; j += 1) hits.push(...intersect3(objects[i], objects[j]));
  }
  return uniqueIntersections(hits);
}

export function createSection3DObjects(scene: Geometry3DScene): Geometry3DObject[] {
  return allSceneIntersections3D(scene).map((section, index) => ({
    id: `section:${index + 1}`,
    kind: "section",
    label: `${section.source} ${index + 1}`,
    section,
    parents: [],
  }));
}

export function snapPointToGeometry3D(pointer: Point3, scene: Geometry3DScene, options: { gridSize?: number; threshold?: number } = {}): Snap3DResult {
  const gridSize = options.gridSize ?? 1;
  const threshold = options.threshold ?? gridSize / 2;
  const grid = point3(Math.round(pointer.x / gridSize) * gridSize, Math.round(pointer.y / gridSize) * gridSize, Math.round(pointer.z / gridSize) * gridSize);
  const candidates: Snap3DResult[] = [{ kind: "grid", point: grid, distance: distance3(pointer, grid), label: "Grid" }];

  scene.objects.forEach((object) => {
    if (object.kind === "point") candidates.push({ kind: "point", point: object.point, distance: distance3(pointer, object.point), label: object.label, targetId: object.id });
    if (object.kind === "line") pushCandidate(candidates, "object", projectPointToLine3(pointer, object.object), pointer, object.label, object.id);
    if (object.kind === "plane") pushCandidate(candidates, "object", projectPointToPlane3(pointer, object.object), pointer, object.label, object.id);
    if (object.kind === "sphere") pushCandidate(candidates, "object", projectPointToSphere3(pointer, object.object), pointer, object.label, object.id);
  });

  allSceneIntersections3D(scene).forEach((hit, index) => {
    if (hit.kind === "point") pushCandidate(candidates, "intersection", hit.point, pointer, `intersection ${index + 1}`);
    if (hit.kind === "circle") pushCandidate(candidates, "intersection", hit.center, pointer, `section center ${index + 1}`);
    if (hit.kind === "line") pushCandidate(candidates, "intersection", projectPointToLine3(pointer, hit.line), pointer, `intersection line ${index + 1}`);
  });

  const nearby = candidates.filter((candidate) => candidate.distance <= threshold);
  if (nearby.length > 0) return nearby.sort((a, b) => snap3DPriority(a.kind) - snap3DPriority(b.kind) || a.distance - b.distance)[0];
  return candidates.sort((a, b) => a.distance - b.distance)[0];
}

export function measureGeometry3D(scene: Geometry3DScene): Geometry3DMeasurement[] {
  const measurements: Geometry3DMeasurement[] = [];
  scene.objects.forEach((object) => {
    if (object.kind === "point") measurements.push({ kind: "equation", label: object.label, value: pointText(object.point), unit: "equation" });
    if (object.kind === "vector") measurements.push({ kind: "distance", label: `length ${object.label}`, value: round(length3(object.vector)), unit: "unit" });
    if (object.kind === "line") {
      measurements.push({ kind: "direction", label: `direction ${object.label}`, value: vectorText(object.object.direction), unit: "vector" });
      measurements.push({ kind: "equation", label: `line ${object.label}`, value: `${pointText(object.object.point)} + t${vectorText(object.object.direction)}`, unit: "equation" });
    }
    if (object.kind === "plane") measurements.push({ kind: "equation", label: `plane ${object.label}`, value: planeEquationText(object.object), unit: "equation" });
    if (object.kind === "sphere" || object.kind === "cylinder" || object.kind === "cone") {
      const metric = object3Measurement(object.object);
      measurements.push({ kind: "volume", label: `volume ${object.label}`, value: round(metric.volume), unit: "cubic-unit" });
      measurements.push({ kind: "surface-area", label: `surface ${object.label}`, value: round(metric.surfaceArea), unit: "square-unit" });
    }
    if (object.kind === "section") measurements.push({ kind: "section", label: object.label, value: sectionText(object.section), unit: "object" });
  });

  allSceneIntersections3D(scene).forEach((section, index) => {
    measurements.push({ kind: "section", label: `section ${index + 1}`, value: sectionText(section), unit: "object" });
  });
  return measurements;
}

export function transformGeometry3DObject(object: Geometry3DObject, transform: { type: "translate"; vector: Vector3 } | { type: "scale"; center: Point3; factor: number } | { type: "rotate"; center: Point3; axis: "x" | "y" | "z"; degrees: number }): Geometry3DObject {
  const transformPoint = (p: Point3) => {
    if (transform.type === "translate") return point3(p.x + transform.vector.x, p.y + transform.vector.y, p.z + transform.vector.z);
    if (transform.type === "scale") return point3(transform.center.x + (p.x - transform.center.x) * transform.factor, transform.center.y + (p.y - transform.center.y) * transform.factor, transform.center.z + (p.z - transform.center.z) * transform.factor);
    return rotatePoint3(p, transform.center, axisVector(transform.axis), transform.degrees);
  };
  const transformVector = (v: Vector3) => (transform.type === "rotate" ? rotateVector3(v, axisVector(transform.axis), transform.degrees) : v);
  const factor = transform.type === "scale" ? Math.abs(transform.factor) : 1;

  if (object.kind === "point") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, point: transformPoint(object.point), parents: [object.id] };
  if (object.kind === "vector") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, origin: transformPoint(object.origin), vector: transformVector(object.vector), parents: [object.id] };
  if (object.kind === "line") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, object: line3(transformPoint(object.object.point), transformVector(object.object.direction)), parents: [object.id] };
  if (object.kind === "plane") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, object: plane3(transformPoint(object.object.point), transformVector(object.object.normal)), parents: [object.id] };
  if (object.kind === "sphere") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, object: sphere3(transformPoint(object.object.center), object.object.radius * factor), parents: [object.id] };
  if (object.kind === "cylinder") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, object: cylinder3(transformPoint(object.object.center), object.object.radius * factor, object.object.height * factor), parents: [object.id] };
  if (object.kind === "cone") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, object: cone3(transformPoint(object.object.center), object.object.radius * factor, object.object.height * factor), parents: [object.id] };
  if (object.kind === "locus") return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, points: object.points.map(transformPoint), parents: [object.id] };
  return { ...object, id: `${object.id}:transform`, label: `${object.label}'`, parents: [object.id] };
}

export function generateLocus3D(id: string, label: string, source: Geometry3DObject, motion: { axis?: "x" | "y" | "z"; center?: Point3; radius?: number; samples?: number } = {}): Geometry3DObject {
  const base = objectPoint3(source);
  const center = motion.center ?? base;
  const radius = motion.radius ?? 2;
  const samples = Math.max(8, Math.min(720, motion.samples ?? 120));
  const axis = motion.axis ?? "z";
  const points = Array.from({ length: samples + 1 }, (_, index) => {
    const theta = (index / samples) * Math.PI * 2;
    if (axis === "x") return point3(center.x, center.y + Math.cos(theta) * radius, center.z + Math.sin(theta) * radius);
    if (axis === "y") return point3(center.x + Math.cos(theta) * radius, center.y, center.z + Math.sin(theta) * radius);
    return point3(center.x + Math.cos(theta) * radius, center.y + Math.sin(theta) * radius, center.z);
  });
  return { id, kind: "locus", label, points, parents: [source.id] };
}

export function createGeometry3DTransformHandles(mode: "translate" | "rotate" | "scale", snapStep?: number) {
  return createTransformGizmo(mode, snapStep);
}

function toExactState(scene: Geometry3DScene): Exact3DState {
  const points: Record<string, Point3> = {};
  const objects: Record<string, Object3> = {};
  scene.objects.forEach((object) => {
    if (object.kind === "point") points[object.id] = object.point;
    if ("object" in object) objects[object.id] = object.object;
  });
  return { points, objects, constraints: scene.constraints };
}

function fromExactState(scene: Geometry3DScene, state: Exact3DState): Geometry3DScene {
  return {
    constraints: scene.constraints,
    objects: scene.objects.map((object) => {
      if (object.kind === "point" && state.points[object.id]) return { ...object, point: state.points[object.id] };
      if ("object" in object && state.objects[object.id]) return { ...object, object: state.objects[object.id] as never };
      return object;
    }),
  };
}

function objectPoint3(object: Geometry3DObject): Point3 {
  if (object.kind === "point") return object.point;
  if (object.kind === "vector") return object.origin;
  if (object.kind === "line" || object.kind === "plane") return object.object.point;
  if (object.kind === "sphere" || object.kind === "cylinder" || object.kind === "cone") return object.object.center;
  if (object.kind === "section") return sectionAnchor(object.section);
  return object.points[0] ?? point3(0, 0, 0);
}

function sectionAnchor(section: Intersection3): Point3 {
  if (section.kind === "point") return section.point;
  if (section.kind === "circle") return section.center;
  return section.line.point;
}

function projectPointToLine3(target: Point3, item: Line3) {
  const delta = vector3(target.x - item.point.x, target.y - item.point.y, target.z - item.point.z);
  return addPointVector(item.point, scaleVector(item.direction, dot3(delta, item.direction)));
}

function projectPointToPlane3(target: Point3, item: Plane3) {
  const delta = vector3(target.x - item.point.x, target.y - item.point.y, target.z - item.point.z);
  return addPointVector(target, scaleVector(item.normal, -dot3(delta, item.normal)));
}

function projectPointToSphere3(target: Point3, item: Sphere3) {
  const delta = vector3(target.x - item.center.x, target.y - item.center.y, target.z - item.center.z);
  const length = length3(delta) || 1;
  return addPointVector(item.center, scaleVector(delta, item.radius / length));
}

function pushCandidate(candidates: Snap3DResult[], kind: Snap3DKind, candidate: Point3, pointer: Point3, label: string, targetId?: string) {
  candidates.push({ kind, point: candidate, distance: distance3(pointer, candidate), label, targetId });
}

function snap3DPriority(kind: Snap3DKind) {
  const order: Record<Snap3DKind, number> = { intersection: 0, point: 1, object: 2, grid: 3 };
  return order[kind];
}

function uniqueIntersections(intersections: Intersection3[]) {
  const seen = new Set<string>();
  return intersections.filter((item) => {
    const key = sectionText(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function planeEquationText(item: Plane3) {
  const d = dot3(item.normal, item.point);
  return `${round(item.normal.x)}x ${item.normal.y >= 0 ? "+" : "-"} ${Math.abs(round(item.normal.y))}y ${item.normal.z >= 0 ? "+" : "-"} ${Math.abs(round(item.normal.z))}z = ${round(d)}`;
}

function sectionText(section: Intersection3) {
  if (section.kind === "point") return `point ${pointText(section.point)}`;
  if (section.kind === "circle") return `circle center ${pointText(section.center)}, r=${round(section.radius)}`;
  return `line ${pointText(section.line.point)} + t${vectorText(section.line.direction)}`;
}

function pointText(p: Point3) {
  return `(${round(p.x)}, ${round(p.y)}, ${round(p.z)})`;
}

function vectorText(v: Vector3) {
  return `<${round(v.x)}, ${round(v.y)}, ${round(v.z)}>`;
}

function rotatePoint3(p: Point3, center: Point3, axis: Vector3, degrees: number) {
  const shifted = vector3(p.x - center.x, p.y - center.y, p.z - center.z);
  const rotated = rotateVector3(shifted, axis, degrees);
  return point3(center.x + rotated.x, center.y + rotated.y, center.z + rotated.z);
}

function rotateVector3(v: Vector3, axis: Vector3, degrees: number) {
  const unit = normalize3(axis);
  const theta = (degrees * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const cross = cross3(unit, v);
  const dot = dot3(unit, v);
  return vector3(v.x * cos + cross.x * sin + unit.x * dot * (1 - cos), v.y * cos + cross.y * sin + unit.y * dot * (1 - cos), v.z * cos + cross.z * sin + unit.z * dot * (1 - cos));
}

function axisVector(axis: "x" | "y" | "z") {
  if (axis === "x") return vector3(1, 0, 0);
  if (axis === "y") return vector3(0, 1, 0);
  return vector3(0, 0, 1);
}

function dot3(a: Vector3, b: Vector3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross3(a: Vector3, b: Vector3) {
  return vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}

function length3(v: Vector3) {
  return Math.hypot(v.x, v.y, v.z);
}

function normalize3(v: Vector3) {
  const length = length3(v) || 1;
  return vector3(v.x / length, v.y / length, v.z / length);
}

function scaleVector(v: Vector3, factor: number) {
  return vector3(v.x * factor, v.y * factor, v.z * factor);
}

function addPointVector(p: Point3, v: Vector3) {
  return point3(p.x + v.x, p.y + v.y, p.z + v.z);
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
