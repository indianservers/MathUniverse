import { lessonScene, type LessonPoint, type LessonScene } from "./geometryLessonScene";
import type { GeomObject, World } from "./construction/constructionEngine";

export function transformationLessonScene(mode: string, pre: LessonPoint[], image: LessonPoint[], translation: LessonPoint): LessonScene {
  const scene = lessonScene(420, 280, p => ({ x: 210 + p.x * 70, y: 200 - p.y * 70 }), 70);
  scene.polygon(pre, { color: "#147df2", fill: "rgba(20,125,242,.12)" });
  scene.polygon(image.map((p, i) => ({ ...p, id: `${pre[i].id}-image`, color: "#8b45f4" })), { color: "#8b45f4", fill: "rgba(139,69,244,.12)" });
  scene.point({ ...translation, id: "T", color: "#f59e0b" });
  const source = pre.map(p => ({ x: 210 + p.x * 70, y: 200 - p.y * 70 }));
  const target = image.map(p => ({ x: 210 + p.x * 70, y: 200 - p.y * 70 }));
  const u = { x: source[1].x - source[0].x, y: source[1].y - source[0].y }, v = { x: source[2].x - source[0].x, y: source[2].y - source[0].y };
  const U = { x: target[1].x - target[0].x, y: target[1].y - target[0].y }, V = { x: target[2].x - target[0].x, y: target[2].y - target[0].y };
  const determinant = u.x * v.y - u.y * v.x;
  if (Math.abs(determinant) > 1e-8) {
    const a = (U.x * v.y - V.x * u.y) / determinant, c = (V.x * u.x - U.x * v.x) / determinant;
    const b = (U.y * v.y - V.y * u.y) / determinant, d = (V.y * u.x - U.y * v.x) / determinant;
    pre.forEach(p => scene.construction.constraints.push({ id: `transform-${p.id}`, type: "affine", source: p.id!, point: `${p.id}-image`, matrix: [a, b, c, d, target[0].x - a * source[0].x - c * source[0].y, target[0].y - b * source[0].x - d * source[0].y], offsetPoint: mode === "Translate" || mode === "Compose" ? "T" : undefined, offsetOrigin: { x: 210 + translation.x * 70, y: 200 - translation.y * 70 } }));
  }
  return scene.result();
}

export function measurementLessonScene(rectangles: Array<{ id: string; x: number; y: number; w: number; h: number; fill: string; stroke: string }>, width: number, height: number, project: (n: number) => number): LessonScene {
  const scene = lessonScene(width, height, p => ({ x: project(p.x), y: project(p.y) }), 26);
  rectangles.forEach(r => scene.polygon([
    { id: `${r.id}-A`, x: r.x, y: r.y }, { id: `${r.id}-B`, x: r.x + r.w, y: r.y },
    { id: `${r.id}-C`, x: r.x + r.w, y: r.y + r.h }, { id: `${r.id}-D`, x: r.x, y: r.y + r.h },
  ], { color: r.stroke, fill: r.fill }));
  return scene.result();
}

export function coordinateLessonScene(source: { points: Array<LessonPoint & { visible: boolean }>; lines: Array<{ m: number; b: number; color: string; visible: boolean }>; strokes?: Array<{ a: LessonPoint; b: LessonPoint; color: string; visible: boolean }> }, width: number, height: number, project: (p: LessonPoint) => LessonPoint): LessonScene {
  const scale = Math.hypot(project({ x: 1, y: 0 }).x - project({ x: 0, y: 0 }).x, project({ x: 1, y: 0 }).y - project({ x: 0, y: 0 }).y);
  const scene = lessonScene(width, height, project, scale);
  source.points.forEach(p => scene.point(p, { visible: p.visible }));
  source.lines.forEach(l => scene.line({ x: -14, y: -14 * l.m + l.b }, { x: 14, y: 14 * l.m + l.b }, { color: l.color, visible: l.visible }));
  source.strokes?.forEach(stroke => scene.line(stroke.a, stroke.b, { color: stroke.color, visible: stroke.visible }));
  if (source.points.length >= 2) scene.line(source.points[0], source.points[1]);
  return scene.result();
}

export function constructionLessonScene(objects: GeomObject[], world: World, width: number, height: number, project: (p: LessonPoint) => LessonPoint): LessonScene {
  const scale = Math.abs(project({ x: 1, y: 0 }).x - project({ x: 0, y: 0 }).x);
  const scene = lessonScene(width, height, project, scale);
  objects.forEach(o => { const p = world[o.id]?.point; if (p) scene.point({ ...p, id: o.id, label: o.label }, { visible: o.visible }); });
  objects.forEach(o => {
    const value = world[o.id];
    if (!value || !o.visible) return;
    if (value.circle) scene.circle(value.circle.center, value.circle.r);
    if (value.line) {
      const { origin, dir } = value.line;
      scene.line({ x: origin.x - dir.x * 20, y: origin.y - dir.y * 20 }, { x: origin.x + dir.x * 20, y: origin.y + dir.y * 20 });
    }
    if (value.polygon && value.polygon.length >= 3 && o.kind !== "locus") scene.polygon(value.polygon);
    else if (value.polygon?.length === 2) scene.line(value.polygon[0], value.polygon[1]);
    else if (value.polygon && o.kind === "locus") scene.construction.loci.push({ id: o.id, label: o.label, points: value.polygon.map(project) });
    if (o.kind === "midpoint" && o.parents.length === 2) scene.construction.constraints.push({ id: `${o.id}-constraint`, type: "midpoint", a: o.parents[0], b: o.parents[1], point: o.id });
  });
  return scene.result();
}

export function proofLessonScene(mode: string, values: { a: number; b: number; arc: number; k: number }): LessonScene {
  const scene = lessonScene(420, 240, p => ({ x: 80 + p.x * 18, y: 200 - p.y * 18 }), 18);
  if (mode === "Pythagoras" || mode === "Area Proofs") {
    const { a, b } = values;
    const A = { id: "A", x: 0, y: 0 }, B = { id: "B", x: a, y: 0 }, C = { id: "C", x: a, y: b };
    scene.polygon([A, B, C]);
    scene.polygon([A, B, { x: a, y: -a }, { x: 0, y: -a }], { color: "#08b9dd", fill: "rgba(8,185,221,.2)" });
    scene.polygon([B, C, { x: a + b, y: b }, { x: a + b, y: 0 }], { color: "#8b45f4", fill: "rgba(139,69,244,.16)" });
    scene.polygon([C, A, { x: -b, y: a }, { x: a - b, y: a + b }], { color: "#10b981", fill: "rgba(16,185,129,.14)" });
  } else if (mode === "Circle Theorems") {
    const center = { id: "O", x: 6.66, y: 4.44 };
    scene.circle(center, 78 / 18);
    const a = { x: center.x + 78 / 18, y: center.y };
    const b = { x: center.x + 78 / 18 * Math.cos(values.arc * Math.PI / 180), y: center.y + 78 / 18 * Math.sin(values.arc * Math.PI / 180) };
    scene.line(center, a); scene.line(center, b);
  } else {
    scene.polygon([{ id: "A", x: 0, y: 0 }, { id: "B", x: 6, y: 0 }, { id: "C", x: 2, y: 6 }]);
    if (mode === "Similarity") scene.polygon([{ x: 8, y: 0 }, { x: 8 + 3 * values.k, y: 0 }, { x: 8, y: 3 * values.k }], { color: "#8b45f4", fill: "rgba(139,69,244,.12)" });
  }
  return scene.result();
}
