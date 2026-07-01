import { createMathObject, normalizeMathObject, withObjectPatch } from "./coreObjects";
import { parseGeoGebraCommand, type ParsedWorkspaceCommand } from "./geogebraCommandParser";
import { sampleGraph } from "./graphSampler";
import { applyObjectProperties } from "./objectProperties";
import {
  circle,
  distanceBetween,
  parseConicEquation,
  point,
  polygonArea,
  polygonPerimeter,
  vector,
} from "./geometry2dKernel";
import { cone3, cylinder3, line3, parsePlaneEquation, plane3, point3, sphere3, vector3 } from "./geometry3dKernel";
import type { AlgebraObjectModel, MathObject, MathObjectDependency, MathVec3 } from "./types";

export type DynamicWorkspaceEvaluation = {
  objects: MathObject[];
  algebra: AlgebraObjectModel[];
  diagnostics: DynamicDiagnostic[];
};

export type DynamicDiagnostic = {
  objectId?: string;
  severity: "info" | "warning" | "error";
  message: string;
};

type ObjectIndex = {
  byId: Map<string, MathObject>;
  byName: Map<string, MathObject>;
};

export function createObjectFromDefinition(input: string, existing: MathObject[] = []): MathObject {
  const command = parseGeoGebraCommand(input);
  const id = command.assignment ?? stableIdForCommand(command);
  return normalizeDynamicObject(materializeCommand(command, id, indexObjects(existing)));
}

export function evaluateDynamicWorkspace(objects: MathObject[]): DynamicWorkspaceEvaluation {
  const diagnostics: DynamicDiagnostic[] = [];
  const normalized = objects.map(normalizeMathObject);
  const ordered = topologicalOrder(normalized, diagnostics);
  let current = normalized;

  ordered.forEach((object) => {
    if (!object.definition?.source) return;
    try {
      const command = parseGeoGebraCommand(object.definition.source);
      const next = materializeCommand(command, object.id, indexObjects(current), object);
      current = current.map((candidate) => (candidate.id === object.id ? normalizeDynamicObject(next) : candidate));
    } catch (error) {
      diagnostics.push({ objectId: object.id, severity: "error", message: error instanceof Error ? error.message : "Could not recompute object." });
      current = current.map((candidate) => (candidate.id === object.id ? withObjectPatch(candidate, { status: "error" }) : candidate));
    }
  });

  current = applyObjectProperties(current);
  const algebra = buildCanonicalAlgebra(current);
  const algebraById = new Map(algebra.map((row) => [row.id, row]));
  return {
    objects: current.map((object) => normalizeMathObject({ ...object, algebra: algebraById.get(object.id) })),
    algebra,
    diagnostics,
  };
}

export function buildCanonicalAlgebra(objects: MathObject[]): AlgebraObjectModel[] {
  const children = new Map<string, string[]>();
  objects.forEach((object) => {
    object.dependencies?.forEach((dependency) => {
      children.set(dependency.id, [...(children.get(dependency.id) ?? []), object.id]);
    });
  });

  return objects.map((object) => {
    const parentIds = object.definition?.parentIds?.length ? object.definition.parentIds : object.dependencies?.map((dependency) => dependency.id) ?? [];
    return {
      id: object.id,
      name: object.label,
      definition: object.definition?.source ?? object.value,
      value: object.value,
      kind: object.kind,
      dimension: object.dimension ?? "abstract",
      free: parentIds.length === 0,
      auxiliary: object.role === "helper" || object.metadata?.auxiliary === true,
      visible: object.visible,
      parentIds,
      childIds: children.get(object.id) ?? [],
      linkedViews: object.linkedViews,
    };
  });
}

