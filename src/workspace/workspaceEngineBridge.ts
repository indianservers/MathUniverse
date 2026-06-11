import { createMathObject, normalizeMathObject } from "./coreObjects";
import {
  circle,
  conic,
  line,
  point,
  segment,
  type KernelPoint,
} from "./geometry2dKernel";
import {
  measureGeometry2D,
  solveGeometry2DScene,
  type Geometry2DObject,
  type Geometry2DScene,
  type GeometryMeasurement,
} from "./geometry2dWorkspaceEngine";
import { cone3, cylinder3, line3, plane3, point3, sphere3, vector3 } from "./geometry3dKernel";
import {
  measureGeometry3D,
  solveGeometry3DScene,
  type Geometry3DMeasurement,
  type Geometry3DObject,
  type Geometry3DScene,
} from "./geometry3dWorkspaceEngine";
import type { MathObject, MathObjectGeometry, MathVec3 } from "./types";

export type SharedWorkspaceModel = {
  objects: MathObject[];
  geometry2d: Geometry2DScene;
  geometry3d: Geometry3DScene;
  measurements: MathObject[];
};

export function buildSharedWorkspaceModel(objects: MathObject[]): SharedWorkspaceModel {
  const normalized = objects.map(normalizeMathObject);
  const geometry2d = solveGeometry2DScene({ objects: normalized.flatMap(mathObjectToGeometry2D), constraints: [] });
  const geometry3d = solveGeometry3DScene({ objects: normalized.flatMap(mathObjectToGeometry3D), constraints: [] });
  const measurements = [
    ...measureGeometry2D(geometry2d).map((measurement, index) => measurementToMathObject(measurement, "2d", index)),
    ...measureGeometry3D(geometry3d).map((measurement, index) => measurementToMathObject(measurement, "3d", index)),
  ];

  return {
    objects: normalized,
    geometry2d,
    geometry3d,
    measurements,
  };
}

export function objectsWithEngineMeasurements(objects: MathObject[]): MathObject[] {
  const model = buildSharedWorkspaceModel(objects);
  const measurementIds = new Set(model.measurements.map((object) => object.id));
  const authored = model.objects.filter((object) => object.metadata?.source !== "engine-measurement" && !measurementIds.has(object.id));
  return [...authored, ...model.measurements];
}

export function mathObjectToGeometry2D(object: MathObject): Geometry2DObject[] {
  if ((object.dimension ?? "abstract") !== "2d") return [];
  const geometry = object.geometry ?? { type: "none" };
  const parents = object.dependencies?.map((dependency) => dependency.id) ?? object.definition?.parentIds ?? [];

  if (geometry.type === "point") {
    return [{ id: object.id, kind: "point", label: object.label, point: point(geometry.position.x, geometry.position.y), parents }];
  }
  if (geometry.type === "line" || geometry.type === "segment" || geometry.type === "ray") {
    const start = point(geometry.start.x, geometry.start.y);
    const end = point(geometry.end.x, geometry.end.y);
    const kernel = geometry.type === "segment" ? segment(start, end) : geometry.type === "ray" ? { kind: "ray" as const, a: start, b: end } : line(start, end);
    return [{ id: object.id, kind: geometry.type, label: object.label, object: kernel, parents }];
  }
  if (geometry.type === "circle") {
    return [{ id: object.id, kind: "circle", label: object.label, object: circle(point(geometry.center.x, geometry.center.y), geometry.radius), parents }];
  }
  if (geometry.type === "polygon") {
    return [{ id: object.id, kind: "polygon", label: object.label, points: geometry.vertices.map(vecToPoint), parents }];
  }
  if (object.kind === "conic") {
    const coefficients = object.metadata?.conicCoefficients;
    if (isConicCoefficientTuple(coefficients)) {
      return [{ id: object.id, kind: "conic", label: object.label, object: conic(coefficients), parents }];
    }
  }
  return [];
}

export function mathObjectToGeometry3D(object: MathObject): Geometry3DObject[] {
  if ((object.dimension ?? "abstract") !== "3d") return [];
  const geometry = object.geometry ?? { type: "none" };
  const parents = object.dependencies?.map((dependency) => dependency.id) ?? object.definition?.parentIds ?? [];

  if (geometry.type === "point") {
    return [{ id: object.id, kind: "point", label: object.label, point: point3(geometry.position.x, geometry.position.y, geometry.position.z), parents }];
  }
  if (geometry.type === "line") {
    const start = point3(geometry.start.x, geometry.start.y, geometry.start.z);
    const end = point3(geometry.end.x, geometry.end.y, geometry.end.z);
    return [{ id: object.id, kind: "line", label: object.label, object: line3(start, vector3(end.x - start.x, end.y - start.y, end.z - start.z)), parents }];
  }
  if (geometry.type === "plane") {
    return [{ id: object.id, kind: "plane", label: object.label, object: plane3(geometry.point, geometry.normal), parents }];
  }
  if (geometry.type === "sphere") {
    return [{ id: object.id, kind: "sphere", label: object.label, object: sphere3(geometry.center, geometry.radius), parents }];
  }
  if (geometry.type === "solid" && geometry.solid === "cylinder") {
    return [{ id: object.id, kind: "cylinder", label: object.label, object: cylinder3(transformPosition(object), geometry.radius ?? geometry.dimensions.x / 2, geometry.dimensions.y), parents }];
  }
  if (geometry.type === "solid" && geometry.solid === "cone") {
    return [{ id: object.id, kind: "cone", label: object.label, object: cone3(transformPosition(object), geometry.radius ?? geometry.dimensions.x / 2, geometry.dimensions.y), parents }];
  }
  return [];
}

