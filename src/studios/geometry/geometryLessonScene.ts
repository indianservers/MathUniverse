import type { Construction, GeoStyle, GeometryCamera } from "../../components/workspace/panels/GeometryWorkspacePanel";

export type LessonPoint = { x: number; y: number; id?: string; label?: string; color?: string };
export type LessonScene = { construction: Construction; camera: GeometryCamera; unitScale: number };

export function emptyLessonConstruction(): Construction {
  return { points: [], lines: [], circles: [], polygons: [], arcs: [], loci: [], constraints: [] };
}

/** Build native constructor objects from the same coordinates used by a lab. */
export function lessonScene(width: number, height: number, project: (point: LessonPoint) => LessonPoint = p => p, unitScale = 40) {
  const construction = emptyLessonConstruction();
  let serial = 0;
  const pointIds = new Set<string>();
  const coordinateIds = new Map<string, string>();
  const point = (value: LessonPoint, style?: GeoStyle) => {
    const projected = project(value);
    const key = `${Math.round(projected.x * 1e6)}:${Math.round(projected.y * 1e6)}`;
    const existing = !value.id ? coordinateIds.get(key) : undefined;
    if (existing) return existing;
    const id = value.id ?? `lesson-p${++serial}`;
    if (!pointIds.has(id)) {
      construction.points.push({ id, x: projected.x, y: projected.y, label: value.label ?? value.id ?? "", style: { color: value.color ?? "#147df2", labelMode: value.label || value.id ? "name" : "hidden", size: 6, ...style } });
      pointIds.add(id);
      if (!coordinateIds.has(key)) coordinateIds.set(key, id);
    }
    return id;
  };
  const line = (a: LessonPoint, b: LessonPoint, style?: GeoStyle) => {
    const id = `lesson-line${++serial}`;
    construction.lines.push({ id, a: point(a), b: point(b), style });
    return id;
  };
  const polygon = (vertices: LessonPoint[], style: GeoStyle = { color: "#147df2", fill: "rgba(20,125,242,.12)" }) => {
    construction.polygons.push({ id: `lesson-polygon${++serial}`, points: vertices.map(p => point(p)), style });
  };
  const circle = (center: LessonPoint, radius: number, style?: GeoStyle) => {
    const edge = { x: center.x + radius, y: center.y, id: `lesson-radius${++serial}` };
    const id = `lesson-circle${++serial}`;
    construction.circles.push({ id, center: point(center), edge: point(edge, { visible: false }), style: { color: "#08b9dd", fill: "rgba(8,185,221,.07)", ...style } });
    return id;
  };
  const result = (): LessonScene => ({ construction, camera: { x: 0, y: 0, width, height }, unitScale });
  return { construction, point, line, polygon, circle, result };
}

export function triangleLessonScene(plane: { width: number; height: number }, triangles: Array<Record<"A" | "B" | "C", LessonPoint>>, project: (point: LessonPoint) => LessonPoint): LessonScene {
  const scene = lessonScene(plane.width, plane.height, project, 36);
  triangles.forEach((triangle, index) => {
    const color = index ? "#8b45f4" : "#147df2";
    scene.polygon((["A", "B", "C"] as const).map((label, i) => ({ ...triangle[label], id: index ? ["D", "E", "F"][i] : label, color })), { color, fill: index ? "rgba(139,69,244,.12)" : "rgba(20,125,242,.12)" });
  });
  return scene.result();
}

export function polygonLessonScene(width: number, height: number, polygons: LessonPoint[][], unitScale = 42): LessonScene {
  const scene = lessonScene(width, height, p => p, unitScale);
  polygons.forEach((points, index) => scene.polygon(points.map((p, i) => ({ ...p, id: `poly${index}-v${i}`, label: String.fromCharCode(65 + i) }))));
  return scene.result();
}

export function nativeLessonScene(scene: LessonScene) {
  const scale = 40 / scene.unitScale;
  const construction = { ...scene.construction,
    points: scene.construction.points.map(p => ({ ...p, x: p.x * scale, y: p.y * scale })),
    constraints: scene.construction.constraints.map(c => c.type === "fixed-length" ? { ...c, length: c.length * scale } : c.type === "affine" ? { ...c, matrix: [c.matrix[0], c.matrix[1], c.matrix[2], c.matrix[3], c.matrix[4] * scale, c.matrix[5] * scale] as [number, number, number, number, number, number], offsetOrigin: c.offsetOrigin ? { x: c.offsetOrigin.x * scale, y: c.offsetOrigin.y * scale } : undefined } : c),
    loci: scene.construction.loci.map(l => ({ ...l, points: l.points.map(p => ({ x: p.x * scale, y: p.y * scale })) })),
  };
  return {
    workspaceSnapshot: { input: "", results: [], plots: [], construction, showSurface: false, showSolid: true, autoRotate3d: false,
      geometryGraphSettings: { showGrid: true, showAxes: false, showPointLabels: true, showMeasurements: false, snapToGrid: false, snapToObjects: true, gridSpacing: 40 } },
    geometryCamera: { x: scene.camera.x * scale, y: scene.camera.y * scale, width: scene.camera.width * scale, height: scene.camera.height * scale },
    workspaceType: "2d-geometry",
  };
}