function materializeCommand(command: ParsedWorkspaceCommand, id: string, index: ObjectIndex, previous?: MathObject): MathObject {
  const label = command.assignment ?? previous?.label ?? id;
  const inferredDependencies = dependenciesFor(command, index);
  const dependencies = inferredDependencies.length ? inferredDependencies : previous?.dependencies ?? [];
  const base = {
    id,
    label,
    dependencies,
    definition: {
      source: command.raw,
      command: command.normalizedName,
      expression: command.args.map((arg) => arg.raw).join(", "),
      category: command.category,
      parentIds: dependencies.map((dependency) => dependency.id),
    },
    metadata: { ...previous?.metadata, command: command.normalizedName, category: command.category },
  };

  if (command.category === "graph" || command.normalizedName === "Plot" || command.normalizedName === "Function") {
    const expression = command.args[0]?.raw ?? command.raw;
    const sample = sampleGraph(expression);
    return createMathObject({
      ...base,
      kind: "function",
      dimension: "2d",
      role: "algebra",
      value: command.assignment ? `${command.assignment}(x) = ${expression}` : `y = ${expression}`,
      summary: `${sample.kind} graph with ${"segments" in sample ? sample.segments.length : sample.cells.length} sampled part(s).`,
      geometry: { type: "surface", expression },
      linkedViews: ["Graph", "Algebra", "Table"],
      metadata: { ...base.metadata, graphKind: sample.kind, sampleParts: "segments" in sample ? sample.segments.length : sample.cells.length },
    });
  }

  if (command.category === "geometry2d") return materialize2D(command, base, index);
  if (command.category === "geometry3d") return materialize3D(command, base, index);

  return createMathObject({
    ...base,
    kind: command.category === "spreadsheet" ? "table" : command.category === "scripting" ? "slider" : "result",
    value: `${command.normalizedName}[${command.args.map((arg) => arg.raw).join(", ")}]`,
    summary: `${command.group ?? command.category} command object.`,
    linkedViews: ["Algebra", "Inspector"],
  });
}

function materialize2D(command: ParsedWorkspaceCommand, base: MaterializeBase, index: ObjectIndex): MathObject {
  const name = command.normalizedName.toLowerCase();
  if (name === "point") {
    const p = pointArg(command.args[0]);
    return createMathObject({ ...base, kind: "point", dimension: "2d", value: `${base.label}=(${p.x}, ${p.y})`, geometry: { type: "point", position: vec3(p.x, p.y, 0) } });
  }
  if (name === "line" || name === "segment" || name === "ray" || name === "vector") {
    const a = resolvePoint(command.args[0]?.raw, index);
    const b = resolvePoint(command.args[1]?.raw, index);
    const kind = name as "line" | "segment" | "ray" | "vector";
    const vectorObject = kind === "vector" ? vector(a, b) : null;
    return createMathObject({
      ...base,
      kind,
      dimension: "2d",
      value: `${base.label}=${command.normalizedName}(${pointText(a)}, ${pointText(b)})`,
      geometry: kind === "vector" ? { type: "line", start: vec3(0, 0, 0), end: vec3(vectorObject?.x ?? 0, vectorObject?.y ?? 0, 0) } : { type: kind, start: vec3(a.x, a.y, 0), end: vec3(b.x, b.y, 0) },
    });
  }
  if (name === "circle") {
    const center = resolvePoint(command.args[0]?.raw, index);
    const radius = command.args[1]?.type === "number" ? command.args[1].value : distanceBetween(center, resolvePoint(command.args[1]?.raw, index));
    const c = circle(center, radius);
    return createMathObject({ ...base, kind: "circle", dimension: "2d", value: `${base.label}=Circle(${pointText(center)}, ${radius})`, geometry: { type: "circle", center: vec3(c.center.x, c.center.y, 0), radius: c.radius } });
  }
  if (name === "polygon") {
    const vertices = command.args.map((arg) => resolvePoint(arg.raw, index));
    return createMathObject({
      ...base,
      kind: "polygon",
      dimension: "2d",
      value: `${base.label}=Polygon(${vertices.map(pointText).join(", ")})`,
      summary: `Area ${round(polygonArea(vertices))}; perimeter ${round(polygonPerimeter(vertices))}.`,
      geometry: { type: "polygon", vertices: vertices.map((vertex) => vec3(vertex.x, vertex.y, 0)) },
    });
  }
  if (name === "conic") {
    const conic = parseConicEquation(command.args[0]?.raw ?? "");
    return createMathObject({ ...base, kind: "conic", dimension: "2d", value: `${base.label}=${command.args[0]?.raw ?? "conic"}`, summary: conic ? `${conic.type} conic` : "General conic", geometry: { type: "none" } });
  }
  return createMathObject({ ...base, kind: "geometry", dimension: "2d", value: `${command.normalizedName}[${command.args.map((arg) => arg.raw).join(", ")}]`, linkedViews: ["Geometry", "Algebra", "Inspector"] });
}

