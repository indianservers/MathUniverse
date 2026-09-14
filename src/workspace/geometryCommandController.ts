import { createUnsupportedWorkspaceAction, type UnsupportedWorkspaceAction } from "./unsupportedWorkspaceAction";

export type GeoStyle = {
  color?: string;
  fill?: string;
  strokeWidth?: number;
  size?: number;
  visible?: boolean;
  trace?: boolean;
  label?: string;
  opacity?: number;
  labelMode?: "name" | "value" | "both" | "hidden";
};

export type GeoPoint = { id: string; x: number; y: number; label: string; style?: GeoStyle };
export type GeoLine = { id: string; a: string; b: string; style?: GeoStyle };
export type GeoCircle = { id: string; center: string; edge: string; style?: GeoStyle };
export type GeoPolygon = { id: string; points: string[]; style?: GeoStyle };
export type GeoArc = { id: string; center: string; start: string; end: string; sector?: boolean; kind?: "arc" | "angle"; style?: GeoStyle };
export type GeoLocus = { id: string; label: string; points: { x: number; y: number }[]; style?: GeoStyle; sourcePointId?: string; mode?: "static" | "trace"; maxSamples?: number };
export type GeoConstraint =
  | { id: string; type: "parallel" | "perpendicular"; sourceLine: string; throughPoint: string; line: string }
  | { id: string; type: "midpoint"; a: string; b: string; point: string }
  | { id: string; type: "fixed-length"; anchor: string; point: string; length: number }
  | { id: string; type: "on-circle"; point: string; circle: string }
  | { id: string; type: "intersection"; first: string; second: string; point: string; firstType?: "line" | "circle"; secondType?: "line" | "circle"; index?: number };
export type Construction = {
  points: GeoPoint[];
  lines: GeoLine[];
  circles: GeoCircle[];
  polygons: GeoPolygon[];
  arcs: GeoArc[];
  loci: GeoLocus[];
  constraints: GeoConstraint[];
};
export type GeometryObjectType = "point" | "line" | "circle" | "polygon" | "arc" | "locus";
export type SelectedGeometryObject = { type: GeometryObjectType; id: string };
export type GeometryTransformMode = "translate" | "rotate" | "dilate" | "mirror";

export type GeometryCommandResult<T> =
  | { ok: true; value: T }
  | { ok: false; unsupported: UnsupportedWorkspaceAction; value: T | null };

export type GeometryTransformRequest = {
  mode: GeometryTransformMode;
  pointIds: string[];
  source: "selected-points" | "selected-object";
};

export function pointById(points: GeoPoint[], id: string) {
  return points.find((point) => point.id === id);
}

export function pointIdsForObject(construction: Construction, object: SelectedGeometryObject) {
  if (object.type === "point") return [object.id];
  if (object.type === "line") {
    const line = construction.lines.find((item) => item.id === object.id);
    return line ? [line.a, line.b] : [];
  }
  if (object.type === "circle") {
    const circle = construction.circles.find((item) => item.id === object.id);
    return circle ? [circle.center, circle.edge] : [];
  }
  if (object.type === "arc") {
    const arc = construction.arcs.find((item) => item.id === object.id);
    return arc ? [arc.center, arc.start, arc.end] : [];
  }
  if (object.type === "locus") return [];
  const polygon = construction.polygons.find((item) => item.id === object.id);
  return polygon?.points ?? [];
}

export function geometryObjectForPointIds(construction: Construction, pointIds: string[]): SelectedGeometryObject | null {
  const idSet = new Set(pointIds);
  if (!idSet.size) return null;
  const polygon = [...construction.polygons].reverse().find((item) => item.points.some((id) => idSet.has(id)));
  if (polygon) return { type: "polygon", id: polygon.id };
  const circle = [...construction.circles].reverse().find((item) => idSet.has(item.center) || idSet.has(item.edge));
  if (circle) return { type: "circle", id: circle.id };
  const arc = [...construction.arcs].reverse().find((item) => idSet.has(item.center) || idSet.has(item.start) || idSet.has(item.end));
  if (arc) return { type: "arc", id: arc.id };
  const line = [...construction.lines].reverse().find((item) => idSet.has(item.a) || idSet.has(item.b));
  if (line) return { type: "line", id: line.id };
  const locus = [...construction.loci].reverse().find((item) => item.sourcePointId && idSet.has(item.sourcePointId));
  if (locus) return { type: "locus", id: locus.id };
  const pointId = pointIds[0];
  return pointId && construction.points.some((point) => point.id === pointId) ? { type: "point", id: pointId } : null;
}

export function createdGeometryFromDelta(before: Construction, after: Construction): { object: SelectedGeometryObject | null; pointIds: string[] } {
  const newPointIds = after.points.filter((point) => !before.points.some((item) => item.id === point.id)).map((point) => point.id);
  const polygon = after.polygons.find((item) => !before.polygons.some((itemBefore) => itemBefore.id === item.id));
  if (polygon) return { object: { type: "polygon", id: polygon.id }, pointIds: polygon.points };
  const circle = after.circles.find((item) => !before.circles.some((itemBefore) => itemBefore.id === item.id));
  if (circle) return { object: { type: "circle", id: circle.id }, pointIds: [circle.center, circle.edge] };
  const line = after.lines.find((item) => !before.lines.some((itemBefore) => itemBefore.id === item.id));
  if (line) return { object: { type: "line", id: line.id }, pointIds: [line.a, line.b] };
  const arc = after.arcs.find((item) => !before.arcs.some((itemBefore) => itemBefore.id === item.id));
  if (arc) return { object: { type: "arc", id: arc.id }, pointIds: [arc.center, arc.start, arc.end] };
  const locus = after.loci.find((item) => !before.loci.some((itemBefore) => itemBefore.id === item.id));
  if (locus) return { object: { type: "locus", id: locus.id }, pointIds: newPointIds };
  if (newPointIds[0]) return { object: { type: "point", id: newPointIds[0] }, pointIds: newPointIds };
  return { object: null, pointIds: newPointIds };
}