export function geometry2DToMathObject(object: Geometry2DObject): MathObject {
  if (object.kind === "point") return createBridgeObject(object.id, object.label, "point", "2d", pointGeometry(object.point), object.parents);
  if (object.kind === "line" || object.kind === "segment" || object.kind === "ray") {
    return createBridgeObject(object.id, object.label, object.kind, "2d", { type: object.kind, start: pointToVec3(object.object.a), end: pointToVec3(object.object.b) }, object.parents);
  }
  if (object.kind === "circle") return createBridgeObject(object.id, object.label, "circle", "2d", { type: "circle", center: pointToVec3(object.object.center), radius: object.object.radius }, object.parents);
  if (object.kind === "polygon") return createBridgeObject(object.id, object.label, "polygon", "2d", { type: "polygon", vertices: object.points.map(pointToVec3) }, object.parents);
  return createBridgeObject(object.id, object.label, object.kind === "conic" ? "conic" : "geometry", "2d", { type: "none" }, object.parents);
}

export function geometry3DToMathObject(object: Geometry3DObject): MathObject {
  if (object.kind === "point") return createBridgeObject(object.id, object.label, "point", "3d", { type: "point", position: object.point }, object.parents);
  if (object.kind === "vector") return createBridgeObject(object.id, object.label, "vector", "3d", { type: "line", start: object.origin, end: addVec3(object.origin, object.vector) }, object.parents);
  if (object.kind === "line") return createBridgeObject(object.id, object.label, "line", "3d", { type: "line", start: object.object.point, end: addVec3(object.object.point, object.object.direction) }, object.parents);
  if (object.kind === "plane") return createBridgeObject(object.id, object.label, "plane", "3d", { type: "plane", point: object.object.point, normal: object.object.normal }, object.parents);
  if (object.kind === "sphere") return createBridgeObject(object.id, object.label, "solid", "3d", { type: "sphere", center: object.object.center, radius: object.object.radius }, object.parents);
  if (object.kind === "cylinder") return createBridgeObject(object.id, object.label, "solid", "3d", { type: "solid", solid: "cylinder", dimensions: vec3(object.object.radius * 2, object.object.height, object.object.radius * 2), radius: object.object.radius }, object.parents);
  if (object.kind === "cone") return createBridgeObject(object.id, object.label, "solid", "3d", { type: "solid", solid: "cone", dimensions: vec3(object.object.radius * 2, object.object.height, object.object.radius * 2), radius: object.object.radius }, object.parents);
  return createBridgeObject(object.id, object.label, object.kind === "locus" ? "space3d" : "result", "3d", { type: "none" }, object.parents);
}

function measurementToMathObject(measurement: GeometryMeasurement | Geometry3DMeasurement, dimension: "2d" | "3d", index: number): MathObject {
  const value = typeof measurement.value === "number" ? String(measurement.value) : measurement.value;
  return createMathObject({
    id: `measurement:${dimension}:${slug(measurement.label)}:${index}`,
    kind: "result",
    dimension: "abstract",
    role: "measurement",
    label: measurement.label,
    value: `${value} ${measurement.unit}`,
    summary: `${dimension.toUpperCase()} ${measurement.kind} measurement.`,
    metadata: { source: "engine-measurement", dimension, measurementKind: measurement.kind },
    linkedViews: dimension === "2d" ? ["Geometry", "Algebra", "Inspector"] : ["3D", "Algebra", "Inspector"],
  });
}

function createBridgeObject(id: string, label: string, kind: MathObject["kind"], dimension: "2d" | "3d", geometry: MathObjectGeometry, parents: string[] = []) {
  return createMathObject({
    id,
    kind,
    dimension,
    label,
    value: label,
    geometry,
    dependencies: parents.map((parent) => ({ id: parent, label: parent, role: "parent" })),
    metadata: { source: "engine-bridge" },
  });
}

function pointGeometry(p: KernelPoint): MathObjectGeometry {
  return { type: "point", position: pointToVec3(p) };
}

function vecToPoint(value: MathVec3) {
  return point(value.x, value.y);
}

function pointToVec3(p: KernelPoint): MathVec3 {
  return { x: p.x, y: p.y, z: 0 };
}

function transformPosition(object: MathObject): MathVec3 {
  return object.transform?.position ?? vec3(0, 0, 0);
}

function addVec3(a: MathVec3, b: MathVec3): MathVec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function vec3(x: number, y: number, z: number): MathVec3 {
  return { x, y, z };
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "measurement";
}

function isConicCoefficientTuple(value: unknown): value is [number, number, number, number, number, number] {
  return Array.isArray(value) && value.length === 6 && value.every((item) => typeof item === "number" && Number.isFinite(item));
}