function materialize3D(command: ParsedWorkspaceCommand, base: MaterializeBase, _index: ObjectIndex): MathObject {
  const name = command.normalizedName.toLowerCase();
  if (name === "point3d" || (name === "point" && command.args[0]?.type === "point3")) {
    const p = point3Arg(command.args[0]);
    return createMathObject({ ...base, kind: "point", dimension: "3d", value: `${base.label}=(${p.x}, ${p.y}, ${p.z})`, geometry: { type: "point", position: p } });
  }
  if (name === "plane") {
    const plane = command.args.length === 1 ? parsePlaneEquation(command.args[0].raw) ?? plane3(point3(0, 0, 0), vector3(0, 0, 1)) : plane3(point3Arg(command.args[0]), vector3Arg(command.args[1]));
    return createMathObject({ ...base, kind: "plane", dimension: "3d", value: `${base.label}=Plane(${point3Text(plane.point)}, <${point3Text(plane.normal)}>)`, geometry: { type: "plane", point: plane.point, normal: plane.normal, width: 6, height: 6 } });
  }
  if (name === "sphere") {
    const center = point3Arg(command.args[0]);
    const radius = numberArg(command.args[1], 1);
    const object = sphere3(center, radius);
    return createMathObject({ ...base, kind: "solid", dimension: "3d", value: `${base.label}=Sphere(${point3Text(center)}, ${radius})`, geometry: { type: "sphere", center: object.center, radius: object.radius } });
  }
  if (name === "cone" || name === "cylinder") {
    const center = point3Arg(command.args[0]);
    const radius = numberArg(command.args[1], 1);
    const height = numberArg(command.args[2], 2);
    const object = name === "cone" ? cone3(center, radius, height) : cylinder3(center, radius, height);
    return createMathObject({ ...base, kind: "solid", dimension: "3d", value: `${base.label}=${command.normalizedName}(${point3Text(center)}, ${radius}, ${height})`, geometry: { type: "solid", solid: object.kind === "cone3" ? "cone" : "cylinder", dimensions: vec3(radius * 2, height, radius * 2), radius } });
  }
  if (name === "line") {
    const a = point3Arg(command.args[0]);
    const b = point3Arg(command.args[1]);
    const object = line3(a, vector3(b.x - a.x, b.y - a.y, b.z - a.z));
    return createMathObject({ ...base, kind: "line", dimension: "3d", value: `${base.label}=Line(${point3Text(a)}, ${point3Text(b)})`, geometry: { type: "line", start: object.point, end: b } });
  }
  return createMathObject({ ...base, kind: name === "surface" ? "surface" : "space3d", dimension: "3d", value: `${command.normalizedName}[${command.args.map((arg) => arg.raw).join(", ")}]`, geometry: name === "surface" ? { type: "surface", expression: command.args[0]?.raw ?? "z=0" } : { type: "none" }, linkedViews: ["3D", "Algebra", "Inspector"] });
}