export function geometryObjectBySelection(construction: Construction, object: SelectedGeometryObject): { style?: GeoStyle } | null {
  if (object.type === "point") return construction.points.find((item) => item.id === object.id) ?? null;
  if (object.type === "line") return construction.lines.find((item) => item.id === object.id) ?? null;
  if (object.type === "circle") return construction.circles.find((item) => item.id === object.id) ?? null;
  if (object.type === "arc") return construction.arcs.find((item) => item.id === object.id) ?? null;
  if (object.type === "locus") return construction.loci.find((item) => item.id === object.id) ?? null;
  return construction.polygons.find((item) => item.id === object.id) ?? null;
}

export function patchGeometryObject(construction: Construction, object: SelectedGeometryObject, patch: { style?: GeoStyle }) {
  const mergeStyle = <T extends { id: string; style?: GeoStyle }>(item: T) =>
    item.id === object.id
      ? { ...item, style: patch.style && Object.keys(patch.style).length === 0 ? {} : { ...(item.style ?? {}), ...(patch.style ?? {}) } }
      : item;
  if (object.type === "point") return { ...construction, points: construction.points.map(mergeStyle) };
  if (object.type === "line") return { ...construction, lines: construction.lines.map(mergeStyle) };
  if (object.type === "circle") return { ...construction, circles: construction.circles.map(mergeStyle) };
  if (object.type === "arc") return { ...construction, arcs: construction.arcs.map(mergeStyle) };
  if (object.type === "locus") return { ...construction, loci: construction.loci.map(mergeStyle) };
  return { ...construction, polygons: construction.polygons.map(mergeStyle) };
}

export function deleteGeometryObjectFromConstruction(construction: Construction, object: SelectedGeometryObject) {
  if (object.type === "point") {
    return {
      points: construction.points.filter((point) => point.id !== object.id),
      lines: construction.lines.filter((line) => line.a !== object.id && line.b !== object.id),
      circles: construction.circles.filter((circle) => circle.center !== object.id && circle.edge !== object.id),
      polygons: construction.polygons.map((polygon) => ({ ...polygon, points: polygon.points.filter((id) => id !== object.id) })).filter((polygon) => polygon.points.length >= 3),
      arcs: construction.arcs.filter((arc) => arc.center !== object.id && arc.start !== object.id && arc.end !== object.id),
      loci: construction.loci.filter((locus) => locus.sourcePointId !== object.id),
      constraints: construction.constraints.filter((constraint) => !JSON.stringify(constraint).includes(object.id)),
    };
  }
  if (object.type === "line") return { ...construction, lines: construction.lines.filter((line) => line.id !== object.id), constraints: construction.constraints.filter((constraint) => !JSON.stringify(constraint).includes(object.id)) };
  if (object.type === "circle") return { ...construction, circles: construction.circles.filter((circle) => circle.id !== object.id), constraints: construction.constraints.filter((constraint) => !JSON.stringify(constraint).includes(object.id)) };
  if (object.type === "arc") return { ...construction, arcs: construction.arcs.filter((arc) => arc.id !== object.id) };
  if (object.type === "locus") return { ...construction, loci: construction.loci.filter((locus) => locus.id !== object.id) };
  return { ...construction, polygons: construction.polygons.filter((polygon) => polygon.id !== object.id) };
}

export function deleteGeometrySelection(construction: Construction, object: SelectedGeometryObject | null): GeometryCommandResult<Construction> {
  if (!object) {
    return {
      ok: false,
      value: construction,
      unsupported: createUnsupportedWorkspaceAction("Delete geometry object", "There is no selected geometry object to delete.", ["Select a point, line, circle, polygon, arc, or locus first.", "Use Delete after selecting an object on the geometry board."]),
    };
  }
  return { ok: true, value: deleteGeometryObjectFromConstruction(construction, object) };
}

export function createNoSelectionDeleteAction() {
  return createUnsupportedWorkspaceAction("Delete selection", "There is no selected workspace object to delete.", ["Select a graph, geometry, or 3D object first.", "Use Escape to clear selection."]);
}

export function createGeometryTransformRequest(
  construction: Construction,
  selectedGeometry: SelectedGeometryObject | null,
  selectedPointIds: string[],
  mode: GeometryTransformMode,
): GeometryCommandResult<GeometryTransformRequest> {
  const pointIds = selectedPointIds.length ? selectedPointIds : selectedGeometry ? pointIdsForObject(construction, selectedGeometry) : [];
  const uniqueIds = Array.from(new Set(pointIds));
  if (!uniqueIds.length) {
    return {
      ok: false,
      value: null,
      unsupported: createUnsupportedWorkspaceAction("Geometry transform", "No geometry points or object are selected.", ["Select points on the board.", "Create a point, segment, polygon, or circle first."]),
    };
  }
  return {
    ok: true,
    value: {
      mode,
      pointIds: uniqueIds,
      source: selectedPointIds.length ? "selected-points" : "selected-object",
    },
  };
}
