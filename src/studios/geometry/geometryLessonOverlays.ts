import { Children, isValidElement, type ReactNode } from "react";
import { type LessonScene } from "./geometryLessonScene";

/** Carry visible teaching overlays into the editable snapshot without executing components. */
export function withLessonOverlays(scene: LessonScene, children: ReactNode): LessonScene {
  const construction = { ...scene.construction, points: [...scene.construction.points], lines: [...scene.construction.lines], circles: [...scene.construction.circles], polygons: [...scene.construction.polygons] };
  let serial = 0;
  const point = (x: number, y: number, label = "", color = "#64748b") => {
    const existing = construction.points.find(p => Math.hypot(p.x - x, p.y - y) < 1e-6);
    if (existing) return existing.id;
    const id = `overlay-point-${++serial}`;
    construction.points.push({ id, x, y, label, style: { color, size: label ? 5 : 0, labelMode: label ? "name" : "hidden" } });
    return id;
  };
  const visit = (nodes: ReactNode) => Children.forEach(nodes, node => {
    if (!isValidElement(node)) return;
    const p = node.props as Record<string, any>;
    const name = typeof node.type === "function" ? node.type.name : node.type;
    const project = (v: { x: number; y: number }) => p.plane ? { x: p.plane.ox + v.x * p.plane.unit, y: p.plane.oy - v.y * p.plane.unit } : v;
    if ((name === "SolidLine" || name === "DashedLine") && p.a && p.b) {
      const a = project(p.a), b = project(p.b);
      construction.lines.push({ id: `overlay-line-${++serial}`, a: point(a.x, a.y), b: point(b.x, b.y), style: { color: p.color ?? "#94a3b8", dashArray: name === "DashedLine" ? "6 4" : undefined } });
    } else if (name === "line" && [p.x1,p.y1,p.x2,p.y2].every(Number.isFinite)) {
      construction.lines.push({ id: `overlay-line-${++serial}`, a: point(p.x1,p.y1), b: point(p.x2,p.y2), style: { color: p.stroke ?? "#64748b", dashArray: p.strokeDasharray } });
    } else if (name === "polygon" && typeof p.points === "string") {
      const vertices = p.points.trim().split(/\s+/).map((pair: string) => pair.split(",").map(Number));
      if (vertices.length >= 3 && vertices.every((v: number[]) => v.length === 2 && v.every(Number.isFinite))) {
        const ids = vertices.map(([x,y]: number[]) => point(x,y));
        if (!construction.polygons.some(poly => poly.points.length === ids.length && poly.points.every((id,i) => id === ids[i]))) construction.polygons.push({ id: `overlay-polygon-${++serial}`, points: ids, style: { color: p.stroke ?? "#147df2", fill: p.fill?.startsWith("url(") ? "rgba(20,125,242,.12)" : p.fill } });
      }
    } else if (name === "CenterDot" && p.p) {
      const v = project(p.p); point(v.x, v.y, p.label, p.color);
    } else if (name === "circle" && Number.isFinite(p.cx) && Number.isFinite(p.cy) && Number.isFinite(p.r) && p.r > 8) {
      const center = point(p.cx, p.cy), edge = point(p.cx + p.r, p.cy);
      if (!construction.circles.some(c => c.center === center && c.edge === edge)) construction.circles.push({ id: `overlay-circle-${++serial}`, center, edge, style: { color: p.stroke ?? "#147df2", fill: p.fill === "none" ? undefined : p.fill, dashArray: p.strokeDasharray } });
    }
    if (p.children) visit(p.children);
  });
  visit(children);
  return { ...scene, construction };
}
