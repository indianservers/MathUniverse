import {
  API_NAMES,
  iframeSnippet,
  normalizeScene,
  scriptSnippet,
  type EmbedKind,
  type EmbedObject,
  type EmbedScene,
} from "./engine";
import type { PortableWorkspaceType } from "../workspace/portableWorkspace";

export const EMBED_KIND_FOR_WORKSPACE: Partial<Record<PortableWorkspaceType, EmbedKind>> = {
  "2d-graph": "twodgraph",
  "2d-geometry": "twodgeometry",
  "3d-graph": "threedgraph",
  "3d-geometry": "threedgeometry",
};

type LooseRecord = Record<string, unknown>;

function asRecord(value: unknown): LooseRecord {
  return value && typeof value === "object" ? (value as LooseRecord) : {};
}

function asList(value: unknown): LooseRecord[] {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === "object") as LooseRecord[] : [];
}

function n(value: unknown, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export function embedSceneFromGraphFunctions(
  functions: Array<{ id?: string; input?: string; expression?: string; color?: string; visible?: boolean; label?: string; name?: string }>,
  view: { xMin?: number; xMax?: number; yMin?: number; yMax?: number },
  title = "2D graph",
): EmbedScene {
  return normalizeScene({
    kind: "twodgraph",
    title,
    view: { width: 960, height: 640, xmin: view.xMin ?? -8, xmax: view.xMax ?? 8, ymin: view.yMin ?? -5, ymax: view.yMax ?? 5, showGrid: true, showAxes: true },
    objects: functions.filter((item) => item.visible !== false).map((item, index) => ({
      id: String(item.id || `f${index + 1}`),
      type: "function",
      expression: String(item.input || item.expression || "x"),
      color: item.color,
      label: item.label || item.name || String(item.input || item.expression || ""),
      size: 2,
    })),
  }, "twodgraph");
}

export function embedSceneFromGeometryConstruction(scene: unknown, title = "2D geometry"): EmbedScene {
  const root = asRecord(scene);
  const snapshot = asRecord(root.workspaceSnapshot ?? root);
  const construction = asRecord(snapshot.construction ?? root.construction);
  const camera = asRecord(snapshot.geometryCamera ?? root.geometryCamera ?? root.camera ?? { x: 0, y: 0, width: 640, height: 420 });
  const points = asList(construction.points);
  const byId = new Map(points.map((point) => [String(point.id), point]));
  const objects: EmbedObject[] = [];
  for (const point of points) {
    objects.push({ id: String(point.id), type: "point", x: n(point.x), y: n(point.y), label: String(point.label ?? point.id), color: "#1d4ed8", size: 6, visible: asRecord(point.style).visible !== false });
  }
  for (const line of asList(construction.lines)) {
    const a = byId.get(String(line.a));
    const b = byId.get(String(line.b));
    if (!a || !b) continue;
    objects.push({ id: String(line.id), type: "segment", x: n(a.x), y: n(a.y), x2: n(b.x), y2: n(b.y), color: "#0f172a", size: 2 });
  }
  for (const circle of asList(construction.circles)) {
    const center = byId.get(String(circle.center));
    const edge = byId.get(String(circle.edge));
    if (!center) continue;
    const radius = edge ? Math.hypot(n(edge.x) - n(center.x), n(edge.y) - n(center.y)) : 1;
    objects.push({ id: String(circle.id), type: "circle", x: n(center.x), y: n(center.y), radius, color: "#7c3aed", size: 2 });
  }
  for (const polygon of asList(construction.polygons)) {
    const coords = asList(polygon.points as unknown as LooseRecord[]).length
      ? []
      : (Array.isArray(polygon.points) ? polygon.points : []).map((id) => byId.get(String(id))).filter(Boolean) as LooseRecord[];
    const verts = coords.map((point) => [n(point.x), n(point.y)]);
    if (verts.length) objects.push({ id: String(polygon.id), type: "polygon", points: verts, color: "#2563eb" });
  }
  return normalizeScene({
    kind: "twodgeometry",
    title,
    view: {
      width: n(camera.width, 640),
      height: n(camera.height, 420),
      xmin: n(camera.x),
      ymin: n(camera.y),
      xmax: n(camera.x) + n(camera.width, 640),
      ymax: n(camera.y) + n(camera.height, 420),
      showGrid: true,
    },
    objects,
  }, "twodgeometry");
}

export function embedSceneFrom3dGeometry(scene: unknown, title = "3D geometry"): EmbedScene {
  const root = asRecord(scene);
  const snapshot = asRecord(root.workspaceSnapshot ?? root);
  const transforms = asRecord(snapshot.transforms3d ?? root.transforms3d);
  const added = asList(snapshot.added3dObjects ?? root.added3dObjects);
  const objects: EmbedObject[] = [];
  const surfaceExpression = String(snapshot.surfaceExpression ?? "x^2 + y^2");
  if (snapshot.showSurface !== false) {
    objects.push({ id: "surface", type: "surface", expression: surfaceExpression, color: "#38bdf8", label: surfaceExpression });
  }
  for (const [id, raw] of Object.entries(transforms)) {
    const transform = asRecord(raw);
    if (transform.visible === false) continue;
    const pos = Array.isArray(transform.position) ? transform.position.map((value) => n(value)) : [0, 0, 0];
    const dim = Array.isArray(transform.dimensions) ? transform.dimensions.map((value) => n(value, 1)) : [1, 1, 1];
    const scale = n(transform.scale, 1);
    if (id === "point" || asRecord(raw).name === "P") {
      objects.push({ id, type: "point", x: pos[0], y: pos[1], z: pos[2], color: String(transform.color || "#f59e0b"), size: 6, label: String(transform.name || id) });
    } else if (id === "vector") {
      objects.push({ id, type: "segment", x: 0, y: 0, z: 0, x2: pos[0] || 1, y2: pos[1] || 1, z2: pos[2] || 1, color: String(transform.color || "#f97316"), size: 2 });
    } else if (id !== "slice" && id !== "surface") {
      objects.push({ id, type: "box", x: pos[0], y: pos[1], z: pos[2], width: dim[0] * scale, height: dim[1] * scale, depth: dim[2] * scale, color: String(transform.color || "#22d3ee"), label: String(transform.name || id) });
    }
  }
  for (const item of added) {
    const transform = asRecord(item.transform);
    const pos = Array.isArray(transform.position) ? transform.position.map((value) => n(value)) : [0, 0, 0];
    const render = String(item.render || "solid");
    if (render === "point") objects.push({ id: String(item.id), type: "point", x: pos[0], y: pos[1], z: pos[2], color: String(transform.color || "#f8fafc"), size: 6, label: String(item.label || "P") });
    else if (render === "vector" || render === "line3d") objects.push({ id: String(item.id), type: "segment", x: 0, y: 0, z: 0, x2: pos[0], y2: pos[1], z2: pos[2], color: String(transform.color || "#f97316"), size: 2 });
    else objects.push({ id: String(item.id), type: "box", x: pos[0], y: pos[1], z: pos[2], width: n(asRecord(transform.dimensions)[0], 1.2), height: n(asRecord(transform.dimensions)[1], 1), depth: n(asRecord(transform.dimensions)[2], 1.2), color: String(transform.color || "#a78bfa"), label: String(item.label || item.id) });
  }
  return normalizeScene({ kind: "threedgeometry", title, view: { width: 960, height: 640, yaw: 0.6, pitch: 0.4, distance: 9 }, objects }, "threedgeometry");
}

export function embedSceneFrom3dGraph(scene: unknown, title = "3D graph"): EmbedScene {
  const root = asRecord(scene);
  const surfaces = asList(root.surfaces);
  const xRange = n(root.xRange, 3);
  const yRange = n(root.yRange, 3);
  return normalizeScene({
    kind: "threedgraph",
    title,
    view: { width: 960, height: 640, xmin: -xRange, xmax: xRange, ymin: -yRange, ymax: yRange, yaw: 0.7, pitch: 0.45, distance: 8, background: "#07111f" },
    objects: surfaces.filter((item) => item.visible !== false).map((item) => ({
      id: String(item.id || "surface"),
      type: "surface",
      expression: String(item.expression || "x^2 + y^2"),
      color: String(item.colorHigh || item.color || "#38bdf8"),
      label: String(item.name || item.expression || "surface"),
    })),
  }, "threedgraph");
}

export function embedSceneFromPortable(workspaceType: PortableWorkspaceType, scene: unknown, title?: string): EmbedScene | null {
  const kind = EMBED_KIND_FOR_WORKSPACE[workspaceType];
  if (!kind) return null;
  if (kind === "twodgraph") {
    const root = asRecord(scene);
    const snapshot = asRecord(root.workspaceSnapshot);
    const plots = asList(snapshot.plots ?? root.plots ?? root.functions);
    const view = asRecord(root.view ?? snapshot.view ?? root.graphView);
    return embedSceneFromGraphFunctions(
      plots.map((item) => ({
        id: String(item.id || ""),
        input: String(item.input || item.expression || ""),
        color: String(item.color || "#2563eb"),
        visible: item.visible !== false,
        label: String(item.label || item.name || ""),
      })),
      { xMin: n(view.xMin, -8), xMax: n(view.xMax, 8), yMin: n(view.yMin, -5), yMax: n(view.yMax, 5) },
      title || "2D graph",
    );
  }
  if (kind === "twodgeometry") return embedSceneFromGeometryConstruction(scene, title);
  if (kind === "threedgraph") return embedSceneFrom3dGraph(scene, title);
  return embedSceneFrom3dGeometry(scene, title);
}

export function embedCodesForScene(scene: EmbedScene, origin = typeof window === "undefined" ? "" : window.location.origin) {
  return {
    kind: scene.kind,
    api: API_NAMES[scene.kind],
    iframe: iframeSnippet(origin, scene),
    script: scriptSnippet(origin, scene),
    json: JSON.stringify(scene, null, 2),
  };
}
