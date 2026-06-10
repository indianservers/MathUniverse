import type {
  MathObject,
  MathObjectDimension,
  MathObjectGeometry,
  MathObjectInteractivity,
  MathObjectKind,
  MathObjectRole,
  MathObjectStyle,
  MathTransform,
  MathVec3,
} from "./types";

export const ZERO_VEC3: MathVec3 = { x: 0, y: 0, z: 0 };
export const UNIT_VEC3: MathVec3 = { x: 1, y: 1, z: 1 };

export type CreateMathObjectInput = {
  id?: string;
  kind: MathObjectKind;
  dimension?: MathObjectDimension;
  role?: MathObjectRole;
  label: string;
  value?: string;
  summary?: string;
  visible?: boolean;
  locked?: boolean;
  selectable?: boolean;
  style?: MathObjectStyle;
  transform?: Partial<MathTransform>;
  geometry?: MathObjectGeometry;
  linkedViews?: string[];
  metadata?: MathObject["metadata"];
  dependencies?: MathObject["dependencies"];
  constraints?: MathObject["constraints"];
  interactivity?: Partial<MathObjectInteractivity>;
  animation?: MathObject["animation"];
};

export function createMathObject(input: CreateMathObjectInput): MathObject {
  const timestamp = Date.now();
  const visible = input.visible ?? true;
  const locked = input.locked ?? false;
  const selectable = input.selectable ?? true;

  return {
    id: input.id ?? crypto.randomUUID(),
    kind: input.kind,
    dimension: input.dimension ?? inferDimension(input.kind),
    role: input.role ?? inferRole(input.kind),
    label: input.label,
    value: input.value ?? input.label,
    summary: input.summary,
    visible,
    locked,
    selectable,
    status: visible ? "ready" : "hidden",
    style: normalizeStyle(input.style),
    transform: normalizeTransform(input.transform),
    geometry: input.geometry ?? { type: "none" },
    constraints: input.constraints ?? [],
    dependencies: input.dependencies ?? [],
    interactivity: normalizeInteractivity(input.kind, locked, selectable, input.interactivity),
    animation: input.animation ?? { enabled: false },
    linkedViews: input.linkedViews ?? defaultLinkedViews(input.kind),
    createdAt: timestamp,
    updatedAt: timestamp,
    metadata: input.metadata,
  };
}

export function normalizeMathObject(object: MathObject): MathObject {
  const locked = object.locked ?? false;
  const selectable = object.selectable ?? true;

  return {
    ...object,
    dimension: object.dimension ?? inferDimension(object.kind),
    role: object.role ?? inferRole(object.kind),
    visible: object.visible ?? object.status !== "hidden",
    locked,
    selectable,
    status: object.visible === false ? "hidden" : object.status ?? "ready",
    style: normalizeStyle(object.style),
    transform: normalizeTransform(object.transform),
    geometry: object.geometry ?? { type: "none" },
    constraints: object.constraints ?? [],
    dependencies: object.dependencies ?? [],
    interactivity: normalizeInteractivity(object.kind, locked, selectable, object.interactivity),
    animation: object.animation ?? { enabled: false },
    linkedViews: object.linkedViews ?? defaultLinkedViews(object.kind),
    createdAt: object.createdAt ?? Date.now(),
    updatedAt: object.updatedAt ?? object.createdAt ?? Date.now(),
  };
}

export function cloneMathObject(object: MathObject): MathObject {
  return JSON.parse(JSON.stringify(object)) as MathObject;
}

export function withObjectPatch(object: MathObject, patch: Partial<MathObject>): MathObject {
  return normalizeMathObject({
    ...object,
    ...patch,
    style: patch.style ? { ...object.style, ...patch.style } : object.style,
    transform: patch.transform ? normalizeTransform({ ...object.transform, ...patch.transform }) : object.transform,
    interactivity: patch.interactivity ? { ...object.interactivity, ...patch.interactivity } : object.interactivity,
    updatedAt: Date.now(),
  });
}

export function inferDimension(kind: MathObjectKind): MathObjectDimension {
  if (kind === "space3d" || kind === "solid" || kind === "surface" || kind === "plane") return "3d";
  if (["point", "line", "segment", "ray", "polygon", "circle", "arc", "angle", "conic", "vector", "text", "geometry", "transform-helper"].includes(kind)) return "2d";
  return "abstract";
}

export function inferRole(kind: MathObjectKind): MathObjectRole {
  if (kind === "result") return "result";
  if (kind === "text") return "annotation";
  if (kind === "slider" || kind === "transform-helper") return "helper";
  if (kind === "expression" || kind === "equation" || kind === "function" || kind === "matrix" || kind === "table" || kind === "dataset") return "algebra";
  return "construction";
}

export function normalizeTransform(transform?: Partial<MathTransform>): MathTransform {
  return {
    position: normalizeVec3(transform?.position, ZERO_VEC3),
    rotation: normalizeVec3(transform?.rotation, ZERO_VEC3),
    scale: normalizeVec3(transform?.scale, UNIT_VEC3),
    origin: transform?.origin ? normalizeVec3(transform.origin, ZERO_VEC3) : undefined,
  };
}

export function normalizeVec3(value: Partial<MathVec3> | undefined, fallback: MathVec3): MathVec3 {
  return {
    x: finiteOr(value?.x, fallback.x),
    y: finiteOr(value?.y, fallback.y),
    z: finiteOr(value?.z, fallback.z),
  };
}

function normalizeStyle(style?: MathObjectStyle): MathObjectStyle {
  return {
    color: style?.color ?? "#22d3ee",
    fill: style?.fill,
    stroke: style?.stroke,
    strokeWidth: style?.strokeWidth ?? 2,
    lineStyle: style?.lineStyle ?? "solid",
    opacity: clamp(style?.opacity ?? 1, 0, 1),
    labelVisible: style?.labelVisible ?? true,
    labelColor: style?.labelColor,
    pointShape: style?.pointShape,
    material: style?.material,
  };
}

function normalizeInteractivity(kind: MathObjectKind, locked: boolean, selectable: boolean, interactivity?: Partial<MathObjectInteractivity>): MathObjectInteractivity {
  const is3d = inferDimension(kind) === "3d";
  return {
    selectable,
    draggable: !locked && (interactivity?.draggable ?? true),
    editable: !locked && (interactivity?.editable ?? true),
    resizable: !locked && (interactivity?.resizable ?? is3d),
    rotatable: !locked && (interactivity?.rotatable ?? is3d),
    snapToGrid: interactivity?.snapToGrid ?? true,
    snapToObjects: interactivity?.snapToObjects ?? true,
    allowedHandles: interactivity?.allowedHandles ?? (is3d ? ["move-x", "move-y", "move-z", "rotate-x", "rotate-y", "rotate-z", "scale"] : ["move-x", "move-y", "scale"]),
  };
}

function defaultLinkedViews(kind: MathObjectKind) {
  if (inferDimension(kind) === "3d") return ["3D", "Inspector", "Algebra"];
  if (inferDimension(kind) === "2d") return ["Geometry", "Inspector", "Algebra"];
  return ["Algebra", "Inspector"];
}

function finiteOr(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