type MaterializeBase = {
  id: string;
  label: string;
  dependencies: MathObjectDependency[];
  definition: MathObject["definition"];
  metadata: MathObject["metadata"];
};

function dependenciesFor(command: ParsedWorkspaceCommand, index: ObjectIndex): MathObjectDependency[] {
  return command.parentIds.flatMap((id) => {
    const object = index.byName.get(id) ?? index.byName.get(id.toLowerCase()) ?? index.byId.get(id);
    return object ? [{ id: object.id, label: object.label, role: "parent" }] : [];
  });
}

function topologicalOrder(objects: MathObject[], diagnostics: DynamicDiagnostic[]) {
  const byId = new Map(objects.map((object) => [object.id, object]));
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const output: MathObject[] = [];
  const visit = (object: MathObject) => {
    if (visited.has(object.id)) return;
    if (visiting.has(object.id)) {
      diagnostics.push({ objectId: object.id, severity: "error", message: "Circular dependency detected." });
      return;
    }
    visiting.add(object.id);
    object.dependencies?.forEach((dependency) => {
      const parent = byId.get(dependency.id);
      if (parent) visit(parent);
    });
    visiting.delete(object.id);
    visited.add(object.id);
    output.push(object);
  };
  objects.forEach(visit);
  return output;
}

function indexObjects(objects: MathObject[]): ObjectIndex {
  const byId = new Map(objects.map((object) => [object.id, object]));
  const byName = new Map<string, MathObject>();
  objects.forEach((object) => {
    byName.set(object.label, object);
    byName.set(object.label.toLowerCase(), object);
    byName.set(object.id, object);
    byName.set(object.id.toLowerCase(), object);
  });
  return { byId, byName };
}

function normalizeDynamicObject(object: MathObject) {
  return normalizeMathObject({ ...object, algebra: undefined });
}

function resolvePoint(raw: string | undefined, index: ObjectIndex) {
  if (!raw) return point(0, 0);
  const object = index.byName.get(raw) ?? index.byName.get(raw.toLowerCase()) ?? index.byId.get(raw);
  if (object?.geometry?.type === "point") return point(object.geometry.position.x, object.geometry.position.y);
  const match = raw.match(/\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?/);
  return match ? point(Number(match[1]), Number(match[2])) : point(0, 0);
}

function pointArg(arg: ParsedWorkspaceCommand["args"][number] | undefined) {
  if (arg?.type === "point2") return point(arg.value[0], arg.value[1]);
  return resolvePoint(arg?.raw, { byId: new Map(), byName: new Map() });
}

function point3Arg(arg: ParsedWorkspaceCommand["args"][number] | undefined) {
  if (arg?.type === "point3") return point3(arg.value[0], arg.value[1], arg.value[2]);
  if (arg?.type === "point2") return point3(arg.value[0], arg.value[1], 0);
  return point3(0, 0, 0);
}

function vector3Arg(arg: ParsedWorkspaceCommand["args"][number] | undefined) {
  const p = point3Arg(arg);
  return vector3(p.x, p.y, p.z);
}

function numberArg(arg: ParsedWorkspaceCommand["args"][number] | undefined, fallback: number) {
  return arg?.type === "number" ? arg.value : fallback;
}

function pointText(p: { x: number; y: number }) {
  return `(${round(p.x)}, ${round(p.y)})`;
}

function point3Text(p: { x: number; y: number; z: number }) {
  return `${round(p.x)}, ${round(p.y)}, ${round(p.z)}`;
}

function vec3(x: number, y: number, z: number): MathVec3 {
  return { x, y, z };
}

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

function stableIdForCommand(command: ParsedWorkspaceCommand) {
  return `${command.category}:${command.normalizedName.toLowerCase()}:${Math.abs(hash(command.raw))}`;
}

function hash(value: string) {
  let output = 0;
  for (let index = 0; index < value.length; index += 1) output = (output * 31 + value.charCodeAt(index)) | 0;
  return output;
}
