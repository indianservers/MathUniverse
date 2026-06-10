export type Point3 = { x: number; y: number; z: number };
export type Vector3 = { x: number; y: number; z: number };
export type Line3 = { kind: "line3"; point: Point3; direction: Vector3 };
export type Plane3 = { kind: "plane3"; point: Point3; normal: Vector3 };
export type Sphere3 = { kind: "sphere3"; center: Point3; radius: number };
export type Cylinder3 = { kind: "cylinder3"; center: Point3; radius: number; height: number };
export type Cone3 = { kind: "cone3"; center: Point3; radius: number; height: number };
export type Solid3 = Sphere3 | Cylinder3 | Cone3;
export type Object3 = Line3 | Plane3 | Solid3;

export type TransformMode3 = "translate" | "rotate" | "scale";
export type GizmoAxis = "x" | "y" | "z" | "xy" | "yz" | "xz" | "uniform";

export type GizmoHandle3 = {
  id: string;
  mode: TransformMode3;
  axis: GizmoAxis;
  label: string;
  color: string;
  cursor: "move" | "crosshair" | "grab";
  snapStep: number;
};

export type Intersection3 =
  | { kind: "point"; point: Point3; source: "line-plane" }
  | { kind: "line"; line: Line3; source: "plane-plane" }
  | { kind: "circle"; center: Point3; normal: Vector3; radius: number; source: "sphere-plane" };

const EPS = 1e-8;

export function point3(x: number, y: number, z: number): Point3 {
  return { x, y, z };
}

export function vector3(x: number, y: number, z: number): Vector3 {
  return { x, y, z };
}

export function line3(point: Point3, direction: Vector3): Line3 {
  return { kind: "line3", point, direction: normalize3(direction) };
}

export function plane3(point: Point3, normal: Vector3): Plane3 {
  return { kind: "plane3", point, normal: normalize3(normal) };
}

export function sphere3(center: Point3, radius: number): Sphere3 {
  return { kind: "sphere3", center, radius: Math.abs(radius) };
}

export function cylinder3(center: Point3, radius: number, height: number): Cylinder3 {
  return { kind: "cylinder3", center, radius: Math.abs(radius), height: Math.abs(height) };
}

export function cone3(center: Point3, radius: number, height: number): Cone3 {
  return { kind: "cone3", center, radius: Math.abs(radius), height: Math.abs(height) };
}

export function parsePoint3(value: string): Point3 | null {
  const match = value.match(/\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?/);
  return match ? point3(Number(match[1]), Number(match[2]), Number(match[3])) : null;
}

export function parseVector3(value: string): Vector3 | null {
  const parsed = parsePoint3(value);
  return parsed ? vector3(parsed.x, parsed.y, parsed.z) : null;
}

export function parsePlaneEquation(value: string): Plane3 | null {
  const compact = value.replace(/\s+/g, "").toLowerCase();
  const z = compact.match(/^z=(-?\d+(?:\.\d+)?)$/);
  if (z) return plane3(point3(0, 0, Number(z[1])), vector3(0, 0, 1));
  const equation = compact.match(/^(-?\d*\.?\d*)x([+-]\d*\.?\d*)y([+-]\d*\.?\d*)z=([-+]?\d+(?:\.\d+)?)$/);
  if (!equation) return null;
  const a = coefficient(equation[1]);
  const b = coefficient(equation[2]);
  const c = coefficient(equation[3]);
  const d = Number(equation[4]);
  const normal = vector3(a, b, c);
  const denominator = dot3(normal, normal) || 1;
  return plane3(scale3(normal, d / denominator), normal);
}

export function intersect3(first: Object3, second: Object3): Intersection3[] {
  if (first.kind === "line3" && second.kind === "plane3") return linePlaneIntersection(first, second);
  if (first.kind === "plane3" && second.kind === "line3") return linePlaneIntersection(second, first);
  if (first.kind === "plane3" && second.kind === "plane3") return planePlaneIntersection(first, second);
  if (first.kind === "sphere3" && second.kind === "plane3") return spherePlaneIntersection(first, second);
  if (first.kind === "plane3" && second.kind === "sphere3") return spherePlaneIntersection(second, first);
  return [];
}

export function distance3(a: Point3, b: Point3) {
  return magnitude3(vector3(b.x - a.x, b.y - a.y, b.z - a.z));
}

