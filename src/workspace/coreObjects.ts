import type {
  MathObject,
  MathObjectDimension,
  MathObjectGeometry,
  MathObjectInteractivity,
  MathObjectKind,
  MathObjectRole,
  MathObjectStyle,
  MathObjectProperties,
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
  definition?: MathObject["definition"];
  algebra?: MathObject["algebra"];
  properties?: MathObjectProperties;
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
    geometry: normalizeGeometry(input.geometry),
    properties: normalizeProperties(input.properties, input.label),
    constraints: input.constraints ?? [],
    dependencies: input.dependencies ?? [],
    definition: input.definition ?? (input.metadata?.definitionSource && typeof input.metadata.definitionSource === "string" ? { source: input.metadata.definitionSource, parentIds: [] } : undefined),
    algebra: input.algebra,
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
    geometry: normalizeGeometry(object.geometry),
    properties: normalizeProperties(object.properties, object.label),
    constraints: object.constraints ?? [],
    dependencies: object.dependencies ?? [],
    definition: object.definition,
    algebra: object.algebra,
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
    properties: patch.properties ? normalizeProperties({ ...object.properties, ...patch.properties }, patch.label ?? object.label) : object.properties,
    interactivity: patch.interactivity ? { ...object.interactivity, ...patch.interactivity } : object.interactivity,
    updatedAt: Date.now(),
  });
}

function normalizeProperties(properties: MathObjectProperties | undefined, fallbackLabel: string): MathObjectProperties {
  return {
    label: properties?.label ?? fallbackLabel,
    caption: properties?.caption ?? "",
    layer: Math.max(0, Math.round(properties?.layer ?? 0)),
    labelMode: properties?.labelMode ?? "name",
    conditionalVisibility: properties?.conditionalVisibility?.trim() || undefined,
    dynamicColor: properties?.dynamicColor,
    dynamicStyle: properties?.dynamicStyle,
  };
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
    strokeWidth: clamp(finiteOr(style?.strokeWidth, 2), 0, 100),
    lineStyle: style?.lineStyle ?? "solid",
    opacity: clamp(style?.opacity ?? 1, 0, 1),
    labelVisible: style?.labelVisible ?? true,
    labelColor: style?.labelColor,
    pointShape: style?.pointShape,
    material: style?.material,
  };
}

/**
 * Keeps malformed imports and runaway calculations from putting NaN/Infinity into
 * SVG, canvas, WebGL, measurement, or export pipelines used by every studio.
 */
export function normalizeGeometry(geometry?: MathObjectGeometry): MathObjectGeometry {
  if (!geometry || geometry.type === "none") return { type: "none" };
  if (geometry.type === "point") return { ...geometry, position: normalizeVec3(geometry.position, ZERO_VEC3) };
  if (geometry.type === "line" || geometry.type === "segment" || geometry.type === "ray") {
    return { ...geometry, start: normalizeVec3(geometry.start, ZERO_VEC3), end: normalizeVec3(geometry.end, ZERO_VEC3) };
  }
  if (geometry.type === "polygon") {
    return { ...geometry, vertices: geometry.vertices.map((vertex) => normalizeVec3(vertex, ZERO_VEC3)) };
  }
  if (geometry.type === "circle" || geometry.type === "sphere") {
    return {
      ...geometry,
      center: normalizeVec3(geometry.center, ZERO_VEC3),
      radius: Math.abs(finiteOr(geometry.radius, 0)),
    };
  }
  if (geometry.type === "arc") {
    return {
      ...geometry,
      center: normalizeVec3(geometry.center, ZERO_VEC3),
      radius: Math.abs(finiteOr(geometry.radius, 0)),
      startAngle: finiteOr(geometry.startAngle, 0),
      endAngle: finiteOr(geometry.endAngle, 0),
    };
  }
  if (geometry.type === "angle") {
    return {
      ...geometry,
      vertex: normalizeVec3(geometry.vertex, ZERO_VEC3),
      armA: normalizeVec3(geometry.armA, ZERO_VEC3),
      armB: normalizeVec3(geometry.armB, ZERO_VEC3),
    };
  }
  if (geometry.type === "plane") {
    const normal = normalizeVec3(geometry.normal, { x: 0, y: 0, z: 1 });
    const usableNormal = Math.hypot(normal.x, normal.y, normal.z) > 1e-12 ? normal : { x: 0, y: 0, z: 1 };
    return {
      ...geometry,
      point: normalizeVec3(geometry.point, ZERO_VEC3),
      normal: usableNormal,
      width: geometry.width === undefined ? undefined : Math.abs(finiteOr(geometry.width, 0)),
      height: geometry.height === undefined ? undefined : Math.abs(finiteOr(geometry.height, 0)),
    };
  }
  if (geometry.type === "solid") {
    return {
      ...geometry,
      dimensions: {
        x: Math.abs(finiteOr(geometry.dimensions.x, 0)),
        y: Math.abs(finiteOr(geometry.dimensions.y, 0)),
        z: Math.abs(finiteOr(geometry.dimensions.z, 0)),
      },
      radius: geometry.radius === undefined ? undefined : Math.abs(finiteOr(geometry.radius, 0)),
    };
  }
  const normalizeRange = (range: [number, number]): [number, number] => {
    const first = finiteOr(range[0], -10);
    const second = finiteOr(range[1], 10);
    return first <= second ? [first, second] : [second, first];
  };
  return {
    ...geometry,
    expression: geometry.expression.trim(),
    domain: geometry.domain ? { u: normalizeRange(geometry.domain.u), v: normalizeRange(geometry.domain.v) } : undefined,
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