export function object3Measurement(object: Object3) {
  if (object.kind === "sphere3") {
    return {
      label: "sphere",
      volume: (4 / 3) * Math.PI * object.radius ** 3,
      surfaceArea: 4 * Math.PI * object.radius ** 2,
      detail: `r=${round(object.radius)}`,
    };
  }
  if (object.kind === "cylinder3") {
    return {
      label: "cylinder",
      volume: Math.PI * object.radius ** 2 * object.height,
      surfaceArea: 2 * Math.PI * object.radius * (object.radius + object.height),
      detail: `r=${round(object.radius)}, h=${round(object.height)}`,
    };
  }
  if (object.kind === "cone3") {
    const slant = Math.hypot(object.radius, object.height);
    return {
      label: "cone",
      volume: (Math.PI * object.radius ** 2 * object.height) / 3,
      surfaceArea: Math.PI * object.radius * (object.radius + slant),
      detail: `r=${round(object.radius)}, h=${round(object.height)}`,
    };
  }
  return {
    label: object.kind,
    volume: 0,
    surfaceArea: 0,
    detail: object.kind === "line3" ? `direction=<${round(object.direction.x)}, ${round(object.direction.y)}, ${round(object.direction.z)}>` : `normal=<${round(object.normal.x)}, ${round(object.normal.y)}, ${round(object.normal.z)}>`,
  };
}

export function createTransformGizmo(mode: TransformMode3, snapStep = mode === "rotate" ? 15 : 0.25): GizmoHandle3[] {
  if (mode === "scale") {
    return [
      { id: "scale-uniform", mode, axis: "uniform", label: "Uniform scale", color: "#f59e0b", cursor: "grab", snapStep },
      { id: "scale-x", mode, axis: "x", label: "Scale X", color: "#ef4444", cursor: "grab", snapStep },
      { id: "scale-y", mode, axis: "y", label: "Scale Y", color: "#22c55e", cursor: "grab", snapStep },
      { id: "scale-z", mode, axis: "z", label: "Scale Z", color: "#38bdf8", cursor: "grab", snapStep },
    ];
  }
  return (["x", "y", "z"] as GizmoAxis[]).map((axis) => ({
    id: `${mode}-${axis}`,
    mode,
    axis,
    label: `${mode} ${axis.toUpperCase()}`,
    color: axis === "x" ? "#ef4444" : axis === "y" ? "#22c55e" : "#38bdf8",
    cursor: mode === "rotate" ? "crosshair" : "move",
    snapStep,
  }));
}

export function snap3(value: number, step: number) {
  return step > 0 ? Math.round(value / step) * step : value;
}

function linePlaneIntersection(line: Line3, plane: Plane3): Intersection3[] {
  const denominator = dot3(plane.normal, line.direction);
  if (Math.abs(denominator) < EPS) return [];
  const t = dot3(plane.normal, vector3(plane.point.x - line.point.x, plane.point.y - line.point.y, plane.point.z - line.point.z)) / denominator;
  return [{ kind: "point", point: add3(line.point, scale3(line.direction, t)), source: "line-plane" }];
}

function planePlaneIntersection(first: Plane3, second: Plane3): Intersection3[] {
  const direction = cross3(first.normal, second.normal);
  const denominator = dot3(direction, direction);
  if (denominator < EPS) return [];
  const d1 = dot3(first.normal, first.point);
  const d2 = dot3(second.normal, second.point);
  const pointOnLine = scale3(add3(scale3(cross3(second.normal, direction), d1), scale3(cross3(direction, first.normal), d2)), 1 / denominator);
  return [{ kind: "line", line: line3(pointOnLine, direction), source: "plane-plane" }];
}

function spherePlaneIntersection(sphere: Sphere3, plane: Plane3): Intersection3[] {
  const signedDistance = dot3(plane.normal, vector3(sphere.center.x - plane.point.x, sphere.center.y - plane.point.y, sphere.center.z - plane.point.z));
  const distance = Math.abs(signedDistance);
  if (distance > sphere.radius + EPS) return [];
  const center = add3(sphere.center, scale3(plane.normal, -signedDistance));
  const radius = Math.sqrt(Math.max(0, sphere.radius ** 2 - distance ** 2));
  return [{ kind: "circle", center, normal: plane.normal, radius, source: "sphere-plane" }];
}

function dot3(a: Vector3, b: Vector3) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function cross3(a: Vector3, b: Vector3): Vector3 {
  return vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}

function magnitude3(v: Vector3) {
  return Math.hypot(v.x, v.y, v.z);
}

function normalize3(v: Vector3): Vector3 {
  const length = magnitude3(v) || 1;
  return vector3(v.x / length, v.y / length, v.z / length);
}

function scale3(v: Vector3, scale: number): Vector3 {
  return vector3(v.x * scale, v.y * scale, v.z * scale);
}

function add3(a: Point3 | Vector3, b: Point3 | Vector3): Point3 {
  return point3(a.x + b.x, a.y + b.y, a.z + b.z);
}

function coefficient(raw: string) {
  if (!raw || raw === "+") return 1;
  if (raw === "-") return -1;
  return Number(raw);
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}
